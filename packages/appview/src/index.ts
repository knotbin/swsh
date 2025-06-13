import events from 'node:events'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { DAY, SECOND } from '@atproto/common'
import { Hono } from '@hono/hono'
import { compress } from '@hono/hono/compress'
import { cors } from '@hono/hono/cors'
import { logger as honoLogger } from '@hono/hono/logger'
import { serve } from '@hono/node-server'
import { pino } from 'pino'

import * as deleteRecord from './api/deleteRecord.js'
import * as getRecord from './api/getRecord.js'
import API, { health, oauth, wellKnown } from './api/index.js'
import * as resolve from './api/resolve.js'
import { createClient } from './auth/client.js'
import { AppContext } from './context.js'
import { createDb, migrateToLatest } from './db.js'
import * as error from './error.js'
import { createBidirectionalResolver, createIdResolver } from './id-resolver.js'
import { createJetstreamIngester } from './ingestors/jetstream.js'
import { createServer } from './lexicons/index.js'
import { env } from './lib/env.js'

export class Server {
  constructor(
    public app: Hono,
    public server: ReturnType<typeof serve>,
    public ctx: AppContext,
  ) {}

  static async create() {
    const { NODE_ENV, HOST, PORT, DB_PATH } = env
    const logger = pino({ name: 'server start' })

    // Set up the SQLite database
    const db = createDb(DB_PATH)
    await migrateToLatest(db)

    // Create the atproto utilities
    const oauthClient = await createClient(db)
    const baseIdResolver = createIdResolver()
    const ingester = await createJetstreamIngester(db)
    const resolver = createBidirectionalResolver(baseIdResolver)
    const ctx = {
      db,
      ingester,
      logger,
      oauthClient,
      resolver,
    }

    // Subscribe to events on the firehose
    ingester.start()

    const app = new Hono()

    // Middleware
    app.use(
      '*',
      cors({
        origin: '*',
        maxAge: DAY / SECOND,
        credentials: true,
      }),
    )
    app.use('*', compress())
    app.use('*', honoLogger())

    // Add cookie middleware
    app.use('*', async (c, next) => {
      // Ensure headers are properly set for cookies
      c.header('Access-Control-Allow-Credentials', 'true')
      await next()
    })

    // Create our XRPC server
    let server = createServer({
      validateResponse: env.isDevelopment,
      payload: {
        jsonLimit: 100 * 1024, // 100kb
        textLimit: 100 * 1024, // 100kb
        blobLimit: 0, // no blobs
      },
    })

    API(server, ctx)

    // Mount routes
    app.route('/', health.createRouter(ctx))
    app.route('/', oauth.createRouter(ctx))
    app.route('/', server.xrpc.routes)
    app.route('/', wellKnown.createRouter(ctx))
    app.route('/', resolve.createRouter(ctx))
    app.route('/', getRecord.createRouter(ctx))
    app.route('/', deleteRecord.createRouter(ctx))

    // Error handling
    app.onError(error.createHandler(ctx))

    // Serve static files in production
    if (env.isProduction) {
      const __filename = fileURLToPath(import.meta.url)
      const __dirname = path.dirname(__filename)
      const frontendPath = path.resolve(
        __dirname,
        '../../../packages/client/dist',
      )

      if (fs.existsSync(frontendPath)) {
        logger.info(`Serving frontend static files from: ${frontendPath}`)

        // Serve static files
        app.use('*', async (c, next) => {
          const filePath = path.join(frontendPath, c.req.path)
          if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
            return c.body(fs.readFileSync(filePath))
          }
          await next()
        })
      } else {
        logger.warn(`Frontend build not found at: ${frontendPath}`)
        app.get('*', (c) => c.newResponse('404 Not Found', 404))
      }
    } else {
      // Development mode settings
      app.use('*', async (c, next) => {
        c.header('X-Forwarded-Proto', 'https')
        await next()
      })
    }

    // Start the server
    const httpServer = serve({
      fetch: app.fetch,
      port: PORT,
    })

    logger.info(
      `API Server (${NODE_ENV}) running on port http://${HOST}:${PORT}`,
    )

    return new Server(app, httpServer, ctx)
  }

  async close() {
    this.ctx.logger.info('sigint received, shutting down')
    await this.ctx.ingester.destroy()
    this.server.close()
    this.ctx.logger.info('server closed')
  }
}

const run = async () => {
  const server = await Server.create()

  const onCloseSignal = async () => {
    setTimeout(() => process.exit(1), 10000).unref() // Force shutdown after 10s
    await server.close()
    process.exit(0)
  }

  process.on('SIGINT', onCloseSignal)
  process.on('SIGTERM', onCloseSignal)
}

run()
