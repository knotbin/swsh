import { isValidHandle } from '@atproto/syntax'
import { Hono } from '@hono/hono'

import { AppContext } from '../context.js'

interface Service {
  id: string
  type: string
  serviceEndpoint: string
}

interface DIDDocument {
  '@context': string[]
  id: string
  service?: Service[]
}

export const createRouter = (ctx: AppContext) => {
  const router = new Hono()

  router.get('/resolve', async (c) => {
    const identifier = c.req.query('identifier')

    if (!identifier || typeof identifier !== 'string') {
      return c.json({ error: 'Missing or invalid identifier parameter' }, 400)
    }

    try {
      // Clean up the identifier - remove any extra quotes
      const cleanIdentifier = identifier.replace(/^"|"$/g, '')
      ctx.logger.info({ cleanIdentifier }, 'Starting resolution')

      let did: string
      // If it's a handle, resolve it to a DID
      if (isValidHandle(cleanIdentifier)) {
        ctx.logger.info({ cleanIdentifier }, 'Resolving handle to DID')
        did = await ctx.resolver.resolveDidToHandle(cleanIdentifier)
        ctx.logger.info({ did }, 'Resolved handle to DID')
      } else {
        // If it's already a DID, use it directly
        did = cleanIdentifier
        ctx.logger.info({ did }, 'Using identifier as DID')
      }

      if (!did) {
        ctx.logger.error({ cleanIdentifier }, 'Failed to get DID')
        return c.json({ error: 'Could not resolve identifier to DID' }, 404)
      }

      // Get the PDS URL directly from the resolver
      ctx.logger.info({ did }, 'Getting PDS URL')
      const pdsUrl = await (ctx.resolver as any).resolveDidToPdsUrl(did)
      ctx.logger.info({ did, pdsUrl }, 'Got PDS URL')

      if (!pdsUrl) {
        ctx.logger.error({ did }, 'No PDS URL found')
        return c.json({ error: 'PDS URL not found for identifier' }, 404)
      }

      ctx.logger.info(
        { identifier, pdsUrl },
        'Successfully resolved identifier',
      )
      return c.json({ pdsUrl })
    } catch (err) {
      ctx.logger.error({ err, identifier }, 'Failed to resolve identifier')
      return c.json({
        error: 'Failed to resolve identifier',
        details: err instanceof Error ? err.message : 'Unknown error',
      }, 500)
    }
  })

  return router
}
