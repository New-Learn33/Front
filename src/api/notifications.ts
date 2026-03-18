import api from './client'

export interface Notification {
  id: number
  recipient_user_id: number
  actor_user_id: number | null
  type: 'like' | 'comment' | 'image_completed' | 'video_completed' | 'video_failed'
  title: string
  message: string
  video_id: number | null
  comment_id: number | null
  job_id: number | null
  is_read: boolean
  created_at?: string
}

export interface NotificationListResponse {
  success: boolean
  data: {
    notifications: Notification[]
    unread_count: number
  }
}

export const notificationApi = {
  /** 알림 목록 조회 */
  getList: () =>
    api.get<NotificationListResponse>('/api/v1/notifications/notifications'),

  /** 개별 알림 읽음 처리 */
  markAsRead: (notificationId: number) =>
    api.patch(`/api/v1/notifications/notifications/${notificationId}/read`),

  /** 전체 알림 읽음 처리 */
  markAllAsRead: () =>
    api.patch('/api/v1/notifications/notifications/read-all'),
}
