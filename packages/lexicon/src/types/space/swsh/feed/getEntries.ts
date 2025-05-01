/**
 * GENERATED CODE - DO NOT MODIFY
 */
import { BlobRef, type ValidationResult } from '@atproto/lexicon'
import { HeadersMap, XRPCError } from '@atproto/xrpc'
import { CID } from 'multiformats/cid'

import { validate as _validate } from '../../../../lexicons'
import {
  is$typed as _is$typed,
  type $Typed,
  type OmitKey,
} from '../../../../util'
import type * as SpaceSwshFeedDefs from './defs.js'

const is$typed = _is$typed,
  validate = _validate
const id = 'space.swsh.feed.getEntries'

export interface QueryParams {
  limit?: number
}

export type InputSchema = undefined

export interface OutputSchema {
  entries: SpaceSwshFeedDefs.EntryView[]
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
