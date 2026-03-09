export interface Project {
  id: number
  title: string
  style: string
  status: '진행중' | '완료' | '실패'
  duration: string
  thumbnail_url?: string
  video_url?: string
  created_at: string
  updated_at: string
}

export interface ProjectListResponse {
  projects: Project[]
  total: number
}
