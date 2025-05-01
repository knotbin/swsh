/**
 * GENERATED CODE - DO NOT MODIFY
 */
import {
  XrpcClient,
  type FetchHandler,
  type FetchHandlerOptions,
} from '@atproto/xrpc'
import { CID } from 'multiformats/cid'

import { schemas } from './lexicons.js'
import * as AppBskyActorDefs from './types/app/bsky/actor/defs.js'
import * as AppBskyActorProfile from './types/app/bsky/actor/profile.js'
import * as ComAtprotoLabelDefs from './types/com/atproto/label/defs.js'
import * as ComAtprotoRepoApplyWrites from './types/com/atproto/repo/applyWrites.js'
import * as ComAtprotoRepoCreateRecord from './types/com/atproto/repo/createRecord.js'
import * as ComAtprotoRepoDefs from './types/com/atproto/repo/defs.js'
import * as ComAtprotoRepoDeleteRecord from './types/com/atproto/repo/deleteRecord.js'
import * as ComAtprotoRepoDescribeRepo from './types/com/atproto/repo/describeRepo.js'
import * as ComAtprotoRepoGetRecord from './types/com/atproto/repo/getRecord.js'
import * as ComAtprotoRepoImportRepo from './types/com/atproto/repo/importRepo.js'
import * as ComAtprotoRepoListMissingBlobs from './types/com/atproto/repo/listMissingBlobs.js'
import * as ComAtprotoRepoListRecords from './types/com/atproto/repo/listRecords.js'
import * as ComAtprotoRepoPutRecord from './types/com/atproto/repo/putRecord.js'
import * as ComAtprotoRepoStrongRef from './types/com/atproto/repo/strongRef.js'
import * as ComAtprotoRepoUploadBlob from './types/com/atproto/repo/uploadBlob.js'
import * as ComWhtwndBlogDefs from './types/com/whtwnd/blog/defs.js'
import * as ComWhtwndBlogEntry from './types/com/whtwnd/blog/entry.js'
import * as ComWhtwndBlogGetAuthorPosts from './types/com/whtwnd/blog/getAuthorPosts.js'
import * as ComWhtwndBlogGetEntryMetadataByName from './types/com/whtwnd/blog/getEntryMetadataByName.js'
import * as ComWhtwndBlogGetMentionsByEntry from './types/com/whtwnd/blog/getMentionsByEntry.js'
import * as ComWhtwndBlogNotifyOfNewEntry from './types/com/whtwnd/blog/notifyOfNewEntry.js'
import * as SpaceSwshFeedDefs from './types/space/swsh/feed/defs.js'
import * as SpaceSwshFeedEntry from './types/space/swsh/feed/entry.js'
import * as SpaceSwshFeedGetEntries from './types/space/swsh/feed/getEntries.js'
import * as SpaceSwshFeedSendEntry from './types/space/swsh/feed/sendEntry.js'
import * as SpaceSwshRichtextFacet from './types/space/swsh/richtext/facet.js'
import * as XyzStatusphereDefs from './types/xyz/statusphere/defs.js'
import * as XyzStatusphereGetStatuses from './types/xyz/statusphere/getStatuses.js'
import * as XyzStatusphereGetUser from './types/xyz/statusphere/getUser.js'
import * as XyzStatusphereSendStatus from './types/xyz/statusphere/sendStatus.js'
import * as XyzStatusphereStatus from './types/xyz/statusphere/status.js'
import { type OmitKey, type Un$Typed } from './util.js'

