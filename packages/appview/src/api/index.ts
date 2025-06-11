import { AppContext } from '../context.js'
import { Server } from '../lexicons/index.js'
import getEntries from './lexicons/getEntries.js'
import getStatuses from './lexicons/getStatuses.js'
import getUser from './lexicons/getUser.js'
import sendEntry from './lexicons/sendEntry.js'
import sendStatus from './lexicons/sendStatus.js'

export * as health from './health.js'
export * as oauth from './oauth.js'
export * as wellKnown from './well-known.js'
export * as resolve from './resolve.js'
export * as getRecord from './getRecord.js'
export * as deleteRecord from './deleteRecord.js'

export default function (server: Server, ctx: AppContext) {
  getEntries(server, ctx)
  sendEntry(server, ctx)
  getStatuses(server, ctx)
  sendStatus(server, ctx)
  getUser(server, ctx)
  return server
}
