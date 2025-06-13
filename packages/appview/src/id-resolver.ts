import { IdResolver, MemoryCache } from '@atproto/identity'

const HOUR = 60e3 * 60
const DAY = HOUR * 24

interface Service {
  id: string
  type: string
  serviceEndpoint: string
}

interface AtprotoData {
  did: string
  signingKey: string
  handle: string
  pds: string
}

export function createIdResolver() {
  return new IdResolver({
    didCache: new MemoryCache(HOUR, DAY),
  })
}

export interface BidirectionalResolver {
  resolveDidToHandle(did: string): Promise<string>
  resolveDidsToHandles(dids: string[]): Promise<Record<string, string>>
  resolveDidToPdsUrl(did: string): Promise<string | undefined>
}

export function createBidirectionalResolver(resolver: IdResolver) {
  return {
    async resolveDidToHandle(did: string): Promise<string> {
      try {
        console.log('resolving did to handle', did)
        const handle = (await resolver.did.resolve(did))
        console.log('resolved handle', handle)
        if (!handle?.alsoKnownAs) {
          return did
        }
        return handle.alsoKnownAs[0]
      } catch (err) {
        console.error('Error resolving handle:', err)
        return did
      }
    },

    async resolveDidToPdsUrl(did: string): Promise<string | undefined> {
      try {
        const didDoc = (await resolver.did.resolveAtprotoData(
          did,
        )) as AtprotoData
        return didDoc.pds
      } catch (err) {
        console.error('Error resolving PDS URL:', err)
        return undefined
      }
    },

    async resolveDidsToHandles(
      dids: string[],
    ): Promise<Record<string, string>> {
      const didHandleMap: Record<string, string> = {}
      const resolves = await Promise.all(
        dids.map((did) => this.resolveDidToHandle(did).catch((_) => did)),
      )
      for (let i = 0; i < dids.length; i++) {
        didHandleMap[dids[i]] = resolves[i]
      }
      return didHandleMap
    },
  }
}
