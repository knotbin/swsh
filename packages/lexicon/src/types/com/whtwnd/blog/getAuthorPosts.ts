/**
 * GENERATED CODE - DO NOT MODIFY
 */
import { HeadersMap, XRPCError } from '@atproto/xrpc'

import type * as ComWhtwndBlogDefs from './defs.js'

export interface QueryParams {
  author: string
}

export type InputSchema = undefined

export interface OutputSchema {
  post: ComWhtwndBlogDefs.BlogEntry[]
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
