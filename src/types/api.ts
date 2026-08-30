export interface ApiErrorBody {
  message?: string | string[]
  error?: string
  statusCode?: number
  errors?: Record<string, string[]>
}

const STATUS_MESSAGES: Partial<Record<number, string>> = {
  400: 'Permintaan tidak valid. Periksa kembali data yang Anda kirim.',
  401: 'Sesi atau kredensial tidak valid. Silakan masuk kembali.',
  403: 'Anda tidak memiliki izin untuk melakukan tindakan ini.',
  404: 'Data atau layanan yang diminta tidak ditemukan.',
  405: 'Metode permintaan tidak didukung oleh layanan.',
  408: 'Waktu permintaan habis. Silakan coba kembali.',
  409: 'Permintaan bertentangan dengan data yang sudah ada.',
  413: 'Data yang dikirim terlalu besar.',
  415: 'Format data yang dikirim tidak didukung.',
  422: 'Data tidak dapat diproses. Periksa kembali isian Anda.',
  429: 'Terlalu banyak permintaan. Tunggu sebentar lalu coba kembali.',
  500: 'Terjadi kesalahan pada server. Silakan coba beberapa saat lagi.',
  501: 'Fitur ini belum tersedia pada server.',
  502: 'Server menerima respons yang tidak valid dari layanan lain.',
  503: 'Layanan sedang tidak tersedia. Silakan coba beberapa saat lagi.',
  504: 'Server terlalu lama merespons. Silakan coba kembali.',
}

export const NETWORK_ERROR_MESSAGE =
  'Tidak dapat terhubung ke server. Pastikan backend sudah berjalan dan konfigurasi API sudah benar.'

export const getStatusErrorMessage = (status: number): string => {
  const knownMessage = STATUS_MESSAGES[status]
  if (knownMessage) return knownMessage
  if (status >= 500 && status <= 599) return STATUS_MESSAGES[500]!
  if (status >= 400 && status <= 499) return STATUS_MESSAGES[400]!
  return 'Permintaan gagal. Silakan coba kembali.'
}

export const getErrorMessage = (error: unknown, fallback = 'Permintaan gagal. Silakan coba kembali.'): string => {
  if (error instanceof ApiError) return error.message
  if (error instanceof Error && error.message) return error.message
  return fallback
}

export class ApiError extends Error {
  public readonly status: number
  public readonly body?: ApiErrorBody

  constructor(
    message: string,
    status: number,
    body?: ApiErrorBody,
  ) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.body = body
  }
}
