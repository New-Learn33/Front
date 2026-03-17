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
    motion_intensity?: string
  }) =>
    api.post<{
      success: boolean
      message: string
      data: { job_id: number; status: string; video_url: string }
    }>('/api/v1/generation/render/video/svd', data, {
      timeout: 1800000, // 30분 - Minimax 영상 변환에 오래 걸림
    }),

  // SVD 백그라운드 영상 생성 (즉시 응답, WebSocket으로 진행률 수신)
  renderVideoSvdBackground: (data: {
    job_id: number
    images: { scene_order: number; image_url: string }[]
    scenes: { scene_order: number; dialogue: string }[]
    motion_intensity?: string
  }) =>
    api.post<{
      success: boolean
      message: string
      data: { job_id: number; status: string; progress: number }
    }>('/api/v1/generation/render/video/svd/background', data),

  // 썸네일 선택
  selectThumbnail: (data: { job_id: number; thumbnail_url: string }) =>
    api.post<{
      success: boolean
      message: string
      data: { job_id: number; thumbnail_url: string }
    }>('/api/v1/generation/thumbnail/select', data),

  // 텍스트 수정 (제목, 대사, 자막)
  updateText: (jobId: number, data: {
    title?: string
    scenes?: { scene_order: number; dialogue?: string; subtitle_text?: string }[]
  }) =>
    api.patch<{
      success: boolean
      message: string
      data: {
        job_id: number
        title: string
        scenes: { scene_order: number; dialogue: string; subtitle_text: string }[]
      }
    }>(`/api/v1/generation/jobs/${jobId}/text`, data),
}
