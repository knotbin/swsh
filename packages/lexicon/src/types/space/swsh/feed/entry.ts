/**
 * GENERATED CODE - DO NOT MODIFY
 */
import { BlobRef } from '@atproto/lexicon'

import { validate as _validate } from '../../../../lexicons.js'
import { is$typed as _is$typed } from '../../../../util.js'
import type * as SpaceSwshRichtextFacet from '../richtext/facet.js'

const is$typed = _is$typed,
  validate = _validate
const id = 'space.swsh.feed.entry'

export interface MainRecord {
  $type: 'space.swsh.feed.entry'
  /** The primary post content. */
  content: string
  /** Annotations of text (mentions, URLs, hashtags, etc) */
  facets?: SpaceSwshRichtextFacet.Main[]
  createdAt?: string
  title?: string
  subtitle?: string
  banner?: BlobRef
  blobs?: BlobRef[]
  /** Tells the visibility of the article to AppView. */
  visibility: 'public' | 'url' | 'author'
  [k: string]: unknown
}

export type Record = MainRecord

const hashMainRecord = 'main'

export function isMainRecord<V>(v: V) {
  return is$typed(v, id, hashMainRecord)
}

export function validateMainRecord<V>(v: V) {
  return validate<MainRecord & V>(v, id, hashMainRecord, true)
}
