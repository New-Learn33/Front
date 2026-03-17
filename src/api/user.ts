import api from './client'

export interface UserProfile {
  id: number
  email: string
  nickname: string
  name?: string
  profile_image_url?: string
  provider?: string
}

export interface UserVideo {
  id: number
  title: string
  category_id: number
  thumbnail_url: string
  video_url: string
  like_count: number
  comment_count: number
  view_count: number
}

export interface UserComment {
  id: number
  video_id: number
  content: string
  video_title?: string
  created_at?: string
}

export const userApi = {
  // 내 프로필 조회
  getProfile: () =>
    api.get<{ success: boolean; data: { user: UserProfile } }>('/api/v1/users/me/profile'),

  // 내 프로필 수정 (닉네임)
  updateProfile: (data: { nickname: string }) =>
    api.patch<{ success: boolean; data: { user: UserProfile } }>('/api/v1/users/me/profile', data),

  // 내 업로드 영상 조회
  getMyVideos: () =>
    api.get<{ success: boolean; data: { videos: UserVideo[] } }>('/api/v1/users/me/videos'),

  // 내 댓글 목록 조회
  getMyComments: () =>
    api.get<{ success: boolean; data: { comments: UserComment[] } }>('/api/v1/users/me/comments'),

  // 좋아요한 영상 목록 조회
  getMyLikes: () =>
    api.get<{ success: boolean; data: { videos: UserVideo[] } }>('/api/v1/users/me/likes'),

  // 저장공간 조회
  getMyStorage: () =>
    api.get<{ success: boolean; data: { storage_used: number; storage_limit: number; storage_used_gb: number; storage_limit_gb: number } }>('/api/v1/users/me/storage'),

  // 댓글 삭제
  deleteComment: (commentId: number) =>
    api.delete<{ success: boolean }>(`/api/v1/comments/${commentId}`),
}
