/**
 * GENERATED CODE - DO NOT MODIFY
 */
import { type HonoRequest } from '@hono/hono'
import { HandlerAuth, HandlerPipeThrough } from '@sprk/xrpc-server'

export interface QueryParams {
  postUri: string
}

export type InputSchema = undefined

export interface OutputSchema {
  mentions: string[]
}

export type HandlerInput = undefined

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
