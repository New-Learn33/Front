import { useState, useRef, useEffect } from 'react'
import { generationApi } from '@/api/generation'
import { presetsApi, type Preset } from '@/api/presets'
import { API_BASE_URL, resolveApiUrl } from '@/config/env'
import type { GenerationData } from '@/types/generation'

const categories = [
  { id: 1, label: '애니메이션', icon: 'animation', desc: '생동감 넘치는 애니 스타일' },
  { id: 2, label: '히어로', icon: 'shield', desc: '슈퍼히어로 액션 스타일' },
  { id: 3, label: '게임', icon: 'sports_esports', desc: '게임 시네마틱 스타일' },
  { id: 4, label: '판타지', icon: 'auto_awesome', desc: '에픽 판타지 스타일' },
]

interface StreamingState {
  step: string
  message: string
  scenes: any[] | null
  images: { scene_order: number; image_url: string }[]
  title: string
  jobId: number | null
}

const API_BASE = API_BASE_URL

const artStyles = [
  { id: 'webtoon', label: '웹툰', icon: 'draw' },
  { id: 'anime', label: '애니메', icon: 'animation' },
  { id: 'watercolor', label: '수채화', icon: 'palette' },
  { id: '3d_render', label: '3D', icon: 'view_in_ar' },
  { id: 'pixel', label: '픽셀', icon: 'grid_on' },
  { id: 'realistic', label: '실사', icon: 'photo_camera' },
]

const genres = [
  { id: 'auto', label: '자동' },
  { id: 'comedy', label: '코미디' },
  { id: 'action', label: '액션' },
  { id: 'romance', label: '로맨스' },
  { id: 'horror', label: '호러' },
  { id: 'emotional', label: '감동' },
]

const qualityOptions = [
  { id: 'low', label: '빠름' },
  { id: 'medium', label: '보통' },
  { id: 'high', label: '고품질' },
]

const motionOptions = [
  { id: 'low', label: '약하게' },
  { id: 'medium', label: '보통' },
  { id: 'high', label: '강하게' },
]

