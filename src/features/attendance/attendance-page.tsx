import { CalendarDays, Download, Filter, LockKeyhole, LogIn, LogOut, RotateCcw, Search } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { Button } from '../../components/ui/button'
import { EmptyState, ErrorState, LoadingState } from '../../components/ui/data-state'
import { Pagination } from '../../components/ui/pagination'
import { useAttendancesControllerFindAll } from '../../services/generated/monitoring/attendances/attendances'
import { useEmployeesControllerFindAll } from '../../services/generated/monitoring/employees/employees'

type Filters = { employeeId: string; from: string; to: string }

const asLocalIsoDate = (date: Date) => {
  const offset = date.getTimezoneOffset() * 60_000
  return new Date(date.getTime() - offset).toISOString().slice(0, 10)
}

const today = new Date()
const defaultFilters: Filters = {
  employeeId: '',
  from: asLocalIsoDate(new Date(today.getFullYear(), today.getMonth(), 1)),
  to: asLocalIsoDate(today),
}

const formatDate = (value: string) => new Intl.DateTimeFormat('id-ID', {
  weekday: 'short', day: '2-digit', month: 'short', year: 'numeric',
}).format(new Date(`${value}T00:00:00`))

const formatTime = (value: string) => new Intl.DateTimeFormat('id-ID', {
  hour: '2-digit', minute: '2-digit', second: '2-digit', hourCycle: 'h23',
}).format(new Date(value))

