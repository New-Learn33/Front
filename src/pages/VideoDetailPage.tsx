import { useState, useMemo } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { allVideos, getCommentsForVideo, formatCount, formatDate } from '../data/videos'
import aiVidLogo from '@/assets/AI_vid_logo.png'
import { resolveApiUrl } from '@/config/env'

export default function VideoDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { user, isLoggedIn, logout } = useAuth()
  const [liked, setLiked] = useState(false)

  const video = allVideos.find((v) => v.id === Number(id))

  // 관련 비디오 (현재 비디오 제외, 랜덤 4개)
  const relatedVideos = useMemo(() => {
    if (!video) return []
    const others = allVideos.filter((v) => v.id !== video.id)
    const shuffled = [...others].sort(() => Math.random() - 0.5)
    return shuffled.slice(0, 4)
  }, [video])

  // 댓글
  const comments = video ? getCommentsForVideo(video.id) : []

  // 404 처리
  if (!video) {
    return (
      <div className="bg-[#f2ece1] font-display text-slate-900 antialiased min-h-screen flex flex-col items-center justify-center">
        <span className="material-symbols-outlined text-6xl text-slate-300 mb-4">videocam_off</span>
        <h2 className="text-2xl font-bold text-[#2d2926] mb-2">비디오를 찾을 수 없습니다</h2>
        <p className="text-[#5e5452] mb-8">존재하지 않는 비디오이거나 삭제된 비디오입니다.</p>
        <Link
          to="/"
          className="px-6 py-3 bg-primary text-white font-bold rounded-xl hover:bg-[#b05d3f] transition-all"
        >
          홈으로 돌아가기
        </Link>
      </div>
    )
  }

  const displayLikes = liked ? video.likes + 1 : video.likes

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
            {/* 비디오 플레이어 영역 */}
            <div className="relative aspect-video w-full rounded-2xl overflow-hidden shadow-lg group cursor-pointer">
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url("${video.image}")` }}
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors" />
              {/* 재생 버튼 */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="size-20 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-4xl text-primary ml-1">play_arrow</span>
                </div>
              </div>
              {/* 길이 */}
              <div className="absolute bottom-4 right-4">
                <span className="text-sm bg-black/50 backdrop-blur-md text-white px-3 py-1.5 rounded-lg font-medium">{video.duration}</span>
              </div>
            </div>

            {/* 비디오 정보 */}
            <div className="space-y-6">
              <h1 className="text-3xl md:text-4xl font-black text-[#2d2926] tracking-tight">{video.title}</h1>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                {/* 크리에이터 */}
                <div className="flex items-center gap-3">
                  <div className="size-12 rounded-full overflow-hidden ring-2 ring-primary/20">
                    <img className="w-full h-full object-cover" src={video.avatar} alt={video.creator} />
                  </div>
                  <div>
                    <p className="font-bold text-[#2d2926]">{video.creator}</p>
                    <p className="text-xs text-[#8c8479]">{formatDate(video.createdAt)}</p>
                  </div>
                </div>

                {/* 액션 버튼 */}
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setLiked(!liked)}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all ${
                      liked
                        ? 'bg-red-50 text-red-500 border border-red-200'
                        : 'bg-white text-[#5e5452] border border-[#e5ddd3] hover:border-primary hover:text-primary'
                    }`}
                  >
                    <span className="material-symbols-outlined text-lg">{liked ? 'favorite' : 'favorite_border'}</span>
                    {formatCount(displayLikes)}
                  </button>
                  <div className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-[#5e5452] border border-[#e5ddd3] text-sm font-medium">
                    <span className="material-symbols-outlined text-lg">chat_bubble_outline</span>
                    {formatCount(video.comments)}
                  </div>
                  <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white text-[#5e5452] border border-[#e5ddd3] hover:border-primary hover:text-primary text-sm font-medium transition-all">
                    <span className="material-symbols-outlined text-lg">share</span>
                  </button>
                </div>
              </div>

              {/* 설명 */}
              <div className="bg-white/60 border border-[#e5ddd3] rounded-2xl p-6">
                <p className="text-[#5e5452] leading-relaxed">{video.description}</p>
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
                  <div className="flex-1 relative">
                    <input
                      className="w-full px-4 py-3 bg-white border border-[#e5ddd3] rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                      placeholder="댓글을 입력하세요..."
                      type="text"
                    />
                  </div>
                </div>
              )}

              {/* 댓글 리스트 */}
              <div className="space-y-4">
                {comments.map((comment) => (
                  <div key={comment.id} className="flex gap-3 bg-white/40 border border-[#eee6d8] rounded-xl p-4">
                    <div className="size-10 rounded-full overflow-hidden flex-shrink-0">
                      <img className="w-full h-full object-cover" src={comment.avatar} alt={comment.author} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-sm text-[#2d2926]">{comment.author}</span>
                        <span className="text-xs text-[#8c8479]">{formatDate(comment.createdAt)}</span>
                      </div>
                      <p className="text-sm text-[#5e5452] leading-relaxed">{comment.content}</p>
                      <div className="flex items-center gap-3 mt-2">
                        <button className="flex items-center gap-1 text-xs text-[#8c8479] hover:text-primary transition-colors">
                          <span className="material-symbols-outlined text-sm">thumb_up</span>
                          {comment.likes}
                        </button>
                        <button className="text-xs text-[#8c8479] hover:text-primary transition-colors">답글</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 오른쪽: 관련 비디오 */}
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
                  className="flex gap-3 group bg-white/50 hover:bg-white border border-[#eee6d8] hover:border-primary/30 rounded-xl p-3 transition-all hover:shadow-md"
                >
                  <div className="relative w-36 flex-shrink-0 aspect-video rounded-lg overflow-hidden">
                    <div
                      className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-300"
                      style={{ backgroundImage: `url("${rv.image}")` }}
                    />
                    <div className="absolute bottom-1 right-1">
                      <span className="text-[10px] bg-black/50 backdrop-blur-sm text-white px-1.5 py-0.5 rounded">{rv.duration}</span>
                    </div>
                  </div>
                  <div className="flex-1 min-w-0 py-1">
                    <h4 className="font-bold text-sm text-[#2d2926] truncate group-hover:text-primary transition-colors">{rv.title}</h4>
                    <p className="text-xs text-[#8c8479] mt-1">{rv.creator}</p>
                    <div className="flex items-center gap-3 mt-2 text-[#8c8479]">
                      <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-xs">favorite</span>
                        <span className="text-xs">{formatCount(rv.likes)}</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-xs">chat_bubble</span>
                        <span className="text-xs">{formatCount(rv.comments)}</span>
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
