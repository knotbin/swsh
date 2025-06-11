/**
 * GENERATED CODE - DO NOT MODIFY
 */
import { BlobRef } from '@atproto/lexicon'
import { HeadersMap, XRPCError } from '@atproto/xrpc'

export interface QueryParams {}

export type InputSchema = string | Uint8Array | Blob

export interface OutputSchema {
  blob: BlobRef
}

export interface CallOptions {
  signal?: AbortSignal
  headers?: HeadersMap
  qp?: QueryParams
  encoding?: string
}

export interface Response {
  success: boolean
  headers: HeadersMap
  data: OutputSchema
}

export function toKnownErr(e: any) {
  return e
}
