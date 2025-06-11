import {
  ComWhtwndBlogEntry,
  SpaceSwshFeedEntry,
  XyzStatusphereStatus,
} from '@swsh/lexicon'
import { pino } from 'pino'
import WebSocket from 'ws'

import type { Database } from '../db.js'
import { env } from '../lib/env.js'
import { encodeFacets } from '../lib/facets.js'

export async function createJetstreamIngester(db: Database) {
  const logger = pino({ name: 'jetstream ingestion' })

  const cursor = await db
    .selectFrom('cursor')
    .where('id', '=', 2)
    .select('seq')
    .executeTakeFirst()

  logger.info(`start cursor: ${cursor?.seq}`)

  // For throttling cursor writes
  let lastCursorWrite = 0

  return new Jetstream<XyzStatusphereStatus.Record>({
    instanceUrl: env.JETSTREAM_INSTANCE,
    logger,
    cursor: cursor?.seq || undefined,
    setCursor: async (seq) => {
      const now = Date.now()

      if (now - lastCursorWrite >= 30000) {
        lastCursorWrite = now
        logger.info(`writing cursor: ${seq}`)
        await db
          .updateTable('cursor')
          .set({ seq })
          .where('id', '=', 2)
          .execute()
      }
    },
    handleEvent: async (evt) => {
      // ignore account and identity events
      if (evt.kind !== 'commit') return

      const now = new Date()
      const uri = `at://${evt.did}/${evt.commit.collection}/${evt.commit.rkey}`

      if (evt.commit.collection === 'xyz.statusphere.status') {
        if (evt.commit.operation === 'delete') {
          await db.deleteFrom('status').where('uri', '=', uri).execute()
          return
        }
        if (
          evt.commit.operation === 'create' ||
          evt.commit.operation === 'update'
        ) {
          if (!XyzStatusphereStatus.isRecord(evt.commit.record)) return

          const validatedRecord = XyzStatusphereStatus.validateRecord(
            evt.commit.record,
          )
          if (!validatedRecord.success) return

          await db
            .insertInto('status')
            .values({
              uri,
              authorDid: evt.did,
              status: validatedRecord.value.status,
              createdAt: validatedRecord.value.createdAt,
              indexedAt: now.toISOString(),
            })
            .onConflict((oc) =>
              oc.column('uri').doUpdateSet({
                status: validatedRecord.value.status,
                indexedAt: now.toISOString(),
              }),
            )
            .execute()
        }
      } else if (evt.commit.collection === 'space.swsh.feed.entry') {
        if (evt.commit.operation === 'delete') {
          await db.deleteFrom('entry').where('uri', '=', uri).execute()
          return
        }
        if (
          evt.commit.operation === 'create' ||
          evt.commit.operation === 'update'
        ) {
          logger.info(
            { record: evt.commit.record },
            'attempting to validate feed entry',
          )

          if (!SpaceSwshFeedEntry.isRecord(evt.commit.record)) {
            logger.info(
              { record: evt.commit.record },
              'record failed isRecord check',
            )
            return
          }

          const validatedRecord = SpaceSwshFeedEntry.validateRecord(
            evt.commit.record,
          )
          if (!validatedRecord.success) {
            logger.info('record failed validation')
            return
          }

          logger.info('feed entry validated successfully')

          await db
            .insertInto('entry')
            .values({
              uri,
              authorDid: evt.did,
              title: validatedRecord.value.title ?? null,
              subtitle: validatedRecord.value.subtitle ?? null,
              content: validatedRecord.value.content,
              facets: encodeFacets(validatedRecord.value.facets),
              createdAt: validatedRecord.value.createdAt ?? now.toISOString(),
              indexedAt: now.toISOString(),
            })
            .onConflict((oc) =>
              oc.column('uri').doUpdateSet({
                title: validatedRecord.value.title ?? null,
                subtitle: validatedRecord.value.subtitle ?? null,
                content: validatedRecord.value.content,
                facets: encodeFacets(validatedRecord.value.facets),
                createdAt: validatedRecord.value.createdAt ?? now.toISOString(),
                indexedAt: now.toISOString(),
              }),
            )
            .execute()
        }
      }
    },
    onError: (err) => {
      logger.error({ err }, 'error during jetstream ingestion')
    },
    wantedCollections: [
      'xyz.statusphere.status',
      'com.whtwnd.blog.entry',
      'space.swsh.feed.entry',
    ],
  })
}

export class Jetstream<T> {
  private instanceUrl: string
  private logger: pino.Logger
  private handleEvent: (evt: JetstreamEvent<T>) => Promise<void>
  private onError: (err: unknown) => void
  private setCursor?: (seq: number) => Promise<void>
  private cursor?: number
  private ws?: WebSocket
  private isStarted = false
  private isDestroyed = false
  private wantedCollections: string[]

  constructor({
    instanceUrl,
    logger,
    cursor,
    setCursor,
    handleEvent,
    onError,
    wantedCollections,
  }: {
    instanceUrl: string
    logger: pino.Logger
    cursor?: number
    setCursor?: (seq: number) => Promise<void>
    handleEvent: (evt: any) => Promise<void>
    onError: (err: any) => void
    wantedCollections: string[]
  }) {
    this.instanceUrl = instanceUrl
    this.logger = logger
    this.cursor = cursor
    this.setCursor = setCursor
    this.handleEvent = handleEvent
    this.onError = onError
    this.wantedCollections = wantedCollections
  }

  constructUrlWithQuery = (): string => {
    const params = new URLSearchParams()
    this.wantedCollections.forEach((collection) => {
      params.append('wantedCollections', collection)
    })
    if (this.cursor !== undefined) {
      params.append('cursor', this.cursor.toString())
    }
    const url = `${this.instanceUrl}/subscribe?${params.toString()}`
    return url
  }

  start() {
    if (this.isStarted) return
    this.isStarted = true
    this.isDestroyed = false
    this.ws = new WebSocket(this.constructUrlWithQuery())

    this.ws.on('open', () => {
      this.logger.info('Jetstream connection opened.')
    })

    this.ws.on('message', async (data) => {
      try {
        const event: JetstreamEvent<T> = JSON.parse(data.toString())

        // Update cursor if provided
        if (event.time_us !== undefined && this.setCursor) {
          await this.setCursor(event.time_us)
        }

        await this.handleEvent(event)
      } catch (err) {
        this.onError(err)
      }
    })

    this.ws.on('error', (err) => {
      this.onError(err)
    })

    this.ws.on('close', (code, reason) => {
      if (!this.isDestroyed) {
        this.logger.error(`Jetstream closed. Code: ${code}, Reason: ${reason}`)
      }
      this.isStarted = false
    })
  }

  destroy() {
    if (this.ws) {
      this.isDestroyed = true
      this.ws.close()
      this.isStarted = false
      this.logger.info('jetstream destroyed gracefully')
    }
  }
}

type JetstreamEvent<T> = {
  did: string
  time_us: number
} & (CommitEvent<T> | AccountEvent | IdentityEvent)

type CommitEvent<T> = {
  kind: 'commit'
  commit:
    | {
        operation: 'create' | 'update'
        record: T
        rev: string
        collection: string
        rkey: string
        cid: string
      }
    | {
        operation: 'delete'
        rev: string
        collection: string
        rkey: string
      }
}

type IdentityEvent = {
  kind: 'identity'
  identity: {
    did: string
    handle: string
    seq: number
    time: string
  }
}

type AccountEvent = {
  kind: 'account'
  account: {
    active: boolean
    did: string
    seq: number
    time: string
  }
}
