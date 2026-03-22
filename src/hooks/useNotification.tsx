import { createContext, useContext, useEffect, useRef, useState, useCallback, type ReactNode } from 'react'
import { API_BASE_URL } from '@/config/env'
import { notificationApi, type Notification } from '@/api/notifications'

interface JobEvent {
  job_id: number
  status: string
  progress: number
  video_url?: string
  message?: string
}

interface NotificationContextType {
  notifications: Notification[]
  unreadCount: number
  jobEvents: Map<number, JobEvent>
  fetchNotifications: () => Promise<void>
  markAsRead: (id: number) => Promise<void>
  markAllAsRead: () => Promise<void>
  connected: boolean
}

const NotificationContext = createContext<NotificationContextType | null>(null)

export function useNotification() {
  const ctx = useContext(NotificationContext)
  if (!ctx) throw new Error('useNotification must be used within NotificationProvider')
  return ctx
}

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [jobEvents, setJobEvents] = useState<Map<number, JobEvent>>(new Map())
  const [connected, setConnected] = useState(false)
  const wsRef = useRef<WebSocket | null>(null)
  const reconnectTimer = useRef<ReturnType<typeof setTimeout>>(undefined)

  const fetchNotifications = useCallback(async () => {
    try {
      const res = await notificationApi.getList()
      if (res.data.success) {
        setNotifications(res.data.data.notifications)
        setUnreadCount(res.data.data.unread_count)
      }
    } catch {
      // 인증 안 된 경우 무시
    }
  }, [])

  const markAsRead = useCallback(async (id: number) => {
    try {
      await notificationApi.markAsRead(id)
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n))
      setUnreadCount(prev => Math.max(0, prev - 1))
    } catch { /* ignore */ }
  }, [])

  const markAllAsRead = useCallback(async () => {
    try {
      await notificationApi.markAllAsRead()
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })))
      setUnreadCount(0)
    } catch { /* ignore */ }
  }, [])

  // 브라우저 데스크톱 알림 전송
  const showBrowserNotification = useCallback((title: string, body: string) => {
    if (!('Notification' in window)) return
    if (Notification.permission === 'granted') {
      new Notification(title, { body, icon: '/favicon.ico' })
    } else if (Notification.permission !== 'denied') {
      Notification.requestPermission().then(perm => {
        if (perm === 'granted') {
          new Notification(title, { body, icon: '/favicon.ico' })
        }
      })
    }
  }, [])

  const connectWs = useCallback(() => {
    const token = localStorage.getItem('access_token')
    if (!token) return

    // HTTP → WS 프로토콜 변환
    const wsBase = API_BASE_URL.replace(/^http/, 'ws')
    const ws = new WebSocket(`${wsBase}/api/v1/notifications/ws/notifications?token=${token}`)

    ws.onopen = () => {
      setConnected(true)
    }

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data)

        if (data.type === 'notification') {
          if (data.event === 'connected') {
            setUnreadCount(data.unread_count ?? 0)
          } else if (data.event === 'created' || data.event === 'new_notification') {
            const notif = data.notification
            setNotifications(prev => [notif, ...prev])
            if (data.unread_count != null) {
              setUnreadCount(data.unread_count)
            } else {
              setUnreadCount(prev => prev + 1)
            }
            // 브라우저 데스크톱 알림
            if (notif) {
              showBrowserNotification(
                notif.title || '새 알림',
                notif.message || ''
              )
            }
          }
        }

        if (data.type === 'job') {
          const jobEvent: JobEvent = {
            job_id: data.job_id,
            status: data.status,
            progress: data.progress,
            video_url: data.video_url,
            message: data.message,
          }
          setJobEvents(prev => {
            const next = new Map(prev)
            next.set(data.job_id, jobEvent)
            return next
          })
          // 영상 생성 완료/실패 시 브라우저 알림
          if (data.status === 'completed') {
            showBrowserNotification('영상 생성 완료', data.message || '영상이 완성되었습니다!')
          } else if (data.status === 'failed') {
            showBrowserNotification('영상 생성 실패', data.message || '영상 생성 중 오류가 발생했습니다.')
          }
        }
      } catch {
        // JSON 파싱 실패 무시
      }
    }

    ws.onclose = () => {
      setConnected(false)
      reconnectTimer.current = setTimeout(connectWs, 3000)
    }

    ws.onerror = () => {
      ws.close()
    }

    wsRef.current = ws
  }, [])

  // 브라우저 알림 권한 요청
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission()
    }
  }, [])

  // 로그인 상태 변화 감지
  useEffect(() => {
    const token = localStorage.getItem('access_token')
    if (token) {
      fetchNotifications()
      connectWs()
    }

    return () => {
      wsRef.current?.close()
      if (reconnectTimer.current) clearTimeout(reconnectTimer.current)
    }
  }, [connectWs, fetchNotifications])

  return (
    <NotificationContext.Provider value={{
      notifications,
      unreadCount,
      jobEvents,
      fetchNotifications,
      markAsRead,
      markAllAsRead,
      connected,
    }}>
      {children}
    </NotificationContext.Provider>
  )
}
