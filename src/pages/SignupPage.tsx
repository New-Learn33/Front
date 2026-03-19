import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { GoogleLogin } from '@react-oauth/google'
import { authApi } from '@/api/auth'
import aiVidLogo from '@/assets/AI_vid_logo.png'

export default function SignupPage() {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // 이메일 회원가입 핸들러
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!name.trim() || !email.trim() || !password) {
      alert('모든 필드를 입력해주세요.')
      return
    }

    if (password !== confirmPassword) {
      alert('비밀번호가 일치하지 않습니다.')
      return
    }

    if (password.length < 6) {
      alert('비밀번호는 6자 이상이어야 합니다.')
      return
    }

    try {
      setIsLoading(true)
      const res = await authApi.signup({ name, email, password })
      const { access_token, user } = res.data.data

      localStorage.setItem('access_token', access_token)
      localStorage.setItem('user', JSON.stringify(user))
      navigate('/studio')
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } }
      const msg = error.response?.data?.message || '회원가입 중 오류가 발생했습니다.'
      alert(msg)
    } finally {
      setIsLoading(false)
    }
  }

  // 구글 로그인 성공 핸들러
  const handleGoogleLoginSuccess = async (credentialResponse: { credential?: string }) => {
    const idToken = credentialResponse.credential
    if (!idToken) {
      alert('구글 인증 정보를 받지 못했습니다.')
      return
    }

    try {
      setIsLoading(true)
      const res = await authApi.googleLogin({ id_token: idToken })
      const { access_token, user } = res.data.data

      localStorage.setItem('access_token', access_token)
      localStorage.setItem('user', JSON.stringify(user))
      navigate('/studio')
    } catch {
      alert('구글 로그인 중 오류가 발생했습니다.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="bg-[#f8fbff] min-h-screen flex flex-col font-display text-slate-900">
      {/* Top Navigation Bar */}
      <header className="flex items-center justify-between px-6 py-6 lg:px-20 border-b border-[#dde7f1]/50">
        <Link to="/" className="flex items-center gap-3">
          <img src={aiVidLogo} alt="SceneFlow 로고" className="size-11 rounded-lg bg-primary p-1.5 object-contain" />
          <h2 className="text-xl font-bold tracking-tight">SceneFlow</h2>
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
              프롬프트에서 장면까지 자연스럽게 이어지는 비디오 제작 흐름을 시작해보세요.
            </p>
          </div>

          {/* Form */}
          <form className="space-y-5" onSubmit={handleSignup}>
            {/* Name */}
            <div className="space-y-2">
              <label className="text-sm font-semibold block px-1">이름</label>
              <input
                className="w-full h-14 px-5 rounded-xl border border-[#dde7f1] bg-white/50 focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder:text-warm-muted/50"
                placeholder="성함을 입력하세요"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label className="text-sm font-semibold block px-1">이메일</label>
              <input
                className="w-full h-14 px-5 rounded-xl border border-[#dde7f1] bg-white/50 focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder:text-warm-muted/50"
                placeholder="example@email.com"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label className="text-sm font-semibold block px-1">비밀번호</label>
              <div className="relative">
                <input
                  className="w-full h-14 px-5 rounded-xl border border-[#dde7f1] bg-white/50 focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder:text-warm-muted/50"
                  placeholder="비밀번호를 입력하세요"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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
                  className="w-full h-14 px-5 rounded-xl border border-[#dde7f1] bg-white/50 focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder:text-warm-muted/50"
                  placeholder="비밀번호를 다시 입력하세요"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
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
                className="w-5 h-5 rounded border-[#dde7f1] text-primary focus:ring-primary bg-white cursor-pointer"
                id="terms"
                type="checkbox"
              />
              <label className="text-sm text-slate-600 cursor-pointer select-none" htmlFor="terms">
                <span className="underline decoration-primary/30">이용 약관</span> 및{' '}
                <span className="underline decoration-primary/30">개인정보 처리방침</span>에 동의합니다.
              </label>
            </div>

            {/* Submit */}
            <button
              disabled={isLoading}
              className="w-full h-14 bg-primary hover:opacity-90 text-white font-bold rounded-xl text-lg transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isLoading ? '가입 중...' : '가입하기'}
              {!isLoading && <span className="material-symbols-outlined">arrow_forward</span>}
            </button>
          </form>

          {/* Divider */}
          <div className="relative py-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#dde7f1]" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-[#f8fbff] px-4 text-warm-muted">또는 간편 로그인</span>
            </div>
          </div>

          {/* Google Login */}
          <div className="w-full flex justify-center">
            {isLoading ? (
              <div className="w-full flex items-center justify-center h-11 rounded-xl border border-[#dde7f1] bg-white/40">
                <span className="text-sm text-warm-muted">로그인 중...</span>
              </div>
            ) : (
              <GoogleLogin
                onSuccess={handleGoogleLoginSuccess}
                onError={() => alert('구글 로그인에 실패했습니다.')}
                size="large"
                width="440"
                theme="outline"
                shape="rectangular"
                text="signup_with"
                logo_alignment="left"
              />
            )}
          </div>

          <p className="text-warm-muted text-base text-center">
            이미 계정이 있으신가요? <Link className="text-primary font-bold hover:underline" to="/login">로그인</Link>
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-8 px-6 lg:px-20 text-center border-t border-[#dde7f1]/50">
        <p className="text-xs text-warm-muted/60">
          © 2026 SceneFlow. All rights reserved.
        </p>
      </footer>
    </div>
  )
}
