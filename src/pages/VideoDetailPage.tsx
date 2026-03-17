import { useEffect, useMemo, useState } from 'react'
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { videosApi, type VideoListItem } from '../api/videos'
import { resolveApiUrl } from '../config/env'
import { getCommentsForVideo, formatCount, formatDate } from '../data/videos'
import aiVidLogo from '@/assets/AI_vid_logo.png'

type RouteState = {
  video?: VideoListItem
}

export default function VideoDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const location = useLocation()
  const { user, isLoggedIn, logout } = useAuth()
  const [liked, setLiked] = useState(false)
  const [video, setVideo] = useState<VideoListItem | null>(null)
  const [relatedVideos, setRelatedVideos] = useState<VideoListItem[]>([])
  const [loading, setLoading] = useState(true)

  const numericId = Number(id)
  const stateVideo = (location.state as RouteState | null)?.video

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
  }, [id])

  useEffect(() => {
    let cancelled = false

    async function fetchDetail() {
      setLoading(true)

      if (stateVideo && stateVideo.id === numericId && !cancelled) {
        setVideo(stateVideo)
      }

      try {
        const res = await videosApi.getAll('latest')
        if (!res.data.success || cancelled) return

        const list = res.data.data.videos
        const current = list.find((v) => v.id === numericId) ?? null
        const related = list.filter((v) => v.id !== numericId).slice(0, 4)

        setVideo(current ?? (stateVideo && stateVideo.id === numericId ? stateVideo : null))
        setRelatedVideos(related)
      } catch (err) {
        console.error('비디오 상세 조회 실패:', err)
        if (!cancelled && stateVideo && stateVideo.id === numericId) {
          setVideo(stateVideo)
          setRelatedVideos([])
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    if (!Number.isNaN(numericId)) fetchDetail()
    else {
      setVideo(null)
      setRelatedVideos([])
      setLoading(false)
    }

    return () => {
      cancelled = true
    }
  }, [numericId, stateVideo])

  const comments = useMemo(() => getCommentsForVideo(numericId), [numericId])

  if (loading) {
    return (
      <div className="bg-[#09111f] font-display text-slate-100 antialiased min-h-screen flex items-center justify-center">
        <span className="text-sm text-slate-300">불러오는 중...</span>
      </div>
    )
  }

  if (!video) {
    return (
      <div className="bg-[#09111f] font-display text-slate-100 antialiased min-h-screen flex flex-col items-center justify-center">
        <span className="material-symbols-outlined text-6xl text-slate-300 mb-4">videocam_off</span>
        <h2 className="text-2xl font-bold text-white mb-2">비디오를 찾을 수 없습니다</h2>
        <p className="text-slate-400 mb-8">존재하지 않는 비디오이거나 삭제된 비디오입니다.</p>
        <Link
          to="/"
          className="px-6 py-3 bg-primary text-white font-bold rounded-xl hover:bg-[#58717c] transition-all"
        >
          홈으로 돌아가기
        </Link>
      </div>
    )
  }

  const displayLikes = liked ? (video.like_count || 0) + 1 : (video.like_count || 0)
  const previewImage = resolveApiUrl(video.thumbnail_url)

  return (
    <div className="bg-[#09111f] font-display text-slate-100 antialiased min-h-screen flex flex-col">
      <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-[#09111f]/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 lg:px-20 h-20 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-3">
              <img src={aiVidLogo} alt="SceneFlow 로고" className="size-8 rounded-lg bg-primary p-1 object-contain" />
              <h2 className="text-lg font-bold tracking-tight text-white">SceneFlow</h2>
            </Link>
            <nav className="hidden md:flex items-center gap-6">
              <Link className="text-sm font-medium text-slate-400 hover:text-primary transition-colors" to="/">홈</Link>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            {isLoggedIn ? (
              <>
                <Link to="/studio" className="text-sm font-medium text-slate-400 hover:text-primary transition-colors">스튜디오</Link>
                <div className="flex items-center gap-3">
                  {user?.profile_image_url ? (
                    <img src={user.profile_image_url} alt="프로필" className="size-8 rounded-full object-cover" />
                  ) : (
                    <div className="size-8 rounded-full bg-primary flex items-center justify-center text-white text-xs font-bold">
                      {user?.name?.charAt(0) || '?'}
                    </div>
                  )}
                  <span className="hidden sm:block text-sm font-medium text-slate-200">{user?.nickname || user?.name}</span>
                  <button onClick={logout} className="text-sm font-medium text-slate-400 hover:text-slate-200 transition-colors">로그아웃</button>
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="hidden sm:block text-sm font-medium text-slate-400">로그인</Link>
                <Link to="/signup" className="bg-primary hover:bg-[#58717c] text-white text-sm font-bold px-5 py-2 rounded-lg transition-all">시작하기</Link>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full px-6 lg:px-20 py-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-slate-400 hover:text-primary transition-colors mb-6 group"
        >
          <span className="material-symbols-outlined text-lg group-hover:-translate-x-1 transition-transform">arrow_back</span>
          <span className="text-sm font-medium">뒤로가기</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-8">
            <div className="relative aspect-video w-full rounded-2xl overflow-hidden shadow-lg group">
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url("${previewImage}")` }}
              />
              <div className="absolute inset-0 bg-black/25" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="size-20 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-xl">
                  <span className="material-symbols-outlined text-4xl text-primary ml-1">play_arrow</span>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight">{video.title}</h1>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="size-12 rounded-full overflow-hidden ring-2 ring-primary/20 bg-white/10 flex items-center justify-center">
                    <span className="material-symbols-outlined text-slate-300">person</span>
                  </div>
                  <div>
                    <p className="font-bold text-white">{video.creator_nickname || video.creator || '작성자'}</p>
                    <p className="text-xs text-slate-400">{video.created_at ? formatDate(video.created_at) : '-'}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setLiked(!liked)}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all ${
                      liked
                        ? 'bg-red-50 text-red-500 border border-red-200'
                        : 'bg-white/5 text-slate-300 border border-white/10 hover:border-primary hover:text-primary'
                    }`}
                  >
                    <span className="material-symbols-outlined text-lg">{liked ? 'favorite' : 'favorite_border'}</span>
                    {formatCount(displayLikes)}
                  </button>
                  <div className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/5 text-slate-300 border border-white/10 text-sm font-medium">
                    <span className="material-symbols-outlined text-lg">chat_bubble_outline</span>
                    {formatCount(video.comment_count || 0)}
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <span className="material-symbols-outlined">chat_bubble</span>
                댓글 {comments.length}개
              </h3>

              {isLoggedIn && (
                <div className="flex gap-3">
                  <div className="size-10 rounded-full overflow-hidden flex-shrink-0">
                    {user?.profile_image_url ? (
                      <img src={user.profile_image_url} alt="내 프로필" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-primary flex items-center justify-center text-white text-xs font-bold">
                        {user?.name?.charAt(0) || '?'}
                      </div>
                    )}
                  </div>
                  <div className="flex-1 relative">
                    <input
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder:text-slate-500"
                      placeholder="댓글을 입력하세요..."
                      type="text"
                    />
                  </div>
                </div>
              )}

              <div className="space-y-4">
                {comments.map((comment) => (
                  <div key={comment.id} className="flex gap-3 bg-white/5 border border-white/10 rounded-xl p-4">
                    <div className="size-10 rounded-full overflow-hidden flex-shrink-0">
                      <img className="w-full h-full object-cover" src={comment.avatar} alt={comment.author} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-sm text-white">{comment.author}</span>
                        <span className="text-xs text-slate-400">{formatDate(comment.createdAt)}</span>
                      </div>
                      <p className="text-sm text-slate-300 leading-relaxed">{comment.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <h3 className="text-lg font-bold text-[#2d2926] mb-6 flex items-center gap-2">
              <span className="material-symbols-outlined">playlist_play</span>
              관련 비디오
            </h3>
            <div className="space-y-4">
              {relatedVideos.map((rv) => (
                <Link
                  key={rv.id}
                  to={`/video/${rv.id}`}
                  state={{ video: rv }}
                  className="flex gap-3 group bg-white/50 hover:bg-white border border-[#eee6d8] hover:border-primary/30 rounded-xl p-3 transition-all hover:shadow-md"
                >
                  <div className="relative w-36 flex-shrink-0 aspect-video rounded-lg overflow-hidden">
                    <div
                      className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-300"
                      style={{ backgroundImage: `url("${resolveApiUrl(rv.thumbnail_url)}")` }}
                    />
                  </div>
                  <div className="flex-1 min-w-0 py-1">
                    <h4 className="font-bold text-sm text-[#2d2926] truncate group-hover:text-primary transition-colors">{rv.title}</h4>
                    <div className="flex items-center gap-3 mt-2 text-[#8c8479]">
                      <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-xs">favorite</span>
                        <span className="text-xs">{formatCount(rv.like_count || 0)}</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-xs">chat_bubble</span>
                        <span className="text-xs">{formatCount(rv.comment_count || 0)}</span>
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </main>

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
          <p className="text-sm text-slate-400">© 2026 SceneFlow. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
