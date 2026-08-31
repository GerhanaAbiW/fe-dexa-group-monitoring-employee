import type { AuthSession } from './auth.types'

const SESSION_KEY = 'dexa_monitoring_auth_session'
const LEGACY_API_KEY_SESSION_KEY = 'dexa_monitoring_admin_api_key'

const parseSession = (value: string | null): AuthSession | null => {
  if (!value) return null
  try {
    return JSON.parse(value) as AuthSession
  } catch {
    return null
  }
}

export const getStoredSession = (): AuthSession | null => {
  try {
    sessionStorage.removeItem(LEGACY_API_KEY_SESSION_KEY)
    return parseSession(localStorage.getItem(SESSION_KEY))
      ?? parseSession(sessionStorage.getItem(SESSION_KEY))
  } catch {
    return null
  }
}

export const getStoredAccessToken = (): string | null =>
  getStoredSession()?.accessToken ?? null

export const storeSession = (session: AuthSession, persist: boolean): void => {
  const storage = persist ? localStorage : sessionStorage
  const otherStorage = persist ? sessionStorage : localStorage
  otherStorage.removeItem(SESSION_KEY)
  storage.setItem(SESSION_KEY, JSON.stringify(session))
}

export const clearStoredSession = (): void => {
  try {
    localStorage.removeItem(SESSION_KEY)
    sessionStorage.removeItem(SESSION_KEY)
    sessionStorage.removeItem(LEGACY_API_KEY_SESSION_KEY)
  } catch {
    // The in-memory session is still cleared when browser storage is unavailable.
  }
}
