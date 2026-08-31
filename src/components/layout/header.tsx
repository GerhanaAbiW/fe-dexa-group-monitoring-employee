import { Menu } from 'lucide-react'
import { useLocation } from 'react-router-dom'
import { useAuth } from '../../features/auth/use-auth'
import { NotificationCenter } from './notification-center'

const pageNames: Record<string, { title: string; subtitle: string }> = {
  '/dashboard': { title: 'Dashboard', subtitle: 'Gambaran aktivitas karyawan hari ini' },
  '/employees': { title: 'Data Karyawan', subtitle: 'Kelola profil dan status karyawan' },
  '/attendance': { title: 'Monitoring Absen', subtitle: 'Pantau data absensi seluruh karyawan' },
}

export const Header = ({ onMenuClick }: { onMenuClick: () => void }) => {
  const { pathname } = useLocation()
  const { user } = useAuth()
  const page = pageNames[pathname] ?? pageNames['/dashboard']
  const initials = user?.name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase() || 'HR'

  return (
    <header className="sticky top-0 z-20 flex h-[70px] items-center border-b border-[#e9e9ed] bg-white/92 px-4 backdrop-blur-[14px] sm:px-5 md:h-[82px] md:px-[34px]">
      <button className="mr-3 grid size-10 shrink-0 place-items-center rounded-xl border border-[#e7e8eb] bg-white p-0 text-[#65676f] md:hidden" type="button" aria-label="Buka menu" onClick={onMenuClick}><Menu size={22} /></button>
      <div className="min-w-0">
        <h1 className="m-0 truncate font-display text-[15px] font-extrabold text-[#303137] md:text-lg">{page.title}</h1>
        <p className="mt-0.5 mb-0 hidden text-[11px] text-[#9a9ca3] sm:block">{page.subtitle}</p>
      </div>
      <div className="ml-auto flex items-center gap-2.5 md:gap-4">
        <NotificationCenter />
        <div className="hidden h-8 w-px bg-[#ececef] sm:block" />
        <div className="flex items-center gap-2.5">
          <span className="grid size-10 place-items-center rounded-xl bg-linear-to-br from-[#c94239] to-[#951914] text-xs font-extrabold text-white shadow-[0_7px_16px_rgba(181,34,27,.18)]">{initials}</span>
          <span className="hidden min-w-0 flex-col sm:flex"><strong className="max-w-44 truncate font-display text-xs text-[#3a3b40]">{user?.name ?? 'HR Administrator'}</strong><small className="max-w-44 truncate text-[10px] text-[#9a9ca3]">{user?.email ?? 'People Operations'}</small></span>
        </div>
      </div>
    </header>
  )
}
