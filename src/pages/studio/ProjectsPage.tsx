import { useState } from 'react'

const projects = [
  { id: 1, title: '브랜드 홍보 영상', style: '시네마틱', date: '2024.12.15', status: '완료', duration: '0:30', icon: 'movie' },
  { id: 2, title: '제품 소개 릴스', style: '애니메이션', date: '2024.12.14', status: '완료', duration: '0:15', icon: 'animation' },
  { id: 3, title: '자연 다큐멘터리', style: '수채화', date: '2024.12.13', status: '진행중', duration: '0:45', icon: 'landscape' },
  { id: 4, title: '테크 프로모션', style: '사이버펑크', date: '2024.12.12', status: '완료', duration: '0:20', icon: 'computer' },
  { id: 5, title: '음식 브이로그', style: '빈티지', date: '2024.12.11', status: '완료', duration: '0:25', icon: 'restaurant' },
  { id: 6, title: '여행 하이라이트', style: '시네마틱', date: '2024.12.10', status: '진행중', duration: '1:00', icon: 'flight' },
  { id: 7, title: '패션 룩북', style: '3D', date: '2024.12.09', status: '완료', duration: '0:35', icon: 'checkroom' },
  { id: 8, title: '뮤직 비디오', style: '사이버펑크', date: '2024.12.08', status: '완료', duration: '0:40', icon: 'music_note' },
]

const filters = ['전체', '완료', '진행중']

export default function ProjectsPage() {
  const [activeFilter, setActiveFilter] = useState('전체')
  const [search, setSearch] = useState('')

  const filtered = projects.filter((p) => {
    const matchFilter = activeFilter === '전체' || p.status === activeFilter
    const matchSearch = p.title.toLowerCase().includes(search.toLowerCase())
    return matchFilter && matchSearch
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between animate-enter">
        <div>
          <h1 className="text-2xl font-bold text-[#2d2926]">프로젝트</h1>
          <p className="text-warm-muted text-sm mt-1">총 {projects.length}개의 프로젝트</p>
        </div>
        <button className="bg-primary hover:bg-[#1b2d52] text-white text-sm font-bold px-5 py-2.5 rounded-xl flex items-center gap-2 transition-all btn-press">
          <span className="material-symbols-outlined text-lg">add</span>
          새 프로젝트
        </button>
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
            </button>
          ))}
        </div>
        <div className="flex-1 max-w-xs">
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-warm-muted text-lg">search</span>
            <input
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-[#e5ddd3] bg-white text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              placeholder="프로젝트 검색..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 stagger-children">
        {filtered.map((p) => (
          <div
            key={p.id}
            className="bg-white rounded-2xl border border-[#e5ddd3] overflow-hidden group cursor-pointer card-hover"
          >
            <div className="aspect-video bg-[#f9f6f0] flex items-center justify-center relative">
              <span className="material-symbols-outlined text-5xl text-primary/30">{p.icon}</span>
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all flex items-center justify-center">
                <span className="material-symbols-outlined text-white text-3xl opacity-0 group-hover:opacity-100 transition-all">
                  play_circle
                </span>
              </div>
              <span className="absolute bottom-2 right-2 bg-black/60 text-white text-[10px] font-medium px-2 py-0.5 rounded">
                {p.duration}
              </span>
            </div>
            <div className="p-4 space-y-2">
              <h3 className="text-sm font-bold text-[#2d2926]">{p.title}</h3>
              <div className="flex items-center justify-between">
                <span className="text-xs text-warm-muted">{p.style} · {p.date}</span>
                <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                  p.status === '완료'
                    ? 'bg-green-50 text-green-600'
                    : 'bg-amber-50 text-amber-600'
                }`}>
                  {p.status}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
