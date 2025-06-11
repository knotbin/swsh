import { HandleResolver } from '@atproto/identity'
import { XrpcClient } from '@atproto/xrpc'
import { SpaceSwshFeedEntry } from '@swsh/lexicon'
import { Hono } from '@hono/hono'

import { AppContext } from '../context.js'
import { encodeFacets } from '../lib/facets.js'
import { entryToEntryView } from '../lib/hydrate.js'
import { getSessionAgent } from '../session.js'
import { schemas } from '../lexicons/lexicons.js'
import * as ComAtprotoRepoGetRecord from '../lexicons/types/com/atproto/repo/getRecord.js'

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
  const router = new Hono()

  router.get('/api/getRecord', async (c) => {
    const handle = c.req.query('handle')
    const repo = c.req.query('repo')
    const collection = c.req.query('collection')
    const rkey = c.req.query('rkey')
    const cid = c.req.query('cid')
    const handleResolver = new HandleResolver()

    if ((!repo && !handle) || !collection || !rkey) {
      return c.json({ error: 'Missing required parameters: repo, collection, rkey' }, 400)
    }

    try {
      // Handle 'self' repo case
      let actualRepo: string
      if (repo === 'self') {
        const agent = await getSessionAgent(c, ctx)
        if (!agent) {
          return c.json({ error: 'Authentication required' }, 401)
        }
        actualRepo = agent.assertDid
      } else {
        actualRepo = repo as string
      }

      if (handle) {
        const did = await handleResolver.resolve(handle as string)
        if (!did) {
          ctx.logger.error({ handle }, 'Handle resolution failed')
          return c.json({ error: 'Handle not found' }, 404)
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
          return c.json({
            uri: dbEntry.uri,
            cid: '', // We don't store CID in our database
            value: entryView,
          })
        }
      }

      // If not in database or not a feed entry, fetch from PDS
      ctx.logger.info({ actualRepo }, 'Getting PDS URL')
      const pdsUrl = await ctx.resolver.resolveDidToPdsUrl(actualRepo)
      ctx.logger.info({ actualRepo, pdsUrl }, 'Got PDS URL')

      if (!pdsUrl) {
        ctx.logger.error({ actualRepo }, 'No PDS URL found')
        return c.json({ error: 'PDS URL not found for repo' }, 404)
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

      return c.json(record)
    } catch (err) {
      ctx.logger.error({ err, params: c.req.query }, 'Failed to get record')
      if (err instanceof Error && err.message === 'Record not found') {
        return c.json({ error: 'Record not found' }, 404)
      } else {
        return c.json({
          error: 'Failed to get record',
          details: err instanceof Error ? err.message : 'Unknown error',
        }, 500)
      }
    }
  })

  return router
}
