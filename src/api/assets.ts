import api from './client'
import type { Asset, AssetListResponse } from '@/types/asset'

export const assetsApi = {
  list: (params?: { type?: string }) =>
    api.get<AssetListResponse>('/assets', { params }),

  get: (id: number) =>
    api.get<Asset>(`/assets/${id}`),

  upload: (file: File) => {
    const formData = new FormData()
    formData.append('file', file)
    return api.post<Asset>('/assets/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },

  delete: (id: number) =>
    api.delete(`/assets/${id}`),
}
