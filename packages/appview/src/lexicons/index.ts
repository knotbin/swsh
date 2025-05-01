/**
 * GENERATED CODE - DO NOT MODIFY
 */
import {
  createServer as createXrpcServer,
  Server as XrpcServer,
  type AuthVerifier,
  type StreamAuthVerifier,
  type Options as XrpcOptions,
} from '@atproto/xrpc-server'

import { schemas } from './lexicons.js'
import * as ComAtprotoRepoApplyWrites from './types/com/atproto/repo/applyWrites.js'
import * as ComAtprotoRepoCreateRecord from './types/com/atproto/repo/createRecord.js'
import * as ComAtprotoRepoDeleteRecord from './types/com/atproto/repo/deleteRecord.js'
import * as ComAtprotoRepoDescribeRepo from './types/com/atproto/repo/describeRepo.js'
import * as ComAtprotoRepoGetRecord from './types/com/atproto/repo/getRecord.js'
import * as ComAtprotoRepoImportRepo from './types/com/atproto/repo/importRepo.js'
import * as ComAtprotoRepoListMissingBlobs from './types/com/atproto/repo/listMissingBlobs.js'
import * as ComAtprotoRepoListRecords from './types/com/atproto/repo/listRecords.js'
import * as ComAtprotoRepoPutRecord from './types/com/atproto/repo/putRecord.js'
import * as ComAtprotoRepoUploadBlob from './types/com/atproto/repo/uploadBlob.js'
import * as ComWhtwndBlogGetAuthorPosts from './types/com/whtwnd/blog/getAuthorPosts.js'
import * as ComWhtwndBlogGetEntryMetadataByName from './types/com/whtwnd/blog/getEntryMetadataByName.js'
import * as ComWhtwndBlogGetMentionsByEntry from './types/com/whtwnd/blog/getMentionsByEntry.js'
import * as ComWhtwndBlogNotifyOfNewEntry from './types/com/whtwnd/blog/notifyOfNewEntry.js'
import * as SpaceSwshFeedGetEntries from './types/space/swsh/feed/getEntries.js'
import * as SpaceSwshFeedSendEntry from './types/space/swsh/feed/sendEntry.js'
import * as XyzStatusphereGetStatuses from './types/xyz/statusphere/getStatuses.js'
import * as XyzStatusphereGetUser from './types/xyz/statusphere/getUser.js'
import * as XyzStatusphereSendStatus from './types/xyz/statusphere/sendStatus.js'

export function createServer(options?: XrpcOptions): Server {
  return new Server(options)
}

export class Server {
  xrpc: XrpcServer
  xyz: XyzNS
  com: ComNS
  space: SpaceNS
  app: AppNS

  constructor(options?: XrpcOptions) {
    this.xrpc = createXrpcServer(schemas, options)
    this.xyz = new XyzNS(this)
    this.com = new ComNS(this)
    this.space = new SpaceNS(this)
    this.app = new AppNS(this)
  }
}

export class XyzNS {
  _server: Server
  statusphere: XyzStatusphereNS

  constructor(server: Server) {
    this._server = server
    this.statusphere = new XyzStatusphereNS(server)
  }
}

export class XyzStatusphereNS {
  _server: Server

  constructor(server: Server) {
    this._server = server
  }

  getStatuses<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      XyzStatusphereGetStatuses.Handler<ExtractAuth<AV>>,
      XyzStatusphereGetStatuses.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = 'xyz.statusphere.getStatuses' // @ts-ignore
    return this._server.xrpc.method(nsid, cfg)
  }

  getUser<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      XyzStatusphereGetUser.Handler<ExtractAuth<AV>>,
      XyzStatusphereGetUser.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = 'xyz.statusphere.getUser' // @ts-ignore
    return this._server.xrpc.method(nsid, cfg)
  }

  sendStatus<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      XyzStatusphereSendStatus.Handler<ExtractAuth<AV>>,
      XyzStatusphereSendStatus.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = 'xyz.statusphere.sendStatus' // @ts-ignore
    return this._server.xrpc.method(nsid, cfg)
  }
}

