import {
  AppBskyActorDefs,
  AppBskyActorProfile,
  ComWhtwndBlogDefs,
  SpaceSwshFeedDefs,
  XyzStatusphereDefs,
} from '@swsh/lexicon'

import { AppContext } from '../context.js'
import { Entry, Status } from '../db.js'

export async function statusToStatusView(
  status: Status,
  ctx: AppContext,
): Promise<XyzStatusphereDefs.StatusView> {
  return {
    uri: status.uri,
    status: status.status,
    createdAt: status.createdAt,
    profile: {
      did: status.authorDid,
      handle: await ctx.resolver
        .resolveDidToHandle(status.authorDid)
        .catch(() => 'invalid.handle'),
    },
  }
}

export async function entryToEntryView(
  entry: Entry,
  ctx: AppContext,
): Promise<
  SpaceSwshFeedDefs.EntryView & { 
    author: { 
      did: string
      handle?: string 
    }
    rkey: string
    uri: string
  }
> {
  // Extract rkey from URI
  const rkey = entry.uri.split('/').pop() || ''

  // Resolve the handle for the author
  const handle = await ctx.resolver
    .resolveDidToHandle(entry.authorDid)
    .catch(() => undefined)

  return {
    $type: 'space.swsh.feed.defs#entryView',
    content: entry.content,
    title: entry.title ?? undefined,
    subtitle: entry.subtitle ?? undefined,
    createdAt: entry.createdAt,
    author: { 
      did: entry.authorDid,
      handle
    },
    rkey,
    uri: entry.uri
  }
}

export async function bskyProfileToProfileView(
  did: string,
  profile: AppBskyActorProfile.Record,
  ctx: AppContext,
): Promise<AppBskyActorDefs.ProfileView> {
  // Try to resolve the handle, but fall back to using the DID if resolution fails
  let handle: string
  try {
    handle = await ctx.resolver.resolveDidToHandle(did)
    if (!handle) {
      throw new Error('Handle resolution returned null')
    }
    // Strip at:// prefix if present
    handle = handle.replace('at://', '')
  } catch (err) {
    // If handle resolution fails, use the DID as the handle
    handle = did
  }

  return {
    $type: 'app.bsky.actor.defs#profileView',
    did: did,
    handle: handle,
    avatar: profile.avatar
      ? `https://atproto.pictures/img/${did}/${profile.avatar.ref}`
      : undefined,
    displayName: profile.displayName,
    createdAt: profile.createdAt,
  }
}
