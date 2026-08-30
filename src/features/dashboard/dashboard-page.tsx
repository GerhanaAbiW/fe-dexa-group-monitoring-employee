import { Activity, ArrowRight, CalendarCheck2, Clock3, LogIn, LogOut, UserCheck, UsersRound } from 'lucide-react'
import { Link } from 'react-router-dom'
import { ErrorState, LoadingState } from '../../components/ui/data-state'
import { useAttendancesControllerFindAll } from '../../services/generated/monitoring/attendances/attendances'
import { useEmployeesControllerFindAll } from '../../services/generated/monitoring/employees/employees'
import { useHealthControllerCheck } from '../../services/generated/monitoring/health/health'
import { useNotificationsControllerList } from '../../services/generated/monitoring/notifications/notifications'

const localDate = () => {
  const date = new Date()
  const offset = date.getTimezoneOffset() * 60_000
  return new Date(date.getTime() - offset).toISOString().slice(0, 10)
}

const formatTime = (value: string) => new Intl.DateTimeFormat('id-ID', {
  hour: '2-digit', minute: '2-digit', hourCycle: 'h23',
}).format(new Date(value))

export const DashboardPage = () => {
  const today = localDate()
  const employees = useEmployeesControllerFindAll({ page: 1, pageSize: 1 }, { query: { retry: 1 } })
  const activeEmployees = useEmployeesControllerFindAll({ page: 1, pageSize: 1, isActive: true }, { query: { retry: 1 } })
  const attendance = useAttendancesControllerFindAll({ from: today, to: today, page: 1, pageSize: 100 }, { query: { retry: 1, refetchInterval: 30_000 } })
  const notifications = useNotificationsControllerList({ unreadOnly: true }, { query: { retry: 1 } })
  const health = useHealthControllerCheck({ query: { retry: 1, refetchInterval: 30_000 } })

  const isLoading = employees.isLoading || activeEmployees.isLoading || attendance.isLoading
  const isError = employees.isError || activeEmployees.isError || attendance.isError
  const records = attendance.data?.items ?? []
  const checkIns = records.filter((item) => item.type === 'CHECK_IN').length
  const checkOuts = records.filter((item) => item.type === 'CHECK_OUT').length
  const summary = [
    { label: 'Total Karyawan', value: employees.data?.pagination.total ?? 0, helper: 'Seluruh data terdaftar', icon: UsersRound, tone: 'bg-[#edf4ff] text-[#3b6daf]' },
    { label: 'Karyawan Aktif', value: activeEmployees.data?.pagination.total ?? 0, helper: 'Status aktif saat ini', icon: UserCheck, tone: 'bg-[#ecf8f1] text-[#278257]' },
    { label: 'Absen Masuk', value: checkIns, helper: 'Tercatat hari ini', icon: LogIn, tone: 'bg-[#fff5e8] text-[#ad6b1c]' },
    { label: 'Absen Pulang', value: checkOuts, helper: 'Tercatat hari ini', icon: LogOut, tone: 'bg-brand-soft text-brand' },
  ]

  return (
    <div className="space-y-5 md:space-y-6">
      <section className="surface flex flex-col gap-4 overflow-hidden p-5 sm:flex-row sm:items-center sm:justify-between md:p-6">
        <div>
          <div className="mb-2 flex items-center gap-2 text-xs font-bold text-[#73757d]"><Activity size={15} className="text-brand" /> Ringkasan operasional</div>
          <h2 className="m-0 font-display text-xl font-extrabold text-[#2e2f34] md:text-2xl">Selamat datang, Tim HRD</h2>
          <p className="mt-2 mb-0 text-sm text-[#898b93]">Pantau data karyawan dan aktivitas absensi dari satu tempat.</p>
        </div>
        <div className="flex items-center gap-3 rounded-xl border border-[#ededf0] bg-[#fafafb] px-4 py-3">
          <span className={`size-2.5 rounded-full ${health.isSuccess ? 'bg-[#2ba36a] shadow-[0_0_0_4px_rgba(43,163,106,.12)]' : 'bg-[#d64a42] shadow-[0_0_0_4px_rgba(214,74,66,.12)]'}`} />
          <span><strong className="block text-xs text-[#44454b]">Monitoring API</strong><small className="text-[10px] text-[#96989f]">{health.isSuccess ? 'Terhubung dan siap' : health.isLoading ? 'Memeriksa koneksi...' : 'Belum terhubung'}</small></span>
        </div>
      </section>

      {isLoading ? <section className="surface"><LoadingState label="Menyiapkan ringkasan..." /></section> : null}
      {isError && !isLoading ? <section className="surface"><ErrorState onRetry={() => { void employees.refetch(); void activeEmployees.refetch(); void attendance.refetch() }} /></section> : null}

      {!isLoading && !isError ? (
        <>
          <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {summary.map(({ label, value, helper, icon: Icon, tone }) => (
              <article className="surface p-5" key={label}>
                <div className="flex items-start justify-between"><span className={`grid size-11 place-items-center rounded-xl ${tone}`}><Icon size={21} /></span><span className="text-[10px] font-bold tracking-wide text-[#aaaab0] uppercase">Hari ini</span></div>
                <strong className="mt-5 block font-display text-3xl font-extrabold text-[#303137]">{value}</strong>
                <span className="mt-1 block text-sm font-bold text-[#56575e]">{label}</span>
                <small className="mt-1 block text-[11px] text-[#9b9da4]">{helper}</small>
              </article>
            ))}
          </section>

          <section className="grid gap-5 lg:grid-cols-[1.55fr_.75fr]">
            <article className="surface overflow-hidden">
              <header className="flex items-center justify-between border-b border-[#ececf0] px-5 py-4">
                <div><h3 className="m-0 font-display text-sm font-extrabold">Aktivitas Absensi Terbaru</h3><p className="mt-1 mb-0 text-[11px] text-[#96989f]">Rekaman masuk dan pulang hari ini</p></div>
                <Link className="flex items-center gap-1 text-xs font-bold text-brand no-underline" to="/attendance">Lihat semua <ArrowRight size={15} /></Link>
              </header>
              {records.length === 0 ? <div className="grid min-h-52 place-items-center text-center"><div><CalendarCheck2 className="mx-auto mb-2 text-[#c4c5ca]" size={25} /><p className="m-0 text-xs text-[#96989f]">Belum ada absensi hari ini.</p></div></div> : (
                <div className="divide-y divide-[#f0f0f2]">
                  {records.slice(0, 6).map((record) => (
                    <div className="flex items-center gap-3 px-5 py-3.5" key={record.id}>
                      <span className={`grid size-9 shrink-0 place-items-center rounded-xl ${record.type === 'CHECK_IN' ? 'bg-[#ecf8f1] text-[#278257]' : 'bg-brand-soft text-brand'}`}>{record.type === 'CHECK_IN' ? <LogIn size={17} /> : <LogOut size={17} />}</span>
                      <span className="min-w-0 flex-1"><strong className="block truncate text-xs text-[#414248]">{record.employee.name}</strong><small className="mt-0.5 block truncate text-[10px] text-[#999ba2]">{record.employee.email}</small></span>
                      <span className="text-right"><strong className="block text-xs text-[#56575e]">{formatTime(record.occurredAt)}</strong><small className="text-[9px] font-bold text-[#a2a4aa]">{record.type === 'CHECK_IN' ? 'MASUK' : 'PULANG'}</small></span>
                    </div>
                  ))}
                </div>
              )}
            </article>

            <aside className="surface p-5">
              <span className="grid size-11 place-items-center rounded-xl bg-brand-soft text-brand"><Clock3 size={21} /></span>
              <h3 className="mt-5 mb-1 font-display text-base font-extrabold">Perlu ditinjau</h3>
              <p className="mt-0 mb-5 text-xs leading-relaxed text-[#8e9097]">Perubahan profil karyawan akan muncul sebagai notifikasi untuk admin.</p>
              <div className="rounded-xl bg-[#fafafb] p-4"><strong className="font-display text-2xl text-[#35363b]">{notifications.data?.length ?? 0}</strong><span className="ml-2 text-xs font-semibold text-[#74767e]">notifikasi belum dibaca</span></div>
            </aside>
          </section>
        </>
      ) : null}
    </div>
  )
}
