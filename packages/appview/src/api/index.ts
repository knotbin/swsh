import { AppContext } from '#/context'
import { Server } from '#/lexicons'
import getEntries from './lexicons/getEntries'
import getStatuses from './lexicons/getStatuses'
import getUser from './lexicons/getUser'
import sendEntry from './lexicons/sendEntry'
import sendStatus from './lexicons/sendStatus'

export * as health from './health'
export * as oauth from './oauth'

export default function (server: Server, ctx: AppContext) {
  getEntries(server, ctx)
  sendEntry(server, ctx)
  getStatuses(server, ctx)
  sendStatus(server, ctx)
  getUser(server, ctx)
  return server
}
