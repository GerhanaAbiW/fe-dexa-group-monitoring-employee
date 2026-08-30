import { useQueryClient } from '@tanstack/react-query'
import { CheckCircle2, Edit3, Mail, MoreHorizontal, Phone, Plus, Search, ShieldOff, UserRound } from 'lucide-react'
import { useDeferredValue, useState, type FormEvent } from 'react'
import { Button } from '../../components/ui/button'
import { EmptyState, ErrorState, LoadingState } from '../../components/ui/data-state'
import { Input } from '../../components/ui/input'
import { Modal } from '../../components/ui/modal'
import { Pagination } from '../../components/ui/pagination'
import {
  useEmployeesControllerCreate,
  useEmployeesControllerDeactivate,
  useEmployeesControllerFindAll,
  useEmployeesControllerUpdate,
} from '../../services/generated/monitoring/employees/employees'
import type { CreateEmployeeDto, EmployeeResponseDto, UpdateEmployeeDto } from '../../services/generated/monitoring/models'

type StatusFilter = 'all' | 'active' | 'inactive'
type EmployeeForm = {
  name: string
  email: string
  position: string
  phoneNumber: string
  photoUrl: string
  initialPassword: string
}

const emptyForm: EmployeeForm = { name: '', email: '', position: '', phoneNumber: '', photoUrl: '', initialPassword: '' }
const getInitials = (name: string) => name.split(' ').filter(Boolean).map((part) => part[0]).join('').slice(0, 2).toUpperCase()
const getErrorMessage = (error: unknown) => error instanceof Error ? error.message : 'Permintaan gagal diproses.'

const EmployeeAvatar = ({ employee, size = 'normal' }: { employee: EmployeeResponseDto; size?: 'normal' | 'large' }) => {
  const classes = size === 'large' ? 'size-12 text-sm' : 'size-10 text-xs'
  return employee.photoUrl ? (
    <img className={`${classes} shrink-0 rounded-xl object-cover`} src={employee.photoUrl} alt={`Foto ${employee.name}`} />
  ) : (
    <span className={`${classes} grid shrink-0 place-items-center rounded-xl bg-linear-to-br from-[#fff0ee] to-[#f8dbd8] font-extrabold text-brand`}>{getInitials(employee.name)}</span>
  )
}

interface EmployeeFormModalProps {
  employee: EmployeeResponseDto | null
  open: boolean
  onClose: () => void
}

const EmployeeFormModal = ({ employee, open, onClose }: EmployeeFormModalProps) => {
  const [form, setForm] = useState<EmployeeForm>(() => employee ? {
    name: employee.name,
    email: employee.email,
    position: employee.position,
    phoneNumber: employee.phoneNumber ?? '',
    photoUrl: employee.photoUrl ?? '',
    initialPassword: '',
  } : emptyForm)
  const [error, setError] = useState('')
  const queryClient = useQueryClient()
  const finish = async () => {
    await queryClient.invalidateQueries({ queryKey: ['/api/v1/employees'] })
    onClose()
  }
  const createEmployee = useEmployeesControllerCreate({
    mutation: { onSuccess: () => { void finish() }, onError: (value) => setError(getErrorMessage(value)) },
  })
  const updateEmployee = useEmployeesControllerUpdate({
    mutation: { onSuccess: () => { void finish() }, onError: (value) => setError(getErrorMessage(value)) },
  })

  const setField = (field: keyof EmployeeForm, value: string) => setForm((current) => ({ ...current, [field]: value }))
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError('')
    if (!form.name.trim() || !form.email.trim() || !form.position.trim()) {
      setError('Nama, email perusahaan, dan posisi wajib diisi.')
      return
    }
    if (!employee && form.initialPassword.length < 8) {
      setError('Password awal minimal 8 karakter.')
      return
    }

    const shared = {
      name: form.name.trim(), email: form.email.trim(), position: form.position.trim(),
      ...(form.phoneNumber.trim() ? { phoneNumber: form.phoneNumber.trim() } : {}),
      ...(form.photoUrl.trim() ? { photoUrl: form.photoUrl.trim() } : {}),
    }
    if (employee) updateEmployee.mutate({ id: employee.id, data: shared satisfies UpdateEmployeeDto })
    else createEmployee.mutate({ data: { ...shared, initialPassword: form.initialPassword } satisfies CreateEmployeeDto })
  }
  const busy = createEmployee.isPending || updateEmployee.isPending

  return (
    <Modal open={open} title={employee ? 'Update Data Karyawan' : 'Tambah Karyawan'} onClose={onClose}>
      <form className="mt-5 space-y-4" onSubmit={submit}>
        <Input label="Nama lengkap" value={form.name} placeholder="Contoh: Budi Santoso" onChange={(event) => setField('name', event.target.value)} />
        <Input label="Email perusahaan" type="email" value={form.email} placeholder="nama@dexagroup.com" onChange={(event) => setField('email', event.target.value)} />
        <Input label="Posisi" value={form.position} placeholder="Contoh: Software Engineer" onChange={(event) => setField('position', event.target.value)} />
        <Input label="Nomor handphone (opsional)" value={form.phoneNumber} placeholder="08xxxxxxxxxx" onChange={(event) => setField('phoneNumber', event.target.value)} />
        <Input label="URL foto (opsional)" type="url" value={form.photoUrl} placeholder="https://..." onChange={(event) => setField('photoUrl', event.target.value)} />
        {!employee ? <Input label="Password awal" type="password" minLength={8} value={form.initialPassword} placeholder="Minimal 8 karakter" onChange={(event) => setField('initialPassword', event.target.value)} /> : null}
        {error ? <p className="m-0 rounded-xl bg-[#fff1f0] px-3.5 py-3 text-xs font-semibold text-brand" role="alert">{error}</p> : null}
        <div className="flex justify-end gap-2.5 pt-1">
          <Button type="button" variant="secondary" onClick={onClose}>Batal</Button>
          <Button type="submit" isLoading={busy}>{employee ? 'Simpan perubahan' : 'Tambah karyawan'}</Button>
        </div>
      </form>
    </Modal>
  )
}

