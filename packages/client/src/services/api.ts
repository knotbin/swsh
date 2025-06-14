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
  async getEntries(params?: { limit?: number }) {
    const response = await agent.space.swsh.feed.getEntries(params)
    console.log('getEntries response:', JSON.stringify(response, null, 2))
    return response
  },

  // Delete record
  deleteRecord(params: { repo: string; collection: string; rkey: string }) {
    return agent.com.atproto.repo.deleteRecord(params)
  },

  // Get entry
  async getEntry(params: { user?: string; repo?: string; rkey?: string }) {
    // Create a parameters object with only the properties that are present
    const getRecordParams: Record<string, string> = {
      collection: 'space.swsh.feed.entry',
    }

    // Only add rkey parameter if it exists
    if (params.rkey) {
      getRecordParams.rkey = params.rkey
    }

    // Only add repo parameter if it exists
    if (params.repo) {
      getRecordParams.repo = params.repo
    }

    // Only add handle parameter if it exists
    if (params.user) {
      getRecordParams.user = params.user
    }

    const url = `/api/getRecord?${new URLSearchParams(getRecordParams).toString()}`
    console.log('getEntry URL:', url)

    const response = await fetch(url, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    const text = await response.text()
    console.log('getEntry response:', text)

    try {
      const data = JSON.parse(text)
      if (!response.ok) {
        throw new Error(data.error || 'Failed to get entry')
      }

      // Return the response in a format that matches what components expect
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
