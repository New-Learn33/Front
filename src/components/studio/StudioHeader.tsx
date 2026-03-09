import { useLocation } from 'react-router-dom'

const routeLabels: Record<string, string> = {
  '/studio': '대시보드',
  '/studio/projects': '프로젝트',
  '/studio/create': '비주얼 생성',
  '/studio/assets': '에셋 라이브러리',
  '/studio/settings': '환경설정',
}

export default function StudioHeader() {
  const { pathname } = useLocation()
  const label = routeLabels[pathname] || '스튜디오'

  return (
    <header className="h-16 bg-[#f2ece1] border-b border-[#e5ddd3] flex items-center justify-between px-8">
      <div className="flex items-center gap-2 text-sm">
        <span className="text-warm-muted">스튜디오</span>
        <span className="text-warm-muted">/</span>
        <span className="font-semibold text-[#2d2926]">{label}</span>
      </div>
      <div className="flex items-center gap-3">
        <button className="size-9 rounded-lg bg-white border border-[#e5ddd3] flex items-center justify-center text-warm-muted hover:text-primary transition-colors">
          <span className="material-symbols-outlined text-xl">notifications</span>
        </button>
        <button className="size-9 rounded-lg bg-white border border-[#e5ddd3] flex items-center justify-center text-warm-muted hover:text-primary transition-colors">
          <span className="material-symbols-outlined text-xl">help</span>
        </button>
      </div>
    </header>
  )
}
