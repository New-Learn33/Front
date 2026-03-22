import { useState, useEffect } from 'react'
import { presetsApi, type Preset } from '@/api/presets'
import { useGeneration } from '@/hooks/useGeneration'

const categories = [
  { id: 1, label: '애니메이션', icon: 'animation', desc: '생동감 넘치는 애니 스타일' },
  { id: 2, label: '히어로', icon: 'shield', desc: '슈퍼히어로 액션 스타일' },
  { id: 3, label: '게임', icon: 'sports_esports', desc: '게임 시네마틱 스타일' },
  { id: 4, label: '판타지', icon: 'auto_awesome', desc: '에픽 판타지 스타일' },
]

export default function VisualCreationPage() {
  const {
    prompt, setPrompt,
    selectedCategory, setSelectedCategory,
    loading, error,
    result,
    streaming,
    artStyle, setArtStyle,
    genre, setGenre,
    imageQuality, setImageQuality,
    motionIntensity, setMotionIntensity,
    videoLoading, videoStep, videoUrl, videoError, videoProgress,
    selectedThumbnail,
    thumbnailSaving, thumbnailSaved,
    handleGenerate, handleRenderVideo, handleSelectThumbnail,
  } = useGeneration()

  // 생성 중 브라우저 닫기 경고
  useEffect(() => {
    const isWorking = loading || videoLoading
    if (!isWorking) return

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault()
    }
    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [loading, videoLoading])

  // 프리셋 상태
  const [presets, setPresets] = useState<Preset[]>([])
  const [showPresetSave, setShowPresetSave] = useState(false)
  const [presetName, setPresetName] = useState('')
  const [showPresets, setShowPresets] = useState(false)

  // 프리셋 목록 로드
  useEffect(() => {
    presetsApi.getAll().then((res) => {
      if (res.data.success) setPresets(res.data.data.presets)
    }).catch(() => {})
  }, [])

  // 프리셋 저장 (상세설정 포함)
  const handleSavePreset = async () => {
    if (!presetName.trim() || !prompt.trim()) return
    try {
      const res = await presetsApi.create({
        name: presetName.trim(),
        prompt: prompt.trim(),
        category_id: selectedCategory,
        art_style: artStyle,
        genre,
        image_quality: imageQuality,
        motion_intensity: motionIntensity,
      })
      if (res.data.success) {
        setPresets((prev) => [res.data.data, ...prev])
        setPresetName('')
        setShowPresetSave(false)
      }
    } catch {}
  }

  // 프리셋 불러오기 (상세설정 포함)
  const handleLoadPreset = (preset: Preset) => {
    setPrompt(preset.prompt)
    setSelectedCategory(preset.category_id)
    if (preset.art_style) setArtStyle(preset.art_style)
    if (preset.genre) setGenre(preset.genre)
    if (preset.image_quality) setImageQuality(preset.image_quality)
    if (preset.motion_intensity) setMotionIntensity(preset.motion_intensity)
    setShowPresets(false)
  }

  // 프리셋 삭제
  const handleDeletePreset = async (id: number) => {
    try {
      await presetsApi.delete(id)
      setPresets((prev) => prev.filter((p) => p.id !== id))
    } catch {}
  }

  const videoStepLabel = () => {
    switch (videoStep) {
      case 'subtitles': return '자막 합성 중...'
      case 'video': return `AI 영상 생성 중... (${videoProgress}%)`
      case 'done': return '완료!'
      default: return '영상 생성 중...'
    }
  }

  // 스트리밍 진행 중인지 (대사 또는 이미지가 있는 상태)
  const isStreaming = loading && (streaming.scenes || streaming.images.length > 0)

  return (
    <div className="flex gap-6 min-h-[calc(100vh-8rem)]">
      {/* Left Panel */}
      <div className="flex-1 min-w-0 space-y-6">
        <div className="space-y-3 animate-enter">
          <h1 className="text-2xl font-bold text-[#2d2926]">새 프로젝트 생성</h1>
          <p className="text-warm-muted text-sm">원하는 장면을 설명해 주세요. AI가 6컷 만화를 만들어 드립니다.</p>
        </div>

        {/* Prompt Input */}
        <div className="bg-white rounded-2xl border border-[#dde7f1] p-5 space-y-3 animate-enter-scale" style={{ animationDelay: '80ms' }}>
          <label className="text-sm font-semibold text-[#2d2926]">프롬프트</label>
          <textarea
            className="w-full h-32 bg-[#f5f9fd] rounded-xl p-4 text-sm outline-none focus:ring-2 focus:ring-primary/20 border border-[#dde7f1] resize-none placeholder:text-warm-muted/50"
            placeholder="시험 전날 밤샘하다가 갑자기 각성한 캐릭터..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            disabled={loading || videoLoading}
          />
          <div className="flex items-center justify-between text-xs text-warm-muted">
            <span>상세할수록 더 좋은 결과를 얻을 수 있습니다</span>
            <span>{prompt.length}/500</span>
          </div>

          {/* 콘텐츠 정책 안내 */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 space-y-1">
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-amber-500 text-sm">info</span>
              <span className="text-xs font-semibold text-amber-700">콘텐츠 생성 가이드</span>
            </div>
            <ul className="text-[11px] text-amber-600 space-y-0.5 pl-5 list-disc">
              <li>특정 캐릭터(마블, 디즈니, 원피스 등) 및 브랜드 이름은 직접 언급할 수 없습니다</li>
              <li>폭력적이거나 선정적인 내용은 생성할 수 없습니다</li>
              <li>실존 인물의 이름이나 초상을 사용할 수 없습니다</li>
            </ul>
          </div>

          {/* 프리셋 버튼 */}
          <div className="flex items-center gap-2 pt-1">
            <button
              onClick={() => setShowPresets(!showPresets)}
              className="flex items-center gap-1 text-xs font-medium text-primary hover:text-[#58717c] transition-colors"
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
            <div className="flex items-center gap-2 bg-[#f5f9fd] rounded-lg p-3 border border-[#dde7f1]">
              <input
                className="flex-1 bg-white rounded-lg px-3 py-2 text-sm border border-[#dde7f1] outline-none focus:ring-2 focus:ring-primary/20"
                placeholder="프리셋 이름 (예: 시험 각성 캐릭터)"
                value={presetName}
                onChange={(e) => setPresetName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSavePreset()}
              />
              <button
                onClick={handleSavePreset}
                disabled={!presetName.trim()}
                className="bg-primary text-white text-xs font-bold px-4 py-2 rounded-lg hover:bg-[#58717c] disabled:opacity-40 transition-colors"
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
            <div className="bg-[#f5f9fd] rounded-xl border border-[#dde7f1] p-3 space-y-2 max-h-48 overflow-y-auto">
              {presets.length === 0 ? (
                <p className="text-xs text-warm-muted text-center py-3">저장된 프리셋이 없습니다</p>
              ) : (
                presets.map((preset) => (
                  <div
                    key={preset.id}
                    className="flex items-center justify-between bg-white rounded-lg px-3 py-2 border border-[#dde7f1] hover:border-primary/30 transition-colors group"
                  >
                    <button
                      onClick={() => handleLoadPreset(preset)}
                      className="flex-1 text-left min-w-0"
                    >
                      <p className="text-sm font-medium text-[#2d2926]">{preset.name}</p>
                      <p className="text-xs text-warm-muted truncate">{preset.prompt}</p>
                      {(preset.art_style || preset.genre) && (
                        <div className="flex flex-wrap gap-1 mt-1">
                          {preset.art_style && (
                            <span className="text-[10px] bg-[#f8fbff] text-warm-grey px-1.5 py-0.5 rounded">{preset.art_style}</span>
                          )}
                          {preset.genre && preset.genre !== 'auto' && (
                            <span className="text-[10px] bg-[#f8fbff] text-warm-grey px-1.5 py-0.5 rounded">{preset.genre}</span>
                          )}
                          {preset.image_quality && preset.image_quality !== 'medium' && (
                            <span className="text-[10px] bg-[#f8fbff] text-warm-grey px-1.5 py-0.5 rounded">퀄리티: {preset.image_quality}</span>
                          )}
                        </div>
                      )}
                    </button>
                    <div className="flex items-center gap-1 ml-2 shrink-0">
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
                    : 'border-[#dde7f1] bg-white hover:border-primary/30 card-hover'
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
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
            <span className="material-symbols-outlined text-red-500 mt-0.5">error</span>
            <p className="text-sm text-red-600 whitespace-pre-line">{error}</p>
          </div>
        )}
        {videoError && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
            <span className="material-symbols-outlined text-red-500 mt-0.5">error</span>
            <p className="text-sm text-red-600 whitespace-pre-line">{videoError}</p>
          </div>
        )}

        {/* 스트리밍 중간 결과 (실시간으로 이미지가 나타남) */}
        {isStreaming && (
          <div className="bg-white rounded-2xl border border-[#dde7f1] p-6 space-y-5 animate-enter-scale">
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
                      <div className="aspect-square rounded-xl overflow-hidden bg-[#f5f9fd] border border-[#dde7f1] relative">
                        {img ? (
                          <img
                            src={img.image_url}
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
                                <span className="material-symbols-outlined text-4xl text-[#dde7f1]">hourglass_top</span>
                                <span className="text-xs text-warm-muted">대기 중</span>
                              </>
                            ) : (
                              <>
                                <span className="material-symbols-outlined text-4xl text-[#dde7f1]">image</span>
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
                        <p className="text-sm font-medium text-[#2d2926] bg-[#f5f9fd] rounded-lg p-3 border border-[#dde7f1]">
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
          <div className="bg-white rounded-2xl border border-[#dde7f1] p-6 space-y-5 animate-enter-scale">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-[#2d2926]">{result.title}</h3>
              <span className="text-xs bg-primary/10 text-primary px-3 py-1 rounded-full font-medium">
                {categories.find(c => c.id === result.category_id)?.label}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {result.scenes.map((scene, idx) => (
                <div key={scene.scene_order} className="space-y-3">
                  <div className="aspect-square rounded-xl overflow-hidden bg-[#f5f9fd] border border-[#dde7f1]">
                    {result.images[idx] && (
                      <img
                        src={result.images[idx].image_url}
                        alt={scene.subtitle_text}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs bg-primary text-white px-2 py-0.5 rounded-full font-bold">
                        {scene.scene_order}컷
                      </span>
                      <span className="text-xs text-warm-muted">{scene.subtitle_text}</span>
                    </div>
                    <p className="text-sm font-medium text-[#2d2926] bg-[#f5f9fd] rounded-lg p-3 border border-[#dde7f1]">
                      "{scene.dialogue}"
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* 영상 플레이어 */}
            {videoUrl && (
              <div className="mt-4 rounded-xl overflow-hidden border border-[#dde7f1] bg-black">
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
          <div className="bg-white rounded-2xl border border-[#dde7f1] p-8 flex flex-col items-center justify-center min-h-[240px] animate-enter-scale" style={{ animationDelay: '300ms' }}>
            <div className="size-16 rounded-2xl bg-[#f5f9fd] flex items-center justify-center mb-4">
              <span className="material-symbols-outlined text-3xl text-primary/40">smart_display</span>
            </div>
            <p className="text-sm font-semibold text-[#2d2926]">미리보기</p>
            <p className="text-xs text-warm-muted mt-1">프롬프트를 입력하고 생성 버튼을 누르세요</p>
          </div>
        )}
      </div>

      {/* Right Panel */}
      <div className="w-80 shrink-0 space-y-5 animate-enter sticky top-8 self-start max-h-[calc(100vh-6rem)] overflow-y-auto" style={{ animationDelay: '200ms' }}>
        <div className="bg-white rounded-2xl border border-[#dde7f1] p-5 space-y-4">
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

        {/* 상세설정 */}
        <div className="bg-white rounded-2xl border border-[#dde7f1] p-5 space-y-4">
          <h3 className="text-base font-bold text-[#2d2926]">상세설정</h3>

          {/* 아트 스타일 */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-[#2d2926]">아트 스타일</label>
            <div className="grid grid-cols-3 gap-1.5">
              {([
                { value: 'webtoon', label: '웹툰', icon: 'draw' },
                { value: 'anime', label: '애니메', icon: 'animation' },
                { value: 'watercolor', label: '수채화', icon: 'palette' },
                { value: '3d_render', label: '3D', icon: 'view_in_ar' },
                { value: 'pixel', label: '픽셀', icon: 'grid_on' },
                { value: 'realistic', label: '실사', icon: 'photo_camera' },
              ] as const).map((s) => (
                <button
                  key={s.value}
                  onClick={() => setArtStyle(s.value)}
                  disabled={loading || videoLoading}
                  className={`flex flex-col items-center gap-1 py-2 rounded-lg text-xs font-medium transition-all ${
                    artStyle === s.value
                      ? 'bg-primary text-white'
                      : 'bg-[#f5f9fd] text-[#5e5452] hover:bg-primary/10'
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
            <label className="text-xs font-semibold text-[#2d2926]">장르 / 분위기</label>
            <div className="flex flex-wrap gap-1.5">
              {([
                { value: 'auto', label: '자동' },
                { value: 'comedy', label: '코미디' },
                { value: 'action', label: '액션' },
                { value: 'romance', label: '로맨스' },
                { value: 'horror', label: '호러' },
                { value: 'emotional', label: '감동' },
              ] as const).map((g) => (
                <button
                  key={g.value}
                  onClick={() => setGenre(g.value)}
                  disabled={loading || videoLoading}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                    genre === g.value
                      ? 'bg-primary text-white'
                      : 'bg-[#f5f9fd] text-[#5e5452] hover:bg-primary/10'
                  }`}
                >
                  {g.label}
                </button>
              ))}
            </div>
          </div>

          {/* 이미지 퀄리티 */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-[#2d2926]">이미지 퀄리티</label>
            <div className="grid grid-cols-3 gap-1.5">
              {([
                { value: 'low', label: '빠름' },
                { value: 'medium', label: '보통' },
                { value: 'high', label: '고품질' },
              ] as const).map((q) => (
                <button
                  key={q.value}
                  onClick={() => setImageQuality(q.value)}
                  disabled={loading || videoLoading}
                  className={`py-2 rounded-lg text-xs font-medium transition-all ${
                    imageQuality === q.value
                      ? 'bg-primary text-white'
                      : 'bg-[#f5f9fd] text-[#5e5452] hover:bg-primary/10'
                  }`}
                >
                  {q.label}
                </button>
              ))}
            </div>
          </div>

          {/* 움직임 강도 */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-[#2d2926]">움직임 강도</label>
            <div className="grid grid-cols-3 gap-1.5">
              {([
                { value: 'low', label: '약하게' },
                { value: 'medium', label: '보통' },
                { value: 'high', label: '강하게' },
              ] as const).map((m) => (
                <button
                  key={m.value}
                  onClick={() => setMotionIntensity(m.value)}
                  disabled={loading || videoLoading}
                  className={`py-2 rounded-lg text-xs font-medium transition-all ${
                    motionIntensity === m.value
                      ? 'bg-primary text-white'
                      : 'bg-[#f5f9fd] text-[#5e5452] hover:bg-primary/10'
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 썸네일 선택 */}
        {result && (
          <div className="bg-white rounded-2xl border border-[#dde7f1] p-5 space-y-3">
            <h3 className="text-base font-bold text-[#2d2926]">썸네일 선택</h3>
            <div className="grid grid-cols-3 gap-2">
              {result.images.map((img) => (
                <button
                  key={img.scene_order}
                  onClick={() => handleSelectThumbnail(img.image_url)}
                  disabled={thumbnailSaving}
                  className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                    selectedThumbnail === img.image_url
                      ? 'border-primary ring-2 ring-primary/20'
                      : 'border-[#dde7f1] hover:border-primary/40'
                  }`}
                >
                  <img src={img.image_url} alt={`씬 ${img.scene_order}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
            {thumbnailSaving && (
              <p className="text-xs text-primary flex items-center gap-1">
                <span className="material-symbols-outlined text-sm animate-spin">progress_activity</span>
                저장 중...
              </p>
            )}
            {thumbnailSaved && !thumbnailSaving && (
              <p className="text-xs text-green-600 flex items-center gap-1">
                <span className="material-symbols-outlined text-sm">check_circle</span>
                썸네일이 저장되었습니다
              </p>
            )}
          </div>
        )}

        {/* 6컷 생성 버튼 */}
        <button
          onClick={handleGenerate}
          disabled={loading || videoLoading || !prompt.trim()}
          className="w-full bg-primary hover:bg-[#58717c] disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/20 btn-press"
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
                      : 'text-[#dde7f1]'
                  }`}>
                    {streaming.images.length >= n ? 'check_circle'
                      : streaming.step === `image_${n}` ? 'progress_activity'
                      : 'radio_button_unchecked'}
                  </span>
                  <span className="text-xs text-[#2d2926]">{n}컷 이미지</span>
                </div>
              ))}
            </div>
            <div className="w-full bg-[#dde7f1] rounded-full h-1.5">
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
              : 'bg-[#dde7f1] text-[#8a7d72] cursor-not-allowed'
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
              새 프로젝트 생성
            </>
          )}
        </button>

        {videoLoading && (
          <div className="bg-[#f5f9fd] rounded-xl p-4 space-y-3">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-sm text-primary animate-spin">progress_activity</span>
              <span className="text-xs text-[#2d2926] font-medium">AI 영상 변환 중</span>
            </div>
            <p className="text-xs text-warm-muted">
              백그라운드에서 영상을 생성 중입니다. 다른 페이지로 이동해도 작업이 계속됩니다.
            </p>
            <div className="w-full bg-[#dde7f1] rounded-full h-1.5">
              <div className="bg-primary h-1.5 rounded-full transition-all duration-500" style={{ width: `${Math.max(videoProgress, 10)}%` }} />
            </div>
            <p className="text-[10px] text-warm-muted text-right">{videoProgress}%</p>
          </div>
        )}

        {videoUrl && !videoLoading && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 space-y-2">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-green-500">check_circle</span>
              <p className="text-sm font-medium text-green-700">영상이 생성되었습니다!</p>
            </div>
            <p className="text-xs text-green-600">왼쪽 미리보기에서 영상을 확인하세요.</p>
          </div>
        )}
      </div>
    </div>
  )
}
