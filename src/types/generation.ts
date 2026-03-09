export interface GenerationRequest {
  prompt: string
  style: string
  aspect_ratio: '9:16' | '1:1' | '16:9'
  duration: 5 | 15 | 30
  settings: {
    lighting: number
    contrast: number
    saturation: number
    motion_speed: number
  }
}

export interface GenerationResponse {
  id: string
  status: 'queued' | 'processing' | 'completed' | 'failed'
  created_at: string
}

export interface GenerationStatus {
  id: string
  status: 'queued' | 'processing' | 'completed' | 'failed'
  progress: number
  video_url?: string
  error?: string
}
