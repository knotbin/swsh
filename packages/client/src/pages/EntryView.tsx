import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { SpaceSwshFeedDefs } from '@swsh/lexicon'
import { format } from 'date-fns'

import Header from '#/components/Header'
import { useAuth } from '#/hooks/useAuth'
import api from '#/services/api'

type BlogEntry = SpaceSwshFeedDefs.EntryView & {
  author?: { did: string; handle?: string }
  rkey?: string
}

export default function EntryView() {
  const { handle, rkey } = useParams<{ handle: string; rkey?: string }>()
  const [entry, setEntry] = useState<BlogEntry | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { user } = useAuth()
  const navigate = useNavigate()
  const isOwnEntry = user?.profile.did === entry?.author?.did

  useEffect(() => {
    const fetchEntry = async () => {
      if (!handle) {
        setError('Handle is missing')
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        // If handle starts with 'did:', use it as repo instead
        const params = handle.startsWith('did:') 
          ? { repo: handle, ...(rkey ? { rkey } : {}) }
          : { handle, ...(rkey ? { rkey } : {}) }
        
        const response = await api.getEntry(params)

        if (!response.data.entry) {
          setError(`Entry not found`)
        } else {
          // Convert the response data to the expected BlogEntry format
          const entryData = response.data.entry
          
          // The API returns author.did, and we use the handle from URL params
          // or fallback to the DID if no handle is available
          const blogEntry: BlogEntry = {
            ...entryData,
            author: {
              did: entryData.author.did,
              handle: handle || entryData.author.did, // Use URL handle or fallback to DID
            },
            rkey,
          }
          setEntry(blogEntry)
        }
      } catch (err) {
        console.error('Failed to fetch entry:', err)
        setError('Failed to load entry')
      } finally {
        setLoading(false)
      }
    }

    fetchEntry()
  }, [handle, rkey])

  const handleDelete = async () => {
    if (!entry?.rkey) {
      console.error('Cannot delete entry: rkey is missing')
      return
    }

    if (!window.confirm('Are you sure you want to delete this entry?')) {
      return
    }

    try {
      const response = await api.deleteEntry(entry.rkey)

      if (response && response.success === true) {
        // Navigate back to home after successful deletion
        navigate('/')

        // Also dispatch event to update any lists
        window.dispatchEvent(
          new CustomEvent('entry-changed', {
            detail: { action: 'delete', rkey: entry.rkey },
          }),
        )
      } else {
        alert(
          'Failed to delete entry: The server returned an unexpected response',
        )
      }
    } catch (err) {
      console.error('Failed to delete entry:', err)
      alert('Failed to delete entry')
    }
  }

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto">
        <Header />
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 dark:border-blue-400"></div>
        </div>
      </div>
    )
  }

  if (error || !entry) {
    return (
      <div className="max-w-3xl mx-auto">
        <Header />
        <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded-lg mt-8 border border-red-200 dark:border-red-800">
          {error || 'Entry not found'}
        </div>
        <div className="mt-4">
          <Link
            to="/"
            className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 flex items-center"
          >
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back to home
          </Link>
        </div>
      </div>
    )
  }

  const createdAt = entry.createdAt || new Date().toISOString()
  const formattedDate = format(new Date(createdAt), 'MMMM d, yyyy')

  return (
    <div className="pb-12">
      <Header />
      <div className="max-w-4xl mx-auto">
        <div className="my-8">
          <Link
            to="/"
            className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 flex items-center"
          >
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back to home
          </Link>
        </div>

        <article className="relative">
          {isOwnEntry && entry.rkey && (
            <div className="absolute top-0 right-0 flex space-x-2 bg-white dark:bg-gray-900 p-2 rounded-lg shadow-sm">
              <button
                onClick={() => navigate(`/edit?rkey=${entry.rkey}`)}
                className="p-2 text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 rounded hover:bg-blue-50 dark:hover:bg-blue-900/20"
                aria-label="Edit entry"
                title="Edit entry"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
              </button>
              <button
                onClick={handleDelete}
                className="p-2 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 rounded hover:bg-red-50 dark:hover:bg-red-900/20"
                aria-label="Delete entry"
                title="Delete entry"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </button>
            </div>
          )}

          <header className="mb-8">
            {entry.title && (
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-3">
                {entry.title}
              </h1>
            )}
            {entry.subtitle && (
              <h2 className="text-xl text-gray-700 dark:text-gray-300 mb-4">
                {entry.subtitle}
              </h2>
            )}
            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
              <span>{formattedDate}</span>
              {entry.author?.handle && (
                <>
                  <span className="mx-2">•</span>
                  <span>{entry.author.handle}</span>
                </>
              )}
            </div>
          </header>

          <div className="font-spectral prose dark:prose-invert prose-lg max-w-none">
            {entry.content.split('\n').map((paragraph, i) => (
              <p
                key={i}
                className={i < entry.content.split('\n').length - 1 ? 'mb-6' : ''}
              >
                {paragraph}
              </p>
            ))}
          </div>
        </article>
      </div>
    </div>
  )
}
