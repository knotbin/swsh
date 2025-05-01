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
  visibility?: 'public' | 'url' | 'author'
}

export interface OutputSchema {
  entry: SpaceSwshFeedDefs.EntryView
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
