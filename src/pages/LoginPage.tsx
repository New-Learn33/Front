import { useState } from 'react'
import { Link } from 'react-router-dom'

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <div className="bg-[#f2ece1] min-h-screen flex flex-col font-display text-slate-900">
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-12">
        <div className="w-full max-w-[440px] space-y-8">
          {/* Logo */}
          <div className="flex flex-col items-center gap-3">
            <Link to="/" className="bg-primary p-1.5 rounded-lg flex items-center justify-center text-white">
              <span className="material-symbols-outlined text-2xl">movie_filter</span>
            </Link>
            <Link to="/" className="text-xl font-bold tracking-tight">AI Video Studio</Link>
          </div>

          {/* Header */}
          <div className="text-center space-y-2">
            <h1 className="text-4xl font-bold tracking-tight">로그인</h1>
            <p className="text-warm-muted text-base">AI 비디오 스튜디오에 오신 것을 환영합니다.</p>
          </div>

          {/* Form */}
          <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
            {/* Email */}
            <div className="space-y-2">
              <label className="text-sm font-semibold block px-1">이메일</label>
              <input
                className="w-full h-14 px-5 rounded-xl border border-[#e5ddd3] bg-white/50 focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder:text-warm-muted/50"
                placeholder="이메일을 입력하세요"
                type="email"
              />
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label className="text-sm font-semibold block px-1">비밀번호</label>
              <div className="relative">
                <input
                  className="w-full h-14 px-5 rounded-xl border border-[#e5ddd3] bg-white/50 focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder:text-warm-muted/50"
                  placeholder="비밀번호를 입력하세요"
                  type={showPassword ? 'text' : 'password'}
                />
                <button
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-primary transition-colors"
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <span className="material-symbols-outlined">
                    {showPassword ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
            </div>

            {/* Remember & Forgot */}
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center gap-3">
                <input
                  className="w-5 h-5 rounded border-[#e5ddd3] text-primary focus:ring-primary bg-white cursor-pointer"
                  id="remember"
                  type="checkbox"
                />
                <label className="text-sm text-slate-600 cursor-pointer select-none" htmlFor="remember">
                  로그인 상태 유지
                </label>
              </div>
              <a className="text-sm text-primary font-bold hover:underline" href="#">
                비밀번호를 잊으셨나요?
              </a>
            </div>

            {/* Submit */}
            <button className="w-full h-14 bg-primary hover:opacity-90 text-white font-bold rounded-xl text-lg transition-all shadow-md">
              로그인
            </button>
          </form>

          {/* Divider */}
          <div className="relative py-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#e5ddd3]" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-[#f2ece1] px-4 text-warm-muted">또는 간편 로그인</span>
            </div>
          </div>

          {/* Social Logins */}
          <div className="grid grid-cols-2 gap-4">
            <button className="flex items-center justify-center gap-2 h-12 rounded-xl border border-[#e5ddd3] bg-white/40 hover:bg-white/70 transition-colors">
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              <span className="text-sm font-medium">Google</span>
            </button>
            <button className="flex items-center justify-center gap-2 h-12 rounded-xl border border-[#e5ddd3] bg-white/40 hover:bg-white/70 transition-colors">
              <span className="material-symbols-outlined text-xl">account_circle</span>
              <span className="text-sm font-medium">Apple</span>
            </button>
          </div>

          {/* Footer */}
          <p className="text-center text-sm text-slate-500">
            계정이 없으신가요? <Link className="text-primary font-bold hover:underline" to="/signup">회원가입</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
