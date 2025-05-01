import { Link } from 'react-router-dom'

interface EntryHeaderProps {
  onSave: () => void
  isSaving?: boolean
  isDirty?: boolean // true if there are unsaved changes
}

const EntryHeader = ({ onSave, isSaving = false, isDirty = false }: EntryHeaderProps) => {
  return (
    <header className="border-b border-gray-200 dark:border-gray-700 pb-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Link to="/" className="focus:outline-none">
            <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 transition">
              <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-700 dark:text-gray-200">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </div>
          </Link>
          <span
            className={`w-2.5 h-2.5 rounded-full inline-block border border-white ${isDirty ? 'bg-yellow-400' : 'bg-green-400'}`}
            title={isDirty ? 'Unsaved changes' : 'All changes saved'}
          />
        </div>
        <button
          onClick={onSave}
          disabled={isSaving}
          className="px-4 py-2 bg-blue-500 text-white font-semibold hover:bg-blue-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSaving ? 'Saving...' : 'Save'}
        </button>
      </div>
    </header>
  )
}

export default EntryHeader 