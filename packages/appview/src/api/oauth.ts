import { OAuthResolverError } from '@atproto/oauth-client-node'
import { isValidHandle } from '@atproto/syntax'
import { Hono } from '@hono/hono'

import { AppContext } from '../context.js'
import { getSession } from '../session.js'

export const createRouter = (ctx: AppContext) => {
  const router = new Hono()

  // OAuth metadata
  router.get('/oauth-client-metadata.json', (c) => {
    return c.json(ctx.oauthClient.clientMetadata)
  })

  // OAuth callback to complete session creation
  router.get('/oauth/callback', async (c) => {
    // Get the query parameters from the URL
    const params = new URLSearchParams(c.req.url.split('?')[1])

    try {
      const { session } = await ctx.oauthClient.callback(params)

      // Use the common session options
      const clientSession = await getSession(c)

      // Set the DID on the session
      clientSession.did = session.did
      await clientSession.save()

      // Get the origin and determine appropriate redirect
      const host = c.req.header('host') || ''
      const protocol = c.req.header('x-forwarded-proto') || 'http'
      const baseUrl = `${protocol}://${host}`

      ctx.logger.info(
        `OAuth callback successful, redirecting to ${baseUrl}/oauth-callback`,
      )

      // Redirect to the frontend oauth-callback page
      return c.redirect('/oauth-callback')
    } catch (err) {
      ctx.logger.error({ err }, 'oauth callback failed')

      // Handle error redirect - stay on same domain
      return c.redirect('/oauth-callback?error=auth')
    }
  })

  // Login handler
  router.post('/oauth/initiate', async (c) => {
    const body = await c.req.json()
    const handle = body?.handle

    // Validate
    if (
      typeof handle !== 'string' ||
      !(isValidHandle(handle) || isValidUrl(handle))
    ) {
      return c.json({ error: 'Invalid handle' }, 400)
    }

    // Initiate the OAuth flow
    try {
      const url = await ctx.oauthClient.authorize(handle, {
        scope: 'atproto transition:generic',
      })
      return c.json({ redirectUrl: url.toString() })
    } catch (err) {
      ctx.logger.error({ err }, 'oauth authorize failed')
      const errorMsg =
        err instanceof OAuthResolverError
          ? err.message
          : "Couldn't initiate login"
      return c.json({ error: errorMsg }, 500)
    }
  })

  // Logout handler
  router.post('/oauth/logout', async (c) => {
    const session = await getSession(c)
    session.destroy()
    return c.json({ success: true })
  })

  return router
}

function isValidUrl(url: string): boolean {
  try {
    const urlp = new URL(url)
    // http or https
    return urlp.protocol === 'http:' || urlp.protocol === 'https:'
  } catch (error) {
    return false
  }
}
