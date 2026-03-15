import { useState, useEffect, useRef } from 'react'
import { assetsApi } from '@/api/assets'
import { resolveApiUrl } from '@/config/env'
import type { Asset } from '@/types/asset'

const categories = [
  { id: '전체', label: '전체' },
  { id: 'animation', label: '애니메이션' },
  { id: 'hero', label: '히어로' },
  { id: 'game', label: '게임' },
  { id: 'fantasy', label: '판타지' },
]

export default function AssetLibraryPage() {
  const [activeCategory, setActiveCategory] = useState('전체')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [assets, setAssets] = useState<Asset[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const fetchAssets = async () => {
    setLoading(true)
    setError('')
    try {
      const params = activeCategory === '전체' ? {} : { category_id: activeCategory }
      const res = await assetsApi.list(params)
      setAssets(res.data.data || [])
    } catch (err: any) {
      console.error('에셋 로드 실패:', err)
      setError('에셋을 불러오지 못했습니다.')
      setAssets([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAssets()
  }, [activeCategory])

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const categoryId = activeCategory === '전체' ? 'animation' : activeCategory
    setUploading(true)
    setError('')
    try {
      await assetsApi.upload(file, categoryId)
      await fetchAssets()
    } catch (err: any) {
      console.error('업로드 실패:', err)
      setError(err.response?.data?.detail || '업로드에 실패했습니다.')
    } finally {
      setUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  const getCategoryLabel = (categoryId?: string) => {
    return categories.find((c) => c.id === categoryId)?.label || categoryId || '-'
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between animate-enter">
        <div>
          <h1 className="text-2xl font-bold text-[#2d2926]">에셋 라이브러리</h1>
          <p className="text-warm-muted text-sm mt-1">
            총 {assets.length}개의 에셋
          </p>
        </div>
        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleUpload}
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="bg-primary hover:bg-[#b05d3f] text-white text-sm font-bold px-5 py-2.5 rounded-xl flex items-center gap-2 transition-all btn-press disabled:opacity-50"
          >
            <span className="material-symbols-outlined text-lg">
              {uploading ? 'hourglass_empty' : 'upload'}
            </span>
            {uploading ? '업로드 중...' : '업로드'}
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
          {error}
        </div>
      )}

      {/* Filter & View */}
      <div className="flex items-center justify-between animate-enter" style={{ animationDelay: '100ms' }}>
        <div className="flex items-center gap-2 flex-wrap">
          {categories.map((c) => (
            <button
              key={c.id}
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

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent" />
        </div>
      ) : assets.length === 0 ? (
        <div className="text-center py-20 text-warm-muted">
          <span className="material-symbols-outlined text-5xl mb-3 block">folder_open</span>
          <p className="text-lg font-medium">에셋이 없습니다</p>
          <p className="text-sm mt-1">이미지를 업로드하여 캐릭터 에셋을 추가하세요.</p>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 stagger-children">
          {assets.map((a) => (
            <div
              key={a.id}
              className="bg-white rounded-2xl border border-[#e5ddd3] overflow-hidden cursor-pointer group card-hover"
            >
              <div className="aspect-square bg-[#f9f6f0] relative overflow-hidden">
                <img
                  src={resolveApiUrl(a.image_url)}
                  alt={a.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    ;(e.target as HTMLImageElement).style.display = 'none'
                    ;(e.target as HTMLImageElement).parentElement!.innerHTML =
                      '<span class="material-symbols-outlined text-4xl text-primary/30 absolute inset-0 flex items-center justify-center">image</span>'
                  }}
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all" />
              </div>
              <div className="p-3">
                <p className="text-xs font-semibold text-[#2d2926] truncate">{a.name}</p>
                <div className="flex items-center gap-1 mt-1">
                  {a.gender && (
                    <span className="text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded">
                      {a.gender}
                    </span>
                  )}
                  <span className="text-[10px] text-warm-muted">
                    {getCategoryLabel(a.category_id)}
                  </span>
                </div>
                {a.style_keywords && a.style_keywords.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-1.5">
                    {a.style_keywords.slice(0, 3).map((kw) => (
                      <span key={kw} className="text-[9px] bg-[#f9f6f0] text-warm-muted px-1.5 py-0.5 rounded">
                        {kw}
                      </span>
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
                <th className="text-left px-6 py-3 font-medium">카테고리</th>
                <th className="text-left px-6 py-3 font-medium">성별</th>
                <th className="text-left px-6 py-3 font-medium">스타일</th>
              </tr>
            </thead>
            <tbody>
              {assets.map((a) => (
                <tr key={a.id} className="border-b border-[#e5ddd3] last:border-0 hover:bg-[#f9f6f0] transition-colors">
                  <td className="px-6 py-3">
                    <div className="flex items-center gap-3">
                      <div className="size-10 rounded-lg overflow-hidden bg-[#f9f6f0] flex-shrink-0">
                        <img
                          src={resolveApiUrl(a.image_url)}
                          alt={a.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            ;(e.target as HTMLImageElement).style.display = 'none'
                          }}
                        />
                      </div>
                      <span className="text-sm font-medium text-[#2d2926]">{a.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-3 text-sm text-warm-muted">{getCategoryLabel(a.category_id)}</td>
                  <td className="px-6 py-3 text-sm text-warm-muted">{a.gender || '-'}</td>
                  <td className="px-6 py-3 text-sm text-warm-muted">
                    {a.style_keywords?.slice(0, 3).join(', ') || '-'}
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
