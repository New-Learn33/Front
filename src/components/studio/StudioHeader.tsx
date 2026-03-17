import { useState, useRef, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useNotification } from '@/hooks/useNotification'

const routeLabels: Record<string, string> = {
  '/studio': '대시보드',
  '/studio/projects': '프로젝트',
  '/studio/create': '비주얼 생성',
  '/studio/assets': '에셋 라이브러리',
  '/studio/settings': '환경설정',
}

const notifIcon: Record<string, string> = {
  like: 'favorite',
  comment: 'chat_bubble',
  video_completed: 'check_circle',
  video_failed: 'error',
}

const notifColor: Record<string, string> = {
  like: 'text-red-400',
  comment: 'text-blue-400',
  video_completed: 'text-green-500',
  video_failed: 'text-red-500',
}

export default function StudioHeader() {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const label = routeLabels[pathname] || '마이페이지'

  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotification()
  const [open, setOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // 외부 클릭 시 닫기
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleNotifClick = async (notif: typeof notifications[0]) => {
    if (!notif.is_read) await markAsRead(notif.id)
    if (notif.video_id) {
      navigate(`/video/${notif.video_id}`)
      setOpen(false)
    }
  }

  const timeAgo = (dateStr?: string) => {
    if (!dateStr) return ''
    const diff = Date.now() - new Date(dateStr).getTime()
    const mins = Math.floor(diff / 60000)
    if (mins < 1) return '방금 전'
    if (mins < 60) return `${mins}분 전`
    const hours = Math.floor(mins / 60)
    if (hours < 24) return `${hours}시간 전`
    return `${Math.floor(hours / 24)}일 전`
  }

  return (
    <header className="h-16 bg-[#f2ece1] border-b border-[#e5ddd3] dark:border-b-0 flex items-center justify-between px-8">
      <div className="flex items-center gap-2 text-sm">
        <span className="text-warm-muted">스튜디오</span>
        <span className="text-warm-muted">/</span>
        <span className="font-semibold text-[#2d2926]">{label}</span>
      </div>
      <div className="flex items-center gap-3">
        {/* 알림 벨 */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setOpen(!open)}
            className="size-9 rounded-lg bg-white border border-[#e5ddd3] flex items-center justify-center text-warm-muted hover:text-primary transition-colors relative"
          >
            <span className="material-symbols-outlined text-xl">notifications</span>
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center px-1">
                {unreadCount > 99 ? '99+' : unreadCount}
              </span>
            )}
          </button>

          {/* 드롭다운 */}
          {open && (
            <div className="absolute right-0 top-11 w-80 bg-white rounded-xl shadow-xl border border-[#e5ddd3] z-50 overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 border-b border-[#e5ddd3]">
                <h3 className="font-bold text-sm text-[#2d2926]">알림</h3>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="text-xs text-primary hover:underline"
                  >
                    모두 읽음
                  </button>
                )}
              </div>

              <div className="max-h-80 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="py-8 text-center text-sm text-warm-muted">
                    알림이 없습니다
                  </div>
                ) : (
                  notifications.slice(0, 20).map((notif) => (
                    <button
                      key={notif.id}
                      onClick={() => handleNotifClick(notif)}
                      className={`w-full text-left px-4 py-3 flex items-start gap-3 hover:bg-[#f9f6f0] transition-colors border-b border-[#f0ebe2] last:border-0 ${
                        !notif.is_read ? 'bg-[#faf7f1]' : ''
                      }`}
                    >
                      <span className={`material-symbols-outlined text-lg mt-0.5 ${notifColor[notif.type] || 'text-warm-muted'}`}>
                        {notifIcon[notif.type] || 'notifications'}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm truncate ${!notif.is_read ? 'font-semibold text-[#2d2926]' : 'text-[#5e5452]'}`}>
                          {notif.title}
                        </p>
                        <p className="text-xs text-warm-muted truncate mt-0.5">{notif.message}</p>
                        <p className="text-[10px] text-warm-muted/60 mt-1">{timeAgo(notif.created_at)}</p>
                      </div>
                      {!notif.is_read && (
                        <span className="size-2 rounded-full bg-primary mt-2 shrink-0" />
                      )}
                    </button>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

      </div>
    </header>
  )
}
