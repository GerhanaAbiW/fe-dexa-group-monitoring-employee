import { CalendarDays, LayoutDashboard, ShieldCheck, UsersRound, X } from 'lucide-react'
import { NavLink } from 'react-router-dom'
import dexaGroupImage from '../../assets/dexa-group.jpg'

interface SidebarProps {
  open: boolean
  onClose: () => void
}

const navItems = [
  { to: '/dashboard', label: 'Dashboard', description: 'Ringkasan hari ini', icon: LayoutDashboard },
  { to: '/employees', label: 'Data Karyawan', description: 'Kelola data master', icon: UsersRound },
  { to: '/attendance', label: 'Monitoring Absen', description: 'Riwayat read-only', icon: CalendarDays },
]

export const Sidebar = ({ open, onClose }: SidebarProps) => (
  <>
    <button
      className={`${open ? 'fixed' : 'hidden'} inset-0 z-29 border-0 bg-black/35 backdrop-blur-[2px] md:hidden`}
      type="button"
      aria-label="Tutup menu"
      onClick={onClose}
    />
    <aside className={`fixed inset-y-0 left-0 z-30 flex w-[265px] flex-col border-r border-[#ececef] bg-white px-[18px] pt-[24px] pb-5 transition-transform duration-200 ${open ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>
      <div className="flex h-[70px] items-center justify-between overflow-hidden">
        <img className="h-16 w-[150px] object-cover object-center" src={dexaGroupImage} alt="Dexa Group" />
        <button className="grid size-10 place-items-center rounded-xl border border-[#e7e8eb] bg-white p-0 text-[#65676f] md:hidden" type="button" aria-label="Tutup menu" onClick={onClose}><X size={21} /></button>
      </div>

      <div className="mx-3 mt-6 mb-2 text-[10px] font-extrabold tracking-[.11em] text-[#adafb5] uppercase">HR Administration</div>
      <nav className="flex flex-col gap-1.5">
        {navItems.map(({ to, label, description, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            onClick={onClose}
            className={({ isActive }) => `relative flex min-h-[58px] items-center gap-3 rounded-xl px-3.5 no-underline transition hover:bg-[#fff6f5] hover:text-brand ${isActive ? 'bg-brand-soft text-brand before:absolute before:-left-[18px] before:h-7 before:w-1 before:rounded-r-sm before:bg-brand' : 'text-[#6f7179]'}`}
          >
            <Icon size={20} />
            <span className="flex flex-col">
              <strong className="text-[13px] font-bold">{label}</strong>
              <small className="mt-0.5 text-[10px] font-medium opacity-65">{description}</small>
            </span>
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto rounded-[14px] border border-[#f0dad7] bg-linear-to-br from-[#fff8f7] to-white p-4">
        <span className="flex items-center gap-2 text-xs font-extrabold text-[#a8241e]"><ShieldCheck size={16} /> Admin HRD</span>
        <p className="mt-2 mb-0 text-[11px] leading-relaxed text-[#888a91]">Akses data karyawan dijaga menggunakan admin API key.</p>
      </div>
      <p className="mt-4 mb-0 text-center text-[10px] font-semibold tracking-wide text-[#b0b1b7]">DEXA PEOPLE MONITOR v1.0</p>
    </aside>
  </>
)
