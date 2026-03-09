import { Link } from 'react-router-dom'
import { useScrollReveal } from '../hooks/useScrollReveal'
import { useAuth } from '../hooks/useAuth'

const showcaseItems = [
  {
    src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA0axGwduWJFuBD4VFEfbR7s5fFT1VSI49rZfr56GGk7CSqc-e2ZI9VsnQWqEjXgbygd-gr6zCwPry_sJdqOe0dOQ2sXt3H0BWpoV3Hw8YKum32NbHare4s8Q3eH4EuowF5tTw7og8AIOXkA1Zxe8IOeQ0l0qxLgfCViJC2XSwqk6JAmWE35Uqry9PVXY5cwuBpikPszU-v1CJriSgG8QKjQOUW9HD_LPa_9ZKQUTGV9sfahnNznZHJ6QJUIAPIbsH_M21J_eeo_kE',
    label: '결과 추적 비주얼',
  },
  {
    src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBfVYyP6diotm5_HohdK2PInE1iZEy2bNpSF7bJ0cu7-ZMCXZxhCOSxFsSd0t7D4PjVFiDgHVm9sWtS9SveHETBdFk1mM-2VLm1rxkhbTtEW__KwmDkSUEumLjk5ZraHRmq8q9vhYwGlwOlLuFrEhqPidbNHwZHDsqbNzL1C_-2kzXx53781HGzSBeJAdH3RTE3IIwSTjwrqs9MCAKmb4U4Cgeq44uTJZh6c3ZOIDCYW7WR2-gwKLq_04uUjo_p9HVazy2hKjG8bhY',
    label: '패션 브랜드',
  },
  {
    src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBZnVxR6zdh26SiVUkrSUYlI9YlGDruDCMKtbKftXQWAG1OfTpyOEySjB9-Qv0r5tyicE-CAyx5WNh4AnA-YOMLZIiPFq9totMF7QPiB0CZ_2z0BEOQ-f-H6ALlC-Fy0oNKJA3Tcg2sRJW7dAOQCmgs4bfNeX8OcAxYqeIIkxQr9JItjTdPtJ6ejDDa0hIi5j1NlBS6mG54K_OPS8gVm-TaLJ8FPZubW8ZyeFypd6nXNiNRRtLyycpDKplyCx_ORgpl99rFi52QuN4',
    label: '예술적인 릴스',
  },
  {
    src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBUbUMQ7W_wmlD51lAhDW0qzsTKZrAxt3VkgI0vHs5vXf6UXU1e_JGHUsqG2L--C1S03ZsBf0HG5-CPJu8SD4oE_b7GFGWILDxu6r_Zcpo8K5DHUx8nMQ28_Olt4CQyn-eMKof-CgG6GLuzxe-QH14ZmfS9mGlgXunGOwjkGzB6rgoNcv6lL77did18E8ruTnYMe8XlcuK9CHd5yBLBV1vLfNzVrw_GcCQ2NAI3zkR1mQqKOknY1-_n5faggq-JoEk0vrkgX2pgSP4',
    label: '자연의 미학',
  },
]