export class ComNS {
  _server: Server
  atproto: ComAtprotoNS
  whtwnd: ComWhtwndNS

  constructor(server: Server) {
    this._server = server
    this.atproto = new ComAtprotoNS(server)
    this.whtwnd = new ComWhtwndNS(server)
  }
}

export class ComAtprotoNS {
  _server: Server
  repo: ComAtprotoRepoNS

  constructor(server: Server) {
    this._server = server
    this.repo = new ComAtprotoRepoNS(server)
  }
}

export class ComAtprotoRepoNS {
  _server: Server

  constructor(server: Server) {
    this._server = server
  }

  applyWrites<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      ComAtprotoRepoApplyWrites.Handler<ExtractAuth<AV>>,
      ComAtprotoRepoApplyWrites.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = 'com.atproto.repo.applyWrites' // @ts-ignore
    return this._server.xrpc.method(nsid, cfg)
  }

  createRecord<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      ComAtprotoRepoCreateRecord.Handler<ExtractAuth<AV>>,
      ComAtprotoRepoCreateRecord.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = 'com.atproto.repo.createRecord' // @ts-ignore
    return this._server.xrpc.method(nsid, cfg)
  }

  deleteRecord<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      ComAtprotoRepoDeleteRecord.Handler<ExtractAuth<AV>>,
      ComAtprotoRepoDeleteRecord.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = 'com.atproto.repo.deleteRecord' // @ts-ignore
    return this._server.xrpc.method(nsid, cfg)
  }

  describeRepo<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      ComAtprotoRepoDescribeRepo.Handler<ExtractAuth<AV>>,
      ComAtprotoRepoDescribeRepo.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = 'com.atproto.repo.describeRepo' // @ts-ignore
    return this._server.xrpc.method(nsid, cfg)
  }

  getRecord<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      ComAtprotoRepoGetRecord.Handler<ExtractAuth<AV>>,
      ComAtprotoRepoGetRecord.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = 'com.atproto.repo.getRecord' // @ts-ignore
    return this._server.xrpc.method(nsid, cfg)
  }

  importRepo<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      ComAtprotoRepoImportRepo.Handler<ExtractAuth<AV>>,
      ComAtprotoRepoImportRepo.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = 'com.atproto.repo.importRepo' // @ts-ignore
    return this._server.xrpc.method(nsid, cfg)
  }

  listMissingBlobs<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      ComAtprotoRepoListMissingBlobs.Handler<ExtractAuth<AV>>,
      ComAtprotoRepoListMissingBlobs.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = 'com.atproto.repo.listMissingBlobs' // @ts-ignore
    return this._server.xrpc.method(nsid, cfg)
  }

  listRecords<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      ComAtprotoRepoListRecords.Handler<ExtractAuth<AV>>,
      ComAtprotoRepoListRecords.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = 'com.atproto.repo.listRecords' // @ts-ignore
    return this._server.xrpc.method(nsid, cfg)
  }

  putRecord<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      ComAtprotoRepoPutRecord.Handler<ExtractAuth<AV>>,
      ComAtprotoRepoPutRecord.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = 'com.atproto.repo.putRecord' // @ts-ignore
    return this._server.xrpc.method(nsid, cfg)
  }

  uploadBlob<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      ComAtprotoRepoUploadBlob.Handler<ExtractAuth<AV>>,
      ComAtprotoRepoUploadBlob.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = 'com.atproto.repo.uploadBlob' // @ts-ignore
    return this._server.xrpc.method(nsid, cfg)
  }
}

export class ComWhtwndNS {
  _server: Server
  blog: ComWhtwndBlogNS

  constructor(server: Server) {
    this._server = server
    this.blog = new ComWhtwndBlogNS(server)
  }
}

export class ComWhtwndBlogNS {
  _server: Server

  constructor(server: Server) {
    this._server = server
  }

