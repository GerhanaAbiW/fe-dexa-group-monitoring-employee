import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { Header } from './header'
import { Sidebar } from './sidebar'

export const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="flex min-h-svh overflow-x-hidden bg-[#f5f6f8]">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="ml-0 min-w-0 w-full md:ml-[265px] md:w-[calc(100%-265px)]">
        <Header onMenuClick={() => setSidebarOpen(true)} />
        <main className="mx-auto w-full max-w-[1400px] p-4 sm:p-5 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
