import api from './client'

export interface VideoListItem {
  id: number
  title: string
  category_id: number
  thumbnail_url: string
  video_url?: string
  created_at?: string
  creator?: string
  creator_nickname?: string
  creator_avatar_url?: string
  description?: string
  duration?: string
  like_count: number
  comment_count: number
  liked?: boolean
  view_count?: number
}

export const videosApi = {
  getAll: (sort: 'popular' | 'latest' = 'popular') =>
    api.get<{ success: boolean; data: { videos: VideoListItem[] } }>('/api/v1/videos', {
      params: { sort },
    }),

  search: (title: string) =>
    api.get<{ success: boolean; data: { videos: VideoListItem[] } }>('/api/v1/videos/search', {
      params: { title },
    }),
}