export const AttendancePage = () => {
  const [draft, setDraft] = useState(defaultFilters)
  const [filters, setFilters] = useState(defaultFilters)
  const [page, setPage] = useState(1)
  const employees = useEmployeesControllerFindAll({ page: 1, pageSize: 100, isActive: true }, { query: { retry: 1 } })
  const attendance = useAttendancesControllerFindAll({
    ...(filters.employeeId ? { employeeId: filters.employeeId } : {}),
    from: filters.from,
    to: filters.to,
    page,
    pageSize: 15,
  }, { query: { retry: 1, refetchInterval: 30_000 } })
  const items = attendance.data?.items ?? []

  const applyFilters = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setPage(1)
    setFilters(draft)
  }
  const resetFilters = () => {
    setDraft(defaultFilters)
    setFilters(defaultFilters)
    setPage(1)
  }

  return (
    <div className="space-y-5">
      <section className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div><div className="flex items-center gap-2 text-[10px] font-extrabold tracking-[.12em] text-brand uppercase"><LockKeyhole size={13} /> Read-only</div><h2 className="mt-1.5 mb-0 font-display text-xl font-extrabold text-[#303137] md:text-2xl">Riwayat Absensi Karyawan</h2><p className="mt-1.5 mb-0 text-sm text-[#8b8d95]">Lihat seluruh absensi masuk dan pulang tanpa mengubah data.</p></div>
        <span className="inline-flex w-fit items-center gap-2 rounded-xl border border-[#e5e5e9] bg-white px-3.5 py-2.5 text-xs font-bold text-[#666870]"><span className="size-2 rounded-full bg-[#2e9d6c]" /> Diperbarui otomatis</span>
      </section>

      <section className="surface p-4 sm:p-5">
        <form className="grid gap-3 md:grid-cols-2 xl:grid-cols-[1.2fr_1fr_1fr_auto] xl:items-end" onSubmit={applyFilters}>
          <label className="flex flex-col gap-2 text-xs font-bold text-[#55565d]"><span>Karyawan</span><select className="field w-full" value={draft.employeeId} onChange={(event) => setDraft((current) => ({ ...current, employeeId: event.target.value }))}><option value="">Semua karyawan</option>{employees.data?.items.map((employee) => <option key={employee.id} value={employee.id}>{employee.name} - {employee.position}</option>)}</select></label>
          <label className="flex flex-col gap-2 text-xs font-bold text-[#55565d]"><span>Dari tanggal</span><input className="field w-full" type="date" max={draft.to} value={draft.from} onChange={(event) => setDraft((current) => ({ ...current, from: event.target.value }))} /></label>
          <label className="flex flex-col gap-2 text-xs font-bold text-[#55565d]"><span>Sampai tanggal</span><input className="field w-full" type="date" min={draft.from} value={draft.to} onChange={(event) => setDraft((current) => ({ ...current, to: event.target.value }))} /></label>
          <div className="flex gap-2"><Button className="min-h-11 flex-1 px-4 xl:flex-none" type="submit"><Search size={17} /> Tampilkan</Button><Button className="min-h-11 px-3.5" type="button" variant="secondary" aria-label="Reset filter" onClick={resetFilters}><RotateCcw size={17} /></Button></div>
        </form>
      </section>

      <section className="grid gap-3 sm:grid-cols-3">
        <article className="surface flex items-center gap-3 p-4"><span className="grid size-10 place-items-center rounded-xl bg-[#edf4ff] text-[#3b6daf]"><CalendarDays size={19} /></span><div><strong className="block font-display text-xl text-[#38393e]">{attendance.data?.pagination.total ?? 0}</strong><small className="text-[10px] font-semibold text-[#92949b]">Total rekaman</small></div></article>
        <article className="surface flex items-center gap-3 p-4"><span className="grid size-10 place-items-center rounded-xl bg-[#eaf7ef] text-[#267a54]"><LogIn size={19} /></span><div><strong className="block font-display text-xl text-[#38393e]">{items.filter((item) => item.type === 'CHECK_IN').length}</strong><small className="text-[10px] font-semibold text-[#92949b]">Masuk di halaman ini</small></div></article>
        <article className="surface flex items-center gap-3 p-4"><span className="grid size-10 place-items-center rounded-xl bg-brand-soft text-brand"><LogOut size={19} /></span><div><strong className="block font-display text-xl text-[#38393e]">{items.filter((item) => item.type === 'CHECK_OUT').length}</strong><small className="text-[10px] font-semibold text-[#92949b]">Pulang di halaman ini</small></div></article>
      </section>

      <section className="surface overflow-hidden">
        <header className="flex items-center justify-between border-b border-[#ececf0] px-4 py-4 sm:px-5">
          <div className="flex items-center gap-2"><Filter size={16} className="text-brand" /><span className="text-xs font-bold text-[#55565d]">{formatDate(filters.from)} - {formatDate(filters.to)}</span></div>
          <button className="hidden items-center gap-1.5 rounded-lg border border-[#e3e4e7] bg-white px-3 py-2 text-[10px] font-bold text-[#777981] sm:flex" type="button" disabled title="Ekspor menunggu dukungan endpoint backend"><Download size={14} /> Ekspor</button>
        </header>

        {attendance.isLoading ? <LoadingState label="Memuat riwayat absensi..." /> : null}
        {attendance.isError && !attendance.isLoading ? <ErrorState onRetry={() => { void attendance.refetch() }} /> : null}
        {!attendance.isLoading && !attendance.isError && items.length === 0 ? <EmptyState title="Belum ada data absensi" description="Tidak ada rekaman pada karyawan atau rentang tanggal ini." /> : null}

        {!attendance.isLoading && !attendance.isError && items.length > 0 ? (
          <>
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full border-collapse text-left">
                <thead><tr className="border-b border-[#ececf0] bg-[#fafafb] text-[10px] font-extrabold tracking-wide text-[#9a9ca3] uppercase"><th className="px-5 py-3.5">Karyawan</th><th className="px-5 py-3.5">Tanggal</th><th className="px-5 py-3.5">Waktu</th><th className="px-5 py-3.5">Tipe Absensi</th><th className="px-5 py-3.5">ID Referensi</th></tr></thead>
                <tbody>{items.map((record) => (
                  <tr className="border-b border-[#f0f0f2] last:border-b-0 hover:bg-[#fdfdfd]" key={record.id}>
                    <td className="px-5 py-4"><strong className="block text-[13px] text-[#3d3e44]">{record.employee.name}</strong><small className="mt-0.5 block text-[10px] text-[#989aa2]">{record.employee.email}</small></td>
                    <td className="px-5 py-4 text-xs font-semibold text-[#65676f]">{formatDate(record.workDate)}</td>
                    <td className="px-5 py-4 font-display text-xs font-bold text-[#4c4d53]">{formatTime(record.occurredAt)} WIB</td>
                    <td className="px-5 py-4"><span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold ${record.type === 'CHECK_IN' ? 'bg-[#eaf7ef] text-[#267a54]' : 'bg-brand-soft text-brand'}`}>{record.type === 'CHECK_IN' ? <LogIn size={12} /> : <LogOut size={12} />}{record.type === 'CHECK_IN' ? 'Masuk' : 'Pulang'}</span></td>
                    <td className="max-w-44 truncate px-5 py-4 font-mono text-[9px] text-[#a0a2a9]" title={record.sourceAttendanceId}>{record.sourceAttendanceId}</td>
                  </tr>
                ))}</tbody>
              </table>
            </div>

            <div className="divide-y divide-[#efeff2] md:hidden">{items.map((record) => (
              <article className="p-4" key={record.id}>
                <div className="flex items-start justify-between gap-3"><div className="min-w-0"><strong className="block truncate text-sm text-[#38393e]">{record.employee.name}</strong><span className="mt-0.5 block truncate text-[11px] text-[#93959c]">{record.employee.email}</span></div><span className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold ${record.type === 'CHECK_IN' ? 'bg-[#eaf7ef] text-[#267a54]' : 'bg-brand-soft text-brand'}`}>{record.type === 'CHECK_IN' ? <LogIn size={12} /> : <LogOut size={12} />}{record.type === 'CHECK_IN' ? 'Masuk' : 'Pulang'}</span></div>
                <div className="mt-3 flex items-center justify-between rounded-xl bg-[#fafafb] p-3 text-xs"><span className="text-[#7a7c84]">{formatDate(record.workDate)}</span><strong className="font-display text-[#4a4b51]">{formatTime(record.occurredAt)} WIB</strong></div>
              </article>
            ))}</div>
            <Pagination page={attendance.data?.pagination.page ?? page} totalPages={attendance.data?.pagination.totalPages ?? 1} total={attendance.data?.pagination.total ?? 0} onChange={setPage} />
          </>
        ) : null}
      </section>
    </div>
  )
}
