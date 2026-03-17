import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { GoogleLogin } from '@react-oauth/google'
import { authApi } from '@/api/auth'
import aiVidLogo from '@/assets/AI_vid_logo.png'

export default function LoginPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // 이메일 로그인 핸들러
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email.trim() || !password) {
      alert('이메일과 비밀번호를 입력해주세요.')
      return
    }

    try {
      setIsLoading(true)
      const res = await authApi.login({ email, password })
      const { access_token, user } = res.data.data

      localStorage.setItem('access_token', access_token)
      localStorage.setItem('user', JSON.stringify(user))
      navigate('/studio')
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } }
      const msg = error.response?.data?.message || '로그인 중 오류가 발생했습니다.'
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
    <div className="bg-[#f2ece1] min-h-screen flex flex-col font-display text-slate-900">
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-12">
        <div className="w-full max-w-[440px] space-y-8">
          {/* Logo */}
          <div className="flex flex-col items-center gap-3">
            <Link to="/" className="flex items-center justify-center">
              <img src={aiVidLogo} alt="SceneFlow 로고" className="size-11 rounded-lg bg-primary p-1.5 object-contain" />
            </Link>
            <Link to="/" className="text-xl font-bold tracking-tight">SceneFlow</Link>
          </div>

          {/* Header */}
          <div className="text-center space-y-2">
            <h1 className="text-4xl font-bold tracking-tight">로그인</h1>
            <p className="text-warm-muted text-base">장면 중심으로 만드는 생성형 비디오 워크스페이스에 로그인하세요.</p>
          </div>

          {/* Form */}
          <form className="space-y-5" onSubmit={handleLogin}>
            {/* Email */}
            <div className="space-y-2">
              <label className="text-sm font-semibold block px-1">이메일</label>
              <input
                className="w-full h-14 px-5 rounded-xl border border-[#e5ddd3] bg-white/50 focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder:text-warm-muted/50"
                placeholder="이메일을 입력하세요"
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
                  className="w-full h-14 px-5 rounded-xl border border-[#e5ddd3] bg-white/50 focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder:text-warm-muted/50"
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
            <button
              disabled={isLoading}
              className="w-full h-14 bg-primary hover:opacity-90 text-white font-bold rounded-xl text-lg transition-all shadow-md disabled:opacity-50"
            >
              {isLoading ? '로그인 중...' : '로그인'}
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
          <div className="w-full flex justify-center">
            {isLoading ? (
              <div className="w-full flex items-center justify-center h-11 rounded-xl border border-[#e5ddd3] bg-white/40">
                <span className="text-sm text-warm-muted">로그인 중...</span>
              </div>
            ) : (
              <GoogleLogin
                onSuccess={handleGoogleLoginSuccess}
                onError={() => alert('구글 로그인에 실패했습니다.')}
                size="large"
                width="400"
                theme="outline"
                shape="rectangular"
                text="signin_with"
                logo_alignment="left"
              />
            )}
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
