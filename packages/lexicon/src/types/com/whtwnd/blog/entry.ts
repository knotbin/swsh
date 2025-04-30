/**
 * GENERATED CODE - DO NOT MODIFY
 */
import { BlobRef, ValidationResult } from '@atproto/lexicon'
import { CID } from 'multiformats/cid'

import { validate as _validate } from '../../../../lexicons'
import { is$typed as _is$typed, $Typed, OmitKey } from '../../../../util'
import type * as ComWhtwndBlogDefs from './defs.js'

const is$typed = _is$typed,
  validate = _validate
const id = 'com.whtwnd.blog.entry'

export interface Record {
  $type: 'com.whtwnd.blog.entry'
  content: string
  createdAt?: string
  title?: string
  subtitle?: string
  ogp?: ComWhtwndBlogDefs.Ogp
  theme?: 'github-light'
  blobs?: ComWhtwndBlogDefs.BlobMetadata[]
  /** (DEPRECATED) Marks this entry as draft to tell AppViews not to show it to anyone except for the author */
  isDraft?: boolean
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
