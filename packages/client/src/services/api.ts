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
  async sendEntry(data: {
    content: string
    title?: string
    subtitle?: string
    rkey?: string
  }) {
    const response = await agent.space.swsh.feed.sendEntry(data)
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
  async getEntry(params: { handle?: string; repo?: string; rkey: string }) {
    // Create a parameters object with only the properties that are present
    const getRecordParams: Record<string, string> = {
      collection: 'space.swsh.feed.entry',
      rkey: params.rkey,
    }
    
    // Only add repo parameter if it exists
    if (params.repo) {
      getRecordParams.repo = params.repo
    }
    
    // Only add handle parameter if it exists
    if (params.handle) {
      getRecordParams.handle = params.handle
    }
    
    const url = `/api/getRecord?${new URLSearchParams(getRecordParams).toString()}`

    const response = await fetch(url, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    const text = await response.text()

    try {
      const data = JSON.parse(text)
      if (!response.ok) {
        throw new Error(data.error || 'Failed to get entry')
      }
      
      // Return the response in a format that matches what components expect
      // EditEntry.tsx expects response.value, EntryView.tsx expects entry in a specific format
      return {
        uri: data.uri,
        cid: data.cid,
        repo: data.repo,
        value: data.value,
        // For compatibility with components that expect a different structure
        data: {
          entry: data.value
        }
      }
    } catch (e) {
      console.error('Error parsing response:', e)
      throw new Error('Invalid response format from server')
    }
  },

  // Delete entry
  async deleteEntry(rkey: string) {
    const deleteRecordParams = {
      collection: 'space.swsh.feed.entry',
      rkey,
    }

    try {
      const response = await fetch('/api/deleteRecord', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(deleteRecordParams),
      })

      // Ensure we wait for the response
      const responseData = await response.json()

      if (!response.ok) {
        throw new Error(responseData.error || 'Failed to delete entry')
      }

      return responseData
    } catch (err) {
      console.error('Error in deleteEntry:', err)
      throw err
    }
  },
}

export default api
