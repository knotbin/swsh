import { AppContext } from '../../context.js'
import { Server } from '../../lexicons/index.js'
import { statusToStatusView } from '../../lib/hydrate.js'

export default function (server: Server, ctx: AppContext) {
  server.xyz.statusphere.getStatuses({
    handler: async ({ params }: { params: { limit: number } }) => {
      // Fetch data stored in our SQLite
      const statuses = await ctx.db
        .selectFrom('status')
        .selectAll()
        .orderBy('indexedAt', 'desc')
        .limit(params.limit)
        .execute()

      return {
        encoding: 'application/json',
        body: {
          statuses: await Promise.all(
            statuses.map((status: any) => statusToStatusView(status, ctx)),
          ),
        },
      }
    },
  })
}
