import api from './client'
import type { LoginRequest, LoginResponse, SignupRequest, User } from '@/types/auth'

export const authApi = {
  login: (data: LoginRequest) =>
    api.post<LoginResponse>('/auth/login', data),

  signup: (data: SignupRequest) =>
    api.post<LoginResponse>('/auth/signup', data),

  me: () =>
    api.get<User>('/auth/me'),

  logout: () =>
    api.post('/auth/logout'),
}
