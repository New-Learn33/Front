import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { allVideos, formatCount } from '../data/videos'
import aiVidLogo from '@/assets/AI_vid_logo.png'
import { resolveApiUrl } from '@/config/env'

// 정렬 필터
const sortFilters = [
  { label: '인기순', icon: 'trending_up' },
  { label: '최신순', icon: 'schedule' },
]

const PAGE_SIZE = 8

// 좋아요 기준 TOP 5 랭킹
const topVideos = [...allVideos].sort((a, b) => b.likes - a.likes).slice(0, 5)

export default function HomePage() {
  const { user, isLoggedIn, logout } = useAuth()
  const [activeSort, setActiveSort] = useState(0)
  const [searchQuery, setSearchQuery] = useState('')
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)

  // 정렬 + 검색 필터링
  const filteredVideos = useMemo(() => {
    let result = [...allVideos]

    // 검색
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      result = result.filter(
        (v) => v.title.toLowerCase().includes(q) || v.creator.toLowerCase().includes(q)
      )
    }

    // 정렬
    if (activeSort === 0) {
      result.sort((a, b) => b.likes - a.likes) // 인기순
    } else {
      result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()) // 최신순
    }

    return result
  }, [activeSort, searchQuery])

  const visibleVideos = filteredVideos.slice(0, visibleCount)
  const hasMore = visibleCount < filteredVideos.length

  return (
    <div className="bg-[#f2ece1] font-display text-slate-900 antialiased min-h-screen flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-[#e5ddd3]/50 bg-[#f2ece1]/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 lg:px-20 h-20 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-3">
              <img src={aiVidLogo} alt="AI Video Studio 로고" className="size-8 rounded-lg bg-primary p-1 object-contain" />
              <h2 className="text-lg font-bold tracking-tight text-[#1a1a1a]">AI 비디오</h2>
            </Link>
            <nav className="hidden md:flex items-center gap-6">
              <Link className="text-sm font-semibold text-primary" to="/">홈</Link>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            {isLoggedIn ? (
              <>
                <Link to="/studio" className="text-sm font-medium text-slate-600 hover:text-primary transition-colors">스튜디오</Link>
                <div className="flex items-center gap-3">
                  {user?.profile_image_url ? (
                    <img src={resolveApiUrl(user.profile_image_url)} alt="프로필" className="size-8 rounded-full object-cover" />
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
                <Link to="/signup" className="bg-primary hover:bg-[#b05d3f] text-white text-sm font-bold px-5 py-2 rounded-lg transition-all">시작하기</Link>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full px-6 lg:px-20 py-10">
        {/* Hero */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="space-y-2">
            <span className="text-primary font-bold text-sm tracking-widest uppercase">Community Showcase</span>
            <h2 className="text-4xl md:text-5xl font-black text-[#2d2926] tracking-tight">커뮤니티 쇼케이스</h2>
            <p className="text-[#5e5452] text-lg max-w-xl">전 세계 크리에이터들이 AI로 창조한 마법 같은 순간들을 감상해보세요.</p>
          </div>
          {isLoggedIn && (
            <Link to="/studio/create" className="flex items-center gap-2 bg-primary/10 text-primary hover:bg-primary/20 px-6 py-3 rounded-xl font-bold transition-all border border-primary/20">
              <span className="material-symbols-outlined">add</span>
              새 영상 만들기
            </Link>
          )}
        </div>

        {/* Ranking */}
        <div className="mb-14">
          <div className="flex items-center gap-3 mb-6">
            <span className="material-symbols-outlined text-2xl text-amber-500">emoji_events</span>
            <h3 className="text-2xl font-black text-[#2d2926] tracking-tight">인기 랭킹 TOP 5</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {topVideos.map((video, index) => (
              <Link
                key={video.id}
                to={`/video/${video.id}`}
                className="group relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-[#eee6d8]"
              >
                {/* 썸네일 */}
                <div className="relative aspect-[3/4] w-full overflow-hidden">
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                    style={{ backgroundImage: `url("${video.image}")` }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  {/* 순위 뱃지 */}
                  <div className={`absolute top-3 left-3 size-9 rounded-full flex items-center justify-center font-black text-sm shadow-lg ${
                    index === 0 ? 'bg-amber-400 text-amber-900' :
                    index === 1 ? 'bg-slate-300 text-slate-700' :
                    index === 2 ? 'bg-amber-600 text-amber-100' :
                    'bg-white/90 text-[#2d2926] rank-badge-light'
                  }`}>
                    {index + 1}
                  </div>
                  {/* 하단 정보 */}
                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <h4 className="font-bold text-sm truncate mb-1">{video.title}</h4>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <div className="size-5 rounded-full overflow-hidden">
                          <img className="w-full h-full object-cover" src={video.avatar} alt={video.creator} />
                        </div>
                        <span className="text-xs text-white/80">{video.creator}</span>
                      </div>
                      <span className="flex items-center gap-1 text-xs text-white/80">
                        <span className="material-symbols-outlined text-xs text-red-400">favorite</span>
                        {formatCount(video.likes)}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Filters + Search */}
        <div className="flex flex-col gap-6 mb-10">
          <div className="flex items-center gap-3 overflow-x-auto pb-2 no-scrollbar">
            {sortFilters.map((filter, i) => (
              <button
                key={filter.label}
                onClick={() => { setActiveSort(i); setVisibleCount(PAGE_SIZE) }}
                className={`flex items-center gap-2 px-5 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                  activeSort === i
                    ? 'bg-primary text-white'
                    : 'bg-white border border-[#e5ddd3] hover:border-primary'
                }`}
              >
                <span className="material-symbols-outlined text-sm">{filter.icon}</span>
                {filter.label}
              </button>
            ))}
          </div>
          <div className="relative w-full">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">search</span>
            <input
              className="w-full pl-12 pr-4 py-4 bg-white border border-[#e5ddd3] rounded-2xl text-base focus:ring-2 focus:ring-primary/20 focus:border-primary shadow-sm outline-none transition-all"
              placeholder="비디오 제목이나 크리에이터 검색..."
              type="text"
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setVisibleCount(PAGE_SIZE) }}
            />
          </div>
        </div>

        {/* Video Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {visibleVideos.map((video) => (
            <Link
              to={`/video/${video.id}`}
              key={video.id}
              className="group relative flex flex-col bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-[#eee6d8] cursor-pointer"
            >
              <div className="relative aspect-[9/16] w-full overflow-hidden">
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                  style={{ backgroundImage: `url("${video.image}")` }}
                />
                <div className="absolute inset-0 video-card-gradient opacity-60" />
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white">
                  <span className="text-xs bg-black/40 backdrop-blur-md px-2 py-1 rounded">{video.duration}</span>
                  <span className="material-symbols-outlined text-lg opacity-0 group-hover:opacity-100 transition-opacity">play_arrow</span>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-bold text-[#2d2926] mb-2 truncate">{video.title}</h3>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="size-6 rounded-full overflow-hidden">
                      <img className="w-full h-full object-cover" src={video.avatar} alt={video.creator} />
                    </div>
                    <span className="text-xs font-medium text-[#5e5452]">{video.creator}</span>
                  </div>
                  <div className="flex items-center gap-3 text-[#5e5452]">
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-sm">favorite</span>
                      <span className="text-xs">{formatCount(video.likes)}</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-sm">chat_bubble</span>
                      <span className="text-xs">{formatCount(video.comments)}</span>
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Empty State */}
        {visibleVideos.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <span className="material-symbols-outlined text-5xl text-slate-300 mb-4">search_off</span>
            <p className="text-lg font-bold text-slate-400">검색 결과가 없습니다</p>
            <p className="text-sm text-slate-400 mt-1">다른 키워드로 검색해보세요.</p>
          </div>
        )}

        {/* Load More */}
        {hasMore && (
          <div className="flex justify-center mt-16">
            <button
              onClick={() => setVisibleCount((prev) => prev + PAGE_SIZE)}
              className="px-8 py-3 bg-white border border-[#e5ddd3] rounded-xl font-bold text-[#5e5452] hover:border-primary hover:text-primary transition-all shadow-sm"
            >
              더 많은 비디오 불러오기
            </button>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-20 border-t border-[#e5ddd3]/50 bg-[#f9f6f0]/30 px-6 lg:px-20 py-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-3">
            <img src={aiVidLogo} alt="AI Video Studio 로고" className="size-8 rounded-lg bg-primary p-1 object-contain" />
            <span className="font-bold text-[#2d2926]">AI 비디오</span>
          </div>
          <div className="flex gap-8 text-sm text-[#5e5452]">
            <Link className="hover:text-primary transition-colors" to="/terms">이용약관</Link>
            <Link className="hover:text-primary transition-colors" to="/privacy">개인정보처리방침</Link>
            <Link className="hover:text-primary transition-colors" to="/support">고객센터</Link>
          </div>
          <p className="text-sm text-slate-400">© 2024 AI Video Studio. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
