import api from './client'
import type { GenerationRequest, GenerationResponse, GenerationStatus } from '@/types/generation'

export const generationApi = {
  create: (data: GenerationRequest) =>
    api.post<GenerationResponse>('/generation', data),

  status: (id: string) =>
    api.get<GenerationStatus>(`/generation/${id}/status`),

  cancel: (id: string) =>
    api.post(`/generation/${id}/cancel`),
}
