import { Route, Routes } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthProvider } from '#/hooks/useAuth'
import HomePage from '#/pages/HomePage'
import LoginPage from '#/pages/LoginPage'
import OAuthCallbackPage from '#/pages/OAuthCallbackPage'
import CreateEntry from '#/pages/CreateEntry'

const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <div className="min-h-screen">
          <div className="max-w-4xl mx-auto p-4 w-full">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/oauth-callback" element={<OAuthCallbackPage />} />
              <Route path="/create" element={<CreateEntry />} />
            </Routes>
          </div>
        </div>
      </AuthProvider>
    </QueryClientProvider>
  )
}

export default App
