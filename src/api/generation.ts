import api from './client'
import type {
  GenerationRequest,
  GenerationResponse,
  SubtitleRenderRequest,
  SubtitleRenderResponse,
  VideoRenderRequest,
  VideoRenderResponse,
} from '@/types/generation'

export const generationApi = {
  // 1단계: 3컷 이미지 + 대사 생성
  create: (data: GenerationRequest) =>
    api.post<GenerationResponse>('/api/v1/generation', data, {
      timeout: 180000,
    }),

  // 2단계: 자막 합성
  renderSubtitles: (data: SubtitleRenderRequest) =>
    api.post<SubtitleRenderResponse>('/api/v1/generation/render/subtitles', data, {
      timeout: 120000,
    }),

  // 3단계: 영상 생성 (기존 방식)
  renderVideo: (data: VideoRenderRequest) =>
    api.post<VideoRenderResponse>('/api/v1/generation/render/video', data, {
      timeout: 180000,
    }),

  // SVD 기반 영상 생성
  renderVideoSvd: (data: {
    job_id: number
    images: { scene_order: number; image_url: string }[]
    scenes: { scene_order: number; dialogue: string }[]
  }) =>
    api.post<{
      success: boolean
      message: string
      data: { job_id: number; status: string; video_url: string }
    }>('/api/v1/generation/render/video/svd', data, {
      timeout: 600000, // 10분 - SVD 변환에 상당히 오래 걸림
    }),
}
