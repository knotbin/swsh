import { Route, Routes } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import { AuthProvider } from '#/hooks/useAuth'
import EditEntry from '#/pages/EditEntry'
import EntryView from '#/pages/EntryView'
import HomePage from '#/pages/HomePage'
import LoginPage from '#/pages/LoginPage'
import OAuthCallbackPage from '#/pages/OAuthCallbackPage'

const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <div className="min-h-screen">
          <div className="mx-auto p-4 w-full h-full">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/oauth-callback" element={<OAuthCallbackPage />} />
              <Route path="/edit" element={<EditEntry />} />
              <Route path="/:handle/entry/:rkey" element={<EntryView />} />
              <Route path="/:handle/entry" element={<EntryView />} />
            </Routes>
          </div>
        </div>
      </AuthProvider>
    </QueryClientProvider>
  )
}

export default App
