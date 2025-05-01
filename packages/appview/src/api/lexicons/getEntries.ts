import { AppContext } from '#/context'
import { Server } from '#/lexicons'
import { entryToEntryView } from '#/lib/hydrate'

export default function (server: Server, ctx: AppContext) {
  server.space.swsh.feed.getEntries({
    handler: async ({ params }) => {
      // Fetch data stored in our SQLite
      const entries = await ctx.db
        .selectFrom('entry')
        .selectAll()
        .orderBy('indexedAt', 'desc')
        .limit(params.limit)
        .execute()

      return {
        encoding: 'application/json',
        body: {
          entries: await Promise.all(
            entries.map((entry) => entryToEntryView(entry, ctx)),
          ),
        },
      }
    },
  })
}
