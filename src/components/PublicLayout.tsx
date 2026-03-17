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
    <div className="bg-[#f2ece1] font-display text-slate-900 antialiased min-h-screen flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-[#e5ddd3]/50 bg-[#f2ece1]/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 lg:px-20 h-20 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-3">
              <img src={aiVidLogo} alt="SceneFlow 로고" className="size-8 rounded-lg bg-primary p-1 object-contain" />
              <h2 className="text-lg font-bold tracking-tight text-[#1a1a1a]">SceneFlow</h2>
            </Link>
            <nav className="hidden md:flex items-center gap-6">
              <Link className={`text-sm font-medium transition-colors ${activeNav === 'home' ? 'font-semibold text-primary' : 'text-slate-600 hover:text-primary'}`} to="/">홈</Link>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            {isLoggedIn ? (
              <>
                <Link to="/studio" className="text-sm font-medium text-slate-600 hover:text-primary transition-colors">스튜디오</Link>
                <div className="flex items-center gap-3">
                  {user?.profile_image_url ? (
                    <img src={user.profile_image_url} alt="프로필" className="size-8 rounded-full object-cover" />
                  ) : (
                    <div className="size-8 rounded-full bg-primary flex items-center justify-center text-white text-xs font-bold">
                      {user?.name?.charAt(0) || '?'}
                    </div>
                  )}
                  <span className="hidden sm:block text-sm font-medium text-slate-700">{user?.nickname || user?.name}</span>
                  <button onClick={logout} className="text-sm font-medium text-slate-500 hover:text-slate-700 transition-colors">로그아웃</button>
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="hidden sm:block text-sm font-medium text-slate-600">로그인</Link>
                <Link to="/signup" className="bg-primary hover:bg-[#2647d8] text-white text-sm font-bold px-5 py-2 rounded-lg transition-all">시작하기</Link>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      {/* Footer */}
      <footer className="mt-20 border-t border-[#e5ddd3]/50 bg-[#f9f6f0]/30 px-6 lg:px-20 py-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-3">
            <img src={aiVidLogo} alt="SceneFlow 로고" className="size-8 rounded-lg bg-primary p-1 object-contain" />
            <span className="font-bold text-[#2d2926]">SceneFlow</span>
          </div>
          <div className="flex gap-8 text-sm text-[#5e5452]">
            <Link className="hover:text-primary transition-colors" to="/terms">이용약관</Link>
            <Link className="hover:text-primary transition-colors" to="/privacy">개인정보처리방침</Link>
            <Link className="hover:text-primary transition-colors" to="/support">고객센터</Link>
          </div>
          <p className="text-sm text-slate-400">&copy; 2026 SceneFlow. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
