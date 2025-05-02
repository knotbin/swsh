import { Router } from 'express'
import { XrpcClient } from '@atproto/xrpc'
import * as ComAtprotoRepoGetRecord from '../lexicons/types/com/atproto/repo/getRecord.js'
import { AppContext } from '#/context'
import { schemas } from '../lexicons/lexicons.js'
import { env } from '#/lib/env'
import { getSessionAgent } from '#/session'

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
async function getRecord(
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
    const { repo, collection, rkey, cid } = req.query

    if (!repo || !collection || !rkey) {
      res.status(400).json({ error: 'Missing required parameters: repo, collection, rkey' })
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
      
      res.json(record)
    } catch (err) {
      ctx.logger.error({ err, params: req.query }, 'Failed to get record')
      if (err instanceof Error && err.message === 'Record not found') {
        res.status(404).json({ error: 'Record not found' })
      } else {
        res.status(500).json({ error: 'Failed to get record', details: err instanceof Error ? err.message : 'Unknown error' })
      }
    }
  })

  return router
}
