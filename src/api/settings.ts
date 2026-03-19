import api from './client'

export interface UserSettings {
  notifications_enabled: boolean
  auto_save: boolean
  default_quality: string
  language: string
}

export interface SettingsResponse {
  success: boolean
  data: { settings: UserSettings }
}

export const settingsApi = {
  /** 환경설정 조회 */
  get: () => api.get<SettingsResponse>('/api/v1/settings'),

  /** 환경설정 저장 */
  update: (data: Partial<UserSettings>) =>
    api.patch<SettingsResponse>('/api/v1/settings', data),
}
