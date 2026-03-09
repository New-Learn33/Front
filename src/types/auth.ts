export interface User {
  id: number
  name: string
  email: string
  plan: 'free' | 'pro' | 'enterprise'
  avatar_url?: string
  created_at: string
}

export interface LoginRequest {
  email: string
  password: string
}

export interface SignupRequest {
  name: string
  email: string
  password: string
}

export interface LoginResponse {
  access_token: string
  token_type: string
  user: User
}
