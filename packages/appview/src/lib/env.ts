import dotenv from 'dotenv'
import { cleanEnv, host, port, str, testOnly } from 'envalid'

dotenv.config()

export const env = cleanEnv(process.env, {
  NODE_ENV: str({
    devDefault: testOnly('test'),
    choices: ['development', 'production', 'test'],
  }),
  HOST: host({ devDefault: '127.0.0.1' }),
  PORT: port({ devDefault: 3001 }),
  VITE_PORT: port({ default: 3000 }),
  DB_PATH: str({ devDefault: ':memory:' }),
  COOKIE_SECRET: str({ devDefault: '0'.repeat(32) }),
  SERVICE_DID: str({ default: undefined }),
  PUBLIC_URL: str({ devDefault: '' }),
  JETSTREAM_INSTANCE: str({ default: 'wss://jetstream.sprk.so' }),
  APPVIEW_K256_PRIVATE_KEY_HEX: str(),
  ATPROTO_SERVER: str({ default: 'https://bsky.social' }),
})
