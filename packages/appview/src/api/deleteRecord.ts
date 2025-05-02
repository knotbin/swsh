import { Agent } from '@atproto/api'
import { Router } from 'express'

import { AppContext } from '#/context'
import { getSessionAgent } from '#/session'
import * as ComAtprotoRepoDeleteRecord from '../lexicons/types/com/atproto/repo/deleteRecord.js'

async function deleteRecord(
  params: ComAtprotoRepoDeleteRecord.InputSchema,
  agent: Agent,
): Promise<void> {
  await agent.com.atproto.repo.deleteRecord(params)
}

export const createRouter = (ctx: AppContext) => {
  const router = Router()

  router.post('/api/deleteRecord', async (req, res) => {
    const { collection, rkey } = req.body

    if (!collection || !rkey) {
      ctx.logger.error({ collection, rkey }, 'Missing required parameters')
      res
        .status(400)
        .json({ error: 'Missing required parameters: collection, rkey' })
      return
    }

    try {
      // Handle 'self' repo case
      let agent = await getSessionAgent(req, res, ctx)

      if (!agent) {
        ctx.logger.error('No authenticated agent found')
        res.status(401).json({ error: 'Authentication required' })
        return
      }

      let repo = agent.assertDid

      const params: ComAtprotoRepoDeleteRecord.InputSchema = {
        repo,
        collection: collection as string,
        rkey: rkey as string,
      }

      ctx.logger.info({ params }, 'Deleting record')
      // Pass ctx and did to deleteRecord function for fallback token access
      await deleteRecord(params, agent)
      ctx.logger.info({ params }, 'Successfully deleted record')

      res.json({ success: true })
    } catch (err) {
      console.error('Error in deleteRecord:', err)
      ctx.logger.error({ error: err }, 'Failed to delete record')
      
      // Send detailed error response back to client
      if (err instanceof Error) {
        res.status(500).json({
          success: false, 
          error: err.message || 'Failed to delete record'
        })
      } else {
        res.status(500).json({
          success: false, 
          error: 'Unknown error occurred'
        })
      }
    }
  })

  return router
}
