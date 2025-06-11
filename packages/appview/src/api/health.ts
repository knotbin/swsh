import { Hono } from '@hono/hono'

import { AppContext } from '../context.js'

export const createRouter = (ctx: AppContext) => {
  const router = new Hono()

  router.get('/health', async (c) => {
    return c.text('OK', 200)
  })

  return router
}
