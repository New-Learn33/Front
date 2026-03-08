import { useState } from 'react'
import { Link } from 'react-router-dom'

export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  return (
    <div className="bg-[#f2ece1] min-h-screen flex flex-col font-display text-slate-900">
      {/* Top Navigation Bar */}
      <header className="flex items-center justify-between px-6 py-6 lg:px-20 border-b border-[#e5ddd3]/50">
        <Link to="/" className="flex items-center gap-3">
          <div className="bg-primary p-1.5 rounded-lg flex items-center justify-center text-white">
            <span className="material-symbols-outlined text-2xl">movie_filter</span>
          </div>
          <h2 className="text-xl font-bold tracking-tight">AI Video Studio</h2>
        </Link>
        <div className="hidden md:flex gap-6 items-center">
          <Link className="text-sm font-medium text-warm-muted hover:text-primary transition-colors" to="/login">로그인</Link>
          <Link className="bg-primary text-white px-5 py-2 rounded-lg text-sm font-bold" to="/signup">시작하기</Link>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-[480px] space-y-8">
          {/* Title & Subtitle */}
          <div className="text-center space-y-3">
            <h1 className="text-4xl font-bold tracking-tight">회원가입</h1>
            <p className="text-warm-muted text-base">
              지금 바로 AI 비디오 제작의 미래를 경험해 보세요.
            </p>
          </div>

          {/* Form */}
          <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
            {/* Name */}
            <div className="space-y-2">
              <label className="text-sm font-semibold block px-1">이름</label>
              <input
                className="w-full h-14 px-5 rounded-xl border border-[#e5ddd3] bg-white/50 focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder:text-warm-muted/50"
                placeholder="성함을 입력하세요"
                type="text"
              />
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label className="text-sm font-semibold block px-1">이메일</label>
              <input
                className="w-full h-14 px-5 rounded-xl border border-[#e5ddd3] bg-white/50 focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder:text-warm-muted/50"
                placeholder="example@email.com"
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

            {/* Password Confirmation */}
            <div className="space-y-2">
              <label className="text-sm font-semibold block px-1">비밀번호 확인</label>
              <div className="relative">
                <input
                  className="w-full h-14 px-5 rounded-xl border border-[#e5ddd3] bg-white/50 focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder:text-warm-muted/50"
                  placeholder="비밀번호를 다시 입력하세요"
                  type={showConfirmPassword ? 'text' : 'password'}
                />
                <button
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-primary transition-colors"
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  <span className="material-symbols-outlined">
                    {showConfirmPassword ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
            </div>

            {/* Terms */}
            <div className="flex items-center gap-3 py-2">
              <input
                className="w-5 h-5 rounded border-[#e5ddd3] text-primary focus:ring-primary bg-white cursor-pointer"
                id="terms"
                type="checkbox"
              />
              <label className="text-sm text-slate-600 cursor-pointer select-none" htmlFor="terms">
                <span className="underline decoration-primary/30">이용 약관</span> 및{' '}
                <span className="underline decoration-primary/30">개인정보 처리방침</span>에 동의합니다.
              </label>
            </div>

            {/* Submit */}
            <button className="w-full h-14 bg-primary hover:opacity-90 text-white font-bold rounded-xl text-lg transition-all shadow-md flex items-center justify-center gap-2">
              가입하기
              <span className="material-symbols-outlined">arrow_forward</span>
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

          {/* Social Buttons */}
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

          <p className="text-warm-muted text-base text-center">
            이미 계정이 있으신가요? <Link className="text-primary font-bold hover:underline" to="/login">로그인</Link>
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-8 px-6 lg:px-20 text-center border-t border-[#e5ddd3]/50">
        <p className="text-xs text-warm-muted/60">
          © 2024 AI Video Studio. All rights reserved.
        </p>
      </footer>
    </div>
  )
}
