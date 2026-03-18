import { useState, useEffect, useRef } from 'react'
import { assetsApi } from '@/api/assets'
import type { Asset } from '@/types/asset'
import { resolveApiUrl } from '@/config/env'

const categories = [
  { id: null, label: '전체' },
  { id: 1, label: '애니메이션' },
  { id: 2, label: '히어로' },
  { id: 3, label: '게임' },
  { id: 4, label: '판타지' },
]

function formatSize(bytes?: number): string {
  if (!bytes) return '0 B'
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`
}

function guessIcon(name: string): string {
  const ext = name.split('.').pop()?.toLowerCase() || ''
  if (['mp4', 'mov', 'avi', 'webm'].includes(ext)) return 'videocam'
  if (['mp3', 'wav', 'ogg', 'aac'].includes(ext)) return 'audio_file'
  if (['ttf', 'otf', 'woff', 'woff2'].includes(ext)) return 'font_download'
  return 'image'
}

function guessType(name: string): string {
  const ext = name.split('.').pop()?.toLowerCase() || ''
  if (['mp4', 'mov', 'avi', 'webm'].includes(ext)) return '영상'
  if (['mp3', 'wav', 'ogg', 'aac'].includes(ext)) return '오디오'
  if (['ttf', 'otf', 'woff', 'woff2'].includes(ext)) return '폰트'
  return '이미지'
}

export default function AssetLibraryPage() {
  const [activeCategory, setActiveCategory] = useState<number | null>(null)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [assets, setAssets] = useState<Asset[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const fetchAssets = async () => {
    try {
      const params = activeCategory ? { category_id: activeCategory } : undefined
      const res = await assetsApi.list(params)
      if (res.data.success) {
        setAssets(res.data.data)
      }
    } catch {
      // 인증 안 된 경우 등 무시
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    setLoading(true)
    fetchAssets()
  }, [activeCategory])

  const totalSize = assets.reduce((sum, a) => sum + (a.file_size || 0), 0)

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    try {
      const res = await assetsApi.upload(file, activeCategory || 1)
      if (res.data.success) {
        setAssets(prev => [res.data.data, ...prev])
      }
    } catch (err: any) {
      const detail = err.response?.data?.detail
      alert(typeof detail === 'string' ? detail : '업로드에 실패했습니다.')
    } finally {
      setUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  const handleDelete = async (assetId: string) => {
    if (!confirm('이 에셋을 삭제하시겠습니까?')) return
    try {
      const res = await assetsApi.delete(assetId)
      if (res.data.success) {
        setAssets(prev => prev.filter(a => a.id !== assetId))
      }
    } catch {
      alert('삭제에 실패했습니다.')
    }
  }

  const timeAgo = (dateStr?: string) => {
    if (!dateStr) return ''
    const d = new Date(dateStr)
    return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between animate-enter">
        <div>
          <h1 className="text-2xl font-bold text-[#2d2926]">내 자료함</h1>
          <p className="text-warm-muted text-sm mt-1">
            총 {assets.length}개의 에셋 · {formatSize(totalSize)} 사용 중
          </p>
        </div>
        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,video/*,audio/*,.ttf,.otf,.woff,.woff2"
            className="hidden"
            onChange={handleUpload}
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="bg-primary hover:bg-[#58717c] disabled:opacity-50 text-white text-sm font-bold px-5 py-2.5 rounded-xl flex items-center gap-2 transition-all btn-press"
          >
            {uploading ? (
              <>
                <span className="material-symbols-outlined text-lg animate-spin">progress_activity</span>
                업로드 중...
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-lg">upload</span>
                업로드
              </>
            )}
          </button>
        </div>
      </div>

      {/* Filter & View */}
      <div className="flex items-center justify-between animate-enter" style={{ animationDelay: '100ms' }}>
        <div className="flex items-center gap-2">
          {categories.map((c) => (
            <button
              key={c.label}
              onClick={() => setActiveCategory(c.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeCategory === c.id
                  ? 'bg-primary text-white'
                  : 'bg-white border border-[#e5ddd3] text-warm-muted hover:bg-[#f9f6f0]'
              }`}
            >
              {c.label}
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

      {/* Loading */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <span className="material-symbols-outlined text-3xl text-primary animate-spin">progress_activity</span>
        </div>
      ) : assets.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[#e5ddd3] p-12 flex flex-col items-center justify-center">
          <div className="size-16 rounded-2xl bg-[#f9f6f0] flex items-center justify-center mb-4">
            <span className="material-symbols-outlined text-3xl text-primary/40">perm_media</span>
          </div>
          <p className="text-sm font-semibold text-[#2d2926]">자료가 없습니다</p>
          <p className="text-xs text-warm-muted mt-1">이미지를 업로드하여 캐릭터 프로필을 생성하세요</p>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 stagger-children">
          {assets.map((a) => (
            <div
              key={a.id}
              className="bg-white rounded-2xl border border-[#e5ddd3] overflow-hidden cursor-pointer group card-hover relative"
            >
              <div className="aspect-square bg-[#f9f6f0] flex items-center justify-center relative overflow-hidden">
                {a.image_url ? (
                  <img src={resolveApiUrl(a.image_url)} alt={a.name} className="w-full h-full object-cover" />
                ) : (
                  <span className="material-symbols-outlined text-4xl text-primary/30">{guessIcon(a.name)}</span>
                )}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all" />
                <button
                  onClick={(e) => { e.stopPropagation(); handleDelete(a.id) }}
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 size-7 rounded-full bg-white/90 flex items-center justify-center text-red-500 hover:bg-red-50 transition-all shadow"
                >
                  <span className="material-symbols-outlined text-sm">delete</span>
                </button>
              </div>
              <div className="p-3">
                <p className="text-xs font-semibold text-[#2d2926] truncate">{a.character_name || a.name}</p>
                <p className="text-[10px] text-warm-muted mt-1">
                  {formatSize(a.file_size)} · {timeAgo(a.created_at)}
                </p>
                {a.style_keywords && a.style_keywords.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-1.5">
                    {a.style_keywords.slice(0, 2).map((kw) => (
                      <span key={kw} className="text-[9px] bg-primary/10 text-primary px-1.5 py-0.5 rounded-full">{kw}</span>
                    ))}
                  </div>
                )}
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
              {assets.map((a) => (
                <tr key={a.id} className="border-b border-[#e5ddd3] last:border-0 hover:bg-[#f9f6f0] transition-colors">
                  <td className="px-6 py-3">
                    <div className="flex items-center gap-3">
                      <div className="size-8 rounded-lg bg-primary/10 flex items-center justify-center overflow-hidden">
                        {a.image_url ? (
                          <img src={resolveApiUrl(a.image_url)} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <span className="material-symbols-outlined text-primary text-sm">{guessIcon(a.name)}</span>
                        )}
                      </div>
                      <span className="text-sm font-medium text-[#2d2926]">{a.character_name || a.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-3 text-sm text-warm-muted">{guessType(a.name)}</td>
                  <td className="px-6 py-3 text-sm text-warm-muted">{formatSize(a.file_size)}</td>
                  <td className="px-6 py-3 text-sm text-warm-muted">{timeAgo(a.created_at)}</td>
                  <td className="px-6 py-3 text-right">
                    <button
                      onClick={() => handleDelete(a.id)}
                      className="text-warm-muted hover:text-red-500 transition-colors"
                    >
                      <span className="material-symbols-outlined text-lg">delete</span>
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
