import { useEffect, useState, useCallback } from 'react'
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { videosApi, type VideoListItem } from '../api/videos'
import { resolveApiUrl } from '../config/env'
import { formatCount, formatDate } from '../data/videos'
import api from '../api/client'
import aiVidLogo from '@/assets/AI_vid_logo.png'

interface Comment {
  comment_id: number
  video_id: number
  nickname: string
  content: string
  created_at?: string
}

type RouteState = {
  video?: VideoListItem
}

export default function VideoDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const location = useLocation()
  const { user, isLoggedIn, logout } = useAuth()

  const [video, setVideo] = useState<VideoListItem | null>(null)
  const [relatedVideos, setRelatedVideos] = useState<VideoListItem[]>([])
  const [loading, setLoading] = useState(true)

  // 좋아요
  const [liked, setLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(0)
  const [likeLoading, setLikeLoading] = useState(false)

  // 댓글
  const [comments, setComments] = useState<Comment[]>([])
  const [commentInput, setCommentInput] = useState('')
  const [commentLoading, setCommentLoading] = useState(false)

  const numericId = Number(id)
  const stateVideo = (location.state as RouteState | null)?.video

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
  }, [id])

  // 비디오 상세 조회
  useEffect(() => {
    let cancelled = false

    async function fetchDetail() {
      setLoading(true)

      // 즉시 표시용 (state로 넘어온 경우)
      if (stateVideo && stateVideo.id === numericId && !cancelled) {
        setVideo(stateVideo)
        setLikeCount(stateVideo.like_count || 0)
        setLiked(stateVideo.liked || false)
      }

      try {
        // 개별 비디오 상세 + 관련 비디오 목록 병렬 조회
        const [detailRes, listRes] = await Promise.all([
          videosApi.getById(numericId),
          videosApi.getAll('latest'),
        ])

        if (cancelled) return

        if (detailRes.data.success) {
          const current = detailRes.data.data.videos
          setVideo(current)
          setLikeCount(current.like_count || 0)
          setLiked(current.liked || false)
        }

        if (listRes.data.success) {
          setRelatedVideos(listRes.data.data.videos.filter((v) => v.id !== numericId).slice(0, 4))
        }
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

    return () => { cancelled = true }
  }, [numericId, stateVideo])

  // 댓글 목록 조회
  const fetchComments = useCallback(async () => {
    if (Number.isNaN(numericId)) return
    try {
      const res = await api.get<{ success: boolean; data: { comments: Comment[] } }>(
        `/api/v1/videos/${numericId}/comments`
      )
      if (res.data.success) {
        setComments(res.data.data.comments)
      }
    } catch {
      // 댓글 로딩 실패 무시
    }
  }, [numericId])

  useEffect(() => {
    fetchComments()
  }, [fetchComments])

  // 좋아요 토글
  const handleLike = async () => {
    if (!isLoggedIn || likeLoading) return
    setLikeLoading(true)
    try {
      if (liked) {
        const res = await api.delete<{ success: boolean; data: { like_count: number } }>(
          `/api/v1/videos/${numericId}/likes`
        )
        if (res.data.success) {
          setLiked(false)
          setLikeCount(res.data.data.like_count)
        }
      } else {
        const res = await api.post<{ success: boolean; data: { like_count: number } }>(
          `/api/v1/videos/${numericId}/likes`
        )
        if (res.data.success) {
          setLiked(true)
          setLikeCount(res.data.data.like_count)
        }
      }
    } catch {
      // 실패 무시
    } finally {
      setLikeLoading(false)
    }
  }

  // 댓글 작성
  const handleCommentSubmit = async () => {
    if (!commentInput.trim() || commentLoading) return
    setCommentLoading(true)
    try {
      const res = await api.post<{ success: boolean; data: { comment: Comment } }>(
        `/api/v1/videos/${numericId}/comments`,
        { content: commentInput.trim() }
      )
      if (res.data.success) {
        setComments(prev => [...prev, res.data.data.comment])
        setCommentInput('')
      }
    } catch {
      alert('댓글 작성에 실패했습니다.')
    } finally {
      setCommentLoading(false)
    }
  }

  // 댓글 삭제
  const handleCommentDelete = async (commentId: number) => {
    try {
      const res = await api.delete<{ success: boolean }>(`/api/v1/comments/${commentId}`)
      if (res.data.success) {
        setComments(prev => prev.filter(c => c.comment_id !== commentId))
      }
    } catch {
      alert('댓글 삭제에 실패했습니다.')
    }
  }

  if (loading) {
    return (
      <div className="bg-[#f2ece1] font-display text-[#2d2926] antialiased min-h-screen flex items-center justify-center">
        <span className="material-symbols-outlined text-3xl text-primary animate-spin">progress_activity</span>
      </div>
    )
  }

  if (!video) {
    return (
      <div className="bg-[#f2ece1] font-display text-[#2d2926] antialiased min-h-screen flex flex-col items-center justify-center">
        <span className="material-symbols-outlined text-6xl text-[#c4b9ab] mb-4">videocam_off</span>
        <h2 className="text-2xl font-bold mb-2">비디오를 찾을 수 없습니다</h2>
        <p className="text-warm-muted mb-8">존재하지 않는 비디오이거나 삭제된 비디오입니다.</p>
        <Link
          to="/"
          className="px-6 py-3 bg-primary text-white font-bold rounded-xl hover:bg-[#58717c] transition-all"
        >
          홈으로 돌아가기
        </Link>
      </div>
    )
  }

  const previewImage = resolveApiUrl(video.thumbnail_url)
  const videoSrc = video.video_url ? resolveApiUrl(video.video_url) : null

  return (
    <div className="relative min-h-screen bg-[#f2ece1] text-slate-900 dark:bg-[#09111f] font-display dark:text-slate-100 antialiased flex flex-col">
      <div className="absolute inset-x-0 top-0 -z-10 h-[420px] bg-[radial-gradient(circle_at_top_left,_rgba(201,152,102,0.16),_transparent_40%),radial-gradient(circle_at_top_right,_rgba(52,87,246,0.06),_transparent_35%),linear-gradient(180deg,_#f8f3ea_0%,_#f2ece1_58%,_#f2ece1_100%)] dark:hidden" />
      <div className="absolute inset-x-0 top-0 -z-10 hidden h-[420px] bg-[radial-gradient(circle_at_top_left,_rgba(52,87,246,0.20),_transparent_38%),radial-gradient(circle_at_top_right,_rgba(125,211,252,0.08),_transparent_30%),linear-gradient(180deg,_#0d1730_0%,_#09111f_58%,_#09111f_100%)] dark:block" />

      {/* Header */}
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
              <Link className="text-sm font-semibold text-primary" to="/">홈</Link>
              <Link className="text-sm font-medium text-slate-400 transition-colors hover:text-primary" to={isLoggedIn ? "/studio" : "/login"}>스튜디오</Link>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            {isLoggedIn ? (
              <div className="flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-2 py-1 shadow-sm shadow-black/20">
                  {user?.profile_image_url ? (
                    <img src={user.profile_image_url} alt="프로필" className="size-8 rounded-full object-cover" />
                  ) : (
                    <div className="size-8 rounded-full bg-primary flex items-center justify-center text-white text-xs font-bold">
                      {user?.name?.charAt(0) || '?'}
                    </div>
                  )}
                  <span className="hidden sm:block text-sm font-medium text-[#2d2926]">{user?.nickname || user?.name}</span>
                  <button onClick={logout} className="px-3 text-sm font-medium text-[#8a7d72] transition-colors hover:text-[#2d2926]">로그아웃</button>
                </div>
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

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-6 lg:px-20 py-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-warm-muted hover:text-primary transition-colors mb-6 group"
        >
          <span className="material-symbols-outlined text-lg group-hover:-translate-x-1 transition-transform">arrow_back</span>
          <span className="text-sm font-medium">뒤로가기</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Left: Video + Info + Comments */}
          <div className="lg:col-span-2 space-y-8">
            {/* Video Player */}
            <div className="relative aspect-video w-full rounded-2xl overflow-hidden shadow-lg bg-black">
              {videoSrc ? (
                <video
                  src={videoSrc}
                  controls
                  poster={previewImage}
                  className="w-full h-full object-contain"
                />
              ) : (
                <>
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
                </>
              )}
            </div>

            {/* Video Info */}
            <div className="space-y-6">
              <h1 className="text-3xl md:text-4xl font-black text-[#2d2926] tracking-tight">{video.title}</h1>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="size-12 rounded-full overflow-hidden ring-2 ring-primary/20 bg-[#e5ddd3] flex items-center justify-center">
                    {video.creator_avatar_url ? (
                      <img src={resolveApiUrl(video.creator_avatar_url)} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <span className="material-symbols-outlined text-warm-muted">person</span>
                    )}
                  </div>
                  <div>
                    <p className="font-bold text-[#2d2926]">{video.creator_nickname || video.creator || '작성자'}</p>
                    <p className="text-xs text-warm-muted">{video.created_at ? formatDate(video.created_at) : '-'}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-warm-muted border border-[#e5ddd3] text-sm font-medium">
                    <span className="material-symbols-outlined text-lg">visibility</span>
                    {formatCount(video.view_count || 0)}
                  </div>
                  <button
                    onClick={handleLike}
                    disabled={!isLoggedIn || likeLoading}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all ${
                      liked
                        ? 'bg-red-50 text-red-500 border border-red-200'
                        : 'bg-white text-warm-muted border border-[#e5ddd3] hover:border-primary hover:text-primary'
                    } ${!isLoggedIn ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <span className="material-symbols-outlined text-lg">{liked ? 'favorite' : 'favorite_border'}</span>
                    {formatCount(likeCount)}
                  </button>
                  <div className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-warm-muted border border-[#e5ddd3] text-sm font-medium">
                    <span className="material-symbols-outlined text-lg">chat_bubble_outline</span>
                    {comments.length}
                  </div>
                </div>
              </div>
            </div>

            {/* Comments Section */}
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-[#2d2926] flex items-center gap-2">
                <span className="material-symbols-outlined">chat_bubble</span>
                댓글 {comments.length}개
              </h3>

              {/* Comment Input */}
              {isLoggedIn ? (
                <div className="flex gap-3">
                  <div className="size-10 rounded-full overflow-hidden flex-shrink-0">
                    {user?.profile_image_url ? (
                      <img src={user.profile_image_url} alt="내 프로필" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-primary flex items-center justify-center text-white text-xs font-bold rounded-full">
                        {user?.name?.charAt(0) || '?'}
                      </div>
                    )}
                  </div>
                  <div className="flex-1 flex gap-2">
                    <input
                      className="flex-1 px-4 py-3 bg-white border border-[#e5ddd3] rounded-xl text-sm text-[#2d2926] focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder:text-warm-muted/50"
                      placeholder="댓글을 입력하세요..."
                      value={commentInput}
                      onChange={(e) => setCommentInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleCommentSubmit()}
                      disabled={commentLoading}
                    />
                    <button
                      onClick={handleCommentSubmit}
                      disabled={!commentInput.trim() || commentLoading}
                      className="px-4 py-3 bg-primary text-white text-sm font-bold rounded-xl hover:bg-[#58717c] disabled:opacity-40 transition-all"
                    >
                      {commentLoading ? (
                        <span className="material-symbols-outlined text-sm animate-spin">progress_activity</span>
                      ) : (
                        '등록'
                      )}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="bg-white border border-[#e5ddd3] rounded-xl p-4 text-center">
                  <p className="text-sm text-warm-muted">
                    댓글을 작성하려면{' '}
                    <Link to="/login" className="text-primary font-bold hover:underline">로그인</Link>
                    이 필요합니다.
                  </p>
                </div>
              )}

              {/* Comment List */}
              <div className="space-y-3">
                {comments.length === 0 ? (
                  <div className="py-8 text-center text-sm text-warm-muted">
                    아직 댓글이 없습니다. 첫 번째 댓글을 남겨보세요!
                  </div>
                ) : (
                  comments.map((comment) => (
                    <div key={comment.comment_id} className="flex gap-3 bg-white border border-[#e5ddd3] rounded-xl p-4 group">
                      <div className="size-10 rounded-full overflow-hidden flex-shrink-0 bg-primary/10 flex items-center justify-center">
                        <span className="material-symbols-outlined text-primary text-lg">person</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-bold text-sm text-[#2d2926]">{comment.nickname}</span>
                          {comment.created_at && (
                            <span className="text-xs text-warm-muted">{formatDate(comment.created_at)}</span>
                          )}
                        </div>
                        <p className="text-sm text-[#5e5452] leading-relaxed">{comment.content}</p>
                      </div>
                      {isLoggedIn && (user?.nickname === comment.nickname || user?.name === comment.nickname) && (
                        <button
                          onClick={() => handleCommentDelete(comment.comment_id)}
                          className="opacity-0 group-hover:opacity-100 text-warm-muted hover:text-red-500 transition-all self-start"
                        >
                          <span className="material-symbols-outlined text-sm">delete</span>
                        </button>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Right: Related Videos */}
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
                  className="flex gap-3 group bg-white hover:bg-[#f9f6f0] border border-[#e5ddd3] hover:border-primary/30 rounded-xl p-3 transition-all hover:shadow-md"
                >
                  <div className="relative w-36 flex-shrink-0 aspect-video rounded-lg overflow-hidden">
                    <div
                      className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-300"
                      style={{ backgroundImage: `url("${resolveApiUrl(rv.thumbnail_url)}")` }}
                    />
                  </div>
                  <div className="flex-1 min-w-0 py-1">
                    <h4 className="font-bold text-sm text-[#2d2926] truncate group-hover:text-primary transition-colors">{rv.title}</h4>
                    <p className="text-xs text-warm-muted mt-1">{rv.creator_nickname || rv.creator}</p>
                    <div className="flex items-center gap-3 mt-2 text-warm-muted">
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

      {/* Footer */}
      <footer className="mt-20 border-t border-[#e5ddd3] bg-[#f9f6f0] px-6 lg:px-20 py-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-3">
            <img src={aiVidLogo} alt="SceneFlow 로고" className="size-8 rounded-lg bg-primary p-1 object-contain" />
            <span className="font-bold text-[#2d2926]">SceneFlow</span>
          </div>
          <p className="text-sm text-warm-muted">© 2026 SceneFlow. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
