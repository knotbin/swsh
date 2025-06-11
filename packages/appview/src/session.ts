import { Agent } from '@atproto/api'
import type { Context } from '@hono/hono'
import type { HonoRequest } from '@hono/hono'
import { getIronSession, SessionOptions } from 'iron-session'

import { AppContext } from './context.js'
import { env } from './lib/env.js'

type Session = { did: string }

// Common session options
const sessionOptions: SessionOptions = {
  cookieName: 'sid',
  password: env.COOKIE_SECRET,
  cookieOptions: {
    secure: env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    // Don't set domain explicitly - let browser determine it
    domain: undefined,
  },
}

export async function getSessionAgent(
  reqOrContext: Context | HonoRequest,
  ctx: AppContext,
) {
  try {
    const req = 'raw' in reqOrContext ? reqOrContext.raw : reqOrContext.req.raw
    const res = new Response()

    const session = await getIronSession<Session>(req, res, sessionOptions)

    if (!session.did) {
      return null
    }

    try {
      const oauthSession = await ctx.oauthClient.restore(session.did)
      return oauthSession ? new Agent(oauthSession) : null
    } catch (err) {
      ctx.logger.warn({ err }, 'oauth restore failed')
      session.destroy()
      return null
    }
  } catch (err) {
    ctx.logger.error({ err }, 'Failed to get session')
    return null
  }
}

export async function getSession(c: Context) {
  return getIronSession<Session>(c.req.raw, c.res, sessionOptions)
}
