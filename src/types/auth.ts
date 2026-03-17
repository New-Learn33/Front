export interface User {
  id: number
  name: string
  email: string
  nickname?: string
  profile_image_url?: string
  provider?: string
  provider_id?: string
  plan?: 'free' | 'pro' | 'enterprise'
  avatar_url?: string
  storage_used?: number
  created_at?: string
}

export interface LoginRequest {
  email: string
  password: string
}

export interface GoogleLoginRequest {
  id_token: string
}

export interface SignupRequest {
  name: string
  email: string
  password: string
}

export interface ApiResponse<T> {
  success: boolean
  message: string
  data: T
}

export interface LoginResponseData {
  access_token: string
  token_type: string
  user: User
}

export type LoginResponse = ApiResponse<LoginResponseData>
export type MeResponse = ApiResponse<User>
