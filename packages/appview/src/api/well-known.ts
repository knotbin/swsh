import { formatMultikey, randomStr, Secp256k1Keypair } from '@atproto/crypto'
import { Hono } from '@hono/hono'

import { AppContext } from '../context.js'
import { env } from '../lib/env.js'

export const createRouter = (ctx: AppContext) => {
  const router = new Hono()

  router.get('/.well-known/did.json', async (c) => {
    const domain = env.PUBLIC_URL?.split('://')[1] || 'localhost'
    const keypair = await Secp256k1Keypair.import(
      env.APPVIEW_K256_PRIVATE_KEY_HEX,
    )
    const multikey = formatMultikey(keypair.jwtAlg, keypair.publicKeyBytes())

    return c.json({
      '@context': ['https://www.w3.org/ns/did/v1'],
      id: `did:web:${domain}`,
      verificationMethod: [
        {
          id: `did:web:${domain}#atproto`,
          type: 'Multikey',
          controller: `did:web:${domain}`,
          publicKeyMultibase: multikey,
        },
      ],
      service: [
        {
          id: '#swsh_appview',
          type: 'SwshAppView',
          serviceEndpoint: `https://${domain}`,
        },
        {
          id: '#atproto_pds',
          type: 'AtprotoPersonalDataServer',
          serviceEndpoint: `https://${domain}`,
        },
      ],
    })
  })

  return router
}
