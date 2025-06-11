/**
 * GENERATED CODE - DO NOT MODIFY
 */
import { validate as _validate } from '../../../lexicons.ts'
import {
  is$typed as _is$typed,
  type $Typed,
  type OmitKey,
} from '../../../util.ts'

const is$typed = _is$typed,
  validate = _validate
const id = 'xyz.statusphere.status'

export interface Record {
  $type: 'xyz.statusphere.status'
  status: string
  createdAt: string
  [k: string]: unknown
}

const hashRecord = 'main'

export function isRecord<V>(v: V) {
  return is$typed(v, id, hashRecord)
}

export function validateRecord<V>(v: V) {
  return validate<Record & V>(v, id, hashRecord, true)
}
