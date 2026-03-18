import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { userApi, type UserProject } from '../../api/user'
import { resolveApiUrl } from '../../config/env'

const categoryLabels: Record<number, string> = {
  1: '애니메이션',
  2: '히어로',
  3: '게임',
  4: '판타지',
}

const filters = ['전체', '완료', '진행중'] as const
type Filter = (typeof filters)[number]

function statusLabel(status: string): { text: string; className: string } {
  switch (status) {
    case 'completed':
      return { text: '완료', className: 'bg-green-50 text-green-600' }
    case 'processing':
      return { text: '생성 중', className: 'bg-amber-50 text-amber-600' }
    case 'pending':
      return { text: '대기 중', className: 'bg-blue-50 text-blue-600' }
    default:
      return { text: status, className: 'bg-gray-50 text-gray-600' }
  }
}

function formatDate(iso: string | null) {
  if (!iso) return '-'
  const d = new Date(iso)
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`
}

function matchFilter(project: UserProject, filter: Filter): boolean {
  if (filter === '전체') return true
  if (filter === '완료') return project.status === 'completed'
  return project.status === 'pending' || project.status === 'processing'
}

export default function ProjectsPage() {
  const [activeFilter, setActiveFilter] = useState<Filter>('전체')
  const [search, setSearch] = useState('')
  const [projects, setProjects] = useState<UserProject[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetch() {
      setLoading(true)
      try {
        const res = await userApi.getMyProjects()
        if (res.data.success) {
          setProjects(res.data.data.projects)
        }
      } catch (err) {
        console.error('작업 목록 조회 실패:', err)
      } finally {
        setLoading(false)
      }
    }
    fetch()
  }, [])

  const handleCancel = async (jobId: number) => {
    if (!confirm('이 작업을 취소하시겠습니까?')) return
    try {
      const res = await userApi.cancelProject(jobId)
      if (res.data.success) {
        setProjects(prev => prev.filter(p => !(p.type === 'job' && p.id === jobId)))
      }
    } catch {
      alert('작업 취소에 실패했습니다.')
    }
  }

  const filtered = projects.filter((p) => {
    return matchFilter(p, activeFilter) && p.title.toLowerCase().includes(search.toLowerCase())
  })

  const completedCount = projects.filter((p) => p.status === 'completed').length
  const inProgressCount = projects.filter((p) => p.status !== 'completed').length

  return (
    <div className="space-y-6">
      <div className="animate-enter">
        <h1 className="text-2xl font-bold text-[#2d2926]">작업 목록</h1>
        <p className="text-warm-muted text-sm mt-1">
          총 {projects.length}개의 작업 · 완료 {completedCount} · 진행중 {inProgressCount}
        </p>
      </div>

      {/* Filter & Search */}
      <div className="flex items-center gap-4 animate-enter" style={{ animationDelay: '100ms' }}>
        <div className="flex items-center gap-2">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeFilter === f
                  ? 'bg-primary text-white'
                  : 'bg-white border border-[#e5ddd3] text-warm-muted hover:bg-[#f9f6f0]'
              }`}
            >
              {f}
              {f === '완료' && <span className="ml-1 text-xs opacity-70">({completedCount})</span>}
              {f === '진행중' && <span className="ml-1 text-xs opacity-70">({inProgressCount})</span>}
            </button>
          ))}
        </div>
        <div className="flex-1 max-w-xs">
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-warm-muted text-lg">search</span>
            <input
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-[#e5ddd3] bg-white text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              placeholder="작업 검색..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <span className="material-symbols-outlined text-2xl text-primary animate-spin">progress_activity</span>
          <span className="ml-2 text-sm text-warm-muted">불러오는 중...</span>
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-warm-muted">
          <span className="material-symbols-outlined text-5xl mb-3">folder_open</span>
          <p className="text-sm">
            {projects.length === 0 ? '아직 작업이 없습니다' : '검색 결과가 없습니다'}
          </p>
          {projects.length === 0 && (
            <Link to="/studio/create" className="mt-4 text-sm text-primary font-medium hover:underline">
              첫 영상 만들기
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 stagger-children">
          {filtered.map((p) => {
            const st = statusLabel(p.status)
            const isCompleted = p.status === 'completed'
            const Wrapper = isCompleted ? Link : 'div'
            const wrapperProps = isCompleted
              ? { to: `/video/${p.id}`, state: { video: p } }
              : {}

            return (
              <Wrapper
                key={`${p.type}-${p.id}`}
                {...(wrapperProps as any)}
                className="bg-white rounded-2xl border border-[#e5ddd3] overflow-hidden group cursor-pointer card-hover block"
              >
                <div className="aspect-video bg-[#f9f6f0] flex items-center justify-center relative overflow-hidden">
                  {p.thumbnail_url ? (
                    <img
                      src={resolveApiUrl(p.thumbnail_url)}
                      alt={p.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <span className="material-symbols-outlined text-5xl text-primary/30">
                      {isCompleted ? 'movie' : 'hourglass_top'}
                    </span>
                  )}
                  {isCompleted && (
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all flex items-center justify-center">
                      <span className="material-symbols-outlined text-white text-3xl opacity-0 group-hover:opacity-100 transition-all">
                        play_circle
                      </span>
                    </div>
                  )}
                  {!isCompleted && p.progress !== undefined && p.progress > 0 && (
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/20">
                      <div
                        className="h-full bg-primary transition-all"
                        style={{ width: `${p.progress}%` }}
                      />
                    </div>
                  )}
                </div>
                <div className="p-4 space-y-2">
                  <h3 className="text-sm font-bold text-[#2d2926] truncate group-hover:text-primary transition-colors">
                    {p.title}
                  </h3>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-warm-muted">
                      {categoryLabels[p.category_id] || '비디오'} · {formatDate(p.created_at)}
                    </span>
                    <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${st.className}`}>
                      {st.text}
                    </span>
                  </div>
                  {isCompleted && (
                    <div className="flex items-center gap-3 text-xs text-warm-muted">
                      <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-xs">visibility</span>
                        {p.view_count.toLocaleString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-xs">favorite</span>
                        {p.like_count.toLocaleString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-xs">chat_bubble</span>
                        {p.comment_count}
                      </span>
                    </div>
                  )}
                  {!isCompleted && (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs text-amber-600">
                        <span className="material-symbols-outlined text-sm animate-spin">progress_activity</span>
                        {p.status === 'processing' ? `생성 중 (${p.progress || 0}%)` : '대기 중...'}
                      </div>
                      <button
                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleCancel(p.id) }}
                        className="text-xs text-warm-muted hover:text-red-500 transition-colors flex items-center gap-1"
                      >
                        <span className="material-symbols-outlined text-sm">cancel</span>
                        취소
                      </button>
                    </div>
                  )}
                </div>
              </Wrapper>
            )
          })}
        </div>
      )}
    </div>
  )
}
