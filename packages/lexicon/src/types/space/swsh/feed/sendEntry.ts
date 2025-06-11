/**
 * GENERATED CODE - DO NOT MODIFY
 */
import { HeadersMap, XRPCError } from '@atproto/xrpc'

import type * as SpaceSwshRichtextFacet from '../richtext/facet.js'
import type * as SpaceSwshFeedDefs from './defs.js'

export interface QueryParams {}

export interface InputSchema {
  title?: string
  subtitle?: string
  content: string
  facets?: SpaceSwshRichtextFacet.Main[]
  /** Tells the visibility of the article to AppView. */
  visibility?: 'public' | 'url' | 'author'
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
