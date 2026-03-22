import api from './client'

export interface Preset {
  id: number
  name: string
  prompt: string
  tags?: string[]
  art_style?: string
  genre?: string
  image_quality?: string
  motion_intensity?: string
  created_at?: string
}

interface PresetsResponse {
  success: boolean
  message: string
  data: { presets: Preset[] }
}

interface PresetResponse {
  success: boolean
  message: string
  data: Preset
}

export interface PresetCreateData {
  name: string
  prompt: string
  tags: string[]
  art_style?: string
  genre?: string
  image_quality?: string
  motion_intensity?: string
}

export const presetsApi = {
  getAll: () => api.get<PresetsResponse>('/api/v1/presets'),

  create: (data: PresetCreateData) =>
    api.post<PresetResponse>('/api/v1/presets', data),

  update: (id: number, data: Partial<PresetCreateData>) =>
    api.patch<PresetResponse>(`/api/v1/presets/${id}`, data),

  delete: (id: number) => api.delete(`/api/v1/presets/${id}`),
}
