import api from './client'
import type { LoginRequest, GoogleLoginRequest, LoginResponse, MeResponse, SignupRequest } from '@/types/auth'

export const authApi = {
  login: (data: LoginRequest) =>
    api.post<LoginResponse>('/api/v1/auth/login', data),

  googleLogin: (data: GoogleLoginRequest) =>
    api.post<LoginResponse>('/api/v1/auth/google/login', data),

  signup: (data: SignupRequest) =>
    api.post<LoginResponse>('/api/v1/auth/signup', data),

  me: () =>
    api.get<User>('/api/v1/auth/me'),

  logout: () =>
    api.post('/api/v1/auth/logout'),
}
