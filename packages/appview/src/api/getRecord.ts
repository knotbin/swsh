import { HandleResolver } from '@atproto/identity'
import { XrpcClient } from '@atproto/xrpc'
import { Router } from 'express'
import { SpaceSwshFeedEntry } from '@swsh/lexicon'

import { AppContext } from '#/context'
import { getSessionAgent } from '#/session'
import { schemas } from '../lexicons/lexicons.js'
import * as ComAtprotoRepoGetRecord from '../lexicons/types/com/atproto/repo/getRecord.js'
import { encodeFacets } from '#/lib/facets'
import { entryToEntryView } from '#/lib/hydrate'

/**
 * Get a single record from a repository.
 * @param client - The XRPC client instance
 * @param params - The parameters for getting the record
 * @param params.repo - The handle or DID of the repo
 * @param params.collection - The NSID of the record collection
 * @param params.rkey - The Record Key
 * @param params.cid - Optional: The CID of the version of the record
 * @returns Promise containing the record data
 */
export async function getRecord(
  client: XrpcClient,
  params: ComAtprotoRepoGetRecord.QueryParams,
): Promise<ComAtprotoRepoGetRecord.OutputSchema> {
  try {
    const response = await client.call('com.atproto.repo.getRecord', params)
    return response.data
  } catch (e) {
    if (e instanceof Error && e.message === 'RecordNotFound') {
      throw new Error('Record not found')
    }
    throw e
  }
}

export const createRouter = (ctx: AppContext) => {
  const router = Router()

  router.get('/api/getRecord', async (req, res) => {
    const { handle, repo, collection, rkey, cid } = req.query
    const handleResolver = new HandleResolver()

    if ((!repo && !handle) || !collection || !rkey) {
      res
        .status(400)
        .json({ error: 'Missing required parameters: repo, collection, rkey' })
      return
    }

    try {
      // Handle 'self' repo case
      let actualRepo: string
      if (repo === 'self') {
        const agent = await getSessionAgent(req, res, ctx)
        if (!agent) {
          res.status(401).json({ error: 'Authentication required' })
          return
        }
        actualRepo = agent.assertDid
      } else {
        actualRepo = repo as string
      }

      if (handle) {
        const did = await handleResolver.resolve(handle as string)
        if (!did) {
          ctx.logger.error({ handle }, 'Handle resolution failed')
          res.status(404).json({ error: 'Handle not found' })
          return
        }
        actualRepo = did
      }

      // For feed entries, first check if it's in our database
      if (collection === 'space.swsh.feed.entry') {
        const dbEntry = await ctx.db
          .selectFrom('entry')
          .where('uri', '=', `at://${actualRepo}/space.swsh.feed.entry/${rkey}`)
          .selectAll()
          .executeTakeFirst()

        if (dbEntry) {
          const entryView = await entryToEntryView(dbEntry, ctx)
          res.json({
            uri: dbEntry.uri,
            cid: '', // We don't store CID in our database
            value: entryView,
          })
          return
        }
      }

      // If not in database or not a feed entry, fetch from PDS
      ctx.logger.info({ actualRepo }, 'Getting PDS URL')
      const pdsUrl = await ctx.resolver.resolveDidToPdsUrl(actualRepo)
      ctx.logger.info({ actualRepo, pdsUrl }, 'Got PDS URL')

      if (!pdsUrl) {
        ctx.logger.error({ actualRepo }, 'No PDS URL found')
        res.status(404).json({ error: 'PDS URL not found for repo' })
        return
      }

      // Create an XRPC client for the PDS
      const client = new XrpcClient({ service: pdsUrl }, schemas)

      const params: ComAtprotoRepoGetRecord.QueryParams = {
        repo: actualRepo,
        collection: collection as string,
        rkey: rkey as string,
        ...(cid ? { cid: cid as string } : {}),
      }

      ctx.logger.info({ params }, 'Fetching record')
      const record = await getRecord(client, params)
      ctx.logger.info({ params }, 'Successfully fetched record')

      // If this is a feed entry, verify and index it if not already in the database
      if (collection === 'space.swsh.feed.entry') {
        if (!SpaceSwshFeedEntry.isRecord(record.value)) {
          ctx.logger.info(
            { record: record.value },
            'record failed isRecord check',
          )
        } else {
          const validatedRecord = SpaceSwshFeedEntry.validateRecord(record.value)
          if (!validatedRecord.success) {
            ctx.logger.info('record failed validation')
          } else {
            ctx.logger.info('feed entry validated successfully')

            await ctx.db
              .insertInto('entry')
              .values({
                uri: record.uri,
                authorDid: actualRepo,
                title: validatedRecord.value.title ?? null,
                subtitle: validatedRecord.value.subtitle ?? null,
                content: validatedRecord.value.content,
                facets: validatedRecord.value.facets ? 
                  encodeFacets(validatedRecord.value.facets.map(f => ({
                    byteStart: f.index.byteStart,
                    byteEnd: f.index.byteEnd,
                    type: f.features[0].$type.split('.').pop()?.toLowerCase() ?? ''
                  }))) : null,
                createdAt: validatedRecord.value.createdAt ?? new Date().toISOString(),
                indexedAt: new Date().toISOString(),
              })
              .execute()
            
            ctx.logger.info({ uri: record.uri }, 'Successfully indexed entry')
          }
        }
      }

      res.json(record)
    } catch (err) {
      ctx.logger.error({ err, params: req.query }, 'Failed to get record')
      if (err instanceof Error && err.message === 'Record not found') {
        res.status(404).json({ error: 'Record not found' })
      } else {
        res.status(500).json({
          error: 'Failed to get record',
          details: err instanceof Error ? err.message : 'Unknown error',
        })
      }
    }
  })

  return router
}