export * as XyzStatusphereDefs from './types/xyz/statusphere/defs.js'
export * as XyzStatusphereGetStatuses from './types/xyz/statusphere/getStatuses.js'
export * as XyzStatusphereGetUser from './types/xyz/statusphere/getUser.js'
export * as XyzStatusphereSendStatus from './types/xyz/statusphere/sendStatus.js'
export * as XyzStatusphereStatus from './types/xyz/statusphere/status.js'
export * as ComAtprotoLabelDefs from './types/com/atproto/label/defs.js'
export * as ComAtprotoRepoApplyWrites from './types/com/atproto/repo/applyWrites.js'
export * as ComAtprotoRepoCreateRecord from './types/com/atproto/repo/createRecord.js'
export * as ComAtprotoRepoDefs from './types/com/atproto/repo/defs.js'
export * as ComAtprotoRepoDeleteRecord from './types/com/atproto/repo/deleteRecord.js'
export * as ComAtprotoRepoDescribeRepo from './types/com/atproto/repo/describeRepo.js'
export * as ComAtprotoRepoGetRecord from './types/com/atproto/repo/getRecord.js'
export * as ComAtprotoRepoImportRepo from './types/com/atproto/repo/importRepo.js'
export * as ComAtprotoRepoListMissingBlobs from './types/com/atproto/repo/listMissingBlobs.js'
export * as ComAtprotoRepoListRecords from './types/com/atproto/repo/listRecords.js'
export * as ComAtprotoRepoPutRecord from './types/com/atproto/repo/putRecord.js'
export * as ComAtprotoRepoStrongRef from './types/com/atproto/repo/strongRef.js'
export * as ComAtprotoRepoUploadBlob from './types/com/atproto/repo/uploadBlob.js'
export * as ComWhtwndBlogDefs from './types/com/whtwnd/blog/defs.js'
export * as ComWhtwndBlogEntry from './types/com/whtwnd/blog/entry.js'
export * as ComWhtwndBlogGetAuthorPosts from './types/com/whtwnd/blog/getAuthorPosts.js'
export * as ComWhtwndBlogGetEntryMetadataByName from './types/com/whtwnd/blog/getEntryMetadataByName.js'
export * as ComWhtwndBlogGetMentionsByEntry from './types/com/whtwnd/blog/getMentionsByEntry.js'
export * as ComWhtwndBlogNotifyOfNewEntry from './types/com/whtwnd/blog/notifyOfNewEntry.js'
export * as SpaceSwshFeedDefs from './types/space/swsh/feed/defs.js'
export * as SpaceSwshFeedEntry from './types/space/swsh/feed/entry.js'
export * as SpaceSwshFeedGetEntries from './types/space/swsh/feed/getEntries.js'
export * as SpaceSwshFeedSendEntry from './types/space/swsh/feed/sendEntry.js'
export * as SpaceSwshRichtextFacet from './types/space/swsh/richtext/facet.js'
export * as AppBskyActorDefs from './types/app/bsky/actor/defs.js'
export * as AppBskyActorProfile from './types/app/bsky/actor/profile.js'

export class AtpBaseClient extends XrpcClient {
  xyz: XyzNS
  com: ComNS
  space: SpaceNS
  app: AppNS

  constructor(options: FetchHandler | FetchHandlerOptions) {
    super(options, schemas)
    this.xyz = new XyzNS(this)
    this.com = new ComNS(this)
    this.space = new SpaceNS(this)
    this.app = new AppNS(this)
  }

  /** @deprecated use `this` instead */
  get xrpc(): XrpcClient {
    return this
  }
}

export class XyzNS {
  _client: XrpcClient
  statusphere: XyzStatusphereNS

  constructor(client: XrpcClient) {
    this._client = client
    this.statusphere = new XyzStatusphereNS(client)
  }
}

export class XyzStatusphereNS {
  _client: XrpcClient
  status: XyzStatusphereStatusRecord

  constructor(client: XrpcClient) {
    this._client = client
    this.status = new XyzStatusphereStatusRecord(client)
  }

  getStatuses(
    params?: XyzStatusphereGetStatuses.QueryParams,
    opts?: XyzStatusphereGetStatuses.CallOptions,
  ): Promise<XyzStatusphereGetStatuses.Response> {
    return this._client.call(
      'xyz.statusphere.getStatuses',
      params,
      undefined,
      opts,
    )
  }

  getUser(
    params?: XyzStatusphereGetUser.QueryParams,
    opts?: XyzStatusphereGetUser.CallOptions,
  ): Promise<XyzStatusphereGetUser.Response> {
    return this._client.call('xyz.statusphere.getUser', params, undefined, opts)
  }

  sendStatus(
    data?: XyzStatusphereSendStatus.InputSchema,
    opts?: XyzStatusphereSendStatus.CallOptions,
  ): Promise<XyzStatusphereSendStatus.Response> {
    return this._client.call('xyz.statusphere.sendStatus', opts?.qp, data, opts)
  }
}

