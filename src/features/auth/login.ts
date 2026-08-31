import { attendanceApiFetch } from '../../lib/openapi-fetch'
import type { AuthSession, LoginPayload, LoginResponse } from './auth.types'

export const login = async (payload: LoginPayload): Promise<AuthSession> => {
  const response = await attendanceApiFetch<LoginResponse>('/api/v1/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: payload.email,
      password: payload.password,
    }),
  })

  return {
    accessToken: response.accessToken,
    user: {
      id: response.employee.id,
      name: response.employee.name,
      email: response.employee.email,
      position: response.employee.position,
      phone: response.employee.phoneNumber ?? '-',
      ...(response.employee.photoUrl ? { avatarUrl: response.employee.photoUrl } : {}),
    },
  }
}
