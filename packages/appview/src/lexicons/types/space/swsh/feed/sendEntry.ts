/**
 * GENERATED CODE - DO NOT MODIFY
 */
import { BlobRef, type ValidationResult } from '@atproto/lexicon'
import { HandlerAuth, HandlerPipeThrough } from '@atproto/xrpc-server'
import express from 'express'
import { CID } from 'multiformats/cid'

import { validate as _validate } from '../../../../lexicons'
import {
  is$typed as _is$typed,
  type $Typed,
  type OmitKey,
} from '../../../../util'
import type * as SpaceSwshRichtextFacet from '../richtext/facet.js'
import type * as SpaceSwshFeedDefs from './defs.js'

const is$typed = _is$typed,
  validate = _validate
const id = 'space.swsh.feed.sendEntry'

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
  req: express.Request
  res: express.Response
  resetRouteRateLimits: () => Promise<void>
}
export type Handler<HA extends HandlerAuth = never> = (
  ctx: HandlerReqCtx<HA>,
) => Promise<HandlerOutput> | HandlerOutput
