import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'

import api from '#/services/api'
import EntryListItem from './EntryListItem'

export default function EntryList() {
  const queryClient = useQueryClient()
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['entries'],
    queryFn: async () => {
      const response = await api.getEntries()
      return response
    },
    // Improve reactivity with these settings
    staleTime: 0, // Consider data stale immediately
    refetchOnWindowFocus: true, // Refetch when window gets focus
    refetchOnMount: true, // Refetch when component mounts
  })

  // Add a custom event listener to invalidate the query when entries are updated
  useEffect(() => {
    const handleEntryChanged = (event: Event) => {
      // First invalidate the query
      queryClient.invalidateQueries({ queryKey: ['entries'] })
      
      // Then force an immediate refetch
      refetch()
      
      // Log details if available (for debugging)
      const customEvent = event as CustomEvent
      if (customEvent.detail) {
        console.log('Entry changed event:', customEvent.detail)
      }
    }

    // Use capture phase to ensure we get the event
    window.addEventListener('entry-changed', handleEntryChanged, true)
    return () => {
      window.removeEventListener('entry-changed', handleEntryChanged, true)
    }
  }, [refetch, queryClient])

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 dark:border-blue-400"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded-lg border border-red-200 dark:border-red-800">
        {error instanceof Error ? error.message : 'Failed to load entries'}
      </div>
    )
  }

  if (!data?.data.entries?.length) {
    return (
      <div className="text-center py-12 text-gray-500 dark:text-gray-400">
        No entries yet. Be the first to create one!
      </div>
    )
  }

  return (
    <div>
      {data.data.entries.map((entry) => (
        <EntryListItem 
          key={entry.rkey || entry.createdAt} 
          entry={entry} 
          onEntryDeleted={() => refetch()}
        />
      ))}
    </div>
  )
} 