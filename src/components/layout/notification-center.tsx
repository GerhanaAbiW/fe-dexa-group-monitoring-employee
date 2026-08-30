import { useQueryClient } from '@tanstack/react-query'
import { Bell, Check, X } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import {
  useNotificationsControllerList,
  useNotificationsControllerMarkRead,
} from '../../services/generated/monitoring/notifications/notifications'
import type { NotificationResponseDto } from '../../services/generated/monitoring/models'

const formatRelativeDate = (value: string) => new Intl.DateTimeFormat('id-ID', {
  day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit',
}).format(new Date(value))

export const NotificationCenter = () => {
  const [open, setOpen] = useState(false)
  const [toast, setToast] = useState<NotificationResponseDto | null>(null)
  const initialized = useRef(false)
  const knownIds = useRef(new Set<string>())
  const containerRef = useRef<HTMLDivElement>(null)
  const queryClient = useQueryClient()
  const notifications = useNotificationsControllerList(undefined, {
    query: { refetchInterval: 15_000, retry: 1 },
  })
  const markRead = useNotificationsControllerMarkRead({
    mutation: {
      onSuccess: () => queryClient.invalidateQueries({ queryKey: ['/api/v1/notifications'] }),
    },
  })
  const items = useMemo(() => notifications.data ?? [], [notifications.data])
  const unreadCount = items.filter((item) => !item.readAt).length

  useEffect(() => {
    const nextIds = new Set(items.map((item) => item.id))
    if (initialized.current) {
      const newest = items.find((item) => !item.readAt && !knownIds.current.has(item.id))
      if (newest) setToast(newest)
    } else if (items.length > 0) {
      initialized.current = true
    }
    knownIds.current = nextIds
  }, [items])

  useEffect(() => {
    if (!toast) return undefined
    const timeout = window.setTimeout(() => setToast(null), 6000)
    return () => window.clearTimeout(timeout)
  }, [toast])

  useEffect(() => {
    const close = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', close)
    return () => document.removeEventListener('mousedown', close)
  }, [])

  const readNotification = (notification: NotificationResponseDto) => {
    if (!notification.readAt) markRead.mutate({ id: notification.id })
  }

  return (
    <div className="relative" ref={containerRef}>
      <button className="relative grid size-10 place-items-center rounded-xl border border-[#e7e8eb] bg-white p-0 text-[#65676f] transition hover:border-[#efc8c5] hover:bg-[#fff7f6] hover:text-brand" type="button" aria-label={`Notifikasi, ${unreadCount} belum dibaca`} aria-expanded={open} onClick={() => setOpen((value) => !value)}>
        <Bell size={19} />
        {unreadCount > 0 ? <span className="absolute -top-1 -right-1 grid min-w-[18px] place-items-center rounded-full border-2 border-white bg-brand px-1 text-[9px] font-extrabold leading-[14px] text-white">{Math.min(unreadCount, 9)}{unreadCount > 9 ? '+' : ''}</span> : null}
      </button>

      {open ? (
        <section className="surface absolute top-12 right-0 z-40 w-[min(360px,calc(100vw-32px))] overflow-hidden" aria-label="Daftar notifikasi">
          <header className="flex items-center justify-between border-b border-[#efeff2] px-4 py-3.5">
            <div><h2 className="m-0 font-display text-sm font-extrabold">Notifikasi</h2><p className="mt-0.5 mb-0 text-[10px] text-[#989aa2]">Pembaruan data karyawan terbaru</p></div>
            <span className="rounded-full bg-brand-soft px-2.5 py-1 text-[10px] font-bold text-brand">{unreadCount} baru</span>
          </header>
          <div className="max-h-[390px] overflow-y-auto">
            {notifications.isLoading ? <p className="p-6 text-center text-xs text-[#989aa2]">Memuat notifikasi...</p> : null}
            {!notifications.isLoading && items.length === 0 ? <p className="p-6 text-center text-xs text-[#989aa2]">Belum ada notifikasi.</p> : null}
            {items.slice(0, 8).map((item) => (
              <button key={item.id} className={`flex w-full gap-3 border-0 border-b border-[#f0f0f3] px-4 py-3.5 text-left last:border-b-0 ${item.readAt ? 'bg-white' : 'bg-[#fff9f8]'}`} type="button" onClick={() => readNotification(item)}>
                <span className={`mt-1 grid size-7 shrink-0 place-items-center rounded-full ${item.readAt ? 'bg-[#f0f1f3] text-[#8b8d94]' : 'bg-brand-soft text-brand'}`}>{item.readAt ? <Check size={14} /> : <span className="size-2 rounded-full bg-brand" />}</span>
                <span className="min-w-0"><strong className="block text-xs text-[#36373c]">{item.title}</strong><span className="mt-1 block text-[11px] leading-relaxed text-[#777982]">{item.message}</span><small className="mt-1.5 block text-[9px] font-semibold text-[#aaaab0]">{formatRelativeDate(item.createdAt)}</small></span>
              </button>
            ))}
          </div>
        </section>
      ) : null}

      {toast ? (
        <div className="fixed right-4 bottom-4 z-60 flex w-[min(390px,calc(100vw-32px))] gap-3 rounded-2xl border border-[#f0d0cd] bg-white p-4 shadow-[0_20px_60px_rgba(28,29,33,.18)]" role="status">
          <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-brand-soft text-brand"><Bell size={18} /></span>
          <div className="min-w-0"><strong className="block text-sm">{toast.title}</strong><p className="mt-1 mb-0 text-xs leading-relaxed text-[#71737b]">{toast.message}</p></div>
          <button className="ml-auto grid size-7 shrink-0 place-items-center border-0 bg-transparent p-0 text-[#92949b]" type="button" aria-label="Tutup notifikasi" onClick={() => setToast(null)}><X size={16} /></button>
        </div>
      ) : null}
    </div>
  )
}