export class XyzStatusphereStatusRecord {
  _client: XrpcClient

  constructor(client: XrpcClient) {
    this._client = client
  }

  async list(
    params: OmitKey<ComAtprotoRepoListRecords.QueryParams, 'collection'>,
  ): Promise<{
    cursor?: string
    records: { uri: string; value: XyzStatusphereStatus.Record }[]
  }> {
    const res = await this._client.call('com.atproto.repo.listRecords', {
      collection: 'xyz.statusphere.status',
      ...params,
    })
    return res.data
  }

  async get(
    params: OmitKey<ComAtprotoRepoGetRecord.QueryParams, 'collection'>,
  ): Promise<{ uri: string; cid: string; value: XyzStatusphereStatus.Record }> {
    const res = await this._client.call('com.atproto.repo.getRecord', {
      collection: 'xyz.statusphere.status',
      ...params,
    })
    return res.data
  }

  async create(
    params: OmitKey<
      ComAtprotoRepoCreateRecord.InputSchema,
      'collection' | 'record'
    >,
    record: Un$Typed<XyzStatusphereStatus.Record>,
    headers?: Record<string, string>,
  ): Promise<{ uri: string; cid: string }> {
    const collection = 'xyz.statusphere.status'
    const res = await this._client.call(
      'com.atproto.repo.createRecord',
      undefined,
      { collection, ...params, record: { ...record, $type: collection } },
      { encoding: 'application/json', headers },
    )
    return res.data
  }

  async delete(
    params: OmitKey<ComAtprotoRepoDeleteRecord.InputSchema, 'collection'>,
    headers?: Record<string, string>,
  ): Promise<void> {
    await this._client.call(
      'com.atproto.repo.deleteRecord',
      undefined,
      { collection: 'xyz.statusphere.status', ...params },
      { headers },
    )
  }
}

export class ComNS {
  _client: XrpcClient
  atproto: ComAtprotoNS
  whtwnd: ComWhtwndNS

  constructor(client: XrpcClient) {
    this._client = client
    this.atproto = new ComAtprotoNS(client)
    this.whtwnd = new ComWhtwndNS(client)
  }
}

export class ComAtprotoNS {
  _client: XrpcClient
  repo: ComAtprotoRepoNS

  constructor(client: XrpcClient) {
    this._client = client
    this.repo = new ComAtprotoRepoNS(client)
  }
}

export class ComAtprotoRepoNS {
  _client: XrpcClient

  constructor(client: XrpcClient) {
    this._client = client
  }

  applyWrites(
    data?: ComAtprotoRepoApplyWrites.InputSchema,
    opts?: ComAtprotoRepoApplyWrites.CallOptions,
  ): Promise<ComAtprotoRepoApplyWrites.Response> {
    return this._client
      .call('com.atproto.repo.applyWrites', opts?.qp, data, opts)
      .catch((e) => {
        throw ComAtprotoRepoApplyWrites.toKnownErr(e)
      })
  }

  createRecord(
    data?: ComAtprotoRepoCreateRecord.InputSchema,
    opts?: ComAtprotoRepoCreateRecord.CallOptions,
  ): Promise<ComAtprotoRepoCreateRecord.Response> {
    return this._client
      .call('com.atproto.repo.createRecord', opts?.qp, data, opts)
      .catch((e) => {
        throw ComAtprotoRepoCreateRecord.toKnownErr(e)
      })
  }

  deleteRecord(
    data?: ComAtprotoRepoDeleteRecord.InputSchema,
    opts?: ComAtprotoRepoDeleteRecord.CallOptions,
  ): Promise<ComAtprotoRepoDeleteRecord.Response> {
    return this._client
      .call('com.atproto.repo.deleteRecord', opts?.qp, data, opts)
      .catch((e) => {
        throw ComAtprotoRepoDeleteRecord.toKnownErr(e)
      })
  }

  describeRepo(
    params?: ComAtprotoRepoDescribeRepo.QueryParams,
    opts?: ComAtprotoRepoDescribeRepo.CallOptions,
  ): Promise<ComAtprotoRepoDescribeRepo.Response> {
    return this._client.call(
      'com.atproto.repo.describeRepo',
      params,
      undefined,
      opts,
    )
  }

