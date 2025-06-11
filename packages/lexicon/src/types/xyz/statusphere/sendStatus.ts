/**
 * GENERATED CODE - DO NOT MODIFY
 */
import { HeadersMap, XRPCError } from '@atproto/xrpc'

import type * as XyzStatusphereDefs from './defs.js'

export type QueryParams = Record<never, never>

export interface InputSchema {
  status: string
}

export interface OutputSchema {
  status: XyzStatusphereDefs.StatusView
}

export interface CallOptions {
  signal?: AbortSignal
  headers?: HeadersMap
  qp?: QueryParams
  encoding?: 'application/json'
}

export interface Response {
  success: boolean
  headers: HeadersMap
  data: OutputSchema
}

export function toKnownErr(e: any) {
  return e
}
