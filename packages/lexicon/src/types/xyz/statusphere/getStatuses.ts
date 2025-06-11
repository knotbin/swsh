/**
 * GENERATED CODE - DO NOT MODIFY
 */
import { HeadersMap, XRPCError } from '@atproto/xrpc'

import type * as XyzStatusphereDefs from './defs.js'

export interface QueryParams {
  limit?: number
}

export type InputSchema = undefined

export interface OutputSchema {
  statuses: XyzStatusphereDefs.StatusView[]
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