export const EmployeesPage = () => {
  const [search, setSearch] = useState('')
  const deferredSearch = useDeferredValue(search)
  const [status, setStatus] = useState<StatusFilter>('all')
  const [page, setPage] = useState(1)
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedEmployee, setSelectedEmployee] = useState<EmployeeResponseDto | null>(null)
  const [menuEmployeeId, setMenuEmployeeId] = useState<string | null>(null)
  const queryClient = useQueryClient()
  const employees = useEmployeesControllerFindAll({
    ...(deferredSearch.trim() ? { search: deferredSearch.trim() } : {}),
    ...(status !== 'all' ? { isActive: status === 'active' } : {}),
    page,
    pageSize: 10,
  }, { query: { retry: 1 } })
  const deactivate = useEmployeesControllerDeactivate({
    mutation: { onSuccess: () => queryClient.invalidateQueries({ queryKey: ['/api/v1/employees'] }) },
  })

  const openCreate = () => { setSelectedEmployee(null); setModalOpen(true) }
  const openEdit = (employee: EmployeeResponseDto) => { setSelectedEmployee(employee); setModalOpen(true); setMenuEmployeeId(null) }
  const deactivateEmployee = (employee: EmployeeResponseDto) => {
    setMenuEmployeeId(null)
    if (window.confirm(`Nonaktifkan ${employee.name}? Data tetap tersimpan dan tidak akan dihapus permanen.`)) {
      deactivate.mutate({ id: employee.id })
    }
  }
  const items = employees.data?.items ?? []

  return (
    <div className="space-y-5">
      <section className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div><span className="text-[10px] font-extrabold tracking-[.12em] text-brand uppercase">Employee Master</span><h2 className="mt-1.5 mb-0 font-display text-xl font-extrabold text-[#303137] md:text-2xl">Kelola Data Karyawan</h2><p className="mt-1.5 mb-0 text-sm text-[#8b8d95]">Tambah, perbarui, dan atur status karyawan Dexa Group.</p></div>
        <Button className="w-full sm:w-auto" type="button" onClick={openCreate}><Plus size={18} /> Tambah Karyawan</Button>
      </section>

      <section className="surface overflow-visible">
        <div className="flex flex-col gap-3 border-b border-[#ececf0] p-4 sm:flex-row sm:items-end sm:p-5">
          <label className="flex min-w-0 flex-1 flex-col gap-2 text-xs font-bold text-[#55565d]"><span>Cari karyawan</span><span className="relative"><Search className="absolute top-1/2 left-3.5 -translate-y-1/2 text-[#989aa2]" size={17} /><input className="field w-full pl-10" value={search} placeholder="Cari nama, email, atau posisi..." onChange={(event) => { setSearch(event.target.value); setPage(1) }} /></span></label>
          <label className="flex flex-col gap-2 text-xs font-bold text-[#55565d]"><span>Status</span><select className="field min-w-40" value={status} onChange={(event) => { setStatus(event.target.value as StatusFilter); setPage(1) }}><option value="all">Semua status</option><option value="active">Aktif</option><option value="inactive">Nonaktif</option></select></label>
        </div>

        {employees.isLoading ? <LoadingState label="Memuat data karyawan..." /> : null}
        {employees.isError && !employees.isLoading ? <ErrorState onRetry={() => { void employees.refetch() }} /> : null}
        {!employees.isLoading && !employees.isError && items.length === 0 ? <EmptyState title="Karyawan tidak ditemukan" description="Coba ubah kata pencarian atau filter status." /> : null}

        {!employees.isLoading && !employees.isError && items.length > 0 ? (
          <>
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full border-collapse text-left">
                <thead><tr className="border-b border-[#ececf0] bg-[#fafafb] text-[10px] font-extrabold tracking-wide text-[#9a9ca3] uppercase"><th className="px-5 py-3.5">Karyawan</th><th className="px-5 py-3.5">Posisi</th><th className="px-5 py-3.5">Kontak</th><th className="px-5 py-3.5">Status</th><th className="w-16 px-5 py-3.5 text-center">Aksi</th></tr></thead>
                <tbody>{items.map((employee) => (
                  <tr className="border-b border-[#f0f0f2] last:border-b-0 hover:bg-[#fdfdfd]" key={employee.id}>
                    <td className="px-5 py-4"><div className="flex items-center gap-3"><EmployeeAvatar employee={employee} /><span className="min-w-0"><strong className="block truncate text-[13px] text-[#3d3e44]">{employee.name}</strong><small className="mt-0.5 block truncate text-[10px] text-[#989aa2]">{employee.email}</small></span></div></td>
                    <td className="px-5 py-4 text-xs font-semibold text-[#666870]">{employee.position}</td>
                    <td className="px-5 py-4 text-xs text-[#74767e]">{employee.phoneNumber ?? '-'}</td>
                    <td className="px-5 py-4"><span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold ${employee.isActive ? 'bg-[#eaf7ef] text-[#257953]' : 'bg-[#f1f1f3] text-[#777981]'}`}><span className={`size-1.5 rounded-full ${employee.isActive ? 'bg-[#2c9a68]' : 'bg-[#96989f]'}`} />{employee.isActive ? 'Aktif' : 'Nonaktif'}</span></td>
                    <td className="relative px-5 py-4 text-center"><button className="grid size-9 place-items-center rounded-lg border border-[#e3e4e7] bg-white p-0 text-[#777981]" type="button" aria-label={`Aksi untuk ${employee.name}`} onClick={() => setMenuEmployeeId((id) => id === employee.id ? null : employee.id)}><MoreHorizontal size={18} /></button>{menuEmployeeId === employee.id ? <div className="absolute top-13 right-5 z-10 w-40 rounded-xl border border-[#e5e5e9] bg-white p-1.5 text-left shadow-[0_14px_38px_rgba(30,31,34,.14)]"><button className="flex w-full items-center gap-2 rounded-lg border-0 bg-white px-3 py-2 text-xs font-semibold text-[#565860] hover:bg-[#f7f7f8]" type="button" onClick={() => openEdit(employee)}><Edit3 size={14} /> Update data</button>{employee.isActive ? <button className="flex w-full items-center gap-2 rounded-lg border-0 bg-white px-3 py-2 text-xs font-semibold text-brand hover:bg-brand-soft" type="button" onClick={() => deactivateEmployee(employee)}><ShieldOff size={14} /> Nonaktifkan</button> : null}</div> : null}</td>
                  </tr>
                ))}</tbody>
              </table>
            </div>

            <div className="divide-y divide-[#efeff2] md:hidden">{items.map((employee) => (
              <article className="p-4" key={employee.id}>
                <div className="flex items-start gap-3"><EmployeeAvatar employee={employee} size="large" /><div className="min-w-0 flex-1"><strong className="block truncate text-sm text-[#38393e]">{employee.name}</strong><span className="mt-0.5 block text-xs text-[#73757d]">{employee.position}</span><span className={`mt-2 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold ${employee.isActive ? 'bg-[#eaf7ef] text-[#257953]' : 'bg-[#f1f1f3] text-[#777981]'}`}>{employee.isActive ? <CheckCircle2 size={12} /> : <ShieldOff size={12} />}{employee.isActive ? 'Aktif' : 'Nonaktif'}</span></div><button className="grid size-9 place-items-center rounded-lg border border-[#e3e4e7] bg-white p-0 text-[#777981]" type="button" aria-label={`Update ${employee.name}`} onClick={() => openEdit(employee)}><Edit3 size={16} /></button></div>
                <div className="mt-3 grid gap-1.5 rounded-xl bg-[#fafafb] p-3 text-[11px] text-[#777981]"><span className="flex items-center gap-2"><Mail size={13} className="text-[#a6a8ae]" /> {employee.email}</span><span className="flex items-center gap-2"><Phone size={13} className="text-[#a6a8ae]" /> {employee.phoneNumber ?? 'Belum tersedia'}</span></div>
                {employee.isActive ? <button className="mt-3 flex items-center gap-1.5 border-0 bg-transparent p-0 text-[11px] font-bold text-brand" type="button" onClick={() => deactivateEmployee(employee)}><ShieldOff size={14} /> Nonaktifkan karyawan</button> : null}
              </article>
            ))}</div>

            <Pagination page={employees.data?.pagination.page ?? page} totalPages={employees.data?.pagination.totalPages ?? 1} total={employees.data?.pagination.total ?? 0} onChange={setPage} />
          </>
        ) : null}
      </section>

      <div className="surface flex items-start gap-3 p-4 text-xs text-[#797b83]"><span className="grid size-9 shrink-0 place-items-center rounded-xl bg-[#f2f3f5] text-[#7c7e85]"><UserRound size={17} /></span><p className="m-0 leading-relaxed"><strong className="block text-[#4c4d53]">Tentang status nonaktif</strong>Penonaktifan menggunakan soft delete. Riwayat karyawan dan absensinya tetap tersimpan.</p></div>
      {modalOpen ? <EmployeeFormModal key={selectedEmployee?.id ?? 'create'} employee={selectedEmployee} open onClose={() => setModalOpen(false)} /> : null}
    </div>
  )
}