export default function VisualCreationPage() {
  const [prompt, setPrompt] = useState('')
  const [selectedCategory, setSelectedCategory] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [result, setResult] = useState<GenerationData | null>(null)

  // 생성 옵션
  const [artStyle, setArtStyle] = useState('webtoon')
  const [genre, setGenre] = useState('auto')
  const [imageQuality, setImageQuality] = useState('medium')
  const [motionIntensity, setMotionIntensity] = useState('medium')

  // 스트리밍 상태
  const [streaming, setStreaming] = useState<StreamingState>({
    step: '',
    message: '',
    scenes: null,
    images: [],
    title: '',
    jobId: null,
  })

  // 영상 생성 상태
  const [videoLoading, setVideoLoading] = useState(false)
  const [videoStep, setVideoStep] = useState<'idle' | 'subtitles' | 'video' | 'done'>('idle')
  const [videoUrl, setVideoUrl] = useState<string | null>(null)
  const [videoError, setVideoError] = useState('')

  // 썸네일 선택 상태
  const [selectedThumbnail, setSelectedThumbnail] = useState<string | null>(null)
  const [thumbnailSaving, setThumbnailSaving] = useState(false)
  const [thumbnailSaved, setThumbnailSaved] = useState(false)

  // 프리셋 상태
  const [presets, setPresets] = useState<Preset[]>([])
  const [showPresetSave, setShowPresetSave] = useState(false)
  const [presetName, setPresetName] = useState('')
  const [showPresets, setShowPresets] = useState(false)

  const abortRef = useRef<AbortController | null>(null)

  // 프리셋 목록 로드
  useEffect(() => {
    presetsApi.getAll().then((res) => {
      if (res.data.success) setPresets(res.data.data.presets)
    }).catch(() => {})
  }, [])

  // 프리셋 저장
  const handleSavePreset = async () => {
    if (!presetName.trim() || !prompt.trim()) return
    try {
      const res = await presetsApi.create({
        name: presetName.trim(),
        prompt: prompt.trim(),
        category_id: selectedCategory,
      })
      if (res.data.success) {
        setPresets((prev) => [res.data.data, ...prev])
        setPresetName('')
        setShowPresetSave(false)
      }
    } catch {}
  }

  // 프리셋 불러오기
  const handleLoadPreset = (preset: Preset) => {
    setPrompt(preset.prompt)
    setSelectedCategory(preset.category_id)
    setShowPresets(false)
  }

  // 프리셋 삭제
  const handleDeletePreset = async (id: number) => {
    try {
      await presetsApi.delete(id)
      setPresets((prev) => prev.filter((p) => p.id !== id))
    } catch {}
  }

  // 1단계: SSE 스트리밍으로 6컷 생성
  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError('프롬프트를 입력해주세요.')
      return
    }

    setLoading(true)
    setError('')
    setResult(null)
    setVideoUrl(null)
    setVideoStep('idle')
    setVideoError('')
    setSelectedThumbnail(null)
    setThumbnailSaved(false)
    setStreaming({ step: '', message: '준비 중...', scenes: null, images: [], title: '', jobId: null })

    // AbortController for cancellation
    const controller = new AbortController()
    abortRef.current = controller

    try {
      const token = localStorage.getItem('access_token')
      const response = await fetch(`${API_BASE}/api/v1/generation/stream`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          category_id: selectedCategory,
          prompt: prompt.trim(),
          art_style: artStyle,
          genre,
          image_quality: imageQuality,
        }),
        signal: controller.signal,
      })

      if (!response.ok) {
        throw new Error(`서버 오류: ${response.status}`)
      }

      const reader = response.body?.getReader()
      if (!reader) throw new Error('스트림을 읽을 수 없습니다.')

      const decoder = new TextDecoder()
      let buffer = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        buffer += decoder.decode(value, { stream: true })

        // SSE 파싱: "data: {...}\n\n"
        const lines = buffer.split('\n\n')
        buffer = lines.pop() || ''

        for (const line of lines) {
          const dataLine = line.trim()
          if (!dataLine.startsWith('data: ')) continue
          const jsonStr = dataLine.slice(6)

          try {
            const event = JSON.parse(jsonStr)

            switch (event.type) {
              case 'step':
                setStreaming((prev) => ({ ...prev, step: event.step, message: event.message }))
                break

              case 'script':
                setStreaming((prev) => ({
                  ...prev,
                  scenes: event.scenes,
                  title: event.title,
                  jobId: event.job_id,
                }))
                break

              case 'image':
                setStreaming((prev) => ({
                  ...prev,
                  images: [...prev.images, { scene_order: event.scene_order, image_url: event.image_url }],
                }))
                break

              case 'done':
                // 스트리밍 완료 → result로 전환
                setResult({
                  job_id: event.job_id,
                  title: event.title,
                  category_id: event.category_id,
                  selected_template_image: event.selected_template_image,
                  scenes: event.scenes,
                  images: event.images,
                })
                setStreaming({ step: '', message: '', scenes: null, images: [], title: '', jobId: null })
                break

              case 'error':
                setError(event.message)
                break
            }
          } catch {
            // JSON 파싱 실패 무시
          }
        }
      }
    } catch (err: any) {
      if (err.name !== 'AbortError') {
        console.error('Stream error:', err)
        setError(err.message || '서버 오류가 발생했습니다.')
      }
    } finally {
      setLoading(false)
      abortRef.current = null
    }
  }

  // 2단계: 자막 합성 → 영상 생성
  const handleRenderVideo = async () => {
    if (!result) return

    setVideoLoading(true)
    setVideoError('')
    setVideoUrl(null)
    setVideoStep('video')

    try {
      // SVD 기반 영상 생성 (각 이미지를 움직이는 영상으로 변환 후 합치기)
      const videoRes = await generationApi.renderVideoSvd({
        job_id: result.job_id,
        images: result.images.map((img) => ({
          scene_order: img.scene_order,
          image_url: img.image_url,
        })),
        scenes: result.scenes.map((s) => ({
          scene_order: s.scene_order,
          dialogue: s.dialogue,
        })),
        motion_intensity: motionIntensity,
      })

      if (videoRes.data.success) {
        setVideoUrl(resolveApiUrl(videoRes.data.data.video_url))
        setVideoStep('done')
      } else {
        setVideoError(videoRes.data.message || '영상 생성에 실패했습니다.')
      }
    } catch (err: any) {
      console.error('Video render error:', err)
      const detail = err.response?.data?.detail
      const message = typeof detail === 'string' ? detail : err.message || '영상 생성 중 오류가 발생했습니다.'
      setVideoError(message)
    } finally {
      setVideoLoading(false)
    }
  }

  // 썸네일 선택 저장
  const handleSelectThumbnail = async (imageUrl: string) => {
    if (!result) return
    setSelectedThumbnail(imageUrl)
    setThumbnailSaving(true)
    try {
      const res = await generationApi.selectThumbnail({
        job_id: result.job_id,
        thumbnail_url: imageUrl,
      })
      if (res.data.success) {
        setThumbnailSaved(true)
      }
    } catch (err) {
      console.error('Thumbnail save error:', err)
    } finally {
      setThumbnailSaving(false)
    }
  }

  const videoStepLabel = () => {
    switch (videoStep) {
      case 'subtitles': return '자막 합성 중...'
      case 'video': return 'AI 영상 생성 중... (5~10분 소요)'
      case 'done': return '완료!'
      default: return '영상 생성 중...'
    }
  }

  // 스트리밍 진행 중인지 (대사 또는 이미지가 있는 상태)
  const isStreaming = loading && (streaming.scenes || streaming.images.length > 0)

  return (
    <div className="flex gap-6 min-h-[calc(100vh-8rem)]">
      {/* Left Panel */}
      <div className="flex-1 space-y-6">
        <div className="space-y-3 animate-enter">
          <h1 className="text-2xl font-bold text-[#2d2926]">비주얼 생성</h1>
          <p className="text-warm-muted text-sm">원하는 장면을 설명해 주세요. AI가 6컷 만화를 만들어 드립니다.</p>
        </div>

        {/* Prompt Input */}
        <div className="bg-white rounded-2xl border border-[#e5ddd3] p-5 space-y-3 animate-enter-scale" style={{ animationDelay: '80ms' }}>
          <label className="text-sm font-semibold text-[#2d2926]">프롬프트</label>
          <textarea
            className="w-full h-32 bg-[#f9f6f0] rounded-xl p-4 text-sm outline-none focus:ring-2 focus:ring-primary/20 border border-[#e5ddd3] resize-none placeholder:text-warm-muted/50"
            placeholder="시험 전날 밤샘하다가 갑자기 각성한 캐릭터..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            disabled={loading || videoLoading}
          />
          <div className="flex items-center justify-between text-xs text-warm-muted">
            <span>상세할수록 더 좋은 결과를 얻을 수 있습니다</span>
            <span>{prompt.length}/500</span>
          </div>

          {/* 프리셋 버튼 */}
          <div className="flex items-center gap-2 pt-1">
            <button
              onClick={() => setShowPresets(!showPresets)}
              className="flex items-center gap-1 text-xs font-medium text-primary hover:text-[#b05d3f] transition-colors"
            >
              <span className="material-symbols-outlined text-sm">folder_open</span>
              프리셋 불러오기
            </button>
            {prompt.trim() && (
              <button
                onClick={() => setShowPresetSave(!showPresetSave)}
                className="flex items-center gap-1 text-xs font-medium text-[#8a7d72] hover:text-primary transition-colors"
              >
                <span className="material-symbols-outlined text-sm">bookmark_add</span>
                현재 설정 저장
              </button>
            )}
          </div>

          {/* 프리셋 저장 폼 */}
          {showPresetSave && (
            <div className="flex items-center gap-2 bg-[#f9f6f0] rounded-lg p-3 border border-[#e5ddd3]">
              <input
                className="flex-1 bg-white rounded-lg px-3 py-2 text-sm border border-[#e5ddd3] outline-none focus:ring-2 focus:ring-primary/20"
                placeholder="프리셋 이름 (예: 시험 각성 캐릭터)"
                value={presetName}
                onChange={(e) => setPresetName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSavePreset()}
              />
              <button
                onClick={handleSavePreset}
                disabled={!presetName.trim()}
                className="bg-primary text-white text-xs font-bold px-4 py-2 rounded-lg hover:bg-[#b05d3f] disabled:opacity-40 transition-colors"
              >
                저장
              </button>
              <button
                onClick={() => { setShowPresetSave(false); setPresetName('') }}
                className="text-[#8a7d72] hover:text-[#2d2926] text-xs"
              >
                취소
              </button>
            </div>
          )}

          {/* 프리셋 목록 */}
          {showPresets && (
            <div className="bg-[#f9f6f0] rounded-xl border border-[#e5ddd3] p-3 space-y-2 max-h-48 overflow-y-auto">
              {presets.length === 0 ? (
                <p className="text-xs text-warm-muted text-center py-3">저장된 프리셋이 없습니다</p>
              ) : (
                presets.map((preset) => (
                  <div
                    key={preset.id}
                    className="flex items-center justify-between bg-white rounded-lg px-3 py-2 border border-[#e5ddd3] hover:border-primary/30 transition-colors group"
                  >
                    <button
                      onClick={() => handleLoadPreset(preset)}
                      className="flex-1 text-left"
                    >
                      <p className="text-sm font-medium text-[#2d2926]">{preset.name}</p>
                      <p className="text-xs text-warm-muted truncate">{preset.prompt}</p>
                    </button>
                    <div className="flex items-center gap-1 ml-2">
                      <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                        {categories.find(c => c.id === preset.category_id)?.label}
                      </span>
                      <button
                        onClick={() => handleDeletePreset(preset.id)}
                        className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-600 transition-all"
                      >
                        <span className="material-symbols-outlined text-sm">close</span>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Category Selection */}
        <div className="space-y-3 animate-enter" style={{ animationDelay: '160ms' }}>
          <h2 className="text-lg font-bold text-[#2d2926]">카테고리 선택</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {categories.map((c) => (
              <button
                key={c.id}
                onClick={() => setSelectedCategory(c.id)}
                disabled={loading || videoLoading}
                className={`p-4 rounded-2xl border-2 text-left transition-all btn-press ${
                  selectedCategory === c.id
                    ? 'border-primary bg-primary/5'
                    : 'border-[#e5ddd3] bg-white hover:border-primary/30 card-hover'
                }`}
              >
                <div className={`size-10 rounded-xl flex items-center justify-center mb-3 ${
                  selectedCategory === c.id ? 'bg-primary text-white' : 'bg-primary/10 text-primary'
                }`}>
                  <span className="material-symbols-outlined">{c.icon}</span>
                </div>
                <p className="text-sm font-bold text-[#2d2926]">{c.label}</p>
                <p className="text-xs text-warm-muted mt-1">{c.desc}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Error Messages */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3">
            <span className="material-symbols-outlined text-red-500">error</span>
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}
        {videoError && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3">
            <span className="material-symbols-outlined text-red-500">error</span>
            <p className="text-sm text-red-600">{videoError}</p>
          </div>
        )}

        {/* 스트리밍 중간 결과 (실시간으로 이미지가 나타남) */}
        {isStreaming && (
          <div className="bg-white rounded-2xl border border-[#e5ddd3] p-6 space-y-5 animate-enter-scale">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-[#2d2926]">
                {streaming.title || '생성 중...'}
              </h3>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary animate-spin text-sm">progress_activity</span>
                <span className="text-xs text-primary font-medium">{streaming.message}</span>
              </div>
            </div>

            {/* 대사 + 이미지 실시간 표시 */}
            {streaming.scenes && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {streaming.scenes.map((scene, idx) => {
                  const img = streaming.images.find((i) => i.scene_order === scene.scene_order)
                  return (
                    <div key={scene.scene_order} className="space-y-3">
                      {/* Image or Placeholder */}
                      <div className="aspect-square rounded-xl overflow-hidden bg-[#f9f6f0] border border-[#e5ddd3] relative">
                        {img ? (
                          <img
                            src={resolveApiUrl(img.image_url)}
                            alt={scene.subtitle_text}
                            className="w-full h-full object-cover animate-fade-in"
                          />
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center gap-3">
                            {streaming.step === `image_${idx + 1}` ? (
                              <>
                                <span className="material-symbols-outlined text-4xl text-primary animate-pulse">brush</span>
                                <span className="text-xs text-primary font-medium">그리는 중...</span>
                              </>
                            ) : streaming.images.length >= idx ? (
                              <>
                                <span className="material-symbols-outlined text-4xl text-[#e5ddd3]">hourglass_top</span>
                                <span className="text-xs text-warm-muted">대기 중</span>
                              </>
                            ) : (
                              <>
                                <span className="material-symbols-outlined text-4xl text-[#e5ddd3]">image</span>
                                <span className="text-xs text-warm-muted">대기 중</span>
                              </>
                            )}
                          </div>
                        )}
                      </div>
                      {/* Scene Info */}
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                            img ? 'bg-green-500 text-white' : 'bg-primary text-white'
                          }`}>
                            {scene.scene_order}컷 {img ? '✓' : ''}
                          </span>
                          <span className="text-xs text-warm-muted">{scene.subtitle_text}</span>
                        </div>
                        <p className="text-sm font-medium text-[#2d2926] bg-[#f9f6f0] rounded-lg p-3 border border-[#e5ddd3]">
                          "{scene.dialogue}"
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}

        {/* 완성된 결과 */}
        {result ? (
          <div className="bg-white rounded-2xl border border-[#e5ddd3] p-6 space-y-5 animate-enter-scale">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-[#2d2926]">{result.title}</h3>
              <span className="text-xs bg-primary/10 text-primary px-3 py-1 rounded-full font-medium">
                {categories.find(c => c.id === result.category_id)?.label}
              </span>
            </div>

            {/* 썸네일 선택 안내 */}
            {videoUrl && !thumbnailSaved && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex items-center gap-2">
                <span className="material-symbols-outlined text-amber-500">touch_app</span>
                <p className="text-xs text-amber-700 font-medium">이미지를 클릭하여 대표 썸네일을 선택하세요</p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {result.scenes.map((scene, idx) => {
                const imgUrl = result.images[idx]?.image_url
                const isSelected = selectedThumbnail === imgUrl
                return (
                  <div key={scene.scene_order} className="space-y-3">
                    <div
                      className={`aspect-square rounded-xl overflow-hidden bg-[#f9f6f0] border-2 relative transition-all ${
                        isSelected
                          ? 'border-primary ring-2 ring-primary/30'
                          : videoUrl
                          ? 'border-[#e5ddd3] hover:border-primary/50 cursor-pointer'
                          : 'border-[#e5ddd3]'
                      }`}
                      onClick={() => {
                        if (videoUrl && imgUrl) handleSelectThumbnail(imgUrl)
                      }}
                    >
                      {result.images[idx] && (
                        <img
                          src={resolveApiUrl(result.images[idx].image_url)}
                          alt={scene.subtitle_text}
                          className="w-full h-full object-cover"
                        />
                      )}
                      {/* 썸네일 선택 뱃지 */}
                      {isSelected && (
                        <div className="absolute top-2 right-2 bg-primary text-white text-xs font-bold px-2 py-1 rounded-lg flex items-center gap-1 shadow-lg">
                          <span className="material-symbols-outlined text-sm">
                            {thumbnailSaving ? 'progress_activity' : 'check_circle'}
                          </span>
                          대표 이미지
                        </div>
                      )}
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs bg-primary text-white px-2 py-0.5 rounded-full font-bold">
                          {scene.scene_order}컷
                        </span>
                        <span className="text-xs text-warm-muted">{scene.subtitle_text}</span>
                      </div>
                      <p className="text-sm font-medium text-[#2d2926] bg-[#f9f6f0] rounded-lg p-3 border border-[#e5ddd3]">
                        "{scene.dialogue}"
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* 영상 플레이어 */}
            {videoUrl && (
              <div className="mt-4 rounded-xl overflow-hidden border border-[#e5ddd3] bg-black">
                <video
                  src={videoUrl}
                  controls
                  className="w-full"
                  autoPlay
                />
              </div>
            )}
          </div>
        ) : !isStreaming && (
          <div className="bg-white rounded-2xl border border-[#e5ddd3] p-8 flex flex-col items-center justify-center min-h-[240px] animate-enter-scale" style={{ animationDelay: '300ms' }}>
            <div className="size-16 rounded-2xl bg-[#f9f6f0] flex items-center justify-center mb-4">
              <span className="material-symbols-outlined text-3xl text-primary/40">smart_display</span>
            </div>
            <p className="text-sm font-semibold text-[#2d2926]">미리보기</p>
            <p className="text-xs text-warm-muted mt-1">프롬프트를 입력하고 생성 버튼을 누르세요</p>
          </div>
        )}
      </div>

      {/* Right Panel */}
      <div className="w-80 shrink-0 space-y-5 animate-enter" style={{ animationDelay: '200ms' }}>
        <div className="bg-white rounded-2xl border border-[#e5ddd3] p-5 space-y-4">
          <h3 className="text-base font-bold text-[#2d2926]">생성 정보</h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-warm-muted">카테고리</span>
              <span className="font-medium text-[#2d2926]">
                {categories.find(c => c.id === selectedCategory)?.label}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-warm-muted">출력</span>
              <span className="font-medium text-[#2d2926]">6컷 만화</span>
            </div>
            <div className="flex justify-between">
              <span className="text-warm-muted">AI 대사</span>
              <span className="font-medium text-[#2d2926]">자동 생성</span>
            </div>
            <div className="flex justify-between">
              <span className="text-warm-muted">AI 이미지</span>
              <span className="font-medium text-[#2d2926]">6장 생성</span>
            </div>
          </div>
        </div>

        {/* 생성 옵션 */}
        <div className="bg-white rounded-2xl border border-[#e5ddd3] p-5 space-y-4">
          <h3 className="text-base font-bold text-[#2d2926]">생성 옵션</h3>

          {/* 아트 스타일 */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-warm-muted">아트 스타일</label>
            <div className="grid grid-cols-3 gap-1.5">
              {artStyles.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setArtStyle(s.id)}
                  disabled={loading || videoLoading}
                  className={`flex flex-col items-center gap-1 py-2 px-1 rounded-lg text-xs transition-all ${
                    artStyle === s.id
                      ? 'bg-primary text-white'
                      : 'bg-[#f9f6f0] text-warm-muted hover:bg-[#efe8de]'
                  }`}
                >
                  <span className="material-symbols-outlined text-base">{s.icon}</span>
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* 장르 / 분위기 */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-warm-muted">장르 / 분위기</label>
            <div className="flex flex-wrap gap-1.5">
              {genres.map((g) => (
                <button
                  key={g.id}
                  onClick={() => setGenre(g.id)}
                  disabled={loading || videoLoading}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    genre === g.id
                      ? 'bg-primary text-white'
                      : 'bg-[#f9f6f0] text-warm-muted hover:bg-[#efe8de]'
                  }`}
                >
                  {g.label}
                </button>
              ))}
            </div>
          </div>

          {/* 이미지 퀄리티 */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-warm-muted">이미지 퀄리티</label>
            <div className="flex bg-[#f9f6f0] rounded-lg p-1">
              {qualityOptions.map((q) => (
                <button
                  key={q.id}
                  onClick={() => setImageQuality(q.id)}
                  disabled={loading || videoLoading}
                  className={`flex-1 py-1.5 rounded-md text-xs font-medium transition-all ${
                    imageQuality === q.id
                      ? 'bg-white text-[#2d2926] shadow-sm'
                      : 'text-warm-muted'
                  }`}
                >
                  {q.label}
                </button>
              ))}
            </div>
          </div>

          {/* 모션 강도 */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-warm-muted">움직임 강도 (영상)</label>
            <div className="flex bg-[#f9f6f0] rounded-lg p-1">
              {motionOptions.map((m) => (
                <button
                  key={m.id}
                  onClick={() => setMotionIntensity(m.id)}
                  disabled={loading || videoLoading}
                  className={`flex-1 py-1.5 rounded-md text-xs font-medium transition-all ${
                    motionIntensity === m.id
                      ? 'bg-white text-[#2d2926] shadow-sm'
                      : 'text-warm-muted'
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 6컷 생성 버튼 */}
        <button
          onClick={handleGenerate}
          disabled={loading || videoLoading || !prompt.trim()}
          className="w-full bg-primary hover:bg-[#b05d3f] disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/20 btn-press"
        >
          {loading ? (
            <>
              <span className="material-symbols-outlined animate-spin">progress_activity</span>
              생성 중...
            </>
          ) : (
            <>
              <span className="material-symbols-outlined">auto_awesome</span>
              6컷 생성하기
            </>
          )}
        </button>

        {/* 스트리밍 진행 상태 */}
        {loading && (
          <div className="bg-orange-50 rounded-xl p-4 space-y-3">
            <div className="space-y-2">
              {/* 대사 생성 */}
              <div className="flex items-center gap-2">
                <span className={`material-symbols-outlined text-sm ${
                  streaming.scenes ? 'text-green-500' : 'text-primary animate-spin'
                }`}>
                  {streaming.scenes ? 'check_circle' : 'progress_activity'}
                </span>
                <span className="text-xs text-[#2d2926]">대사 생성</span>
              </div>
              {/* 이미지 1~6 */}
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <div key={n} className="flex items-center gap-2">
                  <span className={`material-symbols-outlined text-sm ${
                    streaming.images.length >= n ? 'text-green-500'
                      : streaming.step === `image_${n}` ? 'text-primary animate-spin'
                      : 'text-[#e5ddd3]'
                  }`}>
                    {streaming.images.length >= n ? 'check_circle'
                      : streaming.step === `image_${n}` ? 'progress_activity'
                      : 'radio_button_unchecked'}
                  </span>
                  <span className="text-xs text-[#2d2926]">{n}컷 이미지</span>
                </div>
              ))}
            </div>
            <div className="w-full bg-[#e5ddd3] rounded-full h-1.5">
              <div
                className="bg-primary h-1.5 rounded-full transition-all duration-500"
                style={{
                  width: `${
                    streaming.scenes
                      ? 10 + streaming.images.length * 15
                      : 5
                  }%`,
                }}
              />
            </div>
            <p className="text-xs text-warm-muted">{streaming.message || 'AI가 작업 중입니다...'}</p>
          </div>
        )}

        {/* 영상 생성 버튼 */}
        <button
          onClick={handleRenderVideo}
          disabled={!result || videoLoading || loading}
          className={`w-full font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2 btn-press ${
            result && !videoLoading
              ? 'bg-[#2d2926] hover:bg-[#1a1714] text-white shadow-lg shadow-[#2d2926]/20'
              : 'bg-[#e5ddd3] text-[#8a7d72] cursor-not-allowed'
          }`}
        >
          {videoLoading ? (
            <>
              <span className="material-symbols-outlined animate-spin">progress_activity</span>
              {videoStepLabel()}
            </>
          ) : videoUrl ? (
            <>
              <span className="material-symbols-outlined">check_circle</span>
              영상 생성 완료!
            </>
          ) : (
            <>
              <span className="material-symbols-outlined">movie</span>
              영상 생성하기
            </>
          )}
        </button>

        {videoLoading && (
          <div className="bg-[#f9f6f0] rounded-xl p-4 space-y-3">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-sm text-primary animate-spin">progress_activity</span>
              <span className="text-xs text-[#2d2926] font-medium">AI 영상 변환 중</span>
            </div>
            <p className="text-xs text-warm-muted">
              각 이미지를 AI가 움직이는 영상으로 변환하고 있습니다. 2~3분 정도 소요됩니다.
            </p>
            <div className="w-full bg-[#e5ddd3] rounded-full h-1.5">
              <div className="bg-primary h-1.5 rounded-full animate-pulse" style={{ width: '60%' }} />
            </div>
          </div>
        )}

        {videoUrl && !videoLoading && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 space-y-2">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-green-500">check_circle</span>
              <p className="text-sm font-medium text-green-700">영상이 생성되었습니다!</p>
            </div>
            <p className="text-xs text-green-600">왼쪽 미리보기에서 영상을 확인하세요.</p>
            {thumbnailSaved ? (
              <div className="flex items-center gap-1 pt-1">
                <span className="material-symbols-outlined text-green-500 text-sm">check_circle</span>
                <p className="text-xs text-green-600 font-medium">대표 이미지가 저장되었습니다</p>
              </div>
            ) : (
              <p className="text-xs text-amber-600 font-medium pt-1">이미지를 클릭하여 대표 썸네일을 선택해주세요</p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
