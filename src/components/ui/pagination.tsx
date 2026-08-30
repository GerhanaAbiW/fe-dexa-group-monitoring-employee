import { ChevronLeft, ChevronRight } from 'lucide-react'

interface PaginationProps {
  page: number
  totalPages: number
  total: number
  onChange: (page: number) => void
}

export const Pagination = ({ page, totalPages, total, onChange }: PaginationProps) => (
  <div className="flex flex-col items-center justify-between gap-3 border-t border-[#ececf0] px-4 py-4 sm:flex-row sm:px-5">
    <p className="m-0 text-xs text-[#8c8e96]"><strong className="text-[#52535a]">{total}</strong> data ditemukan</p>
    <div className="flex items-center gap-2">
      <button className="grid size-9 place-items-center rounded-lg border border-[#dfe0e4] bg-white p-0 text-[#63656d] disabled:opacity-40" type="button" aria-label="Halaman sebelumnya" disabled={page <= 1} onClick={() => onChange(page - 1)}><ChevronLeft size={16} /></button>
      <span className="min-w-24 text-center text-xs font-semibold text-[#64666e]">Halaman {page} / {Math.max(totalPages, 1)}</span>
      <button className="grid size-9 place-items-center rounded-lg border border-[#dfe0e4] bg-white p-0 text-[#63656d] disabled:opacity-40" type="button" aria-label="Halaman berikutnya" disabled={page >= totalPages} onClick={() => onChange(page + 1)}><ChevronRight size={16} /></button>
    </div>
  </div>
)
