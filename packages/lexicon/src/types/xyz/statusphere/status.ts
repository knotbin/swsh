/**
 * GENERATED CODE - DO NOT MODIFY
 */
import { validate as _validate } from '../../../lexicons.js'
import { is$typed as _is$typed } from '../../../util.js'

const is$typed = _is$typed,
  validate = _validate
const id = 'xyz.statusphere.status'

export interface MainRecord {
  $type: 'xyz.statusphere.status'
  status: string
  createdAt: string
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
