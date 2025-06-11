import { AuthRequiredError } from '@atproto/xrpc-server'
import { AppBskyActorProfile } from '@swsh/lexicon'

import { AppContext } from '../../context.js'
import { Server } from '../../lexicons/index.js'
import { bskyProfileToProfileView, statusToStatusView } from '../../lib/hydrate.js'
import { getSessionAgent } from '../../session.js'

class ApiError extends Error {
  constructor(message: string, public originalError?: Error) {
    super(message)
    this.name = 'ApiError'
  }
}

export default function (server: Server, ctx: AppContext) {
  server.xyz.statusphere.getUser({
    handler: async ({ req }) => {
      try {
        const agent = await getSessionAgent(req, ctx)
        if (!agent) {
          throw new AuthRequiredError('Authentication required')
        }

        const did = agent.assertDid

        try {
          const profileResponse = await agent.com.atproto.repo
            .getRecord({
              repo: did,
              collection: 'app.bsky.actor.profile',
              rkey: 'self',
            })
            .catch((err: Error) => {
              ctx.logger.error({ err, did }, 'Failed to fetch user profile')
              throw new ApiError('Failed to fetch user profile', err)
            })

          const profileRecord = profileResponse?.data
          let profile: AppBskyActorProfile.Record = {} as AppBskyActorProfile.Record

          if (profileRecord && AppBskyActorProfile.isRecord(profileRecord.value)) {
            const validated = AppBskyActorProfile.validateRecord(
              profileRecord.value,
            )
            if (validated.success) {
              profile = profileRecord.value
            } else {
              ctx.logger.error(
                { err: validated.error, did },
                'Failed to validate user profile',
              )
              throw new ApiError('Invalid user profile data')
            }
          }

          // Fetch user status
          const status = await ctx.db
            .selectFrom('status')
            .selectAll()
            .where('authorDid', '=', did)
            .orderBy('indexedAt', 'desc')
            .executeTakeFirst()
            .catch((err: Error) => {
              ctx.logger.error({ err, did }, 'Failed to fetch user status')
              throw new ApiError('Failed to fetch user status', err)
            })

          return {
            encoding: 'application/json',
            body: {
              profile: await bskyProfileToProfileView(did, profile, ctx),
              status: status ? await statusToStatusView(status, ctx) : undefined,
            },
          }
        } catch (err) {
          ctx.logger.error({ 
            err,
            did: agent.assertDid,
            path: req.path,
            method: req.method
          }, 'Error in getUser handler')
          throw err
        }
      } catch (err) {
        // Add request context to the error
        if (err instanceof Error) {
          (err as any).details = {
            path: req.path,
            method: req.method,
            ...(err as any).details
          }
        }
        throw err
      }
    },
  })
}
