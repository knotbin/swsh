/**
 * GENERATED CODE - DO NOT MODIFY
 */
import { type HonoRequest } from '@hono/hono'
import { HandlerAuth, HandlerPipeThrough } from '@sprk/xrpc-server'

import { validate as _validate } from '../../../../lexicons.ts'
import {
  is$typed as _is$typed,
  type $Typed,
  type OmitKey,
} from '../../../../util.ts'

const is$typed = _is$typed,
  validate = _validate
const id = 'com.atproto.repo.listRecords'

export interface QueryParams {
  /** The handle or DID of the repo. */
  repo: string
  /** The NSID of the record type. */
  collection: string
  /** The number of records to return. */
  limit: number
  cursor?: string
  /** DEPRECATED: The lowest sort-ordered rkey to start from (exclusive) */
  rkeyStart?: string
  /** DEPRECATED: The highest sort-ordered rkey to stop at (exclusive) */
  rkeyEnd?: string
  /** Flag to reverse the order of the returned records. */
  reverse?: boolean
}

export type InputSchema = undefined

export interface OutputSchema {
  cursor?: string
  records: Record[]
}

export type HandlerInput = undefined

export interface HandlerSuccess {
  encoding: 'application/json'
  body: OutputSchema
  headers?: { [key: string]: string }
}

export interface HandlerError {
  status: number
  message?: string
}

export type HandlerOutput = HandlerError | HandlerSuccess | HandlerPipeThrough
export type HandlerReqCtx<HA extends HandlerAuth = never> = {
  auth: HA
  params: QueryParams
  input: HandlerInput
  req: HonoRequest
  resetRouteRateLimits: () => Promise<void>
}
export type Handler<HA extends HandlerAuth = never> = (
  ctx: HandlerReqCtx<HA>,
) => Promise<HandlerOutput> | HandlerOutput

export interface Record {
  $type?: 'com.atproto.repo.listRecords#record'
  uri: string
  cid: string
  value: { [_ in string]: unknown }
}

const hashRecord = 'record'

export function isRecord<V>(v: V) {
  return is$typed(v, id, hashRecord)
}

export function validateRecord<V>(v: V) {
  return validate<Record & V>(v, id, hashRecord)
}
