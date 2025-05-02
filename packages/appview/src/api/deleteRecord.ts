import { Agent } from '@atproto/api'
import { XrpcClient } from '@atproto/xrpc'
import { Router } from 'express'

import { AppContext } from '#/context'
import { getSessionAgent } from '#/session'
import { schemas } from '../lexicons/lexicons.js'
import * as ComAtprotoRepoDeleteRecord from '../lexicons/types/com/atproto/repo/deleteRecord.js'

/**
 * Helper function to extract a JWT token from an OAuth session object
 * with flexible property access to handle unknown structure
 */
function extractJwtFromSession(session: any): string | undefined {
  // Log the keys to see what's available
  if (session) {
    console.log('Session keys:', Object.keys(session))
    
    // Try to find JWT in common locations
    // These are guesses at possible property names
    return (
      session.accessJwt ||
      session.access_token ||
      session.accessToken ||
      session.token ||
      session.jwt ||
      session.credentials?.accessJwt ||
      session.credentials?.access_token ||
      session.credentials?.token ||
      session.session?.accessJwt ||
      session.session?.access_token ||
      undefined
    )
  }
  return undefined
}

/**
 * Delete a record from a repository using the appropriate authentication method.
 */
async function deleteRecord(
  client: XrpcClient,
  params: ComAtprotoRepoDeleteRecord.InputSchema,
  agent: any,
  ctx?: AppContext,
  did?: string,
): Promise<void> {
  try {
    // Debug agent object structure
    console.log('Agent type:', typeof agent)
    console.log('Agent keys:', Object.keys(agent))
    
    // First, try using the agent's method directly if possible
    if (agent && typeof agent.com?.atproto?.repo?.deleteRecord === 'function') {
      console.log('Using agent.com.atproto.repo.deleteRecord directly')
      try {
        await agent.com.atproto.repo.deleteRecord(params)
        console.log('Record deleted successfully using agent method')
        return
      } catch (err) {
        console.error('Failed using agent method:', err)
        // Fall through to other methods
      }
    }
    
    // Check if we can use dpopFetch (DPoP-bound token) from the agent's sessionManager
    if (agent && agent.sessionManager && typeof agent.sessionManager.dpopFetch === 'function') {
      console.log('Using agent.sessionManager.dpopFetch')
      try {
        const url = `${client.service}/xrpc/com.atproto.repo.deleteRecord`
        const res = await agent.sessionManager.dpopFetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(params)
        })
        
        if (res.ok) {
          console.log('Record deleted successfully using sessionManager.dpopFetch')
          return
        } else {
          const errorText = await res.text()
          throw new Error(`Failed with status ${res.status}: ${errorText}`)
        }
      } catch (err) {
        console.error('Failed using sessionManager.dpopFetch:', err)
      }
    }
    
    // Try OAuth session's dpopFetch if available
    if (ctx && did) {
      try {
        console.log('Trying OAuth session dpopFetch')
        const oauthSession = await ctx.oauthClient.restore(did)
        console.log('OAuthSession keys:', Object.keys(oauthSession || {}))
        
        if (oauthSession && typeof oauthSession.dpopFetch === 'function') {
          const url = `${client.service}/xrpc/com.atproto.repo.deleteRecord`
          const res = await oauthSession.dpopFetch(url, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(params)
          })
          
          if (res.ok) {
            console.log('Record deleted successfully using OAuth session dpopFetch')
            return
          } else {
            const errorText = await res.text()
            throw new Error(`Failed with status ${res.status}: ${errorText}`)
          }
        }
      } catch (err) {
        console.error('Failed using OAuth session dpopFetch:', err)
        // Fall through to other methods
      }
    }
    
    // Fallback to JWT token method as last resort
    let jwt = extractJwtFromSession(agent)
    
    // Try to get JWT from sessionManager
    if (!jwt && agent?.sessionManager) {
      try {
        if (typeof agent.sessionManager.getSession === 'function') {
          const session = await agent.sessionManager.getSession()
          jwt = extractJwtFromSession(session)
        } else if (agent.sessionManager.session) {
          jwt = extractJwtFromSession(agent.sessionManager.session)
        }
      } catch (err) {
        console.error('Error accessing sessionManager:', err)
      }
    }
    
    // Try to get JWT from OAuth session
    if (!jwt && ctx && did) {
      console.log('No JWT found in agent, trying direct OAuth session')
      try {
        const oauthSession = await ctx.oauthClient.restore(did)
        if (oauthSession) {
          jwt = extractJwtFromSession(oauthSession)
        }
      } catch (err) {
        console.error('Failed to get direct OAuth session:', err)
      }
    }
    
    console.log('Found JWT:', jwt ? 'yes' : 'no')
    if (!jwt) {
      throw new Error('No authentication method available to delete record')
    }
    
    // Use the JWT token if found
    await client.call('com.atproto.repo.deleteRecord', undefined, params, {
      headers: { Authorization: `Bearer ${jwt}` },
    })
    console.log('Record deleted successfully using JWT token')
  } catch (e) {
    if (e instanceof Error && e.message === 'RecordNotFound') {
      throw new Error('Record not found')
    }
    throw e
  }
}

