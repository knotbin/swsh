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

      // Convert entries to views with resolved handles
      const entryViews = await Promise.all(
        entries.map(async (entry: any) => {
          const view = await entryToEntryView(entry, ctx)
          // Ensure we have the handle if it's not already present
          if (view.author && !view.author.handle) {
            try {
              const handle = await ctx.resolver.resolveDidToHandle(view.author.did)
              if (handle) {
                view.author.handle = handle
              }
            } catch (err) {
              ctx.logger.warn({ err, did: view.author.did }, 'Failed to resolve handle')
            }
          }
          return view
        })
      )

      return {
        encoding: 'application/json',
        body: {
          entries: entryViews,
        },
      }
    },
  })
}
