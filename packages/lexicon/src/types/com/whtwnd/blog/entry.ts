/**
 * GENERATED CODE - DO NOT MODIFY
 */
import { validate as _validate } from '../../../../lexicons.js'
import { is$typed as _is$typed } from '../../../../util.js'
import type * as ComWhtwndBlogDefs from './defs.js'

const is$typed = _is$typed,
  validate = _validate
const id = 'com.whtwnd.blog.entry'

export interface MainRecord {
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

export type Record = MainRecord

const hashMainRecord = 'main'

export function isMainRecord<V>(v: V) {
  return is$typed(v, id, hashMainRecord)
}

export function validateMainRecord<V>(v: V) {
  return validate<MainRecord & V>(v, id, hashMainRecord, true)
}
