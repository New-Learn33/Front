import { Link } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { userApi } from '../../api/user'
import { resolveApiUrl } from '../../config/env'
import type { UserVideo } from '../../api/user'

function CountUp({ target, suffix = '' }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const duration = 1200
    const steps = 40
    let step = 0
    const timer = setInterval(() => {
      step++
      const progress = 1 - Math.pow(1 - step / steps, 3)
      setCount(Math.round(target * progress))
      if (step >= steps) {
        setCount(target)
        clearInterval(timer)
      }
    }, duration / steps)
    return () => clearInterval(timer)
  }, [target])

  return <span ref={ref}>{count}{suffix}</span>
}

export default function DashboardPage() {
  const { user } = useAuth()
  const [myVideos, setMyVideos] = useState<UserVideo[]>([])
  const [commentCount, setCommentCount] = useState(0)

  useEffect(() => {
    async function fetchData() {
      try {
        const [videosRes, commentsRes] = await Promise.allSettled([
          userApi.getMyVideos(),
          userApi.getMyComments(),
        ])
        if (videosRes.status === 'fulfilled' && videosRes.value.data.success) {
          setMyVideos(videosRes.value.data.data.videos)
        }
        if (commentsRes.status === 'fulfilled' && commentsRes.value.data.success) {
          setCommentCount(commentsRes.value.data.data.comments.length)
        }
      } catch (err) {
        console.error('대시보드 데이터 로드 실패:', err)
      }
    }
    fetchData()
  }, [])

  const totalViews = myVideos.reduce((sum, v) => sum + (v.view_count || 0), 0)
  const totalLikes = myVideos.reduce((sum, v) => sum + (v.like_count || 0), 0)

  const stats = [
    { icon: 'play_circle', label: '생성된 영상', value: myVideos.length, change: '' },
    { icon: 'visibility', label: '총 조회수', value: totalViews, change: '' },
    { icon: 'favorite', label: '총 좋아요', value: totalLikes, change: '' },
    { icon: 'chat_bubble', label: '작성한 댓글', value: commentCount, change: '' },
  ]

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <div className="animate-enter">
        <h1 className="text-2xl font-bold text-[#2d2926]">안녕하세요, {user?.nickname || user?.name || '사용자'}님 👋</h1>
        <p className="text-warm-muted mt-1">오늘도 멋진 영상을 만들어 보세요.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 stagger-children">
        {stats.map((s) => (
          <div key={s.label} className="bg-white rounded-2xl p-5 border border-[#e5ddd3] card-hover">
            <div className="flex items-center justify-between mb-3">
              <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <span className="material-symbols-outlined text-primary">{s.icon}</span>
              </div>
            </div>
            <p className="text-2xl font-bold text-[#2d2926]">
              <CountUp target={s.value} />
            </p>
            <p className="text-xs text-warm-muted mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 stagger-children" style={{ animationDelay: '200ms' }}>
        <Link
          to="/studio/create"
          className="bg-primary text-white rounded-2xl p-6 flex items-center gap-4 card-hover btn-press"
        >
          <div className="size-12 bg-white/20 rounded-xl flex items-center justify-center">
            <span className="material-symbols-outlined text-2xl">auto_awesome</span>
          </div>
          <div>
            <p className="font-bold">새 영상 만들기</p>
            <p className="text-sm text-white/70">AI로 영상을 생성하세요</p>
          </div>
        </Link>
        <Link
          to="/studio/mypage"
          className="bg-white border border-[#e5ddd3] rounded-2xl p-6 flex items-center gap-4 card-hover btn-press"
        >
          <div className="size-12 bg-primary/10 rounded-xl flex items-center justify-center">
            <span className="material-symbols-outlined text-primary text-2xl">person</span>
          </div>
          <div>
            <p className="font-bold text-[#2d2926]">마이페이지</p>
            <p className="text-sm text-warm-muted">내 프로필 및 활동</p>
          </div>
        </Link>
        <Link
          to="/studio/settings"
          className="bg-white border border-[#e5ddd3] rounded-2xl p-6 flex items-center gap-4 card-hover btn-press"
        >
          <div className="size-12 bg-primary/10 rounded-xl flex items-center justify-center">
            <span className="material-symbols-outlined text-primary text-2xl">settings</span>
          </div>
          <div>
            <p className="font-bold text-[#2d2926]">환경설정</p>
            <p className="text-sm text-warm-muted">앱 설정 관리</p>
          </div>
        </Link>
      </div>

      {/* Recent Videos */}
      <div className="animate-enter" style={{ animationDelay: '350ms' }}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-[#2d2926]">내 최근 영상</h2>
          <Link to="/studio/mypage" className="text-xs text-primary font-bold flex items-center gap-1 btn-press">
            전체 보기 <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </Link>
        </div>
        {myVideos.length === 0 ? (
          <div className="bg-white rounded-2xl border border-[#e5ddd3] p-12 flex flex-col items-center text-warm-muted">
            <span className="material-symbols-outlined text-4xl mb-2">movie</span>
            <p className="text-sm">아직 생성한 영상이 없습니다</p>
            <Link to="/studio/create" className="mt-3 text-sm text-primary font-medium hover:underline">
              첫 영상 만들기 →
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {myVideos.slice(0, 4).map((video) => (
              <Link
                key={video.id}
                to={`/video/${video.id}`}
                state={{ video }}
                className="group bg-white rounded-2xl border border-[#e5ddd3] overflow-hidden hover:shadow-lg transition-all"
              >
                <div className="aspect-video bg-[#f0ebe3] flex items-center justify-center relative overflow-hidden">
                  {video.thumbnail_url ? (
                    <img src={resolveApiUrl(video.thumbnail_url)} alt={video.title} className="w-full h-full object-cover" />
                  ) : (
                    <span className="material-symbols-outlined text-3xl text-[#c5beb4]">movie</span>
                  )}
                </div>
                <div className="p-3">
                  <h3 className="text-xs font-bold text-[#2d2926] truncate group-hover:text-primary transition-colors">
                    {video.title}
                  </h3>
                  <div className="flex items-center gap-2 text-[10px] text-warm-muted mt-1">
                    <span>조회 {video.view_count || 0}</span>
                    <span>좋아요 {video.like_count || 0}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
