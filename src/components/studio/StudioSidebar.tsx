import { useState, useEffect, useCallback } from 'react'
import { NavLink, Link, useLocation } from 'react-router-dom'
import aiVidLogo from '@/assets/AI_vid_logo.png'
import { useAuth } from '../../hooks/useAuth'
import { userApi } from '../../api/user'

const navItems = [
  { to: '/studio', icon: 'dashboard', label: '대시보드', end: true },
  { to: '/studio/projects', icon: 'folder_open', label: '프로젝트' },
  { to: '/studio/create', icon: 'auto_awesome', label: '비주얼 생성' },
  { to: '/studio/assets', icon: 'perm_media', label: '에셋 라이브러리' },
  { to: '/studio/mypage', icon: 'person', label: '마이페이지' },
  { to: '/studio/settings', icon: 'settings', label: '환경설정' },
]

export default function StudioSidebar() {
  const { user } = useAuth()
  const location = useLocation()
  const [storageUsedBytes, setStorageUsedBytes] = useState(0)
  const [storageLimitGb, setStorageLimitGb] = useState(3)

  const fetchStorage = useCallback(async () => {
    try {
      const res = await userApi.getMyStorage()
      if (res.data.success) {
        setStorageUsedBytes(res.data.data.storage_used)
        setStorageLimitGb(res.data.data.storage_limit_gb)
      }
    } catch {
      // 무시
    }
  }, [])

  // 페이지 이동 시 갱신
  useEffect(() => {
    fetchStorage()
  }, [location.pathname, fetchStorage])

  // 커스텀 이벤트로 업로드/삭제 시 즉시 갱신
  useEffect(() => {
    const handler = () => fetchStorage()
    window.addEventListener('storage-updated', handler)
    return () => window.removeEventListener('storage-updated', handler)
  }, [fetchStorage])

  // 용량을 읽기 좋은 단위로 변환
  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 ** 2)).toFixed(1)} MB`
    return `${(bytes / (1024 ** 3)).toFixed(2)} GB`
  }

  const storageUsedGb = storageUsedBytes / (1024 ** 3)
  const usagePercent = storageLimitGb > 0 ? Math.min(100, (storageUsedGb / storageLimitGb) * 100) : 0
  const barColor = usagePercent > 80 ? 'bg-red-500' : 'bg-primary'
  const usedLabel = formatSize(storageUsedBytes)

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-64 bg-[#2d2926] text-white flex flex-col z-50">
      {/* Logo */}
      <div className="px-6 h-16 flex items-center gap-3 border-b border-white/10">
        <Link to="/" className="flex items-center gap-3">
          <img src={aiVidLogo} alt="SceneFlow 로고" className="size-8 rounded-md bg-primary p-1 object-contain" />
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
              `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? 'bg-primary/20 text-primary'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
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
            <span>{usedLabel} / {storageLimitGb} GB</span>
          </div>
          <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
            <div className={`h-full ${barColor} rounded-full transition-all`} style={{ width: `${usagePercent}%` }} />
          </div>
        </div>
        <div className="flex items-center gap-3 px-3 py-2 rounded-xl bg-white/5">
          <div className="size-9 rounded-full bg-primary/20 flex items-center justify-center">
            <span className="material-symbols-outlined text-primary text-lg">person</span>
          </div>
          <div>
            <p className="text-sm font-medium">{user?.nickname || user?.name || '사용자'}</p>
            <p className="text-[11px] text-white/40">{usedLabel} / {storageLimitGb} GB 사용</p>
          </div>
        </div>
      </div>
    </aside>
  )
}
