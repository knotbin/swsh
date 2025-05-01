import { useQuery } from '@tanstack/react-query'

import api from '#/services/api'
import EntryListItem from './EntryListItem'

export default function EntryList() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['entries'],
    queryFn: async () => {
      const response = await api.getEntries()
      return response
    },
  })

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
        <EntryListItem key={entry.createdAt} entry={entry} />
      ))}
    </div>
  )
} 