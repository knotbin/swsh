import { SpaceSwshFeedDefs } from '@swsh/lexicon'
import { formatDistanceToNow } from 'date-fns'

interface EntryViewProps {
  entry: SpaceSwshFeedDefs.EntryView
}

export default function EntryView({ entry }: EntryViewProps) {
  const createdAt = entry.createdAt || new Date().toISOString()

  return (
    <article className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-6">
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