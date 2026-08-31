import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../../features/auth/use-auth'

export const ProtectedRoute = () => {
  const { isAuthenticated } = useAuth()
  const location = useLocation()

  return isAuthenticated
    ? <Outlet />
    : <Navigate to="/login" replace state={{ from: location.pathname }} />
}
