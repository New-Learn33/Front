import { Link } from 'react-router-dom'

const stats = [
  { icon: 'play_circle', label: '생성된 영상', value: '24', change: '+3 이번 주' },
  { icon: 'folder_open', label: '활성 프로젝트', value: '8', change: '+1 이번 주' },
  { icon: 'image', label: '저장된 에셋', value: '156', change: '+12 이번 주' },
  { icon: 'schedule', label: '이용 시간', value: '18h', change: '이번 달' },
]

const recentProjects = [
  { title: '브랜드 홍보 영상', style: '시네마틱', date: '2024.12.15', status: '완료', thumb: 'movie' },
  { title: '제품 소개 릴스', style: '애니메이션', date: '2024.12.14', status: '완료', thumb: 'animation' },
  { title: '자연 다큐멘터리', style: '수채화', date: '2024.12.13', status: '진행중', thumb: 'landscape' },
  { title: '테크 프로모션', style: '사이버펑크', date: '2024.12.12', status: '완료', thumb: 'computer' },
]

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      {/* Welcome */}
      <div>
        <h1 className="text-2xl font-bold text-[#2d2926]">안녕하세요, 사용자님 👋</h1>
        <p className="text-warm-muted mt-1">오늘도 멋진 영상을 만들어 보세요.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="bg-white rounded-2xl p-5 border border-[#e5ddd3]">
            <div className="flex items-center justify-between mb-3">
              <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <span className="material-symbols-outlined text-primary">{s.icon}</span>
              </div>
              <span className="text-[11px] text-green-600 font-medium bg-green-50 px-2 py-0.5 rounded-full">{s.change}</span>
            </div>
            <p className="text-2xl font-bold text-[#2d2926]">{s.value}</p>
            <p className="text-xs text-warm-muted mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link
          to="/studio/create"
          className="bg-primary text-white rounded-2xl p-6 flex items-center gap-4 hover:opacity-90 transition-all"
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
          to="/studio/projects"
          className="bg-white border border-[#e5ddd3] rounded-2xl p-6 flex items-center gap-4 hover:bg-[#f9f6f0] transition-all"
        >
          <div className="size-12 bg-primary/10 rounded-xl flex items-center justify-center">
            <span className="material-symbols-outlined text-primary text-2xl">folder_open</span>
          </div>
          <div>
            <p className="font-bold text-[#2d2926]">프로젝트 보기</p>
            <p className="text-sm text-warm-muted">진행 중인 프로젝트</p>
          </div>
        </Link>
        <Link
          to="/studio/assets"
          className="bg-white border border-[#e5ddd3] rounded-2xl p-6 flex items-center gap-4 hover:bg-[#f9f6f0] transition-all"
        >
          <div className="size-12 bg-primary/10 rounded-xl flex items-center justify-center">
            <span className="material-symbols-outlined text-primary text-2xl">perm_media</span>
          </div>
          <div>
            <p className="font-bold text-[#2d2926]">에셋 라이브러리</p>
            <p className="text-sm text-warm-muted">저장된 미디어 관리</p>
          </div>
        </Link>
      </div>

      {/* Recent Projects */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-[#2d2926]">최근 프로젝트</h2>
          <Link to="/studio/projects" className="text-xs text-primary font-bold flex items-center gap-1">
            전체 보기 <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </Link>
        </div>
        <div className="bg-white rounded-2xl border border-[#e5ddd3] overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#e5ddd3] text-xs text-warm-muted">
                <th className="text-left px-6 py-3 font-medium">프로젝트</th>
                <th className="text-left px-6 py-3 font-medium">스타일</th>
                <th className="text-left px-6 py-3 font-medium">날짜</th>
                <th className="text-left px-6 py-3 font-medium">상태</th>
              </tr>
            </thead>
            <tbody>
              {recentProjects.map((p) => (
                <tr key={p.title} className="border-b border-[#e5ddd3] last:border-0 hover:bg-[#f9f6f0] transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <span className="material-symbols-outlined text-primary text-lg">{p.thumb}</span>
                      </div>
                      <span className="text-sm font-semibold text-[#2d2926]">{p.title}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-warm-muted">{p.style}</td>
                  <td className="px-6 py-4 text-sm text-warm-muted">{p.date}</td>
                  <td className="px-6 py-4">
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                      p.status === '완료'
                        ? 'bg-green-50 text-green-600'
                        : 'bg-amber-50 text-amber-600'
                    }`}>
                      {p.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
