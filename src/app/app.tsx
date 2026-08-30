import { RouterProvider } from 'react-router-dom'
import { QueryProvider } from './providers/query-provider'
import { router } from './router'

export const App = () => (
  <QueryProvider>
    <RouterProvider router={router} />
  </QueryProvider>
)
