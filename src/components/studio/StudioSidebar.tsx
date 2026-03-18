import { useState, useEffect } from 'react'
import { NavLink, Link } from 'react-router-dom'
import aiVidLogo from '@/assets/AI_vid_logo.png'
import { authApi } from '@/api/auth'
import type { User } from '@/types/auth'

const STORAGE_LIMIT = 3 * 1024 * 1024 * 1024 // 3GB

interface NavItem {
  to: string
  icon: string
  label: string
  end?: boolean
}

const navItems: NavItem[] = [
  { to: '/studio/projects', icon: 'folder_open', label: '프로젝트 목록' },
  { to: '/studio/create', icon: 'auto_awesome', label: '새 프로젝트 생성' },
  { to: '/studio/assets', icon: 'perm_media', label: '내 자료함' },
  { to: '/studio/mypage', icon: 'person', label: '마이페이지' },
  { to: '/studio/settings', icon: 'settings', label: '환경설정' },
]

function formatStorage(bytes: number): string {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`
}

export default function StudioSidebar() {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const token = localStorage.getItem('access_token')
    if (!token) return
    authApi.me().then(res => {
      if (res.data.success) setUser(res.data.data)
    }).catch(() => {})
  }, [])

  const storageUsed = user?.storage_used || 0
  const storagePercent = Math.min(100, Math.round((storageUsed / STORAGE_LIMIT) * 100))

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-64 bg-[#0b1324] text-white flex flex-col z-50 border-r border-white/10" style={{ transform: 'translateZ(0)', willChange: 'transform' }}>
      {/* Logo */}
      <div className="px-6 h-16 flex items-center gap-3 border-b border-white/10">
        <Link to="/" className="flex items-center gap-3">
          <img src={aiVidLogo} alt="SceneFlow 로고" className="size-8 rounded-full bg-primary/90 p-1 object-contain" />
          <span className="text-base font-bold tracking-tight">SceneFlow</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors border ${
                isActive
                  ? 'bg-primary/12 text-primary border-primary/20'
                  : 'text-white/60 hover:text-white hover:bg-white/5 border-transparent'
              }`
            }
          >
            <span className="material-symbols-outlined text-xl">{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* User + Storage */}
      <div className="px-4 pb-6 space-y-4">
        <div className="px-3 space-y-2">
          <div className="flex items-center justify-between text-xs text-white/40">
            <span>저장공간</span>
            <span>{formatStorage(storageUsed)} / {formatStorage(STORAGE_LIMIT)}</span>
          </div>
          <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all duration-500"
              style={{ width: `${storagePercent}%` }}
            />
          </div>
        </div>
        <div className="flex items-center gap-3 px-3 py-2 rounded-xl bg-white/5">
          <div className="size-9 rounded-full bg-primary/12 flex items-center justify-center">
            <span className="material-symbols-outlined text-primary text-lg">person</span>
          </div>
          <div>
            <p className="text-sm font-medium">{user?.name || '사용자'}</p>
            <p className="text-[11px] text-white/40">{user?.email || ''}</p>
          </div>
        </div>
      </div>
    </aside>
  )
}
