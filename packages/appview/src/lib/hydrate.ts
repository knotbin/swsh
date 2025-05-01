import {
  AppBskyActorDefs,
  AppBskyActorProfile,
  ComWhtwndBlogDefs,
  SpaceSwshFeedDefs,
  XyzStatusphereDefs,
} from '@swsh/lexicon'

import { AppContext } from '#/context'
import { Entry, Status } from '#/db'

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
): Promise<SpaceSwshFeedDefs.EntryView> {
  return {
    $type: 'space.swsh.feed.defs#entryView',
    content: entry.content,
    title: entry.title ?? undefined,
    subtitle: entry.subtitle ?? undefined,
    createdAt: entry.createdAt,
  }
}

export async function bskyProfileToProfileView(
  did: string,
  profile: AppBskyActorProfile.Record,
  ctx: AppContext,
): Promise<AppBskyActorDefs.ProfileView> {
  return {
    $type: 'app.bsky.actor.defs#profileView',
    did: did,
    handle: await ctx.resolver.resolveDidToHandle(did),
    avatar: profile.avatar
      ? `https://atproto.pictures/img/${did}/${profile.avatar.ref}`
      : undefined,
    displayName: profile.displayName,
    createdAt: profile.createdAt,
  }
}
