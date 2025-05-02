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
    const url = `/api/getRecord?${new URLSearchParams(getRecordParams).toString()}`
    console.log('Fetching URL:', url)
    
    const response = await fetch(url, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    console.log('Response status:', response.status)
    console.log('Response headers:', Object.fromEntries(response.headers.entries()))
    
    const text = await response.text()
    console.log('Response text:', text)
    
    try {
      const data = JSON.parse(text)
      if (!response.ok) {
        throw new Error(data.error || 'Failed to get entry')
      }
      return data
    } catch (e) {
      console.error('Error parsing response:', e)
      throw new Error('Invalid response format from server')
    }
  },

  // Delete entry
  async deleteEntry(params: { repo: string; rkey: string }) {
    console.log('Starting deleteEntry with params:', params)
    
    const deleteRecordParams = {
      repo: params.repo,
      collection: 'space.swsh.feed.entry',
      rkey: params.rkey,
    }
    
    console.log('Sending delete request with params:', deleteRecordParams)
    try {
      const response = await fetch('/api/deleteRecord', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(deleteRecordParams),
      })
      return response.json
    } catch (err) {
      console.error('Error in deleteEntry:', err)
      throw err
    }
  },
}

export default api