export default function HomePage() {
  const { user, isLoggedIn, logout } = useAuth()
  const heroRef = useScrollReveal<HTMLDivElement>({ threshold: 0.1 })
  const featuresHeadingRef = useScrollReveal<HTMLDivElement>()
  const featuresGridRef = useScrollReveal<HTMLDivElement>()
  const showcaseHeadingRef = useScrollReveal<HTMLDivElement>()
  const showcaseGridRef = useScrollReveal<HTMLDivElement>()
  const ctaRef = useScrollReveal<HTMLDivElement>()
  const footerRef = useScrollReveal<HTMLElement>()

  return (
    <div className="bg-[#f2ece1] font-display text-slate-900 antialiased">
      {/* Top Navigation */}
      <header className="fixed top-0 w-full z-50 bg-[#f2ece1]/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-3">
              <div className="size-8 bg-primary rounded-md flex items-center justify-center text-white">
                <span className="material-symbols-outlined text-xl">movie_filter</span>
              </div>
              <h2 className="text-lg font-bold tracking-tight text-[#1a1a1a]">AI 비디오</h2>
            </Link>
            <nav className="hidden md:flex items-center gap-6">
              <Link className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors" to="/">홈</Link>
              <Link className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors" to="/showcase">쇼케이스</Link>
              <Link className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors" to="#">요금제</Link>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            {isLoggedIn ? (
              <>
                <Link to="/studio" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">스튜디오</Link>
                <div className="flex items-center gap-3">
                  {user?.profile_image_url ? (
                    <img src={user.profile_image_url} alt="프로필" className="size-8 rounded-full object-cover" />
                  ) : (
                    <div className="size-8 rounded-full bg-[#c46e4d] flex items-center justify-center text-white text-xs font-bold">
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
                <Link to="/signup" className="bg-[#c46e4d] hover:bg-[#b05d3f] text-white text-sm font-bold px-5 py-2 rounded-lg transition-all">시작하기</Link>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="pt-20">
        {/* Hero Section */}
        <section className="relative pt-32 pb-20 flex flex-col items-center justify-center px-6">
          <div ref={heroRef} className="reveal-up relative z-10 max-w-4xl w-full text-center space-y-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ede4d5] border border-[#d9cdba] text-[#c46e4d] text-[10px] font-bold uppercase tracking-wider">
              <span>★ NEXT-GEN AI GENERATION</span>
            </div>
            <h1 className="text-6xl md:text-[80px] font-bold leading-[1.05] tracking-tight text-[#2d2926]">
              아이디어를 단 몇 초만에<br/>
              <span className="text-[#c46e4d]">숏폼 영상</span>으로
            </h1>
            <p className="text-lg text-[#5e5452] max-w-2xl mx-auto font-medium">
              이미 나를 시용하여 창의적인 아이디어를 소유할 수 있을 정도로 즉시 변환<br/>하세요.
            </p>
            <div className="max-w-2xl mx-auto w-full mt-10">
              <div className="bg-white p-1.5 rounded-2xl flex items-center gap-2 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.05)] border border-[#e8dfcf]">
                <div className="flex-1 flex items-center px-4">
                  <span className="material-symbols-outlined text-slate-300 mr-2">search</span>
                  <input
                    className="w-full bg-transparent border-none focus:ring-0 text-slate-900 placeholder:text-slate-300 py-3 text-sm outline-none"
                    placeholder="비행 자동차와 네온사인이 가득한 미래 도시, 시네마틱한 조명"
                    type="text"
                  />
                </div>
                <Link to="/studio/create" className="bg-[#c46e4d] hover:bg-[#b05d3f] text-white font-bold px-6 py-3 rounded-xl flex items-center gap-2 transition-all text-sm">
                  영상 생성하기 <span className="material-symbols-outlined text-sm">bolt</span>
                </Link>
              </div>
              <p className="mt-4 text-xs text-slate-400">최근 "공상과학적 사운드 효과 및 시각적인 효과"를 입력해보세요.</p>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-24 px-6 max-w-7xl mx-auto">
          <div ref={featuresHeadingRef} className="reveal-up text-center mb-16 space-y-4">
            <h2 className="text-4xl font-bold tracking-tight text-[#2d2926]">콘텐츠 제작의 미래</h2>
            <p className="text-[#5e5452] font-medium">입력하신 텍스트를 통해 비주얼과 스토리를 완벽하게 구성하는 새로운 방법입니다.</p>
          </div>
          <div ref={featuresGridRef} className="reveal-stagger grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-[#f9f6f0] p-8 rounded-[2rem] border border-[#eee6d8] transition-all">
              <div className="size-12 rounded-xl bg-[#c46e4d]/10 flex items-center justify-center text-[#c46e4d] mb-6">
                <span className="material-symbols-outlined">schema</span>
              </div>
              <h3 className="text-xl font-bold mb-3 text-[#2d2926]">AI 스토리보딩</h3>
              <p className="text-[#5e5452] text-sm leading-relaxed">간단한 키워드만으로 상세한 플롯과 구조화된 스토리보드를 자동 생성합니다.</p>
            </div>
            <div className="bg-[#f9f6f0] p-8 rounded-[2rem] border border-[#eee6d8] transition-all">
              <div className="size-12 rounded-xl bg-[#c46e4d]/10 flex items-center justify-center text-[#c46e4d] mb-6">
                <span className="material-symbols-outlined">auto_fix_high</span>
              </div>
              <h3 className="text-xl font-bold mb-3 text-[#2d2926]">일관된 비주얼</h3>
              <p className="text-[#5e5452] text-sm leading-relaxed">전체 영상에 걸쳐 캐릭터와 스타일을 유지하며 고퀄리티의 이미지를 생성합니다.</p>
            </div>
            <div className="bg-[#f9f6f0] p-8 rounded-[2rem] border border-[#eee6d8] transition-all">
              <div className="size-12 rounded-xl bg-[#c46e4d]/10 flex items-center justify-center text-[#c46e4d] mb-6">
                <span className="material-symbols-outlined">speed</span>
              </div>
              <h3 className="text-xl font-bold mb-3 text-[#2d2926]">5초의 마법</h3>
              <p className="text-[#5e5452] text-sm leading-relaxed">소셜 미디어 최적화 규격에 맞춘 숏폼 콘텐츠를 즉시 제작할 수 있습니다.</p>
            </div>
          </div>
        </section>

        {/* Showcase Section */}
        <section className="py-24 px-6">
          <div className="max-w-7xl mx-auto">
            <div ref={showcaseHeadingRef} className="reveal-up flex items-end justify-between mb-12">
              <div>
                <h2 className="text-3xl font-bold tracking-tight text-[#2d2926]">가능성을 탐험하세요</h2>
                <p className="text-[#5e5452] mt-2 font-medium">다양한 주제의 고유 비주얼 갤러리</p>
              </div>
              <button className="text-[#c46e4d] text-xs font-bold flex items-center gap-1">
                갤러리 보기 <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </button>
            </div>
            <div ref={showcaseGridRef} className="reveal-stagger grid grid-cols-2 md:grid-cols-4 gap-6">
              {showcaseItems.map((item) => (
                <div key={item.label} className="space-y-4">
                  <div className="aspect-[3/4] rounded-2xl overflow-hidden shadow-lg">
                    <img className="w-full h-full object-cover" src={item.src} alt={item.label} />
                  </div>
                  <h4 className="text-xs font-bold text-[#2d2926]">{item.label}</h4>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 px-6">
          <div ref={ctaRef} className="reveal-scale max-w-5xl mx-auto bg-[#f9f6f0] rounded-[2.5rem] p-16 md:p-24 text-center border border-[#eee6d8]">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-[#2d2926] mb-8">
              워크플로우를 혁신할 준비가 되셨나요?
            </h2>
            <p className="text-[#5e5452] mb-12 font-medium">내가 입력하신 내용을 고려한 고퀄리티의 시각적인 결과를 얻으세요.</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              {isLoggedIn ? (
                <Link to="/studio/create" className="bg-[#c46e4d] hover:bg-[#b05d3f] text-white font-bold px-10 py-4 rounded-xl transition-all shadow-lg shadow-[#c46e4d]/20 text-sm">
                  영상 만들러 가기
                </Link>
              ) : (
                <Link to="/signup" className="bg-[#c46e4d] hover:bg-[#b05d3f] text-white font-bold px-10 py-4 rounded-xl transition-all shadow-lg shadow-[#c46e4d]/20 text-sm">
                  무료로 시작하기
                </Link>
              )}
              <button className="bg-white border border-[#d9cdba] text-[#5e5452] px-10 py-4 rounded-xl text-sm font-bold transition-all hover:bg-slate-50">
                요금제 보기
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer ref={footerRef} className="reveal-up py-12 px-6 border-t border-[#d9cdba]/30">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8 text-[11px] font-bold text-slate-500">
          <div className="flex items-center gap-2">
            <div className="size-6 bg-[#c46e4d] rounded-md flex items-center justify-center text-white">
              <span className="material-symbols-outlined text-sm">movie_filter</span>
            </div>
            <span className="text-[#2d2926] tracking-tight">AI 비디오</span>
          </div>
          <div className="flex items-center gap-10">
            <a className="hover:text-[#c46e4d] transition-colors" href="#">개인정보처리방침</a>
            <a className="hover:text-[#c46e4d] transition-colors" href="#">이용약관</a>
            <a className="hover:text-[#c46e4d] transition-colors" href="#">고객 지원</a>
          </div>
          <div className="flex items-center gap-6">
            <span className="material-symbols-outlined cursor-pointer hover:text-[#c46e4d] text-lg">share</span>
            <span className="material-symbols-outlined cursor-pointer hover:text-[#c46e4d] text-lg">alternate_email</span>
          </div>
        </div>
        <div className="text-center mt-12 text-[10px] text-slate-400 font-medium tracking-wide">
          © 2024. AI 비디오. ALL RIGHTS RESERVED.
        </div>
      </footer>
    </div>
  )
}
