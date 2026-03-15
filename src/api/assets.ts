import api from './client'
import type { AssetListResponse, AssetUploadResponse } from '@/types/asset'

export const assetsApi = {
  list: (params?: { category_id?: string }) =>
    api.get<AssetListResponse>('/api/v1/assets', { params }),

  upload: (file: File, categoryId: string, name?: string) => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('category_id', categoryId)
    if (name) formData.append('name', name)
    return api.post<AssetUploadResponse>('/api/v1/assets/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      timeout: 60000,
    })
  },
}
