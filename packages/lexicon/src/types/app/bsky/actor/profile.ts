/**
 * GENERATED CODE - DO NOT MODIFY
 */
import { BlobRef } from '@atproto/lexicon'

import { validate as _validate } from '../../../../lexicons.js'
import { is$typed as _is$typed, type $Typed } from '../../../../util.js'
import type * as ComAtprotoLabelDefs from '../../../com/atproto/label/defs.js'
import type * as ComAtprotoRepoStrongRef from '../../../com/atproto/repo/strongRef.js'

const is$typed = _is$typed,
  validate = _validate
const id = 'app.bsky.actor.profile'

export interface MainRecord {
  $type: 'app.bsky.actor.profile'
  displayName?: string
  /** Free-form profile description text. */
  description?: string
  /** Small image to be displayed next to posts from account. AKA, 'profile picture' */
  avatar?: BlobRef
  /** Larger horizontal image to display behind profile view. */
  banner?: BlobRef
  labels?: $Typed<ComAtprotoLabelDefs.SelfLabels> | { $type: string }
  joinedViaStarterPack?: ComAtprotoRepoStrongRef.Main
  pinnedPost?: ComAtprotoRepoStrongRef.Main
  createdAt?: string
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
