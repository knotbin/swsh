/**
 * GENERATED CODE - DO NOT MODIFY
 */
import { type HonoRequest } from '@hono/hono'
import { HandlerAuth, HandlerPipeThrough } from '@sprk/xrpc-server'

import type * as SpaceSwshRichtextFacet from '../richtext/facet.js'
import type * as SpaceSwshFeedDefs from './defs.js'

export interface QueryParams {}

export interface InputSchema {
  title?: string
  subtitle?: string
  content: string
  facets?: SpaceSwshRichtextFacet.Main[]
  /** Tells the visibility of the article to AppView. */
  visibility: 'public' | 'url' | 'author'
  /** If updating, the rkey of the existing entry. */
  rkey?: string
}

export interface OutputSchema {
  /** The URI of the entry. */
  uri?: string
  /** The CID of the entry. */
  cid?: string
  entry: SpaceSwshFeedDefs.EntryView
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
