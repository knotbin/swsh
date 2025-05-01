import Header from '#/components/Header'
import EntryList from '#/components/EntryList'
import { useAuth } from '#/hooks/useAuth'
import { useNavigate } from 'react-router-dom'

const HomePage = () => {
  const { user, loading, error } = useAuth()
  const navigate = useNavigate()

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[80vh]">
        <div className="text-9xl animate-pulse">📝</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex justify-center items-center py-16">
        <div className="text-center p-6 max-w-md">
          <h2 className="text-2xl font-semibold mb-2 text-gray-800 dark:text-gray-200">
            Error
          </h2>
          <p className="text-red-500 mb-4">{error}</p>
          <a
            href="/login"
            className="inline-block px-4 py-2 bg-blue-500 dark:bg-blue-600 text-white hover:bg-blue-600 dark:hover:bg-blue-700 transition-colors"
          >
            Try logging in again
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-8 pb-12">
      <Header />

      <div className="flex max-w-4xl mx-auto p-4 w-full justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
          Recent Entries
        </h2>
        {user && (
          <button
            onClick={() => navigate('/edit')}
            className="px-4 py-2 bg-blue-500 dark:bg-blue-600 text-white hover:bg-blue-600 dark:hover:bg-blue-700 transition-colors"
          >
            New Entry
          </button>
        )}
      </div>

      <EntryList />
    </div>
  )
}

export default HomePage
