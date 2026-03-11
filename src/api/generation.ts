import api from './client'
import type { GenerationRequest, GenerationResponse } from '@/types/generation'

export const generationApi = {
  create: (data: GenerationRequest) =>
    api.post<GenerationResponse>('/api/v1/generation', data, {
      timeout: 180000, // 3분 - 이미지 생성에 시간이 걸림
    }),
}
