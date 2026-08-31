const readEnv = (key: keyof ImportMetaEnv, fallback = ''): string => {
  const value = import.meta.env[key]
  return typeof value === 'string' && value.length > 0 ? value : fallback
}

export const env = {
  attendanceApiUrl: readEnv('VITE_ATTENDANCE_API_URL', 'http://localhost:3001'),
  monitoringApiUrl: readEnv('VITE_MONITORING_API_URL', 'http://localhost:3002'),
} as const
