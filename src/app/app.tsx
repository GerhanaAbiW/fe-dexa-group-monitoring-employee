import { RouterProvider } from 'react-router-dom'
import { AuthProvider } from '../features/auth/auth-provider'
import { QueryProvider } from './providers/query-provider'
import { router } from './router'

export const App = () => (
  <QueryProvider>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </QueryProvider>
)
