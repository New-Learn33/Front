import api from './client'
import type { Asset, AssetListResponse } from '@/types/asset'

export const assetsApi = {
  list: (params?: { tag?: string }) =>
    api.get<AssetListResponse>('/api/v1/assets', { params }),

  upload: (file: File, tags: string[] = [], name?: string) => {
    const formData = new FormData()
    formData.append('file', file)
    tags.forEach((tag) => formData.append('tags', tag))
    if (name) formData.append('name', name)
    return api.post<{ success: boolean; message: string; data: Asset }>(
      '/api/v1/assets/upload',
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' }, timeout: 60000 },
    )
  },

  updateTags: (assetId: string, tags: string[]) =>
    api.patch<{ success: boolean; message: string; data: Asset }>(
      `/api/v1/assets/${assetId}/tags`,
      { tags },
    ),

  delete: (assetId: string) =>
    api.delete<{ success: boolean; message: string; data: { id: string } }>(
      `/api/v1/assets/${assetId}`,
    ),
}
