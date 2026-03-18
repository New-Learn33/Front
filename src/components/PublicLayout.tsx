import { Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import aiVidLogo from '@/assets/AI_vid_logo.png'

interface PublicLayoutProps {
  children: React.ReactNode
  activeNav?: 'home' | ''
}

export default function PublicLayout({ children, activeNav = '' }: PublicLayoutProps) {
  const { isLoggedIn, user, logout } = useAuth()

  return (
    <div className="min-h-screen bg-[#f2ece1] text-slate-900 dark:bg-[#09111f] font-display dark:text-slate-100 antialiased flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-[#e5ddd3] bg-[#f2ece1]/80 backdrop-blur-xl dark:border-white/10 dark:bg-[#09111f]/80">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 lg:px-20">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-3">
              <img src={aiVidLogo} alt="SceneFlow 로고" className="size-9 rounded-xl bg-primary p-1.5 object-contain shadow-lg shadow-primary/20" />
              <div>
                <h2 className="text-lg font-bold tracking-tight text-[#2d2926] dark:text-white">SceneFlow</h2>
                <p className="text-[11px] font-medium tracking-[0.12em] text-slate-500">GENERATIVE VIDEO STUDIO</p>
              </div>
            </Link>
            <nav className="hidden md:flex items-center gap-6">
              <Link className={`text-sm transition-colors ${activeNav === 'home' ? 'font-semibold text-primary' : 'font-medium text-slate-400 hover:text-primary'}`} to="/">홈</Link>
              <Link className="text-sm font-medium text-slate-400 transition-colors hover:text-primary" to={isLoggedIn ? "/studio" : "/login"}>스튜디오</Link>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            {isLoggedIn ? (
              <div className="flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-2 py-1 shadow-sm shadow-black/20">
                  {user?.profile_image_url ? (
                    <img src={user.profile_image_url} alt="프로필" className="size-8 rounded-full object-cover" />
                  ) : (
                    <div className="size-8 rounded-full bg-primary flex items-center justify-center text-white text-xs font-bold">
                      {user?.name?.charAt(0) || '?'}
                    </div>
                  )}
                  <span className="hidden sm:block text-sm font-medium text-[#2d2926]">{user?.nickname || user?.name}</span>
                  <button onClick={logout} className="px-3 text-sm font-medium text-[#8a7d72] transition-colors hover:text-[#2d2926]">로그아웃</button>
                </div>
            ) : (
              <>
                <Link to="/login" className="hidden text-sm font-medium text-slate-400 sm:block">로그인</Link>
                <Link to="/signup" className="rounded-full bg-primary px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-primary/20 transition-all hover:bg-[#58717c]">시작하기</Link>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      {/* Footer */}
      <footer className="mt-20 border-t border-white/10 bg-[#0d1729] px-6 lg:px-20 py-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-3">
            <img src={aiVidLogo} alt="SceneFlow 로고" className="size-8 rounded-lg bg-primary p-1 object-contain" />
            <span className="font-bold text-white">SceneFlow</span>
          </div>
          <p className="text-sm text-slate-400">&copy; 2026 SceneFlow. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
