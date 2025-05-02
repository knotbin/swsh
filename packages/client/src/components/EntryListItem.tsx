import { SpaceSwshFeedDefs } from '@swsh/lexicon'
import { formatDistanceToNow } from 'date-fns'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '#/hooks/useAuth'
import api from '#/services/api'
import { useState, useEffect } from 'react'

interface EntryListItemProps {
  entry: SpaceSwshFeedDefs.EntryView & {
    author?: { did: string }
    rkey?: string
  }
}

export default function EntryListItem({ entry }: EntryListItemProps) {
  const createdAt = entry.createdAt || new Date().toISOString()
  const navigate = useNavigate()
  const { user } = useAuth()
  const isOwnEntry = user?.profile.did === entry.author?.did
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const handleDelete = async () => {
    if (!entry.rkey) {
      console.error('Cannot delete entry: rkey is missing')
      return
    }

    if (!window.confirm('Are you sure you want to delete this entry?')) {
      return
    }

    try {
      console.log('Attempting to delete entry with params:', { repo: 'self', rkey: entry.rkey })
      const response = await api.deleteEntry({ repo: 'self', rkey: entry.rkey })
      console.log('Delete response:', response)
      // Refresh the page to update the list
      window.location.reload()
    } catch (err) {
      console.error('Failed to delete entry:', err)
      if (err instanceof Error) {
        console.error('Error details:', err.message, err.stack)
      }
      alert('Failed to delete entry')
    }
  }

  // Close menu when clicking outside
  const handleClickOutside = (e: React.MouseEvent) => {
    if (!(e.target as HTMLElement).closest('.menu-container')) {
      setIsMenuOpen(false)
    }
  }

  // Add click outside listener when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.addEventListener('click', handleClickOutside as any)
      return () => document.removeEventListener('click', handleClickOutside as any)
    }
  }, [isMenuOpen])

  return (
    <article className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-6 relative">
      {isOwnEntry && entry.rkey && (
        <div className="absolute top-4 right-4 menu-container">
          <div className="relative inline-block text-left">
            <button
              type="button"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center w-8 h-8 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
              aria-label="Entry options"
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
                  d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                />
              </svg>
            </button>
            {isMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-gray-50 dark:bg-gray-900 ring-1 ring-gray-200 dark:ring-gray-700">
                <div className="py-2">
                  <button
                    onClick={() => navigate(`/edit?rkey=${entry.rkey}`)}
                    className="block w-full text-left px-4 py-2 mx-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={handleDelete}
                    className="block w-full text-left px-4 py-2 mx-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
                  >
                    Delete
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      <div className="mb-4">
        {entry.title && (
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
            {entry.title}
          </h2>
        )}
        {entry.subtitle && (
          <h3 className="text-lg text-gray-700 dark:text-gray-300 mb-4">
            {entry.subtitle}
          </h3>
        )}
        <div className="prose dark:prose-invert max-w-none">
          {entry.content.split('\n').map((paragraph, i) => (
            <p key={i} className="mb-4 last:mb-0">
              {paragraph}
            </p>
          ))}
        </div>
      </div>
      <div className="text-sm text-gray-500 dark:text-gray-400">
        {formatDistanceToNow(new Date(createdAt), { addSuffix: true })}
      </div>
    </article>
  )
} 