  getRecord(
    params?: ComAtprotoRepoGetRecord.QueryParams,
    opts?: ComAtprotoRepoGetRecord.CallOptions,
  ): Promise<ComAtprotoRepoGetRecord.Response> {
    return this._client
      .call('com.atproto.repo.getRecord', params, undefined, opts)
      .catch((e) => {
        throw ComAtprotoRepoGetRecord.toKnownErr(e)
      })
  }

  importRepo(
    data?: ComAtprotoRepoImportRepo.InputSchema,
    opts?: ComAtprotoRepoImportRepo.CallOptions,
  ): Promise<ComAtprotoRepoImportRepo.Response> {
    return this._client.call(
      'com.atproto.repo.importRepo',
      opts?.qp,
      data,
      opts,
    )
  }

  listMissingBlobs(
    params?: ComAtprotoRepoListMissingBlobs.QueryParams,
    opts?: ComAtprotoRepoListMissingBlobs.CallOptions,
  ): Promise<ComAtprotoRepoListMissingBlobs.Response> {
    return this._client.call(
      'com.atproto.repo.listMissingBlobs',
      params,
      undefined,
      opts,
    )
  }

  listRecords(
    params?: ComAtprotoRepoListRecords.QueryParams,
    opts?: ComAtprotoRepoListRecords.CallOptions,
  ): Promise<ComAtprotoRepoListRecords.Response> {
    return this._client.call(
      'com.atproto.repo.listRecords',
      params,
      undefined,
      opts,
    )
  }

  putRecord(
    data?: ComAtprotoRepoPutRecord.InputSchema,
    opts?: ComAtprotoRepoPutRecord.CallOptions,
  ): Promise<ComAtprotoRepoPutRecord.Response> {
    return this._client
      .call('com.atproto.repo.putRecord', opts?.qp, data, opts)
      .catch((e) => {
        throw ComAtprotoRepoPutRecord.toKnownErr(e)
      })
  }

  uploadBlob(
    data?: ComAtprotoRepoUploadBlob.InputSchema,
    opts?: ComAtprotoRepoUploadBlob.CallOptions,
  ): Promise<ComAtprotoRepoUploadBlob.Response> {
    return this._client.call(
      'com.atproto.repo.uploadBlob',
      opts?.qp,
      data,
      opts,
    )
  }
}

export class ComWhtwndNS {
  _client: XrpcClient
  blog: ComWhtwndBlogNS

  constructor(client: XrpcClient) {
    this._client = client
    this.blog = new ComWhtwndBlogNS(client)
  }
}

export class ComWhtwndBlogNS {
  _client: XrpcClient
  entry: ComWhtwndBlogEntryRecord

  constructor(client: XrpcClient) {
    this._client = client
    this.entry = new ComWhtwndBlogEntryRecord(client)
  }

  getAuthorPosts(
    params?: ComWhtwndBlogGetAuthorPosts.QueryParams,
    opts?: ComWhtwndBlogGetAuthorPosts.CallOptions,
  ): Promise<ComWhtwndBlogGetAuthorPosts.Response> {
    return this._client.call(
      'com.whtwnd.blog.getAuthorPosts',
      params,
      undefined,
      opts,
    )
  }

  getEntryMetadataByName(
    params?: ComWhtwndBlogGetEntryMetadataByName.QueryParams,
    opts?: ComWhtwndBlogGetEntryMetadataByName.CallOptions,
  ): Promise<ComWhtwndBlogGetEntryMetadataByName.Response> {
    return this._client
      .call('com.whtwnd.blog.getEntryMetadataByName', params, undefined, opts)
      .catch((e) => {
        throw ComWhtwndBlogGetEntryMetadataByName.toKnownErr(e)
      })
  }

  getMentionsByEntry(
    params?: ComWhtwndBlogGetMentionsByEntry.QueryParams,
    opts?: ComWhtwndBlogGetMentionsByEntry.CallOptions,
  ): Promise<ComWhtwndBlogGetMentionsByEntry.Response> {
    return this._client.call(
      'com.whtwnd.blog.getMentionsByEntry',
      params,
      undefined,
      opts,
    )
  }

