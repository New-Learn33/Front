import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { videosApi, type VideoListItem } from '../api/videos'
import { formatCount } from '../data/videos'
import { resolveApiUrl } from '../config/env'
import aiVidLogo from '@/assets/AI_vid_logo.png'

const sortFilters = [
  { label: '인기순', value: 'popular' as const, icon: 'trending_up' },
  { label: '최신순', value: 'latest' as const, icon: 'schedule' },
]

const PAGE_SIZE = 8

const categoryLabels: Record<number, string> = {
  1: '애니메이션',
  2: '히어로',
  3: '게임',
  4: '판타지',
}

export default function HomePage() {
  const { user, isLoggedIn, logout } = useAuth()
  const [activeSort, setActiveSort] = useState<'popular' | 'latest'>('popular')
  const [searchQuery, setSearchQuery] = useState('')
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)
  const [videos, setVideos] = useState<VideoListItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false

    async function fetchVideos() {
      setLoading(true)
      setError('')

      try {
        const res = searchQuery.trim()
          ? await videosApi.search(searchQuery.trim())
          : await videosApi.getAll(activeSort)

        if (!cancelled && res.data.success) {
          setVideos(res.data.data.videos)
        }
      } catch (err) {
        console.error('홈 영상 조회 실패:', err)
        if (!cancelled) {
          setVideos([])
          setError('영상을 불러오지 못했습니다.')
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    fetchVideos()
    return () => {
      cancelled = true
    }
  }, [activeSort, searchQuery])

  const topVideos = useMemo(() => videos.slice(0, 4), [videos])
  const heroVideo = topVideos[0]
  const visibleVideos = useMemo(() => videos.slice(0, visibleCount), [videos, visibleCount])
  const hasMore = visibleCount < videos.length

  const stats = useMemo(() => {
    const likes = videos.reduce((sum, video) => sum + video.like_count, 0)
    const comments = videos.reduce((sum, video) => sum + video.comment_count, 0)

    return {
      videos: videos.length,
      likes: formatCount(likes),
      comments: formatCount(comments),
    }
  }, [videos])

  return (
    <div className="min-h-screen bg-[#f2ece1] text-slate-900 dark:bg-[#09111f] font-display dark:text-slate-100 antialiased">
      <div className="absolute inset-x-0 top-0 -z-10 h-[420px] bg-[radial-gradient(circle_at_top_left,_rgba(201,152,102,0.16),_transparent_40%),radial-gradient(circle_at_top_right,_rgba(52,87,246,0.06),_transparent_35%),linear-gradient(180deg,_#f8f3ea_0%,_#f2ece1_58%,_#f2ece1_100%)] dark:hidden" />
      <div className="absolute inset-x-0 top-0 -z-10 hidden h-[420px] bg-[radial-gradient(circle_at_top_left,_rgba(52,87,246,0.20),_transparent_38%),radial-gradient(circle_at_top_right,_rgba(125,211,252,0.08),_transparent_30%),linear-gradient(180deg,_#0d1730_0%,_#09111f_58%,_#09111f_100%)] dark:block" />

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
              <Link className="text-sm font-semibold text-primary" to="/">탐색</Link>
              <Link className="text-sm font-medium text-slate-400 transition-colors hover:text-primary" to="/studio">스튜디오</Link>
            </nav>
          </div>

          <div className="flex items-center gap-4">
            {isLoggedIn ? (
              <>
                <Link to="/studio" className="text-sm font-medium text-slate-400 transition-colors hover:text-primary">워크스페이스</Link>
                <div className="flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-2 py-1 shadow-sm shadow-black/20">
                  {user?.profile_image_url ? (
                    <img src={user.profile_image_url} alt="프로필" className="size-8 rounded-full object-cover" />
                  ) : (
                    <div className="flex size-8 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">
                      {user?.name?.charAt(0) || '?'}
                    </div>
                  )}
                  <span className="hidden sm:block text-sm font-medium text-slate-200">{user?.nickname || user?.name}</span>
                  <button onClick={logout} className="px-3 text-sm font-medium text-slate-400 transition-colors hover:text-slate-200">로그아웃</button>
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="hidden text-sm font-medium text-slate-400 sm:block">로그인</Link>
                <Link to="/signup" className="rounded-full bg-primary px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-primary/20 transition-all hover:bg-[#58717c]">
                  시작하기
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-7xl flex-col gap-10 px-6 pb-16 pt-10 lg:px-20">
        <section className="grid gap-6 lg:grid-cols-[1.25fr_0.75fr]">
          <div className="overflow-hidden rounded-[32px] border border-[#243454] dark:border-white/10 bg-[#081225] px-7 py-8 text-white shadow-[0_30px_80px_-30px_rgba(15,23,42,0.55)] sm:px-9 sm:py-10">
            <div className="grid gap-6 xl:grid-cols-[1fr_340px]">
              <div className="space-y-6">
                <div className="space-y-3">
                  <span className="inline-flex rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-[11px] font-semibold tracking-[0.14em] text-primary">
                    쇼케이스
                  </span>
                  <h1 className="max-w-[520px] break-keep text-[36px] font-black leading-[1.08] tracking-tight sm:text-[44px] xl:text-[52px]">
                    영상으로
                    <br />
                    바로 둘러보는
                    <span className="block text-primary">SceneFlow 쇼케이스</span>
                  </h1>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                  <Link
                    to={isLoggedIn ? '/studio/create' : '/signup'}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-bold text-white transition-transform hover:-translate-y-0.5 hover:bg-[#58717c] sm:w-auto"
                  >
                    <span className="material-symbols-outlined text-lg">auto_awesome</span>
                    영상 생성하기
                  </Link>
                  <a
                    href="#showcase"
                    className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-white/20 bg-white/5 px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-white/10 sm:w-auto"
                  >
                    <span className="material-symbols-outlined text-lg">south</span>
                    쇼케이스 보기
                  </a>
                </div>

                <div className="grid gap-3 sm:grid-cols-3">
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <p className="text-xs tracking-[0.12em] text-slate-400">영상</p>
                    <p className="mt-2 text-xl font-bold">{stats.videos}</p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <p className="text-xs tracking-[0.12em] text-slate-400">좋아요</p>
                    <p className="mt-2 text-xl font-bold">{stats.likes}</p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <p className="text-xs tracking-[0.12em] text-slate-400">댓글</p>
                    <p className="mt-2 text-xl font-bold">{stats.comments}</p>
                  </div>
                </div>
              </div>

              <div className="overflow-hidden rounded-[28px] border border-white/10 bg-[#0f1c38]">
                {heroVideo ? (
                  <div className="relative h-full min-h-[360px] p-5">
                    <div
                      className="absolute inset-0 bg-cover bg-center opacity-80"
                      style={{ backgroundImage: `url("${resolveApiUrl(heroVideo.thumbnail_url)}")` }}
                    />
                    <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,18,37,0.12)_0%,rgba(8,18,37,0.88)_100%)]" />
                    <div className="relative flex h-full flex-col justify-end space-y-3">
                      <span className="w-fit rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary backdrop-blur-md">
                        대표 영상
                      </span>
                      <div>
                        <h2 className="text-2xl font-black tracking-tight">{heroVideo.title}</h2>
                        <p className="mt-2 text-sm text-white/68">{categoryLabels[heroVideo.category_id] || '비디오'}</p>
                      </div>
                      <div className="flex gap-4 text-sm text-slate-300">
                        <span>좋아요 {formatCount(heroVideo.like_count)}</span>
                        <span>댓글 {formatCount(heroVideo.comment_count)}</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex min-h-[360px] items-center justify-center text-sm text-white/55">
                    {loading ? '불러오는 중...' : '표시할 영상이 없습니다'}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="rounded-[28px] border border-white/10 bg-[#101a30] p-6 shadow-[0_24px_60px_-30px_rgba(0,0,0,0.45)]">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold tracking-[0.14em] text-primary">인기 순위</p>
                <h3 className="mt-2 text-2xl font-black tracking-tight text-white">인기 영상</h3>
              </div>
              <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">실시간 목록</span>
            </div>
            <div className="mt-5 space-y-3">
              {topVideos.map((video, index) => (
                <Link
                  key={video.id}
                  to={`/video/${video.id}`}
                  state={{ video }}
                  className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-3 py-3 transition-all hover:border-primary/20 hover:bg-white/[0.05]"
                >
                  <div className="flex size-10 flex-shrink-0 items-center justify-center rounded-2xl bg-primary/12 text-sm font-black text-primary">
                    {index + 1}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-bold text-white">{video.title}</p>
                    <p className="mt-1 text-xs text-slate-400">{categoryLabels[video.category_id] || '비디오'}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-white">{formatCount(video.like_count)}</p>
                    <p className="text-xs text-slate-500">좋아요</p>
                  </div>
                </Link>
              ))}
              {!loading && topVideos.length === 0 && (
                <div className="rounded-2xl border border-dashed border-white/10 px-4 py-8 text-center text-sm text-slate-500">
                  표시할 영상이 없습니다
                </div>
              )}
            </div>
          </div>
        </section>

        <section id="showcase" className="space-y-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h2 className="text-3xl font-black tracking-tight text-white">쇼케이스</h2>
              <p className="mt-2 text-sm text-slate-400">실제 업로드된 영상만 보여줍니다.</p>
            </div>
            {isLoggedIn && (
              <Link
                to="/studio/create"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-primary/20 bg-white/5 px-6 py-3 text-sm font-bold text-primary shadow-sm transition-colors hover:bg-primary/10"
              >
                <span className="material-symbols-outlined">add</span>
                새 영상 만들기
              </Link>
            )}
          </div>

          <div className="grid gap-4 rounded-[28px] border border-white/10 bg-[#101a30] p-5 shadow-[0_24px_60px_-32px_rgba(0,0,0,0.45)] md:grid-cols-[auto_1fr] md:items-center md:p-6">
            <div className="flex items-center gap-3 overflow-x-auto pb-1 no-scrollbar">
              {sortFilters.map((filter) => (
                <button
                  key={filter.value}
                  onClick={() => {
                    setActiveSort(filter.value)
                    setVisibleCount(PAGE_SIZE)
                  }}
                  className={`inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium whitespace-nowrap transition-all ${
                    activeSort === filter.value
                      ? 'bg-primary text-white'
                      : 'border border-white/10 bg-white/[0.03] text-slate-300 hover:border-primary/25 hover:text-primary'
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
                className="w-full rounded-2xl border border-white/10 bg-white/[0.03] py-4 pl-12 pr-4 text-base text-white outline-none transition-all placeholder:text-slate-500 focus:border-primary focus:ring-2 focus:ring-primary/15"
                placeholder="영상 제목 검색"
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value)
                  setVisibleCount(PAGE_SIZE)
                }}
              />
            </div>
          </div>

          {error && (
            <div className="rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
              {error}
            </div>
          )}

          {loading ? (
            <div className="flex items-center justify-center rounded-[28px] border border-white/10 bg-[#101a30] px-6 py-20 text-sm text-slate-400">
              영상을 불러오는 중...
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
              {visibleVideos.map((video) => (
                <Link
                  key={video.id}
                  to={`/video/${video.id}`}
                  state={{ video }}
                  className="group overflow-hidden rounded-[26px] border border-white/10 bg-[#101a30] shadow-[0_24px_55px_-34px_rgba(0,0,0,0.45)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_30px_70px_-32px_rgba(37,99,235,0.22)]"
                >
                  <div className="relative aspect-[9/16] overflow-hidden">
                    <div
                      className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                      style={{ backgroundImage: `url("${resolveApiUrl(video.thumbnail_url)}")` }}
                    />
                    <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(15,23,42,0.04)_0%,rgba(15,23,42,0.72)_100%)]" />
                    <div className="absolute left-4 right-4 top-4 flex items-center justify-between">
                      <span className="rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-semibold text-[#0f172a] backdrop-blur-md">
                        {categoryLabels[video.category_id] || '비디오'}
                      </span>
                    </div>
                    <div className="absolute bottom-4 left-4 right-4">
                      <h3 className="truncate text-lg font-bold tracking-tight text-white">{video.title}</h3>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 text-sm text-slate-400">
                    <span className="inline-flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-base text-primary">favorite</span>
                      {formatCount(video.like_count)}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-base">chat_bubble</span>
                      {formatCount(video.comment_count)}
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-primary">
                      상세
                      <span className="material-symbols-outlined text-base transition-transform group-hover:translate-x-1">arrow_forward</span>
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {!loading && visibleVideos.length === 0 && !error && (
            <div className="flex flex-col items-center justify-center rounded-[28px] border border-dashed border-white/10 bg-[#101a30] px-6 py-20 text-center">
              <span className="material-symbols-outlined mb-4 text-5xl text-slate-300">search_off</span>
              <p className="text-lg font-bold text-slate-300">검색 결과가 없습니다</p>
            </div>
          )}

          {!loading && hasMore && (
            <div className="flex justify-center">
              <button
                onClick={() => setVisibleCount((prev) => prev + PAGE_SIZE)}
                className="rounded-full border border-white/10 bg-white/[0.04] px-8 py-3 text-sm font-bold text-slate-200 shadow-sm transition-all hover:border-primary/25 hover:text-primary"
              >
                더 보기
              </button>
            </div>
          )}
        </section>
      </main>

      <footer className="border-t border-[#e5ddd3] bg-[#f9f6f0]/30 px-6 py-12 lg:px-20 dark:border-white/10 dark:bg-[#0d1729]">
        <div className="mx-auto flex max-w-7xl flex-col gap-8 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <img src={aiVidLogo} alt="SceneFlow 로고" className="size-8 rounded-xl bg-primary p-1.5 object-contain" />
            <div>
              <p className="font-bold text-[#2d2926] dark:text-white">SceneFlow</p>
              <p className="text-sm text-slate-400">AI 비디오 쇼케이스</p>
            </div>
          </div>
          <div className="flex gap-8 text-sm text-slate-400">
            <Link className="transition-colors hover:text-primary" to="/terms">이용약관</Link>
            <Link className="transition-colors hover:text-primary" to="/privacy">개인정보처리방침</Link>
            <Link className="transition-colors hover:text-primary" to="/support">고객센터</Link>
          </div>
          <p className="text-sm text-slate-400">© 2026 SceneFlow. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
