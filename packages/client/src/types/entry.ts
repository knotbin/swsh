import { SpaceSwshFeedDefs } from '@swsh/lexicon'

// Base entry view type from the lexicon
export type BaseEntryView = SpaceSwshFeedDefs.EntryView

// Extended entry view type with additional fields
export interface EntryView extends BaseEntryView {
  author: {
    did: string
    handle?: string
  }
  rkey: string
  uri?: string
}

// Type for the API response
export interface EntriesResponse {
  data: {
    entries: EntryView[]
  }
} 