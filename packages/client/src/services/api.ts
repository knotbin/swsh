import * as Lexicon from '@swsh/lexicon'
import type {
  XyzStatusphereGetStatuses,
  XyzStatusphereGetUser,
  XyzStatusphereSendStatus,
} from '@swsh/lexicon'

class SwshAgent extends Lexicon.AtpBaseClient {
  constructor() {
    super(SwshAgent.fetchHandler)
  }

  private static fetchHandler: Lexicon.AtpBaseClient['fetchHandler'] = (
    path,
    options,
  ) => {
    return fetch(path, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    })
  }
}

const agent = new SwshAgent()

// API service
export const api = {
  // Login
  async login(handle: string) {
    const response = await fetch('/oauth/initiate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ handle }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Login failed')
    }

    return response.json()
  },

  // Logout
  async logout() {
    const response = await fetch('/oauth/logout', {
      method: 'POST',
      credentials: 'include',
    })

    if (!response.ok) {
      throw new Error('Logout failed')
    }

    return response.json()
  },

  // Get current user
  getCurrentUser(params: XyzStatusphereGetUser.QueryParams) {
    return agent.xyz.statusphere.getUser(params)
  },

  // Get statuses
  getStatuses(params: XyzStatusphereGetStatuses.QueryParams) {
    return agent.xyz.statusphere.getStatuses(params)
  },

  // Create status
  createStatus(params: XyzStatusphereSendStatus.InputSchema) {
    return agent.xyz.statusphere.sendStatus(params)
  },

  // Send entry
  async sendEntry(data: { content: string; title?: string; subtitle?: string; rkey?: string }) {
    const response = await agent.space.swsh.feed.sendEntry(data)
    console.log('sendEntry response: ', response)
    return response.data
  },

  // Get entries
  getEntries() {
    return agent.space.swsh.feed.getEntries()
  },

  // Delete record
  deleteRecord(params: { repo: string; collection: string; rkey: string }) {
    return agent.com.atproto.repo.deleteRecord(params)
  },

  // Get entry
  async getEntry(params: { repo: string; rkey: string }) {
    const getRecordParams = {
      repo: params.repo,
      collection: 'space.swsh.feed.entry',
      rkey: params.rkey,
    }
    const response = await agent.com.atproto.repo.getRecord(getRecordParams)
    console.log('getEntry response: ', response)
    return response.data
  },
}

export default api
