import { useState, useEffect, useRef } from 'react'
import { assetsApi } from '@/api/assets'
import type { Asset } from '@/types/asset'
import { resolveApiUrl } from '@/config/env'

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
  const [activeTag, setActiveTag] = useState<string>('')
  const [filterTagInput, setFilterTagInput] = useState('')
  const [uploadTagsInput, setUploadTagsInput] = useState('')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [assets, setAssets] = useState<Asset[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // 선택 모드
  const [selectMode, setSelectMode] = useState(false)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [bulkDeleting, setBulkDeleting] = useState(false)

  // 태그 편집
  const [editingAsset, setEditingAsset] = useState<Asset | null>(null)
  const [tagInput, setTagInput] = useState('')
  const [editTags, setEditTags] = useState<string[]>([])
  const [savingTags, setSavingTags] = useState(false)

  const parseTags = (raw: string): string[] =>
    Array.from(
      new Set(
        raw
          .split(',')
          .map((tag) => tag.trim())
          .filter(Boolean),
      ),
    )

  const removeUploadTag = (tagToRemove: string) => {
    const nextTags = parseTags(uploadTagsInput).filter((tag) => tag !== tagToRemove)
    setUploadTagsInput(nextTags.join(', '))
  }

  const fetchAssets = async () => {
    try {
      const params = activeTag.trim() ? { tag: activeTag.trim() } : undefined
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
  }, [activeTag])

  const totalSize = assets.reduce((sum, a) => sum + (a.file_size || 0), 0)

  const [uploadProgress, setUploadProgress] = useState({ current: 0, total: 0 })

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    setUploading(true)
    const total = files.length
    const uploadTags = parseTags(uploadTagsInput)
    setUploadProgress({ current: 0, total })
    let failed = 0

    for (let i = 0; i < total; i++) {
      setUploadProgress({ current: i + 1, total })
      try {
        const res = await assetsApi.upload(files[i], uploadTags)
        if (res.data.success) {
          setAssets(prev => [res.data.data, ...prev])
        }
      } catch {
        failed++
      }
    }

    if (failed > 0) {
      alert(`${total - failed}개 업로드 완료, ${failed}개 실패`)
    }

    setUploading(false)
    setUploadProgress({ current: 0, total: 0 })
    setUploadTagsInput('')
    if (fileInputRef.current) fileInputRef.current.value = ''
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

  // 선택 토글
  const toggleSelect = (id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  // 전체 선택 / 해제
  const toggleSelectAll = () => {
    if (selectedIds.size === assets.length) {
      setSelectedIds(new Set())
    } else {
      setSelectedIds(new Set(assets.map(a => a.id)))
    }
  }

  // 선택 모드 종료
  const exitSelectMode = () => {
    setSelectMode(false)
    setSelectedIds(new Set())
  }

  // 태그 편집 열기
  const openTagEditor = (asset: Asset) => {
    if (selectMode) return
    setEditingAsset(asset)
    const existing = new Set([...(asset.style_keywords || []), ...(asset.custom_tags || [])])
    setEditTags([...existing])
    setTagInput('')
  }

  // 태그 추가
  const addTag = () => {
    const tag = tagInput.trim()
    if (!tag || editTags.includes(tag)) return
    setEditTags(prev => [...prev, tag])
    setTagInput('')
  }

  // 태그 삭제
  const removeTag = (tag: string) => {
    setEditTags(prev => prev.filter(t => t !== tag))
  }

  // 태그 저장
  const saveTags = async () => {
    if (!editingAsset) return
    setSavingTags(true)
    try {
      const res = await assetsApi.updateTags(editingAsset.id, editTags)
      if (res.data.success) {
        setAssets(prev => prev.map(a =>
          a.id === editingAsset.id ? { ...a, custom_tags: editTags } : a
        ))
        setEditingAsset(null)
      }
    } catch {
      alert('태그 저장에 실패했습니다.')
    } finally {
      setSavingTags(false)
    }
  }

  // 일괄 삭제
  const handleBulkDelete = async () => {
    if (selectedIds.size === 0) return
    if (!confirm(`선택한 ${selectedIds.size}개의 에셋을 삭제하시겠습니까?`)) return

    setBulkDeleting(true)
    const ids = Array.from(selectedIds)
    const failed: string[] = []

    for (const id of ids) {
      try {
        await assetsApi.delete(id)
      } catch {
        failed.push(id)
      }
    }

    setAssets(prev => prev.filter(a => failed.includes(a.id) || !selectedIds.has(a.id)))
    setSelectedIds(new Set())
    setBulkDeleting(false)

    if (failed.length > 0) {
      alert(`${ids.length - failed.length}개 삭제 완료, ${failed.length}개 실패`)
    }

    exitSelectMode()
  }

  const timeAgo = (dateStr?: string) => {
    if (!dateStr) return ''
    const d = new Date(dateStr)
    return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`
  }

  const applyTagFilter = () => {
    const nextTag = filterTagInput.trim()
    setActiveTag(nextTag)
    setFilterTagInput('')
  }

  const clearTagFilter = () => {
    setFilterTagInput('')
    setActiveTag('')
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between animate-enter">
        <div>
          <h1 className="text-2xl font-bold text-[#2d2926]">내 자료함</h1>
          <p className="text-warm-muted text-sm mt-1">
            총 {assets.length}개의 에셋 · {formatSize(totalSize)} 사용 중
          </p>
          <p className="text-warm-muted text-xs mt-1">에셋을 다중으로 업로드 시 태그를 한번에 붙일 수 있습니다.</p>
        </div>
        <div className="flex items-center gap-2">
          {/* 선택 모드 토글 */}
          {!selectMode ? (
            <button
              onClick={() => setSelectMode(true)}
              disabled={assets.length === 0}
              className="bg-white border border-[#dde7f1] text-warm-muted hover:text-[#2d2926] hover:bg-[#f5f9fd] disabled:opacity-40 text-sm font-medium px-4 py-2.5 rounded-xl flex items-center gap-2 transition-all"
            >
              <span className="material-symbols-outlined text-lg">checklist</span>
              선택
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={toggleSelectAll}
                className="bg-white border border-[#dde7f1] text-sm font-medium px-3 py-2 rounded-lg hover:bg-[#f5f9fd] transition-all"
              >
                {selectedIds.size === assets.length ? '전체 해제' : '전체 선택'}
              </button>
              <button
                onClick={handleBulkDelete}
                disabled={selectedIds.size === 0 || bulkDeleting}
                className="bg-red-500 hover:bg-red-600 disabled:opacity-40 text-white text-sm font-bold px-4 py-2 rounded-lg flex items-center gap-1.5 transition-all"
              >
                {bulkDeleting ? (
                  <span className="material-symbols-outlined text-sm animate-spin">progress_activity</span>
                ) : (
                  <span className="material-symbols-outlined text-sm">delete</span>
                )}
                {selectedIds.size > 0 ? `${selectedIds.size}개 삭제` : '삭제'}
              </button>
              <button
                onClick={exitSelectMode}
                className="text-warm-muted hover:text-[#2d2926] text-sm font-medium px-3 py-2 rounded-lg hover:bg-[#f5f9fd] transition-all"
              >
                취소
              </button>
            </div>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,video/*,audio/*,.ttf,.otf,.woff,.woff2"
            multiple
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
                {uploadProgress.total > 1 ? `업로드 중 (${uploadProgress.current}/${uploadProgress.total})` : '업로드 중...'}
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

      <div className="bg-white rounded-xl border border-[#dde7f1] p-4 animate-enter" style={{ animationDelay: '80ms' }}>
        <label className="block text-xs font-semibold text-[#2d2926] mb-2">업로드 태그</label>
        <div className="flex items-center gap-2">
          <input
            value={uploadTagsInput}
            onChange={(e) => setUploadTagsInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault()
                setUploadTagsInput(parseTags(uploadTagsInput).join(', '))
              }
            }}
            className="w-full max-w-lg bg-[#f5f9fd] border border-[#dde7f1] rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20"
            placeholder="쉼표로 구분해서 입력 (예: hero, fantasy, 3d)"
          />
          {uploadTagsInput.trim() && (
            <button
              onClick={() => setUploadTagsInput('')}
              className="px-3 py-2 rounded-lg text-sm font-medium bg-white border border-[#dde7f1] text-warm-muted hover:bg-[#f5f9fd] transition-all"
            >
              초기화
            </button>
          )}
        </div>
        {parseTags(uploadTagsInput).length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-2">
            {parseTags(uploadTagsInput).map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 text-xs bg-primary/10 text-primary px-2.5 py-1 rounded-full"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => removeUploadTag(tag)}
                  aria-label={`${tag} 태그 삭제`}
                  className="hover:text-red-500 transition-colors"
                >
                  <span className="material-symbols-outlined text-xs leading-none">close</span>
                </button>
              </span>
            ))}
          </div>
        )}
        <p className="text-[11px] text-warm-muted mt-2">
          업로드 시 입력한 태그가 모든 선택 파일에 동일하게 적용됩니다.
        </p>
      </div>

      {/* Filter & View */}
      <div className="flex items-center justify-between animate-enter" style={{ animationDelay: '100ms' }}>
        <div className="flex items-center gap-2">
          <input
            value={filterTagInput}
            onChange={(e) => setFilterTagInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && applyTagFilter()}
            className="w-56 bg-white border border-[#dde7f1] rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20"
            placeholder="태그 필터 (예: hero, 3d)"
          />
          <button
            onClick={applyTagFilter}
            className="px-3 py-2 rounded-lg text-sm font-medium bg-primary text-white hover:bg-[#58717c] transition-all"
          >
            적용
          </button>
          <button
            onClick={clearTagFilter}
            className="px-3 py-2 rounded-lg text-sm font-medium bg-white border border-[#dde7f1] text-warm-muted hover:bg-[#f5f9fd] transition-all"
          >
            전체
          </button>
          {activeTag && (
            <span className="text-xs bg-primary/10 text-primary px-2.5 py-1 rounded-full">
              필터: {activeTag}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1 bg-white border border-[#dde7f1] rounded-lg p-1">
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
        <div className="bg-white rounded-2xl border border-[#dde7f1] p-12 flex flex-col items-center justify-center">
          <div className="size-16 rounded-2xl bg-[#f5f9fd] flex items-center justify-center mb-4">
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
              onClick={() => selectMode ? toggleSelect(a.id) : openTagEditor(a)}
              className={`bg-white rounded-2xl border overflow-hidden group card-hover relative transition-all cursor-pointer ${
                selectMode && selectedIds.has(a.id)
                  ? 'border-primary ring-2 ring-primary/20'
                  : 'border-[#dde7f1]'
              } ${selectMode ? 'cursor-pointer' : ''}`}
            >
              {/* 선택 체크박스 */}
              {selectMode && (
                <div className="absolute top-2 left-2 z-10">
                  <div className={`size-6 rounded-full border-2 flex items-center justify-center transition-all ${
                    selectedIds.has(a.id)
                      ? 'bg-primary border-primary text-white'
                      : 'bg-white/90 border-[#dde7f1]'
                  }`}>
                    {selectedIds.has(a.id) && (
                      <span className="material-symbols-outlined text-sm">check</span>
                    )}
                  </div>
                </div>
              )}

              <div className="aspect-square bg-[#f5f9fd] flex items-center justify-center relative overflow-hidden">
                {a.image_url ? (
                  <img src={resolveApiUrl(a.image_url)} alt={a.name} className="w-full h-full object-cover" />
                ) : (
                  <span className="material-symbols-outlined text-4xl text-primary/30">{guessIcon(a.name)}</span>
                )}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all" />
                {!selectMode && (
                  <button
                    onClick={(e) => { e.stopPropagation(); handleDelete(a.id) }}
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 size-7 rounded-full bg-white/90 flex items-center justify-center text-red-500 hover:bg-red-50 transition-all shadow"
                  >
                    <span className="material-symbols-outlined text-sm">delete</span>
                  </button>
                )}
              </div>
              <div className="p-3">
                <p className="text-xs font-semibold text-[#2d2926] truncate">{a.character_name || a.name}</p>
                <p className="text-[10px] text-warm-muted mt-1">
                  {formatSize(a.file_size)} · {timeAgo(a.created_at)}
                </p>
                {(() => {
                  const allTags = [
                    ...(a.style_keywords || []).map(t => ({ tag: t, type: 'style' as const })),
                    ...(a.custom_tags || [])
                      .filter(t => !(a.style_keywords || []).includes(t))
                      .map(t => ({ tag: t, type: 'custom' as const })),
                  ]
                  return allTags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1.5">
                      {allTags.slice(0, 3).map(({ tag, type }) => (
                        <span key={tag} className={`text-[9px] px-1.5 py-0.5 rounded-full ${
                          type === 'custom' ? 'bg-amber-100 text-amber-700' : 'bg-primary/10 text-primary'
                        }`}>{tag}</span>
                      ))}
                      {allTags.length > 3 && (
                        <span className="text-[9px] text-warm-muted">+{allTags.length - 3}</span>
                      )}
                    </div>
                  )
                })()}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-[#dde7f1] overflow-hidden animate-enter-scale" style={{ animationDelay: '150ms' }}>
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#dde7f1] text-xs text-warm-muted">
                {selectMode && (
                  <th className="px-4 py-3 w-10">
                    <button onClick={toggleSelectAll}>
                      <div className={`size-5 rounded border-2 flex items-center justify-center transition-all ${
                        selectedIds.size === assets.length
                          ? 'bg-primary border-primary text-white'
                          : 'border-[#dde7f1]'
                      }`}>
                        {selectedIds.size === assets.length && (
                          <span className="material-symbols-outlined text-xs">check</span>
                        )}
                      </div>
                    </button>
                  </th>
                )}
                <th className="text-left px-6 py-3 font-medium">이름</th>
                <th className="text-left px-6 py-3 font-medium">유형</th>
                <th className="text-left px-6 py-3 font-medium">크기</th>
                <th className="text-left px-6 py-3 font-medium">날짜</th>
                <th className="text-right px-6 py-3 font-medium">작업</th>
              </tr>
            </thead>
            <tbody>
              {assets.map((a) => (
                <tr
                  key={a.id}
                  onClick={() => selectMode ? toggleSelect(a.id) : openTagEditor(a)}
                  className={`border-b border-[#dde7f1] last:border-0 hover:bg-[#f5f9fd] transition-colors cursor-pointer ${
                    selectMode ? '' : ''
                  } ${selectMode && selectedIds.has(a.id) ? 'bg-primary/5' : ''}`}
                >
                  {selectMode && (
                    <td className="px-4 py-3">
                      <div className={`size-5 rounded border-2 flex items-center justify-center transition-all ${
                        selectedIds.has(a.id)
                          ? 'bg-primary border-primary text-white'
                          : 'border-[#dde7f1]'
                      }`}>
                        {selectedIds.has(a.id) && (
                          <span className="material-symbols-outlined text-xs">check</span>
                        )}
                      </div>
                    </td>
                  )}
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
                    {!selectMode && (
                      <button
                        onClick={() => handleDelete(a.id)}
                        className="text-warm-muted hover:text-red-500 transition-colors"
                      >
                        <span className="material-symbols-outlined text-lg">delete</span>
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* 태그 편집 모달 */}
      {editingAsset && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => setEditingAsset(null)}>
          <div
            className="bg-white rounded-2xl border border-[#dde7f1] w-full max-w-md p-6 space-y-4 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-[#2d2926]">태그 편집</h3>
              <button onClick={() => setEditingAsset(null)} className="text-warm-muted hover:text-[#2d2926]">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            {/* 에셋 정보 */}
            <div className="flex items-center gap-3">
              <div className="size-12 rounded-lg bg-[#f5f9fd] overflow-hidden border border-[#dde7f1]">
                {editingAsset.image_url ? (
                  <img src={resolveApiUrl(editingAsset.image_url)} alt="" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="material-symbols-outlined text-primary/30">{guessIcon(editingAsset.name)}</span>
                  </div>
                )}
              </div>
              <div>
                <p className="text-sm font-medium text-[#2d2926]">{editingAsset.character_name || editingAsset.name}</p>
                <p className="text-xs text-warm-muted">{formatSize(editingAsset.file_size)}</p>
              </div>
            </div>

            {/* 현재 태그 */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-[#2d2926]">커스텀 태그</label>
              {editTags.length > 0 ? (
                <div className="flex flex-wrap gap-1.5">
                  {editTags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 text-xs bg-primary/10 text-primary px-2.5 py-1 rounded-full"
                    >
                      {tag}
                      <button onClick={() => removeTag(tag)} className="hover:text-red-500 transition-colors">
                        <span className="material-symbols-outlined text-xs">close</span>
                      </button>
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-warm-muted">태그가 없습니다</p>
              )}
            </div>

            {/* 태그 입력 */}
            <div className="flex items-center gap-2">
              <input
                className="flex-1 bg-[#f5f9fd] rounded-lg px-3 py-2 text-sm border border-[#dde7f1] outline-none focus:ring-2 focus:ring-primary/20"
                placeholder="태그 입력 후 Enter"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
              />
              <button
                onClick={addTag}
                disabled={!tagInput.trim()}
                className="bg-[#f5f9fd] border border-[#dde7f1] text-sm font-medium px-3 py-2 rounded-lg hover:bg-primary/10 disabled:opacity-40 transition-all"
              >
                추가
              </button>
            </div>

            {/* 저장/취소 */}
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setEditingAsset(null)}
                className="text-sm text-warm-muted hover:text-[#2d2926] px-4 py-2 rounded-lg hover:bg-[#f5f9fd] transition-all"
              >
                취소
              </button>
              <button
                onClick={saveTags}
                disabled={savingTags}
                className="bg-primary hover:bg-[#58717c] disabled:opacity-50 text-white text-sm font-bold px-5 py-2 rounded-lg transition-all flex items-center gap-1.5"
              >
                {savingTags && <span className="material-symbols-outlined text-sm animate-spin">progress_activity</span>}
                저장
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
