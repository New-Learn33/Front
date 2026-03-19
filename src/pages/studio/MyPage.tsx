import { useState, useEffect } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { userApi } from '../../api/user'
import { resolveApiUrl } from '../../config/env'
import type { UserVideo, UserComment } from '../../api/user'
import { Link } from 'react-router-dom'

type Tab = 'videos' | 'likes' | 'comments'

export default function MyPage() {
  const { user, isLoading: authLoading } = useAuth()
  const [activeTab, setActiveTab] = useState<Tab>('videos')
  const [nickname, setNickname] = useState('')
  const [isEditingNickname, setIsEditingNickname] = useState(false)
  const [nicknameSaving, setNicknameSaving] = useState(false)

  const [videos, setVideos] = useState<UserVideo[]>([])
  const [likedVideos, setLikedVideos] = useState<UserVideo[]>([])
  const [comments, setComments] = useState<UserComment[]>([])
  const [loadingVideos, setLoadingVideos] = useState(false)
  const [loadingLikes, setLoadingLikes] = useState(false)
  const [loadingComments, setLoadingComments] = useState(false)

  // 유저 닉네임 초기화
  useEffect(() => {
    if (user?.nickname) setNickname(user.nickname)
  }, [user])

  // 내 영상 불러오기
  useEffect(() => {
    async function fetchVideos() {
      setLoadingVideos(true)
      try {
        const res = await userApi.getMyVideos()
        if (res.data.success) {
          setVideos(res.data.data.videos)
        }
      } catch (err) {
        console.error('영상 조회 실패:', err)
      } finally {
        setLoadingVideos(false)
      }
    }
    fetchVideos()
  }, [])

  // 좋아요 영상 불러오기
  useEffect(() => {
    async function fetchLikes() {
      setLoadingLikes(true)
      try {
        const res = await userApi.getMyLikes()
        if (res.data.success) {
          setLikedVideos(res.data.data.videos)
        }
      } catch (err) {
        console.error('좋아요 조회 실패:', err)
      } finally {
        setLoadingLikes(false)
      }
    }
    fetchLikes()
  }, [])

  // 내 댓글 불러오기
  useEffect(() => {
    async function fetchComments() {
      setLoadingComments(true)
      try {
        const res = await userApi.getMyComments()
        if (res.data.success) {
          setComments(res.data.data.comments)
        }
      } catch (err) {
        console.error('댓글 조회 실패:', err)
      } finally {
        setLoadingComments(false)
      }
    }
    fetchComments()
  }, [])

  // 닉네임 저장
  const handleNicknameSave = async () => {
    if (!nickname.trim()) return
    setNicknameSaving(true)
    try {
      const res = await userApi.updateProfile({ nickname: nickname.trim() })
      if (res.data.success) {
        setIsEditingNickname(false)
        // localStorage에 유저 정보 갱신
        const stored = localStorage.getItem('user')
        if (stored) {
          const parsed = JSON.parse(stored)
          parsed.nickname = nickname.trim()
          localStorage.setItem('user', JSON.stringify(parsed))
        }
        // 전체 페이지 리로드를 하면 배포 환경에서 /studio/mypage 404가 날 수 있어
        // 로컬 상태/스토리지 갱신만으로 화면을 유지한다.
      }
    } catch (err) {
      console.error('닉네임 수정 실패:', err)
      alert('닉네임 수정에 실패했습니다.')
    } finally {
      setNicknameSaving(false)
    }
  }

  // 댓글 삭제
  const handleDeleteComment = async (commentId: number) => {
    if (!confirm('댓글을 삭제하시겠습니까?')) return
    try {
      await userApi.deleteComment(commentId)
      setComments((prev) => prev.filter((c) => c.id !== commentId))
    } catch (err) {
      console.error('댓글 삭제 실패:', err)
      alert('댓글 삭제에 실패했습니다.')
    }
  }

  const tabs: { key: Tab; label: string; icon: string; count: number }[] = [
    { key: 'videos', label: '내 영상', icon: 'movie', count: videos.length },
    { key: 'likes', label: '좋아요', icon: 'favorite', count: likedVideos.length },
    { key: 'comments', label: '내 댓글', icon: 'chat_bubble', count: comments.length },
  ]

  if (authLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <span className="text-sm text-warm-muted">불러오는 중...</span>
      </div>
    )
  }

  return (
    <div className="max-w-4xl space-y-8 stagger-children">
      <div>
        <h1 className="text-2xl font-bold text-[#2d2926]">마이페이지</h1>
        <p className="text-warm-muted text-sm mt-1">내 정보와 활동을 확인합니다.</p>
      </div>

      {/* Profile Card */}
      <div className="bg-white rounded-2xl border border-[#dde7f1] p-6">
        <div className="flex items-center gap-6">
          {user?.profile_image_url ? (
            <img src={user.profile_image_url} alt="프로필" className="size-20 rounded-full object-cover" />
          ) : (
            <div className="size-20 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-primary text-3xl font-bold">{user?.name?.charAt(0) || '?'}</span>
            </div>
          )}
          <div className="flex-1 space-y-2">
            {/* Nickname */}
            <div className="flex items-center gap-3">
              {isEditingNickname ? (
                <div className="flex items-center gap-2">
                  <input
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                    className="h-9 px-3 rounded-lg border border-[#dde7f1] bg-[#f5f9fd] text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    placeholder="닉네임 입력"
                    maxLength={20}
                    autoFocus
                    onKeyDown={(e) => e.key === 'Enter' && handleNicknameSave()}
                  />
                  <button
                    onClick={handleNicknameSave}
                    disabled={nicknameSaving}
                    className="h-9 px-4 bg-primary text-white text-sm font-medium rounded-lg hover:bg-[#58717c] transition-all disabled:opacity-50"
                  >
                    {nicknameSaving ? '저장 중...' : '저장'}
                  </button>
                  <button
                    onClick={() => { setIsEditingNickname(false); setNickname(user?.nickname || '') }}
                    className="h-9 px-3 text-sm text-warm-muted hover:text-[#2d2926] transition-colors"
                  >
                    취소
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-bold text-[#2d2926]">
                    {nickname || user?.nickname || '익명의 참가자'}
                  </h2>
                  <button
                    onClick={() => { setNickname(user?.nickname || ''); setIsEditingNickname(true) }}
                    className="text-warm-muted hover:text-primary transition-colors"
                  >
                    <span className="material-symbols-outlined text-lg">edit</span>
                  </button>
                </div>
              )}
            </div>
            <p className="text-sm text-warm-muted">{user?.email || '-'}</p>
            <div className="flex items-center gap-3">
              <span className="inline-block text-[11px] font-medium px-2.5 py-1 rounded-full bg-primary/10 text-primary">
                {user?.provider === 'google' ? 'Google 계정' : '이메일 계정'}
              </span>
              {/* 플랜 뱃지 제거 */}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-[#dde7f1]">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-2 px-5 py-3 text-sm font-medium border-b-2 transition-all ${
              activeTab === tab.key
                ? 'border-primary text-primary'
                : 'border-transparent text-warm-muted hover:text-[#2d2926]'
            }`}
          >
            <span className="material-symbols-outlined text-lg">{tab.icon}</span>
            {tab.label}
            <span className={`text-xs px-1.5 py-0.5 rounded-full ${
              activeTab === tab.key ? 'bg-primary/10 text-primary' : 'bg-[#f0ebe3] text-warm-muted'
            }`}>
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Tab Content - 내 영상 */}
      {activeTab === 'videos' && (
        <div className="space-y-4">
          {loadingVideos ? (
            <div className="flex items-center justify-center py-16">
              <span className="text-sm text-warm-muted">영상을 불러오는 중...</span>
            </div>
          ) : videos.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-warm-muted">
              <span className="material-symbols-outlined text-5xl mb-3">movie</span>
              <p className="text-sm">아직 업로드한 영상이 없습니다</p>
              <Link to="/studio/create" className="mt-4 text-sm text-primary font-medium hover:underline">
                첫 영상 만들기
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {videos.map((video) => (
                <Link
                  key={video.id}
                  to={`/video/${video.id}`}
                  state={{ video }}
                  className="group bg-white rounded-2xl border border-[#dde7f1] overflow-hidden hover:shadow-lg transition-all"
                >
                  <div className="aspect-video bg-[#f0ebe3] flex items-center justify-center relative overflow-hidden">
                    {video.thumbnail_url ? (
                      <img src={resolveApiUrl(video.thumbnail_url)} alt={video.title} className="w-full h-full object-cover" />
                    ) : (
                      <span className="material-symbols-outlined text-4xl text-[#c5beb4]">movie</span>
                    )}
                  </div>
                  <div className="p-4 space-y-2">
                    <h3 className="text-sm font-bold text-[#2d2926] truncate group-hover:text-primary transition-colors">
                      {video.title}
                    </h3>
                    <div className="flex items-center gap-3 text-xs text-warm-muted">
                      <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-xs">visibility</span>
                        {video.view_count?.toLocaleString() || 0}
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-xs">favorite</span>
                        {video.like_count?.toLocaleString() || 0}
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-xs">chat_bubble</span>
                        {video.comment_count || 0}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab Content - 좋아요 */}
      {activeTab === 'likes' && (
        <div className="space-y-4">
          {loadingLikes ? (
            <div className="flex items-center justify-center py-16">
              <span className="text-sm text-warm-muted">불러오는 중...</span>
            </div>
          ) : likedVideos.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-warm-muted">
              <span className="material-symbols-outlined text-5xl mb-3">favorite</span>
              <p className="text-sm">좋아요한 영상이 없습니다</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {likedVideos.map((video) => (
                <Link
                  key={video.id}
                  to={`/video/${video.id}`}
                  state={{ video }}
                  className="group bg-white rounded-2xl border border-[#dde7f1] overflow-hidden hover:shadow-lg transition-all"
                >
                  <div className="aspect-video bg-[#f0ebe3] flex items-center justify-center relative overflow-hidden">
                    {video.thumbnail_url ? (
                      <img src={resolveApiUrl(video.thumbnail_url)} alt={video.title} className="w-full h-full object-cover" />
                    ) : (
                      <span className="material-symbols-outlined text-4xl text-[#c5beb4]">movie</span>
                    )}
                  </div>
                  <div className="p-4 space-y-2">
                    <h3 className="text-sm font-bold text-[#2d2926] truncate group-hover:text-primary transition-colors">
                      {video.title}
                    </h3>
                    <div className="flex items-center gap-3 text-xs text-warm-muted">
                      <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-xs">visibility</span>
                        {video.view_count?.toLocaleString() || 0}
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-xs text-red-400">favorite</span>
                        {video.like_count?.toLocaleString() || 0}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab Content - 내 댓글 */}
      {activeTab === 'comments' && (
        <div className="space-y-3">
          {loadingComments ? (
            <div className="flex items-center justify-center py-16">
              <span className="text-sm text-warm-muted">댓글을 불러오는 중...</span>
            </div>
          ) : comments.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-warm-muted">
              <span className="material-symbols-outlined text-5xl mb-3">chat_bubble</span>
              <p className="text-sm">작성한 댓글이 없습니다</p>
            </div>
          ) : (
            comments.map((comment) => (
              <div key={comment.id} className="bg-white rounded-2xl border border-[#dde7f1] p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 space-y-2">
                    <Link
                      to={`/video/${comment.video_id}`}
                      className="text-xs font-medium text-primary hover:underline"
                    >
                      {comment.video_title || `영상 #${comment.video_id}`}
                    </Link>
                    <p className="text-sm text-[#2d2926]">{comment.content}</p>
                    {comment.created_at && (
                      <p className="text-xs text-warm-muted">{comment.created_at}</p>
                    )}
                  </div>
                  <button
                    onClick={() => handleDeleteComment(comment.id)}
                    className="text-warm-muted hover:text-red-500 transition-colors p-1"
                    title="댓글 삭제"
                  >
                    <span className="material-symbols-outlined text-lg">delete</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  )
}
