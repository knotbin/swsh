/**
 * GENERATED CODE - DO NOT MODIFY
 */
import { BlobRef, type ValidationResult } from '@atproto/lexicon'
import { HandlerAuth, HandlerPipeThrough } from '@atproto/xrpc-server'
import express from 'express'
import { CID } from 'multiformats/cid'

import { validate as _validate } from '../../../lexicons'
import { is$typed as _is$typed, type $Typed, type OmitKey } from '../../../util'
import type * as AppBskyActorDefs from '../../app/bsky/actor/defs.js'
import type * as XyzStatusphereDefs from './defs.js'

const is$typed = _is$typed,
  validate = _validate
const id = 'xyz.statusphere.getUser'

export interface QueryParams {}

export type InputSchema = undefined

export interface OutputSchema {
  profile: AppBskyActorDefs.ProfileView
  status?: XyzStatusphereDefs.StatusView
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
  req: express.Request
  res: express.Response
  resetRouteRateLimits: () => Promise<void>
}
export type Handler<HA extends HandlerAuth = never> = (
  ctx: HandlerReqCtx<HA>,
) => Promise<HandlerOutput> | HandlerOutput
