import { useState } from 'react'

const categories = ['전체', '이미지', '영상', '오디오', '폰트']

const assets = [
  { id: 1, name: '서울 야경.mp4', type: '영상', size: '24.5 MB', date: '2024.12.15', icon: 'videocam' },
  { id: 2, name: '배경음악_01.mp3', type: '오디오', size: '3.2 MB', date: '2024.12.14', icon: 'audio_file' },
  { id: 3, name: '캐릭터_디자인.png', type: '이미지', size: '1.8 MB', date: '2024.12.13', icon: 'image' },
  { id: 4, name: '인트로_애니메이션.mp4', type: '영상', size: '18.3 MB', date: '2024.12.12', icon: 'videocam' },
  { id: 5, name: '타이틀_폰트.ttf', type: '폰트', size: '0.5 MB', date: '2024.12.11', icon: 'font_download' },
  { id: 6, name: '자연_배경.jpg', type: '이미지', size: '4.1 MB', date: '2024.12.10', icon: 'image' },
  { id: 7, name: '효과음_모음.mp3', type: '오디오', size: '7.6 MB', date: '2024.12.09', icon: 'audio_file' },
  { id: 8, name: '프로모션_클립.mp4', type: '영상', size: '32.1 MB', date: '2024.12.08', icon: 'videocam' },
  { id: 9, name: '로고_원본.svg', type: '이미지', size: '0.2 MB', date: '2024.12.07', icon: 'image' },
  { id: 10, name: '나레이션.mp3', type: '오디오', size: '5.4 MB', date: '2024.12.06', icon: 'audio_file' },
  { id: 11, name: '제품샷_01.png', type: '이미지', size: '2.9 MB', date: '2024.12.05', icon: 'image' },
  { id: 12, name: '아웃트로.mp4', type: '영상', size: '15.7 MB', date: '2024.12.04', icon: 'videocam' },
]

export default function AssetLibraryPage() {
  const [activeCategory, setActiveCategory] = useState('전체')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  const filtered = activeCategory === '전체'
    ? assets
    : assets.filter((a) => a.type === activeCategory)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between animate-enter">
        <div>
          <h1 className="text-2xl font-bold text-[#2d2926]">에셋 라이브러리</h1>
          <p className="text-warm-muted text-sm mt-1">총 {assets.length}개의 에셋 · 115.3 MB 사용 중</p>
        </div>
        <button className="bg-primary hover:bg-[#58717c] text-white text-sm font-bold px-5 py-2.5 rounded-xl flex items-center gap-2 transition-all btn-press">
          <span className="material-symbols-outlined text-lg">upload</span>
          업로드
        </button>
      </div>

      {/* Filter & View */}
      <div className="flex items-center justify-between animate-enter" style={{ animationDelay: '100ms' }}>
        <div className="flex items-center gap-2">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setActiveCategory(c)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeCategory === c
                  ? 'bg-primary text-white'
                  : 'bg-white border border-[#e5ddd3] text-warm-muted hover:bg-[#f9f6f0]'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-1 bg-white border border-[#e5ddd3] rounded-lg p-1">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-1.5 rounded transition-all ${viewMode === 'grid' ? 'bg-primary/10 text-primary' : 'text-warm-muted'}`}
          >
            <span className="material-symbols-outlined text-lg">grid_view</span>
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-1.5 rounded transition-all ${viewMode === 'list' ? 'bg-primary/10 text-primary' : 'text-warm-muted'}`}
          >
            <span className="material-symbols-outlined text-lg">view_list</span>
          </button>
        </div>
      </div>

      {/* Content */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 stagger-children">
          {filtered.map((a) => (
            <div
              key={a.id}
              className="bg-white rounded-2xl border border-[#e5ddd3] overflow-hidden cursor-pointer group card-hover"
            >
              <div className="aspect-square bg-[#f9f6f0] flex items-center justify-center relative">
                <span className="material-symbols-outlined text-4xl text-primary/30">{a.icon}</span>
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all" />
              </div>
              <div className="p-3">
                <p className="text-xs font-semibold text-[#2d2926] truncate">{a.name}</p>
                <p className="text-[10px] text-warm-muted mt-1">{a.size} · {a.date}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-[#e5ddd3] overflow-hidden animate-enter-scale" style={{ animationDelay: '150ms' }}>
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#e5ddd3] text-xs text-warm-muted">
                <th className="text-left px-6 py-3 font-medium">이름</th>
                <th className="text-left px-6 py-3 font-medium">유형</th>
                <th className="text-left px-6 py-3 font-medium">크기</th>
                <th className="text-left px-6 py-3 font-medium">날짜</th>
                <th className="text-right px-6 py-3 font-medium">작업</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((a) => (
                <tr key={a.id} className="border-b border-[#e5ddd3] last:border-0 hover:bg-[#f9f6f0] transition-colors">
                  <td className="px-6 py-3">
                    <div className="flex items-center gap-3">
                      <div className="size-8 rounded-lg bg-primary/10 flex items-center justify-center">
                        <span className="material-symbols-outlined text-primary text-sm">{a.icon}</span>
                      </div>
                      <span className="text-sm font-medium text-[#2d2926]">{a.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-3 text-sm text-warm-muted">{a.type}</td>
                  <td className="px-6 py-3 text-sm text-warm-muted">{a.size}</td>
                  <td className="px-6 py-3 text-sm text-warm-muted">{a.date}</td>
                  <td className="px-6 py-3 text-right">
                    <button className="text-warm-muted hover:text-primary transition-colors">
                      <span className="material-symbols-outlined text-lg">more_horiz</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
