/**
 * GENERATED CODE - DO NOT MODIFY
 */
import { validate as _validate } from '../../../../lexicons.js'
import {
  is$typed as _is$typed,
  type $Typed,
  type OmitKey,
} from '../../../../util.js'

const is$typed = _is$typed,
  validate = _validate
const id = 'space.swsh.richtext.facet'

/** Annotation of a sub-string within rich text. */
export interface Main {
  $type?: 'space.swsh.richtext.facet'
  index: ByteSlice
  features: (
    | $Typed<Mention>
    | $Typed<Link>
    | $Typed<Tag>
    | $Typed<Bold>
    | $Typed<Italic>
    | $Typed<Underline>
    | $Typed<Strikethrough>
    | $Typed<Code>
    | { $type: string }
  )[]
}

const hashMain = 'main'

export function isMain<V>(v: V) {
  return is$typed(v, id, hashMain)
}

export function validateMain<V>(v: V) {
  return validate<Main & V>(v, id, hashMain)
}

/** Facet feature for mention of another account. The text is usually a handle, including a '@' prefix, but the facet reference is a DID. */
export interface Mention {
  $type?: 'space.swsh.richtext.facet#mention'
  did: string
}

const hashMention = 'mention'

export function isMention<V>(v: V) {
  return is$typed(v, id, hashMention)
}

export function validateMention<V>(v: V) {
  return validate<Mention & V>(v, id, hashMention)
}

/** Facet feature for a URL. The text URL may have been simplified or truncated, but the facet reference should be a complete URL. */
export interface Link {
  $type?: 'space.swsh.richtext.facet#link'
  uri: string
}

const hashLink = 'link'

export function isLink<V>(v: V) {
  return is$typed(v, id, hashLink)
}

export function validateLink<V>(v: V) {
  return validate<Link & V>(v, id, hashLink)
}

/** Facet feature for a hashtag. The text usually includes a '#' prefix, but the facet reference should not (except in the case of 'double hash tags'). */
export interface Tag {
  $type?: 'space.swsh.richtext.facet#tag'
  tag: string
}

const hashTag = 'tag'

export function isTag<V>(v: V) {
  return is$typed(v, id, hashTag)
}

export function validateTag<V>(v: V) {
  return validate<Tag & V>(v, id, hashTag)
}

/** Specifies the sub-string range a facet feature applies to. Start index is inclusive, end index is exclusive. Indices are zero-indexed, counting bytes of the UTF-8 encoded text. NOTE: some languages, like Javascript, use UTF-16 or Unicode codepoints for string slice indexing; in these languages, convert to byte arrays before working with facets. */
export interface ByteSlice {
  $type?: 'space.swsh.richtext.facet#byteSlice'
  byteStart: number
  byteEnd: number
}

const hashByteSlice = 'byteSlice'

export function isByteSlice<V>(v: V) {
  return is$typed(v, id, hashByteSlice)
}

export function validateByteSlice<V>(v: V) {
  return validate<ByteSlice & V>(v, id, hashByteSlice)
}

/** Facet feature for bold text formatting. */
export interface Bold {
  $type?: 'space.swsh.richtext.facet#bold'
  byteStart: number
  byteEnd: number
}

const hashBold = 'bold'

export function isBold<V>(v: V) {
  return is$typed(v, id, hashBold)
}

export function validateBold<V>(v: V) {
  return validate<Bold & V>(v, id, hashBold)
}

/** Facet feature for italic text formatting. */
export interface Italic {
  $type?: 'space.swsh.richtext.facet#italic'
  byteStart: number
  byteEnd: number
}

const hashItalic = 'italic'

export function isItalic<V>(v: V) {
  return is$typed(v, id, hashItalic)
}

export function validateItalic<V>(v: V) {
  return validate<Italic & V>(v, id, hashItalic)
}

/** Facet feature for underlined text formatting. */
export interface Underline {
  $type?: 'space.swsh.richtext.facet#underline'
  byteStart: number
  byteEnd: number
}

const hashUnderline = 'underline'

export function isUnderline<V>(v: V) {
  return is$typed(v, id, hashUnderline)
}

export function validateUnderline<V>(v: V) {
  return validate<Underline & V>(v, id, hashUnderline)
}

/** Facet feature for strikethrough text formatting. */
export interface Strikethrough {
  $type?: 'space.swsh.richtext.facet#strikethrough'
  byteStart: number
  byteEnd: number
}

const hashStrikethrough = 'strikethrough'

export function isStrikethrough<V>(v: V) {
  return is$typed(v, id, hashStrikethrough)
}

export function validateStrikethrough<V>(v: V) {
  return validate<Strikethrough & V>(v, id, hashStrikethrough)
}

/** Facet feature for monospace/code text formatting. */
export interface Code {
  $type?: 'space.swsh.richtext.facet#code'
  byteStart: number
  byteEnd: number
}

const hashCode = 'code'

export function isCode<V>(v: V) {
  return is$typed(v, id, hashCode)
}

export function validateCode<V>(v: V) {
  return validate<Code & V>(v, id, hashCode)
}
