/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_ATTENDANCE_API_URL?: string
  readonly VITE_MONITORING_API_URL?: string
  readonly VITE_MONITORING_ADMIN_API_KEY?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
