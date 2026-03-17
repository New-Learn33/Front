import api from './client'
import type { Asset, AssetListResponse } from '@/types/asset'

export const assetsApi = {
  list: (params?: { category_id?: number; tag?: string }) =>
    api.get<AssetListResponse>('/api/v1/assets', { params }),

  upload: (file: File, categoryId: number, name?: string) => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('category_id', String(categoryId))
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
