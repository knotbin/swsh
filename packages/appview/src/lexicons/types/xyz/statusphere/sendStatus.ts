/**
 * GENERATED CODE - DO NOT MODIFY
 */
import { type HonoRequest } from '@hono/hono'
import { HandlerAuth, HandlerPipeThrough } from '@sprk/xrpc-server'

import type * as XyzStatusphereDefs from './defs.js'

export interface QueryParams {}

export interface InputSchema {
  status: string
}

export interface OutputSchema {
  status: XyzStatusphereDefs.StatusView
}

export interface HandlerInput {
  encoding: 'application/json'
  body: InputSchema
}

export interface HandlerSuccess {
  encoding: 'application/json'
  body: OutputSchema
  headers?: { [key: string]: string }
}

export interface HandlerError {
  status: number
  message?: string
}

export type HandlerOutput = HandlerError | HandlerSuccess | HandlerPipeThrough
export type HandlerReqCtx<HA extends HandlerAuth = never> = {
  auth: HA
  params: QueryParams
  input: HandlerInput
  req: HonoRequest
  resetRouteRateLimits: () => Promise<void>
}
export type Handler<HA extends HandlerAuth = never> = (
  ctx: HandlerReqCtx<HA>,
) => Promise<HandlerOutput> | HandlerOutput
