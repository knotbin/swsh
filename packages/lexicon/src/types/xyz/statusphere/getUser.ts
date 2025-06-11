/**
 * GENERATED CODE - DO NOT MODIFY
 */
import { HeadersMap, XRPCError } from '@atproto/xrpc'

import type * as AppBskyActorDefs from '../../app/bsky/actor/defs.js'
import type * as XyzStatusphereDefs from './defs.js'

export type QueryParams = Record<never, never>
export type InputSchema = undefined

export interface OutputSchema {
  profile: AppBskyActorDefs.ProfileView
  status?: XyzStatusphereDefs.StatusView
}

export interface CallOptions {
  signal?: AbortSignal
  headers?: HeadersMap
}

export interface Response {
  success: boolean
  headers: HeadersMap
  data: OutputSchema
}

export function toKnownErr(e: any) {
  return e
}