  notifyOfNewEntry(
    data?: ComWhtwndBlogNotifyOfNewEntry.InputSchema,
    opts?: ComWhtwndBlogNotifyOfNewEntry.CallOptions,
  ): Promise<ComWhtwndBlogNotifyOfNewEntry.Response> {
    return this._client.call(
      'com.whtwnd.blog.notifyOfNewEntry',
      opts?.qp,
      data,
      opts,
    )
  }
}

export class ComWhtwndBlogEntryRecord {
  _client: XrpcClient

  constructor(client: XrpcClient) {
    this._client = client
  }

  async list(
    params: OmitKey<ComAtprotoRepoListRecords.QueryParams, 'collection'>,
  ): Promise<{
    cursor?: string
    records: { uri: string; value: ComWhtwndBlogEntry.Record }[]
  }> {
    const res = await this._client.call('com.atproto.repo.listRecords', {
      collection: 'com.whtwnd.blog.entry',
      ...params,
    })
    return res.data
  }

  async get(
    params: OmitKey<ComAtprotoRepoGetRecord.QueryParams, 'collection'>,
  ): Promise<{ uri: string; cid: string; value: ComWhtwndBlogEntry.Record }> {
    const res = await this._client.call('com.atproto.repo.getRecord', {
      collection: 'com.whtwnd.blog.entry',
      ...params,
    })
    return res.data
  }

  async create(
    params: OmitKey<
      ComAtprotoRepoCreateRecord.InputSchema,
      'collection' | 'record'
    >,
    record: Un$Typed<ComWhtwndBlogEntry.Record>,
    headers?: Record<string, string>,
  ): Promise<{ uri: string; cid: string }> {
    const collection = 'com.whtwnd.blog.entry'
    const res = await this._client.call(
      'com.atproto.repo.createRecord',
      undefined,
      { collection, ...params, record: { ...record, $type: collection } },
      { encoding: 'application/json', headers },
    )
    return res.data
  }

  async delete(
    params: OmitKey<ComAtprotoRepoDeleteRecord.InputSchema, 'collection'>,
    headers?: Record<string, string>,
  ): Promise<void> {
    await this._client.call(
      'com.atproto.repo.deleteRecord',
      undefined,
      { collection: 'com.whtwnd.blog.entry', ...params },
      { headers },
    )
  }
}

export class SpaceNS {
  _client: XrpcClient
  swsh: SpaceSwshNS

  constructor(client: XrpcClient) {
    this._client = client
    this.swsh = new SpaceSwshNS(client)
  }
}

export class SpaceSwshNS {
  _client: XrpcClient
  feed: SpaceSwshFeedNS
  richtext: SpaceSwshRichtextNS

  constructor(client: XrpcClient) {
    this._client = client
    this.feed = new SpaceSwshFeedNS(client)
    this.richtext = new SpaceSwshRichtextNS(client)
  }
}

export class SpaceSwshFeedNS {
  _client: XrpcClient
  entry: SpaceSwshFeedEntryRecord

  constructor(client: XrpcClient) {
    this._client = client
    this.entry = new SpaceSwshFeedEntryRecord(client)
  }

  getEntries(
    params?: SpaceSwshFeedGetEntries.QueryParams,
    opts?: SpaceSwshFeedGetEntries.CallOptions,
  ): Promise<SpaceSwshFeedGetEntries.Response> {
    return this._client.call(
      'space.swsh.feed.getEntries',
      params,
      undefined,
      opts,
    )
  }

  sendEntry(
    data?: SpaceSwshFeedSendEntry.InputSchema,
    opts?: SpaceSwshFeedSendEntry.CallOptions,
  ): Promise<SpaceSwshFeedSendEntry.Response> {
    return this._client.call('space.swsh.feed.sendEntry', opts?.qp, data, opts)
  }
}

export class SpaceSwshFeedEntryRecord {
  _client: XrpcClient

  constructor(client: XrpcClient) {
    this._client = client
  }

