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

      if (stateVideo && stateVideo.id === numericId && !cancelled) {
        setVideo(stateVideo)
        setLikeCount(stateVideo.like_count || 0)
        setLiked(stateVideo.liked || false)
      }

      try {
        const res = await videosApi.getAll('latest')
        if (!res.data.success || cancelled) return

        const list = res.data.data.videos
        const current = list.find((v) => v.id === numericId) ?? null
        const related = list.filter((v) => v.id !== numericId).slice(0, 4)

        const finalVideo = current ?? (stateVideo && stateVideo.id === numericId ? stateVideo : null)
        setVideo(finalVideo)
        setRelatedVideos(related)
        if (finalVideo) {
          setLikeCount(finalVideo.like_count || 0)
          setLiked(finalVideo.liked || false)
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
    <div className="bg-[#f2ece1] font-display text-[#2d2926] antialiased min-h-screen flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-[#1b2f57] bg-[#0b1f44]/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 lg:px-20 h-20 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-3">
              <img src={aiVidLogo} alt="SceneFlow 로고" className="size-8 rounded-lg bg-primary p-1 object-contain" />
              <h2 className="text-lg font-bold tracking-tight text-white">SceneFlow</h2>
            </Link>
            <nav className="hidden md:flex items-center gap-6">
              <Link className="text-sm font-medium text-[#b7c8e8] hover:text-white transition-colors" to="/">홈</Link>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            {isLoggedIn ? (
              <>
                <Link to="/studio" className="text-sm font-medium text-[#b7c8e8] hover:text-white transition-colors">스튜디오</Link>
                <div className="flex items-center gap-3">
                  {user?.profile_image_url ? (
                    <img src={user.profile_image_url} alt="프로필" className="size-8 rounded-full object-cover" />
                  ) : (
                    <div className="size-8 rounded-full bg-primary flex items-center justify-center text-white text-xs font-bold">
                      {user?.name?.charAt(0) || '?'}
                    </div>
                  )}
                  <span className="hidden sm:block text-sm font-medium text-white">{user?.nickname || user?.name}</span>
                  <button onClick={logout} className="text-sm font-medium text-[#b7c8e8] hover:text-white transition-colors">로그아웃</button>
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="hidden sm:block text-sm font-medium text-[#b7c8e8] hover:text-white transition-colors">로그인</Link>
                <Link to="/signup" className="bg-primary hover:bg-[#58717c] text-white text-sm font-bold px-5 py-2 rounded-lg transition-all">시작하기</Link>
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
          <div className="flex gap-8 text-sm text-[#5e5452]">
            <Link className="hover:text-primary transition-colors" to="/terms">이용약관</Link>
            <Link className="hover:text-primary transition-colors" to="/privacy">개인정보처리방침</Link>
            <Link className="hover:text-primary transition-colors" to="/support">고객센터</Link>
          </div>
          <p className="text-sm text-warm-muted">© 2026 SceneFlow. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
