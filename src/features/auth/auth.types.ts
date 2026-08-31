export interface LoginPayload {
  email: string
  password: string
  rememberMe: boolean
}

export interface AuthUser {
  id: string
  name: string
  email: string
  position: string
  phone: string
  avatarUrl?: string
}

export interface AuthSession {
  accessToken: string
  user: AuthUser
}

export interface LoginResponse {
  accessToken: string
  tokenType: string
  expiresIn: string
  employee: {
    id: string
    name: string
    email: string
    position: string
    phoneNumber: string | null
    photoUrl: string | null
  }
}
