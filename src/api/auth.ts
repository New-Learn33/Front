import api from './client'
import type { LoginRequest, GoogleLoginRequest, LoginResponse, SignupRequest, User } from '@/types/auth'

export const authApi = {
  login: (data: LoginRequest) =>
    api.post<LoginResponse>('/auth/login', data),

  googleLogin: (data: GoogleLoginRequest) =>
    api.post<LoginResponse>('/auth/google/login', data),

  signup: (data: SignupRequest) =>
    api.post<LoginResponse>('/auth/signup', data),

  me: () =>
    api.get<User>('/auth/me'),

  logout: () =>
    api.post('/auth/logout'),
}
