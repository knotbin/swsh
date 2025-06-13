/**
 * GENERATED CODE - DO NOT MODIFY
 */
import { validate as _validate } from '../../../../lexicons.js'
import { is$typed as _is$typed } from '../../../../util.js'

const is$typed = _is$typed,
  validate = _validate
const id = 'space.swsh.feed.defs'

export interface EntryView {
  $type?: 'space.swsh.feed.defs#entryView'
  title?: string
  subtitle?: string
  content: string
  createdAt?: string
}

const hashEntryView = 'entryView'

export function isEntryView<V>(v: V) {
  return is$typed(v, id, hashEntryView)
}

export function validateEntryView<V>(v: V) {
  return validate<EntryView & V>(v, id, hashEntryView)
}

export interface Reply {
  $type?: 'space.swsh.feed.defs#reply'
  content: string
  reply?: ReplyRef
  createdAt: string
}

const hashReply = 'reply'

export function isReply<V>(v: V) {
  return is$typed(v, id, hashReply)
}

export function validateReply<V>(v: V) {
  return validate<Reply & V>(v, id, hashReply)
}

export interface ReplyRef {
  $type?: 'space.swsh.feed.defs#replyRef'
  root: EntryView
  parent: Reply
  grandparentAuthor?: string
}

const hashReplyRef = 'replyRef'

export function isReplyRef<V>(v: V) {
  return is$typed(v, id, hashReplyRef)
}

export function validateReplyRef<V>(v: V) {
  return validate<ReplyRef & V>(v, id, hashReplyRef)
}
