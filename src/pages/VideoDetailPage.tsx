import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { videosApi, type VideoDetail, type VideoComment } from '../api/videos'
import aiVidLogo from '@/assets/AI_vid_logo.png'
import { resolveApiUrl } from '@/config/env'

function formatCount(n: number): string {
  if (n >= 1000) return (n / 1000).toFixed(1).replace(/\.0$/, '') + 'k'
  return String(n)
}

export default function VideoDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { user, isLoggedIn, logout } = useAuth()

  const [video, setVideo] = useState<VideoDetail | null>(null)
  const [comments, setComments] = useState<VideoComment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [liked, setLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(0)
  const [commentText, setCommentText] = useState('')
  const [commentSubmitting, setCommentSubmitting] = useState(false)

  // 비디오 상세 + 댓글 로드
  useEffect(() => {
    if (!id) return

    async function fetchData() {
      setLoading(true)
      setError('')
      try {
        const [videoRes, commentsRes] = await Promise.all([
          videosApi.getById(Number(id)),
          videosApi.getComments(Number(id)),
        ])

        if (videoRes.data.success) {
          const v = videoRes.data.data.videos
          setVideo(v)
          setLiked(v.liked)
          setLikeCount(v.like_count)
        } else {
          setError('영상을 찾을 수 없습니다.')
        }

        if (commentsRes.data.success) {
          setComments(commentsRes.data.data.comments)
        }
      } catch {
        setError('영상을 불러오는데 실패했습니다.')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [id])

  // 좋아요 토글
  const handleLike = async () => {
    if (!video || !isLoggedIn) return
    try {
      if (liked) {
        const res = await videosApi.removeLike(video.id)
        if (res.data.success) {
          setLiked(false)
          setLikeCount(res.data.data.like_count)
        }
      } else {
        const res = await videosApi.addLike(video.id)
        if (res.data.success) {
          setLiked(true)
          setLikeCount(res.data.data.like_count)
        }
      }
    } catch (err) {
      console.error('좋아요 실패:', err)
    }
  }

  // 댓글 작성
  const handleAddComment = async () => {
    if (!commentText.trim() || !video) return
    setCommentSubmitting(true)
    try {
      const res = await videosApi.addComment(video.id, commentText.trim())
      if (res.data.success) {
        setComments((prev) => [...prev, res.data.data.comment])
        setCommentText('')
      }
    } catch (err) {
      console.error('댓글 작성 실패:', err)
    } finally {
      setCommentSubmitting(false)
    }
  }

  // 로딩
  if (loading) {
    return (
      <div className="bg-[#f2ece1] font-display min-h-screen flex items-center justify-center">
        <span className="text-sm text-[#8c8479]">불러오는 중...</span>
      </div>
    )
  }

  // 404
  if (error || !video) {
    return (
      <div className="bg-[#f2ece1] font-display text-slate-900 antialiased min-h-screen flex flex-col items-center justify-center">
        <span className="material-symbols-outlined text-6xl text-slate-300 mb-4">videocam_off</span>
        <h2 className="text-2xl font-bold text-[#2d2926] mb-2">비디오를 찾을 수 없습니다</h2>
        <p className="text-[#5e5452] mb-8">{error || '존재하지 않는 비디오이거나 삭제된 비디오입니다.'}</p>
        <Link
          to="/"
          className="px-6 py-3 bg-primary text-white font-bold rounded-xl hover:bg-[#b05d3f] transition-all"
        >
          홈으로 돌아가기
        </Link>
      </div>
    )
  }

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
              <Link className="text-sm font-medium text-slate-600 hover:text-primary transition-colors" to="/">홈</Link>
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

      <main className="flex-1 max-w-7xl mx-auto w-full px-6 lg:px-20 py-8">
        {/* 뒤로가기 */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-[#5e5452] hover:text-primary transition-colors mb-6 group"
        >
          <span className="material-symbols-outlined text-lg group-hover:-translate-x-1 transition-transform">arrow_back</span>
          <span className="text-sm font-medium">뒤로가기</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* 왼쪽: 비디오 + 정보 */}
          <div className="lg:col-span-2 space-y-8">
            {/* 비디오 플레이어 */}
            {video.video_url ? (
              <div className="aspect-video w-full rounded-2xl overflow-hidden shadow-lg bg-black">
                <video
                  src={resolveApiUrl(video.video_url)}
                  controls
                  autoPlay
                  className="w-full h-full"
                  poster={video.thumbnail_url ? resolveApiUrl(video.thumbnail_url) : undefined}
                />
              </div>
            ) : (
              <div className="aspect-video w-full rounded-2xl overflow-hidden shadow-lg bg-[#f0ebe3] flex items-center justify-center">
                {video.thumbnail_url ? (
                  <img src={resolveApiUrl(video.thumbnail_url)} alt={video.title} className="w-full h-full object-cover" />
                ) : (
                  <span className="material-symbols-outlined text-6xl text-[#c5beb4]">movie</span>
                )}
              </div>
            )}

            {/* 비디오 정보 */}
            <div className="space-y-6">
              <h1 className="text-3xl md:text-4xl font-black text-[#2d2926] tracking-tight">{video.title}</h1>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3 text-sm text-[#8c8479]">
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm">visibility</span>
                    조회 {video.view_count?.toLocaleString() || 0}
                  </span>
                </div>

                {/* 액션 버튼 */}
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleLike}
                    disabled={!isLoggedIn}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all ${
                      liked
                        ? 'bg-red-50 text-red-500 border border-red-200'
                        : 'bg-white text-[#5e5452] border border-[#e5ddd3] hover:border-primary hover:text-primary'
                    }`}
                  >
                    <span className="material-symbols-outlined text-lg">{liked ? 'favorite' : 'favorite_border'}</span>
                    {formatCount(likeCount)}
                  </button>
                  <div className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-[#5e5452] border border-[#e5ddd3] text-sm font-medium">
                    <span className="material-symbols-outlined text-lg">chat_bubble_outline</span>
                    {comments.length}
                  </div>
                </div>
              </div>
            </div>

            {/* 댓글 섹션 */}
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-[#2d2926] flex items-center gap-2">
                <span className="material-symbols-outlined">chat_bubble</span>
                댓글 {comments.length}개
              </h3>

              {/* 댓글 입력 */}
              {isLoggedIn && (
                <div className="flex gap-3">
                  <div className="size-10 rounded-full overflow-hidden flex-shrink-0">
                    {user?.profile_image_url ? (
                      <img src={resolveApiUrl(user.profile_image_url)} alt="내 프로필" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-primary flex items-center justify-center text-white text-xs font-bold">
                        {user?.name?.charAt(0) || '?'}
                      </div>
                    )}
                  </div>
                  <div className="flex-1 flex gap-2">
                    <input
                      className="flex-1 px-4 py-3 bg-white border border-[#e5ddd3] rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                      placeholder="댓글을 입력하세요..."
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleAddComment()}
                      disabled={commentSubmitting}
                    />
                    <button
                      onClick={handleAddComment}
                      disabled={!commentText.trim() || commentSubmitting}
                      className="px-4 py-2 bg-primary text-white text-sm font-bold rounded-xl hover:bg-[#b05d3f] disabled:opacity-40 transition-all"
                    >
                      {commentSubmitting ? '...' : '작성'}
                    </button>
                  </div>
                </div>
              )}

              {/* 댓글 리스트 */}
              <div className="space-y-4">
                {comments.length === 0 ? (
                  <p className="text-sm text-[#8c8479] text-center py-8">아직 댓글이 없습니다. 첫 댓글을 남겨보세요!</p>
                ) : (
                  comments.map((comment) => (
                    <div key={comment.comment_id} className="flex gap-3 bg-white/40 border border-[#eee6d8] rounded-xl p-4">
                      <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <span className="text-primary text-sm font-bold">{comment.nickname?.charAt(0) || '?'}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="font-bold text-sm text-[#2d2926]">{comment.nickname || '익명'}</span>
                        <p className="text-sm text-[#5e5452] leading-relaxed mt-1">{comment.content}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* 오른쪽: 빈 공간 (나중에 관련 영상 추가 가능) */}
          <div className="lg:col-span-1">
            <h3 className="text-lg font-bold text-[#2d2926] mb-6 flex items-center gap-2">
              <span className="material-symbols-outlined">info</span>
              영상 정보
            </h3>
            <div className="bg-white/60 border border-[#e5ddd3] rounded-2xl p-5 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-[#8c8479]">카테고리</span>
                <span className="font-medium text-[#2d2926]">
                  {video.category_id === 1 ? '애니메이션' : video.category_id === 2 ? '히어로' : video.category_id === 3 ? '게임' : '판타지'}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[#8c8479]">좋아요</span>
                <span className="font-medium text-[#2d2926]">{likeCount}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[#8c8479]">댓글</span>
                <span className="font-medium text-[#2d2926]">{comments.length}</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-20 border-t border-[#e5ddd3]/50 bg-[#f9f6f0]/30 px-6 lg:px-20 py-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-3">
            <img src={aiVidLogo} alt="AI Video Studio 로고" className="size-8 rounded-lg bg-primary p-1 object-contain" />
            <span className="font-bold text-[#2d2926]">AI 비디오</span>
          </div>
          <p className="text-sm text-slate-400">&copy; 2024 AI Video Studio. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
