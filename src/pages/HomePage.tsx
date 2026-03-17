import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { allVideos, formatCount } from '../data/videos'
import aiVidLogo from '@/assets/AI_vid_logo.png'

const sortFilters = [
  { label: '인기순', icon: 'trending_up' },
  { label: '최신순', icon: 'schedule' },
]

const PAGE_SIZE = 8

const topVideos = [...allVideos].sort((a, b) => b.likes - a.likes).slice(0, 5)
const heroVideo = topVideos[0]

const curatedThemes = [
  {
    title: 'Cinematic Atmosphere',
    description: '빛, 안개, 입자감을 살린 영화 같은 숏폼 무드',
    icon: 'movie',
  },
  {
    title: 'Future Visuals',
    description: 'SF, 네온, 모션 그래픽 톤의 시각 실험',
    icon: 'neurology',
  },
  {
    title: 'Brand Story Clips',
    description: '브랜드 필름과 제품 티저에 맞는 장면 구성',
    icon: 'campaign',
  },
]

export default function HomePage() {
  const { user, isLoggedIn, logout } = useAuth()
  const [activeSort, setActiveSort] = useState(0)
  const [searchQuery, setSearchQuery] = useState('')
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)

  const filteredVideos = useMemo(() => {
    let result = [...allVideos]

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      result = result.filter(
        (v) => v.title.toLowerCase().includes(q) || v.creator.toLowerCase().includes(q)
      )
    }

    if (activeSort === 0) {
      result.sort((a, b) => b.likes - a.likes)
    } else {
      result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    }

    return result
  }, [activeSort, searchQuery])

  const visibleVideos = filteredVideos.slice(0, visibleCount)
  const hasMore = visibleCount < filteredVideos.length

  const stats = useMemo(() => {
    const likes = allVideos.reduce((sum, video) => sum + video.likes, 0)
    const comments = allVideos.reduce((sum, video) => sum + video.comments, 0)
    const creators = new Set(allVideos.map((video) => video.creator)).size

    return {
      videos: allVideos.length,
      likes: formatCount(likes),
      comments: formatCount(comments),
      creators,
    }
  }, [])

  return (
    <div className="min-h-screen bg-[#f4f6fb] font-display text-slate-900 antialiased">
      <div className="absolute inset-x-0 top-0 -z-10 h-[520px] bg-[radial-gradient(circle_at_top_left,_rgba(52,87,246,0.20),_transparent_40%),radial-gradient(circle_at_top_right,_rgba(125,211,252,0.18),_transparent_34%),linear-gradient(180deg,_#eef3ff_0%,_#f4f6fb_55%,_#f4f6fb_100%)]" />

      <header className="sticky top-0 z-50 border-b border-[#dbe3f5]/70 bg-[#f4f6fb]/80 backdrop-blur-xl">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 lg:px-20">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-3">
              <img src={aiVidLogo} alt="SceneFlow 로고" className="size-9 rounded-xl bg-primary p-1.5 object-contain shadow-lg shadow-primary/20" />
              <div>
                <h2 className="text-lg font-bold tracking-tight text-[#0f172a]">SceneFlow</h2>
                <p className="text-[11px] font-medium uppercase tracking-[0.24em] text-[#667085]">Generative Video Studio</p>
              </div>
            </Link>
            <nav className="hidden md:flex items-center gap-6">
              <Link className="text-sm font-semibold text-primary" to="/">탐색</Link>
              <Link className="text-sm font-medium text-slate-600 transition-colors hover:text-primary" to="/studio">스튜디오</Link>
            </nav>
          </div>

          <div className="flex items-center gap-4">
            {isLoggedIn ? (
              <>
                <Link to="/studio" className="text-sm font-medium text-slate-600 transition-colors hover:text-primary">워크스페이스</Link>
                <div className="flex items-center gap-3 rounded-full border border-white/80 bg-white/80 px-2 py-1 shadow-sm shadow-slate-200/60">
                  {user?.profile_image_url ? (
                    <img src={user.profile_image_url} alt="프로필" className="size-8 rounded-full object-cover" />
                  ) : (
                    <div className="flex size-8 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">
                      {user?.name?.charAt(0) || '?'}
                    </div>
                  )}
                  <span className="hidden sm:block text-sm font-medium text-slate-700">{user?.nickname || user?.name}</span>
                  <button onClick={logout} className="px-3 text-sm font-medium text-slate-500 transition-colors hover:text-slate-700">로그아웃</button>
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="hidden text-sm font-medium text-slate-600 sm:block">로그인</Link>
                <Link to="/signup" className="rounded-full bg-primary px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-primary/20 transition-all hover:bg-[#2647d8]">
                  시작하기
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-7xl flex-col gap-16 px-6 pb-16 pt-10 lg:px-20">
        <section className="grid gap-6 lg:grid-cols-[1.35fr_0.85fr]">
          <div className="overflow-hidden rounded-[32px] border border-white/80 bg-[#081225] px-7 py-8 text-white shadow-[0_30px_80px_-30px_rgba(15,23,42,0.55)] sm:px-9 sm:py-10">
            <div className="mb-8 flex flex-wrap items-center gap-3">
              <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-[#9ec5ff]">
                Prompt To Motion
              </span>
              <span className="text-sm text-white/60">컷에서 무드까지, 장면을 설계하는 생성형 비디오 플랫폼</span>
            </div>

            <div className="grid gap-8 xl:grid-cols-[1.15fr_0.85fr]">
              <div className="space-y-6">
                <div className="space-y-4">
                  <h1 className="max-w-3xl text-4xl font-black leading-tight tracking-tight sm:text-5xl">
                    SceneFlow로
                    <br />
                    아이디어를 바로
                    <span className="block text-[#8fd3ff]">영상 장면으로 전환하세요</span>
                  </h1>
                  <p className="max-w-2xl text-base leading-7 text-white/72 sm:text-lg">
                    프롬프트 한 줄, 레퍼런스 몇 장, 그리고 원하는 무드만 정하면 됩니다.
                    SceneFlow는 쇼츠, 광고 티저, 컨셉 필름에 어울리는 장면을 더 빠르게 시각화합니다.
                  </p>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row">
                  <Link
                    to={isLoggedIn ? '/studio/create' : '/signup'}
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3.5 text-sm font-bold text-[#0f172a] transition-transform hover:-translate-y-0.5"
                  >
                    <span className="material-symbols-outlined text-lg">auto_awesome</span>
                    {isLoggedIn ? '새 영상 만들기' : '무료로 시작하기'}
                  </Link>
                  <a
                    href="#showcase"
                    className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 bg-white/5 px-6 py-3.5 text-sm font-bold text-white transition-colors hover:bg-white/10"
                  >
                    <span className="material-symbols-outlined text-lg">play_circle</span>
                    쇼케이스 둘러보기
                  </a>
                </div>

                <div className="grid gap-3 sm:grid-cols-3">
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-white/45">Curated Clips</p>
                    <p className="mt-2 text-2xl font-bold">{stats.videos}</p>
                    <p className="mt-1 text-sm text-white/55">서비스 내 추천 영상</p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-white/45">Creator Signals</p>
                    <p className="mt-2 text-2xl font-bold">{stats.likes}</p>
                    <p className="mt-1 text-sm text-white/55">누적 좋아요 반응</p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-white/45">Active Voices</p>
                    <p className="mt-2 text-2xl font-bold">{stats.creators}</p>
                    <p className="mt-1 text-sm text-white/55">참여 크리에이터</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <div className="relative min-h-[360px] overflow-hidden rounded-[28px] border border-white/10 bg-[#0f1c38] p-5">
                  <div
                    className="absolute inset-0 bg-cover bg-center opacity-80"
                    style={{ backgroundImage: `url("${heroVideo.image}")` }}
                  />
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,18,37,0.10)_0%,rgba(8,18,37,0.88)_100%)]" />
                  <div className="relative flex h-full flex-col justify-between">
                    <div className="flex items-start justify-between gap-3">
                      <span className="rounded-full bg-white/12 px-3 py-1 text-xs font-semibold text-white/80 backdrop-blur-md">
                        Editor's Pick
                      </span>
                      <span className="rounded-full bg-black/25 px-3 py-1 text-xs font-medium text-white/85 backdrop-blur-md">
                        {heroVideo.duration}
                      </span>
                    </div>
                    <div className="space-y-4">
                      <div className="inline-flex items-center gap-2 rounded-full bg-white/12 px-3 py-1 text-xs text-white/80 backdrop-blur-md">
                        <span className="material-symbols-outlined text-sm text-[#8fd3ff]">favorite</span>
                        {formatCount(heroVideo.likes)} likes
                      </div>
                      <div>
                        <p className="text-xs uppercase tracking-[0.22em] text-white/50">Featured Scene</p>
                        <h2 className="mt-2 text-2xl font-black tracking-tight">{heroVideo.title}</h2>
                        <p className="mt-2 max-w-sm text-sm leading-6 text-white/72">{heroVideo.description}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <img className="size-9 rounded-full border border-white/30 object-cover" src={heroVideo.avatar} alt={heroVideo.creator} />
                        <div>
                          <p className="text-sm font-semibold">{heroVideo.creator}</p>
                          <p className="text-xs text-white/55">{formatCount(heroVideo.comments)} comments</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
                  {curatedThemes.map((theme) => (
                    <div key={theme.title} className="rounded-2xl border border-white/12 bg-white/6 p-4 backdrop-blur-md">
                      <div className="mb-3 flex size-10 items-center justify-center rounded-2xl bg-white/10 text-[#8fd3ff]">
                        <span className="material-symbols-outlined">{theme.icon}</span>
                      </div>
                      <h3 className="text-sm font-bold">{theme.title}</h3>
                      <p className="mt-1 text-sm leading-6 text-white/60">{theme.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-6">
            <div className="rounded-[28px] border border-[#d9e2f5] bg-white/90 p-6 shadow-[0_24px_60px_-30px_rgba(51,65,85,0.30)]">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary/70">Showcase Pulse</p>
                  <h3 className="mt-2 text-2xl font-black tracking-tight text-[#0f172a]">오늘 주목받는 영상</h3>
                </div>
                <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">Top 5</span>
              </div>
              <div className="mt-5 space-y-3">
                {topVideos.slice(0, 4).map((video, index) => (
                  <Link
                    key={video.id}
                    to={`/video/${video.id}`}
                    className="flex items-center gap-3 rounded-2xl border border-[#edf1f8] px-3 py-3 transition-all hover:border-primary/20 hover:bg-[#f8faff]"
                  >
                    <div className="flex size-10 flex-shrink-0 items-center justify-center rounded-2xl bg-[#eef3ff] text-sm font-black text-primary">
                      {index + 1}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-bold text-[#0f172a]">{video.title}</p>
                      <p className="mt-1 text-xs text-slate-500">{video.creator}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-[#0f172a]">{formatCount(video.likes)}</p>
                      <p className="text-xs text-slate-400">likes</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            <div className="rounded-[28px] border border-[#d9e2f5] bg-[linear-gradient(180deg,#ffffff_0%,#f6f9ff_100%)] p-6 shadow-[0_24px_60px_-30px_rgba(51,65,85,0.28)]">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary/70">Why SceneFlow</p>
              <div className="mt-4 space-y-4">
                <div className="flex gap-3">
                  <div className="mt-0.5 flex size-9 flex-shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <span className="material-symbols-outlined text-lg">instant_mix</span>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#0f172a]">프롬프트와 레퍼런스를 한 화면에서 정리</h4>
                    <p className="mt-1 text-sm leading-6 text-slate-600">아이디어 메모, 이미지 레퍼런스, 스타일 키워드를 분산되지 않게 연결합니다.</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="mt-0.5 flex size-9 flex-shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <span className="material-symbols-outlined text-lg">view_in_ar</span>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#0f172a]">쇼츠와 티저에 맞는 장면 감도</h4>
                    <p className="mt-1 text-sm leading-6 text-slate-600">빠른 몰입감이 필요한 포맷에 맞춰 시각적인 밀도를 올린 결과물을 모읍니다.</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="mt-0.5 flex size-9 flex-shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <span className="material-symbols-outlined text-lg">dynamic_feed</span>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#0f172a]">커뮤니티에서 반응 좋은 무드 참고</h4>
                    <p className="mt-1 text-sm leading-6 text-slate-600">좋아요와 댓글 반응을 보며 어떤 장면이 먹히는지 바로 파악할 수 있습니다.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-[28px] border border-[#d9e2f5] bg-[#0f172a] p-6 text-white shadow-[0_24px_60px_-30px_rgba(15,23,42,0.55)]">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#8fd3ff]">Community Signal</p>
              <div className="mt-4 grid grid-cols-2 gap-4">
                <div>
                  <p className="text-2xl font-black">{stats.comments}</p>
                  <p className="mt-1 text-sm text-white/55">누적 댓글</p>
                </div>
                <div>
                  <p className="text-2xl font-black">{formatCount(topVideos[0].likes)}</p>
                  <p className="mt-1 text-sm text-white/55">최고 인기 영상</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="showcase" className="space-y-8">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="space-y-3">
              <span className="inline-flex rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-primary">
                Curated Showcase
              </span>
              <div>
                <h2 className="text-3xl font-black tracking-tight text-[#0f172a] sm:text-4xl">지금 바로 참고할 수 있는 생성형 비디오 무드보드</h2>
                <p className="mt-3 max-w-2xl text-base leading-7 text-slate-600">
                  크리에이터들이 만든 결과물을 검색하고, 반응을 살펴보고, 좋은 흐름은 바로 내 작업에 연결해보세요.
                </p>
              </div>
            </div>
            {isLoggedIn && (
              <Link
                to="/studio/create"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-primary/20 bg-white px-6 py-3 text-sm font-bold text-primary shadow-sm transition-colors hover:bg-primary/5"
              >
                <span className="material-symbols-outlined">add</span>
                내 첫 장면 만들기
              </Link>
            )}
          </div>

          <div className="grid gap-4 rounded-[28px] border border-[#d9e2f5] bg-white/90 p-5 shadow-[0_24px_60px_-32px_rgba(51,65,85,0.24)] md:grid-cols-[auto_1fr] md:items-center md:p-6">
            <div className="flex items-center gap-3 overflow-x-auto pb-1 no-scrollbar">
              {sortFilters.map((filter, i) => (
                <button
                  key={filter.label}
                  onClick={() => { setActiveSort(i); setVisibleCount(PAGE_SIZE) }}
                  className={`inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium whitespace-nowrap transition-all ${
                    activeSort === i
                      ? 'bg-primary text-white shadow-md shadow-primary/15'
                      : 'border border-[#d9e2f5] bg-[#f8faff] text-slate-600 hover:border-primary/25 hover:text-primary'
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
                className="w-full rounded-2xl border border-[#d9e2f5] bg-[#f8faff] py-4 pl-12 pr-4 text-base outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/15"
                placeholder="영상 제목, 크리에이터, 무드를 검색해보세요"
                type="text"
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setVisibleCount(PAGE_SIZE) }}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
            {visibleVideos.map((video) => (
              <Link
                key={video.id}
                to={`/video/${video.id}`}
                className="group overflow-hidden rounded-[26px] border border-[#dbe3f5] bg-white shadow-[0_24px_55px_-34px_rgba(51,65,85,0.30)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_30px_70px_-32px_rgba(37,99,235,0.28)]"
              >
                <div className="relative aspect-[9/16] overflow-hidden">
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                    style={{ backgroundImage: `url("${video.image}")` }}
                  />
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(15,23,42,0.04)_0%,rgba(15,23,42,0.68)_100%)]" />
                  <div className="absolute left-4 right-4 top-4 flex items-center justify-between">
                    <span className="rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-semibold text-[#0f172a] backdrop-blur-md">
                      {activeSort === 0 ? 'Trending Clip' : 'Fresh Upload'}
                    </span>
                    <span className="rounded-full bg-black/25 px-2.5 py-1 text-[11px] font-medium text-white backdrop-blur-md">
                      {video.duration}
                    </span>
                  </div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="truncate text-lg font-bold tracking-tight text-white">{video.title}</h3>
                    <p className="mt-1 line-clamp-2 text-sm leading-5 text-white/70">{video.description}</p>
                  </div>
                </div>

                <div className="space-y-4 p-4">
                  <div className="flex items-center gap-3">
                    <img className="size-9 rounded-full object-cover ring-2 ring-primary/10" src={video.avatar} alt={video.creator} />
                    <div className="min-w-0">
                      <p className="truncate text-sm font-bold text-[#0f172a]">{video.creator}</p>
                      <p className="text-xs text-slate-500">{video.createdAt}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm text-slate-500">
                    <span className="inline-flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-base text-primary">favorite</span>
                      {formatCount(video.likes)}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-base">chat_bubble</span>
                      {formatCount(video.comments)}
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-primary">
                      보기
                      <span className="material-symbols-outlined text-base transition-transform group-hover:translate-x-1">arrow_forward</span>
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {visibleVideos.length === 0 && (
            <div className="flex flex-col items-center justify-center rounded-[28px] border border-dashed border-[#d9e2f5] bg-white/70 px-6 py-20 text-center">
              <span className="material-symbols-outlined mb-4 text-5xl text-slate-300">search_off</span>
              <p className="text-lg font-bold text-slate-500">검색 결과가 없습니다</p>
              <p className="mt-1 text-sm text-slate-400">다른 무드나 크리에이터 이름으로 다시 찾아보세요.</p>
            </div>
          )}

          {hasMore && (
            <div className="flex justify-center">
              <button
                onClick={() => setVisibleCount((prev) => prev + PAGE_SIZE)}
                className="rounded-full border border-[#d9e2f5] bg-white px-8 py-3 text-sm font-bold text-slate-700 shadow-sm transition-all hover:border-primary/25 hover:text-primary"
              >
                더 많은 쇼케이스 보기
              </button>
            </div>
          )}
        </section>
      </main>

      <footer className="border-t border-[#dbe3f5] bg-white/70 px-6 py-12 lg:px-20">
        <div className="mx-auto flex max-w-7xl flex-col gap-8 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <img src={aiVidLogo} alt="SceneFlow 로고" className="size-8 rounded-xl bg-primary p-1.5 object-contain" />
            <div>
              <p className="font-bold text-[#0f172a]">SceneFlow</p>
              <p className="text-sm text-slate-500">Generative video workspace for fast-moving creators.</p>
            </div>
          </div>
          <div className="flex gap-8 text-sm text-slate-600">
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
