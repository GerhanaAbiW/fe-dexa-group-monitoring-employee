import { useEffect, type ReactNode } from 'react'
import { X } from 'lucide-react'

interface ModalProps {
  open: boolean
  title: string
  children: ReactNode
  onClose: () => void
}

export const Modal = ({ open, title, children, onClose }: ModalProps) => {
  useEffect(() => {
    if (!open) return undefined
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [onClose, open])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-100 grid place-items-center bg-[rgba(20,21,24,.45)] p-5 backdrop-blur-sm" role="presentation" onMouseDown={onClose}>
      <section className="w-full max-w-[430px] rounded-[18px] bg-white p-6 shadow-[0_28px_80px_rgba(20,20,24,.23)]" role="dialog" aria-modal="true" aria-labelledby="modal-title" onMouseDown={(event) => event.stopPropagation()}>
        <header className="flex items-center justify-between">
          <h2 className="font-display text-lg font-bold" id="modal-title">{title}</h2>
          <button className="grid size-10 place-items-center rounded-xl border border-[#e7e8eb] bg-white p-0 text-[#65676f]" type="button" aria-label="Tutup" onClick={onClose}><X size={20} /></button>
        </header>
        {children}
      </section>
    </div>
  )
}
