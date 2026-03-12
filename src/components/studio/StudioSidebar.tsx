import { NavLink, Link } from 'react-router-dom'
import aiVidLogo from '@/assets/AI_vid_logo.png'

const navItems = [
  { to: '/studio', icon: 'dashboard', label: '대시보드', end: true },
  { to: '/studio/projects', icon: 'folder_open', label: '프로젝트' },
  { to: '/studio/create', icon: 'auto_awesome', label: '비주얼 생성' },
  { to: '/studio/assets', icon: 'perm_media', label: '에셋 라이브러리' },
  { to: '/studio/mypage', icon: 'person', label: '마이페이지' },
  { to: '/studio/settings', icon: 'settings', label: '환경설정' },
]

export default function StudioSidebar() {
  return (
    <aside className="fixed left-0 top-0 bottom-0 w-64 bg-[#2d2926] text-white flex flex-col z-50">
      {/* Logo */}
      <div className="px-6 h-16 flex items-center gap-3 border-b border-white/10">
        <Link to="/" className="flex items-center gap-3">
          <img src={aiVidLogo} alt="AI Video Studio 로고" className="size-8 rounded-md bg-primary p-1 object-contain" />
          <span className="text-base font-bold tracking-tight">AI Video Studio</span>
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
            <span>2.4 / 5 GB</span>
          </div>
          <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
            <div className="h-full w-[48%] bg-primary rounded-full" />
          </div>
        </div>
        <div className="flex items-center gap-3 px-3 py-2 rounded-xl bg-white/5">
          <div className="size-9 rounded-full bg-primary/20 flex items-center justify-center">
            <span className="material-symbols-outlined text-primary text-lg">person</span>
          </div>
          <div>
            <p className="text-sm font-medium">사용자</p>
            <p className="text-[11px] text-white/40">베타 사용자</p>
          </div>
        </div>
      </div>
    </aside>
  )
}
