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

  const connectWs = useCallback(() => {
    const token = localStorage.getItem('access_token')
    if (!token) return

    // HTTP → WS 프로토콜 변환
    const wsBase = API_BASE_URL.replace(/^http/, 'ws')
    const ws = new WebSocket(`${wsBase}/api/v1/notifications/ws/notifications?token=${token}`)

    ws.onopen = () => {
      setConnected(true)
      console.log('[WS] Connected')
    }

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data)

        if (data.type === 'notification') {
          if (data.event === 'connected') {
            setUnreadCount(data.unread_count ?? 0)
          } else if (data.event === 'new_notification') {
            setNotifications(prev => [data.notification, ...prev])
            setUnreadCount(prev => prev + 1)
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
        }
      } catch {
        // JSON 파싱 실패 무시
      }
    }

    ws.onclose = () => {
      setConnected(false)
      console.log('[WS] Disconnected, reconnecting in 3s...')
      reconnectTimer.current = setTimeout(connectWs, 3000)
    }

    ws.onerror = () => {
      ws.close()
    }

    wsRef.current = ws
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
