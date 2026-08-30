import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { env } from '../../config/env'
import { Header } from './header'
import { Sidebar } from './sidebar'

export const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="flex min-h-svh overflow-x-hidden bg-[#f5f6f8]">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="ml-0 min-w-0 w-full md:ml-[265px] md:w-[calc(100%-265px)]">
        <Header onMenuClick={() => setSidebarOpen(true)} />
        {!env.monitoringAdminApiKey ? (
          <div className="border-b border-[#f0d4d1] bg-[#fff7f6] px-5 py-2.5 text-center text-xs font-semibold text-[#9f241e]">
            Isi VITE_MONITORING_ADMIN_API_KEY pada file .env agar data admin dapat dimuat.
          </div>
        ) : null}
        <main className="mx-auto w-full max-w-[1400px] p-4 sm:p-5 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
