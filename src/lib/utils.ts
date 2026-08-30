export const cn = (...classes: Array<string | false | null | undefined>): string =>
  classes.filter(Boolean).join(' ')

export const formatDate = (value: Date | string, options?: Intl.DateTimeFormatOptions): string =>
  new Intl.DateTimeFormat('id-ID', options ?? { dateStyle: 'long' }).format(new Date(value))

export const formatTime = (value: Date | string): string =>
  new Intl.DateTimeFormat('id-ID', { hour: '2-digit', minute: '2-digit' }).format(new Date(value))

export const toLocalDateKey = (value: Date): string => {
  const year = value.getFullYear()
  const month = String(value.getMonth() + 1).padStart(2, '0')
  const day = String(value.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export const formatDuration = (start: string | null, end: string | null): string => {
  if (!start || !end) return '—'
  const minutes = Math.max(0, Math.round((new Date(end).getTime() - new Date(start).getTime()) / 60_000))
  return `${Math.floor(minutes / 60)}j ${minutes % 60}m`
}