  async list(
    params: OmitKey<ComAtprotoRepoListRecords.QueryParams, 'collection'>,
  ): Promise<{
    cursor?: string
    records: { uri: string; value: SpaceSwshFeedEntry.Record }[]
  }> {
    const res = await this._client.call('com.atproto.repo.listRecords', {
      collection: 'space.swsh.feed.entry',
      ...params,
    })
    return res.data
  }

  async get(
    params: OmitKey<ComAtprotoRepoGetRecord.QueryParams, 'collection'>,
  ): Promise<{ uri: string; cid: string; value: SpaceSwshFeedEntry.Record }> {
    const res = await this._client.call('com.atproto.repo.getRecord', {
      collection: 'space.swsh.feed.entry',
      ...params,
    })
    return res.data
  }

  async create(
    params: OmitKey<
      ComAtprotoRepoCreateRecord.InputSchema,
      'collection' | 'record'
    >,
    record: Un$Typed<SpaceSwshFeedEntry.Record>,
    headers?: Record<string, string>,
  ): Promise<{ uri: string; cid: string }> {
    const collection = 'space.swsh.feed.entry'
    const res = await this._client.call(
      'com.atproto.repo.createRecord',
      undefined,
      { collection, ...params, record: { ...record, $type: collection } },
      { encoding: 'application/json', headers },
    )
    return res.data
  }

  async delete(
    params: OmitKey<ComAtprotoRepoDeleteRecord.InputSchema, 'collection'>,
    headers?: Record<string, string>,
  ): Promise<void> {
    await this._client.call(
      'com.atproto.repo.deleteRecord',
      undefined,
      { collection: 'space.swsh.feed.entry', ...params },
      { headers },
    )
  }
}

export class SpaceSwshRichtextNS {
  _client: XrpcClient

  constructor(client: XrpcClient) {
    this._client = client
  }
}

export class AppNS {
  _client: XrpcClient
  bsky: AppBskyNS

  constructor(client: XrpcClient) {
    this._client = client
    this.bsky = new AppBskyNS(client)
  }
}

export class AppBskyNS {
  _client: XrpcClient
  actor: AppBskyActorNS

  constructor(client: XrpcClient) {
    this._client = client
    this.actor = new AppBskyActorNS(client)
  }
}

export class AppBskyActorNS {
  _client: XrpcClient
  profile: AppBskyActorProfileRecord

  constructor(client: XrpcClient) {
    this._client = client
    this.profile = new AppBskyActorProfileRecord(client)
  }
}

export class AppBskyActorProfileRecord {
  _client: XrpcClient

  constructor(client: XrpcClient) {
    this._client = client
  }

  async list(
    params: OmitKey<ComAtprotoRepoListRecords.QueryParams, 'collection'>,
  ): Promise<{
    cursor?: string
    records: { uri: string; value: AppBskyActorProfile.Record }[]
  }> {
    const res = await this._client.call('com.atproto.repo.listRecords', {
      collection: 'app.bsky.actor.profile',
      ...params,
    })
    return res.data
  }

  async get(
    params: OmitKey<ComAtprotoRepoGetRecord.QueryParams, 'collection'>,
  ): Promise<{ uri: string; cid: string; value: AppBskyActorProfile.Record }> {
    const res = await this._client.call('com.atproto.repo.getRecord', {
      collection: 'app.bsky.actor.profile',
      ...params,
    })
    return res.data
  }

  async create(
    params: OmitKey<
      ComAtprotoRepoCreateRecord.InputSchema,
      'collection' | 'record'
    >,
    record: Un$Typed<AppBskyActorProfile.Record>,
    headers?: Record<string, string>,
  ): Promise<{ uri: string; cid: string }> {
    const collection = 'app.bsky.actor.profile'
    const res = await this._client.call(
      'com.atproto.repo.createRecord',
      undefined,
      {
        collection,
        rkey: 'self',
        ...params,
        record: { ...record, $type: collection },
      },
      { encoding: 'application/json', headers },
    )
    return res.data
  }

  async delete(
    params: OmitKey<ComAtprotoRepoDeleteRecord.InputSchema, 'collection'>,
    headers?: Record<string, string>,
  ): Promise<void> {
    await this._client.call(
      'com.atproto.repo.deleteRecord',
      undefined,
      { collection: 'app.bsky.actor.profile', ...params },
      { headers },
    )
  }
}
