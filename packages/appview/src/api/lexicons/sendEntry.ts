import { TID } from '@atproto/common'
import {
  AuthRequiredError,
  InvalidRequestError,
  UpstreamFailureError,
} from '@atproto/xrpc-server'
import { SpaceSwshFeedEntry } from '@swsh/lexicon'

import { AppContext } from '#/context'
import { Facet } from '#/db'
import { Server } from '#/lexicons'
import { encodeFacets } from '#/lib/facets'
import { entryToEntryView } from '#/lib/hydrate'
import { getSessionAgent } from '#/session'

export default function (server: Server, ctx: AppContext) {
  server.space.swsh.feed.sendEntry({
    handler: async ({ input, req, res }) => {
      const agent = await getSessionAgent(req, res, ctx)
      if (!agent) {
        throw new AuthRequiredError('Authentication required')
      }

      // Construct & validate their entry record
      const rkey = input.body.rkey ?? TID.nextStr()
      const record = {
        $type: 'space.swsh.feed.entry',
        content: input.body.content,
        title: input.body.title ?? null,
        subtitle: input.body.subtitle ?? null,
        facets:
          input.body.facets?.map((f) => ({
            byteStart: f.index.byteStart,
            byteEnd: f.index.byteEnd,
            type: f.features[0].$type.split('.').pop()?.toLowerCase() ?? '',
          })) ?? [],
        createdAt: new Date().toISOString(),
        visibility: input.body.visibility ?? 'public',
      }

      const validation = SpaceSwshFeedEntry.validateRecord(record)
      if (!validation.success) {
        throw new InvalidRequestError('Invalid entry')
      }

      let uri
      let cid
      try {
        // Write the entry record to the user's repository
        const response = await agent.com.atproto.repo.putRecord({
          repo: agent.assertDid,
          collection: 'space.swsh.feed.entry',
          rkey,
          record: validation.value,
          validate: false,
        })
        uri = response.data.uri
        cid = response.data.cid
      } catch (err) {
        throw new UpstreamFailureError('Failed to write record')
      }

      const optimisticEntry = {
        uri,
        authorDid: agent.assertDid,
        content: record.content,
        title: record.title,
        subtitle: record.subtitle,
        facets: encodeFacets(record.facets),
        createdAt: record.createdAt,
        indexedAt: new Date().toISOString(),
      }

      try {
        // Optimistically update our SQLite
        // This isn't strictly necessary because the write event will be
        // handled in #/firehose/ingestor.ts, but it ensures that future reads
        // will be up-to-date after this method finishes.
        await ctx.db
          .insertInto('entry')
          .values({
            ...optimisticEntry,
            facets: encodeFacets(record.facets),
          })
          .execute()
      } catch (err) {
        ctx.logger.warn(
          { err },
          'failed to update computed view; ignoring as it should be caught by the firehose',
        )
      }

      return {
        encoding: 'application/json',
        body: {
          uri,
          cid,
          entry: await entryToEntryView(optimisticEntry, ctx),
        },
      }
    },
  })
}
