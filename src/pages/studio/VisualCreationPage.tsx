import { useState } from 'react'
import { generationApi } from '@/api/generation'
import { resolveApiUrl } from '@/config/env'
import type { GenerationData } from '@/types/generation'

const categories = [
  { id: 1, label: '애니메이션', icon: 'animation', desc: '생동감 넘치는 애니 스타일' },
  { id: 2, label: '히어로', icon: 'shield', desc: '슈퍼히어로 액션 스타일' },
  { id: 3, label: '게임', icon: 'sports_esports', desc: '게임 시네마틱 스타일' },
  { id: 4, label: '판타지', icon: 'auto_awesome', desc: '에픽 판타지 스타일' },
]

export default function VisualCreationPage() {
  const [prompt, setPrompt] = useState('')
  const [selectedCategory, setSelectedCategory] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [result, setResult] = useState<GenerationData | null>(null)

  // 영상 생성 상태
  const [videoLoading, setVideoLoading] = useState(false)
  const [videoStep, setVideoStep] = useState<'idle' | 'subtitles' | 'video' | 'done'>('idle')
  const [videoUrl, setVideoUrl] = useState<string | null>(null)
  const [videoError, setVideoError] = useState('')

  // 1단계: 3컷 이미지 + 대사 생성
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

    try {
      const res = await generationApi.create({
        category_id: selectedCategory,
        prompt: prompt.trim(),
      })

      if (res.data.success) {
        setResult(res.data.data)
      } else {
        setError(res.data.message || '생성에 실패했습니다.')
      }
    } catch (err: any) {
      console.error('Generation error:', err)
      const detail = err.response?.data?.detail
      const message = typeof detail === 'string' ? detail : err.message || '서버 오류가 발생했습니다.'
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  // 2단계 + 3단계: 자막 합성 → 영상 생성 (한 플로우)
  const handleRenderVideo = async () => {
    if (!result) return

    setVideoLoading(true)
    setVideoError('')
    setVideoUrl(null)

    try {
      // 2단계: 자막 합성
      setVideoStep('subtitles')
      const subtitleRes = await generationApi.renderSubtitles({
        job_id: result.job_id,
        images: result.images,
        scenes: result.scenes,
      })

      if (!subtitleRes.data.success) {
        setVideoError(subtitleRes.data.message || '자막 합성에 실패했습니다.')
        return
      }

      // 3단계: 영상 생성
      setVideoStep('video')
      const videoRes = await generationApi.renderVideo({
        job_id: result.job_id,
        subtitle_images: subtitleRes.data.data.subtitle_images.map((img) => ({
          scene_order: img.scene_order,
          image_url: img.image_url,
          duration: 2,
        })),
      })

      if (videoRes.data.success) {
        setVideoUrl(videoRes.data.data.video_url)
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

  const videoStepLabel = () => {
    switch (videoStep) {
      case 'subtitles': return '자막 합성 중...'
      case 'video': return '영상 렌더링 중...'
      default: return '영상 생성 중...'
    }
  }

  return (
    <div className="flex gap-6 min-h-[calc(100vh-8rem)]">
      {/* Left Panel - Prompt & Category */}
      <div className="flex-1 space-y-6">
        <div className="space-y-3 animate-enter">
          <h1 className="text-2xl font-bold text-[#2d2926]">비주얼 생성</h1>
          <p className="text-warm-muted text-sm">원하는 장면을 설명해 주세요. AI가 3컷 만화를 만들어 드립니다.</p>
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

        {/* Result - 3컷 미리보기 */}
        {result ? (
          <div className="bg-white rounded-2xl border border-[#e5ddd3] p-6 space-y-5 animate-enter-scale">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-[#2d2926]">{result.title}</h3>
              <span className="text-xs bg-primary/10 text-primary px-3 py-1 rounded-full font-medium">
                {categories.find(c => c.id === result.category_id)?.label}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {result.scenes.map((scene, idx) => (
                <div key={scene.scene_order} className="space-y-3">
                  {/* Image */}
                  <div className="aspect-square rounded-xl overflow-hidden bg-[#f9f6f0] border border-[#e5ddd3]">
                    {result.images[idx] && (
                      <img
                        src={resolveApiUrl(result.images[idx].image_url)}
                        alt={scene.subtitle_text}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                  {/* Scene Info */}
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
              ))}
            </div>

            {/* 영상 플레이어 */}
            {videoUrl && (
              <div className="mt-4 rounded-xl overflow-hidden border border-[#e5ddd3] bg-black">
                <video
                  src={resolveApiUrl(videoUrl)}
                  controls
                  className="w-full"
                  autoPlay
                />
              </div>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-[#e5ddd3] p-8 flex flex-col items-center justify-center min-h-[240px] animate-enter-scale" style={{ animationDelay: '300ms' }}>
            <div className="size-16 rounded-2xl bg-[#f9f6f0] flex items-center justify-center mb-4">
              <span className="material-symbols-outlined text-3xl text-primary/40">smart_display</span>
            </div>
            <p className="text-sm font-semibold text-[#2d2926]">미리보기</p>
            <p className="text-xs text-warm-muted mt-1">프롬프트를 입력하고 생성 버튼을 누르세요</p>
          </div>
        )}
      </div>

      {/* Right Panel - Buttons */}
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
              <span className="font-medium text-[#2d2926]">3컷 만화</span>
            </div>
            <div className="flex justify-between">
              <span className="text-warm-muted">AI 대사</span>
              <span className="font-medium text-[#2d2926]">자동 생성</span>
            </div>
            <div className="flex justify-between">
              <span className="text-warm-muted">AI 이미지</span>
              <span className="font-medium text-[#2d2926]">3장 생성</span>
            </div>
          </div>
        </div>

        {/* 3컷 생성 버튼 */}
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
              3컷 생성하기
            </>
          )}
        </button>

        {loading && (
          <div className="bg-orange-50 rounded-xl p-4 space-y-2">
            <p className="text-xs text-warm-muted">AI가 대사와 이미지를 생성하고 있습니다.</p>
            <p className="text-xs text-warm-muted">잠시만 기다려주세요...</p>
          </div>
        )}

        {/* 영상 생성 버튼 - 3컷 생성 완료 후 활성화 */}
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
            {/* 진행 단계 표시 */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className={`material-symbols-outlined text-sm ${videoStep === 'subtitles' ? 'text-primary animate-spin' : videoStep === 'video' || videoStep === 'done' ? 'text-green-500' : 'text-[#e5ddd3]'}`}>
                  {videoStep === 'subtitles' ? 'progress_activity' : videoStep === 'video' || videoStep === 'done' ? 'check_circle' : 'radio_button_unchecked'}
                </span>
                <span className="text-xs text-[#2d2926]">자막 합성</span>
              </div>
              <div className="flex items-center gap-2">
                <span className={`material-symbols-outlined text-sm ${videoStep === 'video' ? 'text-primary animate-spin' : videoStep === 'done' ? 'text-green-500' : 'text-[#e5ddd3]'}`}>
                  {videoStep === 'video' ? 'progress_activity' : videoStep === 'done' ? 'check_circle' : 'radio_button_unchecked'}
                </span>
                <span className="text-xs text-[#2d2926]">영상 렌더링</span>
              </div>
            </div>
            <p className="text-xs text-warm-muted">이미지에 자막을 합성하고 영상을 만들고 있습니다.</p>
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