  getAuthorPosts<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      ComWhtwndBlogGetAuthorPosts.Handler<ExtractAuth<AV>>,
      ComWhtwndBlogGetAuthorPosts.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = 'com.whtwnd.blog.getAuthorPosts' // @ts-ignore
    return this._server.xrpc.method(nsid, cfg)
  }

  getEntryMetadataByName<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      ComWhtwndBlogGetEntryMetadataByName.Handler<ExtractAuth<AV>>,
      ComWhtwndBlogGetEntryMetadataByName.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = 'com.whtwnd.blog.getEntryMetadataByName' // @ts-ignore
    return this._server.xrpc.method(nsid, cfg)
  }

  getMentionsByEntry<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      ComWhtwndBlogGetMentionsByEntry.Handler<ExtractAuth<AV>>,
      ComWhtwndBlogGetMentionsByEntry.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = 'com.whtwnd.blog.getMentionsByEntry' // @ts-ignore
    return this._server.xrpc.method(nsid, cfg)
  }

  notifyOfNewEntry<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      ComWhtwndBlogNotifyOfNewEntry.Handler<ExtractAuth<AV>>,
      ComWhtwndBlogNotifyOfNewEntry.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = 'com.whtwnd.blog.notifyOfNewEntry' // @ts-ignore
    return this._server.xrpc.method(nsid, cfg)
  }
}

export class SpaceNS {
  _server: Server
  swsh: SpaceSwshNS

  constructor(server: Server) {
    this._server = server
    this.swsh = new SpaceSwshNS(server)
  }
}

export class SpaceSwshNS {
  _server: Server
  feed: SpaceSwshFeedNS

  constructor(server: Server) {
    this._server = server
    this.feed = new SpaceSwshFeedNS(server)
  }
}

export class SpaceSwshFeedNS {
  _server: Server

  constructor(server: Server) {
    this._server = server
  }

  getEntries<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      SpaceSwshFeedGetEntries.Handler<ExtractAuth<AV>>,
      SpaceSwshFeedGetEntries.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = 'space.swsh.feed.getEntries' // @ts-ignore
    return this._server.xrpc.method(nsid, cfg)
  }

  sendEntry<AV extends AuthVerifier>(
    cfg: ConfigOf<
      AV,
      SpaceSwshFeedSendEntry.Handler<ExtractAuth<AV>>,
      SpaceSwshFeedSendEntry.HandlerReqCtx<ExtractAuth<AV>>
    >,
  ) {
    const nsid = 'space.swsh.feed.sendEntry' // @ts-ignore
    return this._server.xrpc.method(nsid, cfg)
  }
}

export class AppNS {
  _server: Server
  bsky: AppBskyNS

  constructor(server: Server) {
    this._server = server
    this.bsky = new AppBskyNS(server)
  }
}

export class AppBskyNS {
  _server: Server
  actor: AppBskyActorNS

  constructor(server: Server) {
    this._server = server
    this.actor = new AppBskyActorNS(server)
  }
}

export class AppBskyActorNS {
  _server: Server

  constructor(server: Server) {
    this._server = server
  }
}

type SharedRateLimitOpts<T> = {
  name: string
  calcKey?: (ctx: T) => string | null
  calcPoints?: (ctx: T) => number
}
type RouteRateLimitOpts<T> = {
  durationMs: number
  points: number
  calcKey?: (ctx: T) => string | null
  calcPoints?: (ctx: T) => number
}
type HandlerOpts = { blobLimit?: number }
type HandlerRateLimitOpts<T> = SharedRateLimitOpts<T> | RouteRateLimitOpts<T>
type ConfigOf<Auth, Handler, ReqCtx> =
  | Handler
  | {
      auth?: Auth
      opts?: HandlerOpts
      rateLimit?: HandlerRateLimitOpts<ReqCtx> | HandlerRateLimitOpts<ReqCtx>[]
      handler: Handler
    }
type ExtractAuth<AV extends AuthVerifier | StreamAuthVerifier> = Extract<
  Awaited<ReturnType<AV>>,
  { credentials: unknown }
>
