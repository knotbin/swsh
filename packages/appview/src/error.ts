import { XRPCError } from '@atproto/xrpc-server'
import type { Context, ErrorHandler } from '@hono/hono'

import type { AppContext } from './context.js'

export const createHandler = (ctx: AppContext): ErrorHandler => {
  return (err: Error, c: Context, ...handlers: any[]) => {
    // Log detailed error information
    ctx.logger.error({
      err,
      message: err.message,
      stack: err.stack,
      code: (err as any).code,
      type: (err as any).type,
      details: (err as any).details,
      path: c.req.path,
      method: c.req.method,
    }, 'Server error occurred')

    const next = handlers[0]
    if (c.res && c.res.headers.get('content-type') && typeof next === 'function') {
      return next()
    }

    const serverError = XRPCError.fromError(err)
    
    // Create response with proper status code
    return new Response(JSON.stringify({
      ...serverError.payload,
      path: c.req.path,
      method: c.req.method,
      details: (err as any).details || serverError.payload.message
    }), {
      status: typeof serverError.type === 'number' ? serverError.type : 500,
      headers: {
        'Content-Type': 'application/json'
      }
    })
  }
}
