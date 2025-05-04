import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { SpaceSwshFeedDefs } from '@swsh/lexicon'
import { formatDistanceToNow } from 'date-fns'

import { useAuth } from '#/hooks/useAuth'
import api from '#/services/api'

interface EntryListItemProps {
  entry: SpaceSwshFeedDefs.EntryView & {
    author?: { did: string; handle?: string }
    rkey?: string
  }
  onEntryDeleted?: () => void
}

export default function EntryListItem({
  entry,
  onEntryDeleted,
}: EntryListItemProps) {
  const createdAt = entry.createdAt || new Date().toISOString()
  const navigate = useNavigate()
  const { user } = useAuth()
  const isOwnEntry = user?.profile.did === entry.author?.did
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isDeleted, setIsDeleted] = useState(false)

  const handleDelete = async () => {
    if (!entry.rkey) {
      console.error('Cannot delete entry: rkey is missing')
      return
    }

    if (!window.confirm('Are you sure you want to delete this entry?')) {
      return
    }

    try {
      const response = await api.deleteEntry(entry.rkey)

      if (response && response.success === true) {
        // Mark this entry as deleted locally
        setIsDeleted(true)

        // Notify parent component directly through callback
        if (onEntryDeleted) {
          onEntryDeleted()
        }

        // Also dispatch detailed event for other components
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

  // Handle navigation to full blog view
  const handleEntryClick = (e: React.MouseEvent) => {
    // Don't navigate if clicking on menu or menu items
    if ((e.target as HTMLElement).closest('.menu-container')) {
      return
    }

    // Navigate to the full blog view
    const handle = entry.author?.handle || user?.profile.handle || 'user'
    navigate(`/${handle}/entry/${entry.rkey}`)
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
      return () =>
        document.removeEventListener('click', handleClickOutside as any)
    }
  }, [isMenuOpen])

  // If this entry has been deleted, don't render it
  if (isDeleted) {
    return null
  }

  return (
    <article
      className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-6 relative cursor-pointer hover:shadow-md transition-shadow duration-200"
      onClick={handleEntryClick}
    >
      {isOwnEntry && entry.rkey && (
        <div className="absolute top-4 right-4 menu-container z-10">
          <div className="relative inline-block text-left">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                setIsMenuOpen(!isMenuOpen)
              }}
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
              <div
                className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-gray-50 dark:bg-gray-900 ring-1 ring-gray-200 dark:ring-gray-700"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="py-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      navigate(`/edit?rkey=${entry.rkey}`)
                    }}
                    className="block w-full text-left px-4 py-2 mx-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleDelete()
                    }}
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
        <div className="font-spectral prose dark:prose-invert max-w-none">
          <div className="line-clamp-2">
            {entry.content}
          </div>
          {entry.content.split('\n').length > 2 && (
            <p className="text-blue-500 mt-2">Read more...</p>
          )}
        </div>
      </div>
      <div className="text-sm text-gray-500 dark:text-gray-400">
        <div className="mb-1">
          <span>
            {formatDistanceToNow(new Date(createdAt), { addSuffix: true })}
          </span>
        </div>
        {entry.author?.handle && (
          <div className="text-gray-600 dark:text-gray-400">
            <span>{entry.author.handle}</span>
            {entry.author?.did && (
              <span className="ml-2 text-gray-500 dark:text-gray-500 text-xs">
                {entry.author.did.substring(0, 10)}...
              </span>
            )}
          </div>
        )}
      </div>
    </article>
  )
}
