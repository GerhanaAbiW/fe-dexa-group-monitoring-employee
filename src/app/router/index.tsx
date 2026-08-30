import { Navigate, createBrowserRouter } from 'react-router-dom'
import { AdminLayout } from '../../components/layout/admin-layout'
import { AttendancePage } from '../../features/attendance/attendance-page'
import { DashboardPage } from '../../features/dashboard/dashboard-page'
import { EmployeesPage } from '../../features/employees/employees-page'

export const router = createBrowserRouter([
  {
    element: <AdminLayout />,
    children: [
      { path: '/dashboard', element: <DashboardPage /> },
      { path: '/employees', element: <EmployeesPage /> },
      { path: '/attendance', element: <AttendancePage /> },
    ],
  },
  { path: '/', element: <Navigate to="/dashboard" replace /> },
  { path: '*', element: <Navigate to="/dashboard" replace /> },
])
