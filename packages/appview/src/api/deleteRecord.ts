import { Agent } from '@atproto/api'
import { Hono } from '@hono/hono'

import { AppContext } from '../context.js'
import { getSessionAgent } from '../session.js'
import * as ComAtprotoRepoDeleteRecord from '../lexicons/types/com/atproto/repo/deleteRecord.js'

async function deleteRecord(
  params: ComAtprotoRepoDeleteRecord.InputSchema,
  agent: Agent,
): Promise<void> {
  await agent.com.atproto.repo.deleteRecord(params)
}

export const createRouter = (ctx: AppContext) => {
  const router = new Hono()

  router.post('/api/deleteRecord', async (c) => {
    const body = await c.req.json()
    const { collection, rkey } = body

    if (!collection || !rkey) {
      ctx.logger.error({ collection, rkey }, 'Missing required parameters')
      return c.json({ error: 'Missing required parameters: collection, rkey' }, 400)
    }

    try {
      // Handle 'self' repo case
      let agent = await getSessionAgent(c, ctx)

      if (!agent) {
        ctx.logger.error('No authenticated agent found')
        return c.json({ error: 'Authentication required' }, 401)
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

      return c.json({ success: true })
    } catch (err) {
      console.error('Error in deleteRecord:', err)
      ctx.logger.error({ error: err }, 'Failed to delete record')

      // Send detailed error response back to client
      if (err instanceof Error) {
        return c.json({
          success: false,
          error: err.message || 'Failed to delete record',
        }, 500)
      } else {
        return c.json({
          success: false,
          error: 'Unknown error occurred',
        }, 500)
      }
    }
  })

  return router
}
