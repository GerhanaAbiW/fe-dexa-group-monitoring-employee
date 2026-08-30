const readEnv = (key: keyof ImportMetaEnv, fallback = ''): string => {
  const value = import.meta.env[key]
  return typeof value === 'string' && value.length > 0 ? value : fallback
}

export const env = {
  monitoringApiUrl: readEnv('VITE_MONITORING_API_URL', 'http://localhost:3002'),
  monitoringAdminApiKey: readEnv('VITE_MONITORING_ADMIN_API_KEY'),
} as const
