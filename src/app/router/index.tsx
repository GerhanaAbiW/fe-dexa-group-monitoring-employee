import { Navigate, createBrowserRouter } from 'react-router-dom'
import { AdminLayout } from '../../components/layout/admin-layout'
import { AttendancePage } from '../../features/attendance/attendance-page'
import { LoginPage } from '../../features/auth/login-page'
import { DashboardPage } from '../../features/dashboard/dashboard-page'
import { EmployeesPage } from '../../features/employees/employees-page'
import { ProtectedRoute } from './route-guards'

export const router = createBrowserRouter([
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <AdminLayout />,
        children: [
          { path: '/dashboard', element: <DashboardPage /> },
          { path: '/employees', element: <EmployeesPage /> },
          { path: '/attendance', element: <AttendancePage /> },
        ],
      },
    ],
  },
  { path: '/login', element: <LoginPage /> },
  { path: '/', element: <Navigate to="/dashboard" replace /> },
  { path: '*', element: <Navigate to="/dashboard" replace /> },
])
