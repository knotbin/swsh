import { AppContext } from '../../context.js'
import { Server } from '../../lexicons/index.js'
import { entryToEntryView } from '../../lib/hydrate.js'

export default function (server: Server, ctx: AppContext) {
  server.space.swsh.feed.getEntries({
    handler: async ({ params }: { params: { limit: number } }) => {
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
            entries.map((entry: any) => entryToEntryView(entry, ctx)),
          ),
        },
      }
    },
  })
}
