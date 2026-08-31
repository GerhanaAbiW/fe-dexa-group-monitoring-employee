import { useCallback, useMemo, useState, type ReactNode } from 'react'
import { queryClient } from '../../lib/query-client'
import { employeesControllerFindAll } from '../../services/generated/monitoring/employees/employees'
import { AuthContext, type AuthContextValue } from './auth-context'
import { clearStoredSession, getStoredSession, storeSession } from './auth-session'
import type { AuthSession, LoginPayload } from './auth.types'
import { login as loginRequest } from './login'

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<AuthSession | null>(getStoredSession)

  const login = useCallback(async (payload: LoginPayload) => {
    const nextSession = await loginRequest(payload)

    await employeesControllerFindAll(
      { page: 1, pageSize: 1 },
      { headers: { Authorization: `Bearer ${nextSession.accessToken}` } },
    )

    storeSession(nextSession, payload.rememberMe)
    setSession(nextSession)
    queryClient.clear()
  }, [])

  const logout = useCallback(() => {
    clearStoredSession()
    queryClient.clear()
    setSession(null)
  }, [])

  const value = useMemo<AuthContextValue>(() => ({
    user: session?.user ?? null,
    isAuthenticated: Boolean(session),
    login,
    logout,
  }), [login, logout, session])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
