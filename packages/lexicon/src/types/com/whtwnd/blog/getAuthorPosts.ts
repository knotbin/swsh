/**
 * GENERATED CODE - DO NOT MODIFY
 */
import { BlobRef, ValidationResult } from '@atproto/lexicon'
import { HeadersMap, XRPCError } from '@atproto/xrpc'
import { CID } from 'multiformats/cid'

import { validate as _validate } from '../../../../lexicons'
import { is$typed as _is$typed, $Typed, OmitKey } from '../../../../util'
import type * as ComWhtwndBlogDefs from './defs.js'

const is$typed = _is$typed,
  validate = _validate
const id = 'com.whtwnd.blog.getAuthorPosts'

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
