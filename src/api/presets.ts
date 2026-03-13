import api from './client'

export interface Preset {
  id: number
  name: string
  prompt: string
  category_id: number
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

export const presetsApi = {
  getAll: () => api.get<PresetsResponse>('/api/v1/presets'),

  create: (data: { name: string; prompt: string; category_id: number }) =>
    api.post<PresetResponse>('/api/v1/presets', data),

  update: (id: number, data: { name?: string; prompt?: string; category_id?: number }) =>
    api.patch<PresetResponse>(`/api/v1/presets/${id}`, data),

  delete: (id: number) => api.delete(`/api/v1/presets/${id}`),
}
