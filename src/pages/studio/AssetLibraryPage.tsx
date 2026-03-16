import { useState, useEffect, useRef } from 'react'
import { assetsApi } from '@/api/assets'
import { resolveApiUrl } from '@/config/env'
import type { Asset } from '@/types/asset'

const categories = [
  { id: '전체', label: '전체' },
  { id: '1', label: '애니메이션' },
  { id: '2', label: '히어로' },
  { id: '3', label: '게임' },
  { id: '4', label: '판타지' },
]

function TagEditModal({
  asset,
  onClose,
  onSave,
}: {
  asset: Asset
  onClose: () => void
  onSave: (assetId: string, tags: string[]) => Promise<void>
}) {
  const [tags, setTags] = useState<string[]>(asset.custom_tags || [])
  const [newTag, setNewTag] = useState('')
  const [saving, setSaving] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const addTag = () => {
    const trimmed = newTag.trim()
    if (trimmed && !tags.includes(trimmed)) {
      setTags([...tags, trimmed])
    }
    setNewTag('')
    inputRef.current?.focus()
  }

  const removeTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag))
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addTag()
    }
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      await onSave(asset.id, tags)
      onClose()
    } catch {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={onClose}>
      <div
        className="bg-white rounded-2xl shadow-xl w-full max-w-md mx-4 overflow-hidden animate-enter-scale"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with image */}
        <div className="flex items-center gap-4 p-5 border-b border-[#e5ddd3]">
          <div className="size-14 rounded-xl overflow-hidden bg-[#f9f6f0] flex-shrink-0">
            <img
              src={resolveApiUrl(asset.image_url)}
              alt={asset.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-bold text-[#2d2926] truncate">{asset.name}</h3>
            <p className="text-xs text-warm-muted mt-0.5">태그를 추가하여 캐릭터 특성을 정의하세요</p>
          </div>
          <button onClick={onClose} className="text-warm-muted hover:text-[#2d2926] transition-colors">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Tag input */}
        <div className="p-5 space-y-4">
          {/* Auto-generated style keywords (read-only) */}
          {asset.style_keywords && asset.style_keywords.length > 0 && (
            <div>
              <p className="text-xs font-medium text-warm-muted mb-2">자동 생성 스타일</p>
              <div className="flex flex-wrap gap-1.5">
                {asset.style_keywords.map((kw) => (
                  <span
                    key={kw}
                    className="text-xs bg-[#f9f6f0] text-warm-muted px-2.5 py-1 rounded-lg"
                  >
                    {kw}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Custom tags */}
          <div>
            <p className="text-xs font-medium text-[#2d2926] mb-2">커스텀 태그</p>
            <div className="flex flex-wrap gap-1.5 min-h-[32px]">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs bg-primary/10 text-primary px-2.5 py-1 rounded-lg flex items-center gap-1 group"
                >
                  {tag}
                  <button
                    onClick={() => removeTag(tag)}
                    className="text-primary/50 hover:text-primary transition-colors"
                  >
                    <span className="material-symbols-outlined text-sm">close</span>
                  </button>
                </span>
              ))}
              {tags.length === 0 && (
                <span className="text-xs text-warm-muted/50 py-1">태그를 추가해보세요</span>
              )}
            </div>
          </div>

          {/* Input */}
          <div className="flex gap-2">
            <input
              ref={inputRef}
              type="text"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="태그 입력 후 Enter"
              className="flex-1 px-3 py-2 text-sm border border-[#e5ddd3] rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 bg-white"
            />
            <button
              onClick={addTag}
              disabled={!newTag.trim()}
              className="px-3 py-2 text-sm bg-[#f9f6f0] text-[#2d2926] rounded-lg hover:bg-[#efe8de] transition-colors disabled:opacity-30"
            >
              <span className="material-symbols-outlined text-lg">add</span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2 px-5 pb-5">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-warm-muted hover:text-[#2d2926] transition-colors"
          >
            취소
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-5 py-2 text-sm bg-primary hover:bg-[#b05d3f] text-white rounded-lg font-medium transition-all disabled:opacity-50"
          >
            {saving ? '저장 중...' : '저장'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default function AssetLibraryPage() {
  const [activeCategory, setActiveCategory] = useState('전체')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [assets, setAssets] = useState<Asset[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [tagSearch, setTagSearch] = useState('')
  const [editingAsset, setEditingAsset] = useState<Asset | null>(null)

  const fetchAssets = async () => {
    setLoading(true)
    setError('')
    try {
      const params: Record<string, string> = {}
      if (activeCategory !== '전체') params.category_id = activeCategory
      if (tagSearch.trim()) params.tag = tagSearch.trim()
      const res = await assetsApi.list(params)
      const raw = res.data.data
      if (Array.isArray(raw)) {
        setAssets(raw)
      } else if (raw && typeof raw === 'object') {
        setAssets(Object.values(raw).flat() as Asset[])
      } else {
        setAssets([])
      }
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
  }, [activeCategory, tagSearch])

  const [uploadProgress, setUploadProgress] = useState({ current: 0, total: 0 })

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    const categoryId = activeCategory === '전체' ? '1' : activeCategory
    setUploading(true)
    setError('')
    setUploadProgress({ current: 0, total: files.length })

    let failCount = 0
    for (let i = 0; i < files.length; i++) {
      setUploadProgress({ current: i + 1, total: files.length })
      try {
        await assetsApi.upload(files[i], categoryId)
      } catch (err: any) {
        console.error(`업로드 실패 (${files[i].name}):`, err)
        failCount++
      }
    }

    if (failCount > 0) {
      setError(`${files.length}개 중 ${failCount}개 업로드에 실패했습니다.`)
    }

    await fetchAssets()
    window.dispatchEvent(new Event('storage-updated'))
    setUploading(false)
    setUploadProgress({ current: 0, total: 0 })
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleDelete = async (assetId: string, assetName: string) => {
    if (!window.confirm(`"${assetName}" 에셋을 삭제하시겠습니까?`)) return
    try {
      await assetsApi.delete(assetId)
      await fetchAssets()
      window.dispatchEvent(new Event('storage-updated'))
    } catch (err: any) {
      console.error('삭제 실패:', err)
      setError('에셋 삭제에 실패했습니다.')
    }
  }

  const handleSaveTags = async (assetId: string, tags: string[]) => {
    await assetsApi.updateTags(assetId, tags)
    await fetchAssets()
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
            multiple
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
            {uploading
              ? uploadProgress.total > 1
                ? `업로드 중... (${uploadProgress.current}/${uploadProgress.total})`
                : '업로드 중...'
              : '업로드'}
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
          {error}
        </div>
      )}

      {/* Filter & View */}
      <div className="flex items-center justify-between animate-enter gap-3" style={{ animationDelay: '100ms' }}>
        <div className="flex items-center gap-2 flex-wrap flex-1">
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

          {/* Tag search */}
          <div className="relative ml-2">
            <span className="material-symbols-outlined text-warm-muted absolute left-2.5 top-1/2 -translate-y-1/2 text-lg">
              search
            </span>
            <input
              type="text"
              value={tagSearch}
              onChange={(e) => setTagSearch(e.target.value)}
              placeholder="태그 검색..."
              className="pl-9 pr-3 py-2 text-sm border border-[#e5ddd3] rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 bg-white w-40"
            />
            {tagSearch && (
              <button
                onClick={() => setTagSearch('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-warm-muted hover:text-[#2d2926]"
              >
                <span className="material-symbols-outlined text-sm">close</span>
              </button>
            )}
          </div>
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
          <p className="text-sm mt-1">
            {tagSearch ? `"${tagSearch}" 태그에 해당하는 에셋이 없습니다.` : '이미지를 업로드하여 캐릭터 에셋을 추가하세요.'}
          </p>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 stagger-children">
          {assets.map((a) => (
            <div
              key={a.id}
              onClick={() => setEditingAsset(a)}
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
                <button
                  onClick={(e) => { e.stopPropagation(); handleDelete(a.id, a.name) }}
                  className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
                  title="삭제"
                >
                  <span className="material-symbols-outlined text-sm">close</span>
                </button>
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
                {/* Custom tags */}
                {a.custom_tags && a.custom_tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-1.5">
                    {a.custom_tags.slice(0, 3).map((tag) => (
                      <span key={tag} className="text-[9px] bg-primary/10 text-primary px-1.5 py-0.5 rounded">
                        {tag}
                      </span>
                    ))}
                    {a.custom_tags.length > 3 && (
                      <span className="text-[9px] text-warm-muted">+{a.custom_tags.length - 3}</span>
                    )}
                  </div>
                )}
                {/* Style keywords */}
                {a.style_keywords && a.style_keywords.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-1">
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
                <th className="text-left px-6 py-3 font-medium">태그</th>
                <th className="text-left px-6 py-3 font-medium">스타일</th>
                <th className="text-right px-6 py-3 font-medium">작업</th>
              </tr>
            </thead>
            <tbody>
              {assets.map((a) => (
                <tr
                  key={a.id}
                  onClick={() => setEditingAsset(a)}
                  className="border-b border-[#e5ddd3] last:border-0 hover:bg-[#f9f6f0] transition-colors cursor-pointer"
                >
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
                    {a.custom_tags && a.custom_tags.length > 0
                      ? a.custom_tags.slice(0, 3).join(', ')
                      : '-'}
                  </td>
                  <td className="px-6 py-3 text-sm text-warm-muted">
                    {a.style_keywords?.slice(0, 3).join(', ') || '-'}
                  </td>
                  <td className="px-6 py-3 text-right">
                    <button
                      onClick={(e) => { e.stopPropagation(); handleDelete(a.id, a.name) }}
                      className="text-red-400 hover:text-red-600 transition-colors"
                      title="삭제"
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

      {/* Tag edit modal */}
      {editingAsset && (
        <TagEditModal
          asset={editingAsset}
          onClose={() => setEditingAsset(null)}
          onSave={handleSaveTags}
        />
      )}
    </div>
  )
}
