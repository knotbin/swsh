/**
 * GENERATED CODE - DO NOT MODIFY
 */
import { BlobRef, type ValidationResult } from '@atproto/lexicon'
import { CID } from 'multiformats/cid'

import { validate as _validate } from '../../../../lexicons'
import {
  is$typed as _is$typed,
  type $Typed,
  type OmitKey,
} from '../../../../util'
import type * as SpaceSwshRichtextFacet from '../richtext/facet.js'

const is$typed = _is$typed,
  validate = _validate
const id = 'space.swsh.feed.entry'

export interface Record {
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

const hashRecord = 'main'

export function isRecord<V>(v: V) {
  return is$typed(v, id, hashRecord)
}

export function validateRecord<V>(v: V) {
  return validate<Record & V>(v, id, hashRecord, true)
}
