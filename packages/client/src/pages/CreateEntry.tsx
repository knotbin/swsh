import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { SpaceSwshFeedDefs } from '@swsh/lexicon'

import Header from '#/components/Header'
import { useAuth } from '#/hooks/useAuth'
import api from '#/services/api'

export default function CreateEntry() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { user } = useAuth()
  const [content, setContent] = useState('')
  const [title, setTitle] = useState('')
  const [subtitle, setSubtitle] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isTitleFocused, setIsTitleFocused] = useState(false)
  const [isSubtitleFocused, setIsSubtitleFocused] = useState(false)
  const [isContentFocused, setIsContentFocused] = useState(false)

  const mutation = useMutation({
    mutationFn: (data: { content: string; title?: string; subtitle?: string }) =>
      api.sendEntry(data),
    onMutate: async (newEntry) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['entries'] })

      // Snapshot the previous value
      const previousEntries = queryClient.getQueryData(['entries'])

      // Optimistically update the entries
      queryClient.setQueryData(['entries'], (oldData: any) => {
        if (!oldData) return oldData
        if (!user) return oldData

        // Create a provisional entry
        const optimisticEntry = {
          $type: 'space.swsh.feed.defs#entryView',
          content: newEntry.content,
          title: newEntry.title,
          subtitle: newEntry.subtitle,
          createdAt: new Date().toISOString(),
        } satisfies SpaceSwshFeedDefs.EntryView

        return {
          ...oldData,
          entries: [optimisticEntry, ...oldData.entries],
        }
      })

      // Return a context with the previous data
      return { previousEntries }
    },
    onSuccess: () => {
      // Clear form and redirect to home
      setContent('')
      setTitle('')
      setSubtitle('')
      navigate('/')
    },
    onError: (err, _newEntry, context) => {
      const message = err instanceof Error ? err.message : 'Failed to send entry'
      setError(message)

      // If we have a previous context, roll back to it
      if (context?.previousEntries) {
        queryClient.setQueryData(['entries'], context.previousEntries)
      } else {
        queryClient.invalidateQueries({ queryKey: ['entries'] })
      }
    },
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!content.trim()) return

    setError(null)
    mutation.mutate({
      content,
      title: title || undefined,
      subtitle: subtitle || undefined,
    })
  }

  return (
    <div className="flex flex-col h-[calc(100vh-7rem)]">
      <Header />
      <div className="flex-1 overflow-hidden">
        <div className="h-full max-w-4xl mx-auto p-6">
          <form onSubmit={handleSubmit} className="h-full flex flex-col">
            <div className="mb-6">
              <h1 className="text-2xl font-bold">Create Entry</h1>
              {(error || mutation.error) && (
                <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded-lg border border-red-200 dark:border-red-800">
                  {error ||
                    (mutation.error instanceof Error
                      ? mutation.error.message
                      : 'Failed to send entry')}
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-6 mb-6">
              <div className="relative">
                <label
                  htmlFor="title"
                  className={`absolute left-3 transition-all duration-200 ${
                    isTitleFocused || title
                      ? '-top-2 text-xs bg-white dark:bg-gray-900 px-1 text-blue-500 dark:text-blue-400'
                      : 'top-3 text-gray-500 dark:text-gray-400'
                  }`}
                >
                  Title (optional)
                </label>
                <input
                  id="title"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  onFocus={() => setIsTitleFocused(true)}
                  onBlur={() => setIsTitleFocused(false)}
                  className="w-full p-3 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 transition-all duration-200"
                  maxLength={1000}
                />
              </div>

              <div className="relative">
                <label
                  htmlFor="subtitle"
                  className={`absolute left-3 transition-all duration-200 ${
                    isSubtitleFocused || subtitle
                      ? '-top-2 text-xs bg-white dark:bg-gray-900 px-1 text-blue-500 dark:text-blue-400'
                      : 'top-3 text-gray-500 dark:text-gray-400'
                  }`}
                >
                  Subtitle (optional)
                </label>
                <input
                  id="subtitle"
                  type="text"
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  onFocus={() => setIsSubtitleFocused(true)}
                  onBlur={() => setIsSubtitleFocused(false)}
                  className="w-full p-3 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 transition-all duration-200"
                  maxLength={1000}
                />
              </div>
            </div>

            <div className="relative flex-1 min-h-0">
              <label
                htmlFor="content"
                className={`absolute left-3 transition-all duration-200 ${
                  isContentFocused || content
                    ? '-top-2 text-xs bg-white dark:bg-gray-900 px-1 text-blue-500 dark:text-blue-400'
                    : 'top-3 text-gray-500 dark:text-gray-400'
                }`}
              >
                What's on your mind?
              </label>
              <textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                onFocus={() => setIsContentFocused(true)}
                onBlur={() => setIsContentFocused(false)}
                className="w-full h-full p-3 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 transition-all duration-200 resize-none"
                maxLength={100000}
                required
              />
              <div className="absolute bottom-3 right-3 text-sm text-gray-500 dark:text-gray-400">
                {content.length}/100,000
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                type="submit"
                disabled={mutation.isPending || !content.trim()}
                className="px-6 py-3 bg-blue-500 text-white rounded-lg disabled:opacity-50 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 transition-colors duration-200 flex items-center gap-2"
              >
                {mutation.isPending ? (
                  <>
                    <svg
                      className="animate-spin h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    <span>Posting...</span>
                  </>
                ) : (
                  'Post'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
} 