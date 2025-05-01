import { env} from '#/lib/env'
import { Secp256k1Keypair, formatMultikey, randomStr } from '@atproto/crypto'

import { Router } from 'express'
import { AppContext } from '#/context'

export const createRouter = (ctx: AppContext) => {
  const router = Router()


  router.get('/.well-known/did.json', async function (req, res) {
    const domain = env.PUBLIC_URL?.split('://')[1] || 'localhost'
    const keypair = await Secp256k1Keypair.import(
      env.APPVIEW_K256_PRIVATE_KEY_HEX,
    )
    const multikey = formatMultikey(keypair.jwtAlg, keypair.publicKeyBytes())

    res.json({
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
        ],
      })
  })

  return router
}