export const createRouter = (ctx: AppContext) => {
  const router = Router()

  router.post('/api/deleteRecord', async (req, res) => {
    console.log('Received delete request')
    console.log('Request body:', req.body)
    console.log('Request headers:', req.headers)

    const { repo, collection, rkey } = req.body
    ctx.logger.info({ reqBody: req.body }, 'Received delete request')

    if (!repo || !collection || !rkey) {
      console.log('Missing parameters:', { repo, collection, rkey })
      ctx.logger.error(
        { repo, collection, rkey },
        'Missing required parameters',
      )
      res
        .status(400)
        .json({ error: 'Missing required parameters: repo, collection, rkey' })
      return
    }

    try {
      // Handle 'self' repo case
      let actualRepo: string
      let agent
      let did: string | undefined

      if (repo === 'self') {
        console.log('Resolving self to actual DID')
        ctx.logger.info('Resolving self to actual DID')
        agent = await getSessionAgent(req, res, ctx)
        if (!agent) {
          console.log('No authenticated agent found')
          ctx.logger.error('No authenticated agent found')
          res.status(401).json({ error: 'Authentication required' })
          return
        }
        actualRepo = agent.assertDid
        did = actualRepo // Store the DID for direct token access if needed
        console.log('Resolved self to DID:', actualRepo)
        ctx.logger.info({ actualRepo }, 'Resolved self to DID')
      } else {
        actualRepo = repo as string
        did = actualRepo // Store the DID for direct token access if needed
        agent = await getSessionAgent(req, res, ctx)
        if (!agent) {
          console.log('No authenticated agent found')
          ctx.logger.error('No authenticated agent found')
          res.status(401).json({ error: 'Authentication required' })
          return
        }
      }

      console.log('Getting PDS URL for repo:', actualRepo)
      ctx.logger.info({ actualRepo }, 'Getting PDS URL')
      const pdsUrl = await ctx.resolver.resolveDidToPdsUrl(actualRepo)
      console.log('Got PDS URL:', pdsUrl)
      ctx.logger.info({ actualRepo, pdsUrl }, 'Got PDS URL')

      if (!pdsUrl) {
        console.log('No PDS URL found for repo:', actualRepo)
        ctx.logger.error({ actualRepo }, 'No PDS URL found')
        res.status(404).json({ error: 'PDS URL not found for repo' })
        return
      }

      // Create an XRPC client for the PDS
      const client = new XrpcClient({ service: pdsUrl }, schemas)

      const params: ComAtprotoRepoDeleteRecord.InputSchema = {
        repo: actualRepo,
        collection: collection as string,
        rkey: rkey as string,
      }

      console.log('Deleting record with params:', params)
      ctx.logger.info({ params }, 'Deleting record')
      // Pass ctx and did to deleteRecord function for fallback token access
      await deleteRecord(client, params, agent, ctx, did)
      console.log('Successfully deleted record')
      ctx.logger.info({ params }, 'Successfully deleted record')

      res.json({ success: true })
    } catch (err) {
      console.error('Error in deleteRecord:', err)
      ctx.logger.error({ err, params: req.body }, 'Failed to delete record')
      if (err instanceof Error) {
        console.error('Error details:', err.message, err.stack)
        ctx.logger.error(
          { error: err.message, stack: err.stack },
          'Error details',
        )
        if (err.message.includes('RecordNotFound')) {
          res.status(404).json({ error: 'Record not found' })
        } else {
          res.status(500).json({
            error: 'Failed to delete record',
            details: err.message,
          })
        }
      } else {
        res.status(500).json({
          error: 'Failed to delete record',
          details: 'Unknown error occurred',
        })
      }
    }
  })

  // Add a token generator endpoint for testing/debugging
  router.get('/api/getToken', async (req, res) => {
    const { did } = req.query as { did?: string }

    if (!did) {
      res.status(400).json({ error: 'DID is required' })
      return // Add return statement to prevent further execution
    }

    try {
      const oauthSession = await ctx.oauthClient.restore(did as string) // Fix the type error by asserting as string

      if (!oauthSession) {
        res.status(404).json({ error: 'No session found for this DID' })
        return // Add return statement to prevent further execution
      }

      // Log session structure but sanitize sensitive data for logging
      const sessionKeys = Object.keys(oauthSession)
      console.log('OAuth Session keys:', sessionKeys)

      const sanitizedSession: Record<string, any> = { ...(oauthSession || {}) }
      // Redact any property that might contain a JWT
      const sensitiveKeys = [
        'accessJwt',
        'refreshJwt',
        'access_token',
        'refresh_token',
        'token',
        'jwt',
        'accessToken',
        'refreshToken',
      ]

      sensitiveKeys.forEach((key: string) => {
        if (key in sanitizedSession) {
          sanitizedSession[key] = '[REDACTED]'
        }

        // Also check nested objects
        ;['credentials', 'session'].forEach((nestedObj) => {
          if (
            sanitizedSession[nestedObj] &&
            typeof sanitizedSession[nestedObj] === 'object'
          ) {
            if (key in sanitizedSession[nestedObj]) {
              ;(sanitizedSession[nestedObj] as Record<string, any>)[key] =
                '[REDACTED]'
            }
          }
        })
      })

      console.log(
        'OAuth Session structure:',
        JSON.stringify(sanitizedSession, null, 2),
      )

      // Extract JWT using the flexible helper function
      const jwt = extractJwtFromSession(oauthSession)

      // Check for DPoP capability
      const hasDpopFetch = typeof oauthSession.dpopFetch === 'function'

      // Return information about available authentication methods
      res.json({
        sessionFound: true,
        authMethods: {
          jwt: {
            available: !!jwt,
            preview: jwt ? `${jwt.substring(0, 20)}...` : null 
          },
          dpop: {
            available: hasDpopFetch
          }
        }
      })
    } catch (err) {
      console.error('Error getting token:', err)
      res.status(500).json({ error: 'Failed to get token' })
    }
  })

  return router
}