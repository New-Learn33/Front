import api from './client'

export interface VideoDetail {
  id: number
  title: string
  category_id: number
  thumbnail_url: string
  video_url: string
  like_count: number
  comment_count: number
  view_count: number
  liked: boolean
}

export interface VideoListItem {
  id: number
  title: string
  category_id: number
  thumbnail_url: string
  like_count: number
  comment_count: number
  liked: boolean
}

export interface VideoComment {
  comment_id: number
  video_id: number
  nickname: string
  content: string
}

export const videosApi = {
  // 영상 목록
  getAll: (sort: string = 'popular') =>
    api.get<{ success: boolean; data: { videos: VideoListItem[] } }>(`/api/v1/videos?sort=${sort}`),

  // 영상 상세
  getById: (id: number) =>
    api.get<{ success: boolean; data: { videos: VideoDetail } }>(`/api/v1/videos/${id}`),

  // 영상 검색
  search: (title: string) =>
    api.get<{ success: boolean; data: { videos: VideoListItem[] } }>(`/api/v1/videos/search?title=${encodeURIComponent(title)}`),

  // 댓글 목록
  getComments: (videoId: number) =>
    api.get<{ success: boolean; data: { comments: VideoComment[] } }>(`/api/v1/videos/${videoId}/comments`),

  // 댓글 작성
  addComment: (videoId: number, content: string) =>
    api.post<{ success: boolean; data: { comment: VideoComment } }>(`/api/v1/videos/${videoId}/comments`, { content }),

  // 좋아요 추가
  addLike: (videoId: number) =>
    api.post<{ success: boolean; data: { video_id: number; liked: boolean; like_count: number } }>(`/api/v1/videos/${videoId}/likes`),

  // 좋아요 취소
  removeLike: (videoId: number) =>
    api.delete<{ success: boolean; data: { video_id: number; liked: boolean; like_count: number } }>(`/api/v1/videos/${videoId}/likes`),
}
