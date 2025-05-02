import { Router } from 'express'
import { AppContext } from '#/context'
import { isValidHandle } from '@atproto/syntax'

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
  const router = Router()

  router.get('/resolve', async (req, res) => {
    const { identifier } = req.query

    if (!identifier || typeof identifier !== 'string') {
      res.status(400).json({ error: 'Missing or invalid identifier parameter' })
      return
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
        res.status(404).json({ error: 'Could not resolve identifier to DID' })
        return
      }

      // Get the PDS URL directly from the resolver
      ctx.logger.info({ did }, 'Getting PDS URL')
      const pdsUrl = await (ctx.resolver as any).resolveDidToPdsUrl(did)
      ctx.logger.info({ did, pdsUrl }, 'Got PDS URL')
      
      if (!pdsUrl) {
        ctx.logger.error({ did }, 'No PDS URL found')
        res.status(404).json({ error: 'PDS URL not found for identifier' })
        return
      }

      ctx.logger.info({ identifier, pdsUrl }, 'Successfully resolved identifier')
      res.json({ pdsUrl })
    } catch (err) {
      ctx.logger.error({ err, identifier }, 'Failed to resolve identifier')
      res.status(500).json({ error: 'Failed to resolve identifier', details: err instanceof Error ? err.message : 'Unknown error' })
    }
  })

  return router
} 