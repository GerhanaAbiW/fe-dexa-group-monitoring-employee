import { AlertCircle, LoaderCircle } from 'lucide-react'

export const LoadingState = ({ label = 'Memuat data...' }: { label?: string }) => (
  <div className="grid min-h-52 place-items-center text-center text-sm text-[#8b8d95]">
    <div><LoaderCircle className="mx-auto mb-3 animate-spin text-brand" size={25} /><p className="m-0">{label}</p></div>
  </div>
)

export const ErrorState = ({ message = 'Data belum dapat dimuat. Pastikan backend aktif dan konfigurasi API sudah benar.', onRetry }: { message?: string; onRetry?: () => void }) => (
  <div className="grid min-h-52 place-items-center px-5 text-center">
    <div className="max-w-md"><AlertCircle className="mx-auto mb-3 text-brand" size={27} /><strong className="block text-sm text-[#3c3d42]">Tidak dapat memuat data</strong><p className="mt-1.5 mb-4 text-xs leading-relaxed text-[#8b8d95]">{message}</p>{onRetry ? <button className="rounded-xl border border-[#e4c0bd] bg-[#fff8f7] px-4 py-2 text-xs font-bold text-brand" type="button" onClick={onRetry}>Coba lagi</button> : null}</div>
  </div>
)

export const EmptyState = ({ title, description }: { title: string; description: string }) => (
  <div className="grid min-h-52 place-items-center px-5 text-center"><div><strong className="block text-sm text-[#4b4c52]">{title}</strong><p className="mt-1.5 mb-0 text-xs text-[#94969d]">{description}</p></div></div>
)
