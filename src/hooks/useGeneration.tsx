import { createContext, useContext, useState, useRef, useCallback, type ReactNode } from 'react'
import { generationApi } from '@/api/generation'
import { API_BASE_URL, resolveApiUrl } from '@/config/env'
import type { GenerationData } from '@/types/generation'

// ── 타입 ──
interface StreamingState {
  step: string
  message: string
  scenes: any[] | null
  images: { scene_order: number; image_url: string }[]
  title: string
  jobId: number | null
}

interface GenerationContextType {
  // 생성 상태
  prompt: string
  setPrompt: (v: string) => void
  selectedCategory: number
  setSelectedCategory: (v: number) => void
  loading: boolean
  error: string
  setError: (v: string) => void
  result: GenerationData | null
  setResult: (v: GenerationData | null) => void
  streaming: StreamingState

  // 생성 옵션
  artStyle: string
  setArtStyle: (v: string) => void
  genre: string
  setGenre: (v: string) => void
  imageQuality: string
  setImageQuality: (v: string) => void
  motionIntensity: string
  setMotionIntensity: (v: string) => void

  // 영상 상태
  videoLoading: boolean
  videoStep: 'idle' | 'subtitles' | 'video' | 'done'
  videoUrl: string | null
  videoError: string

  // 썸네일
  selectedThumbnail: string | null
  setSelectedThumbnail: (v: string | null) => void
  thumbnailSaving: boolean
  thumbnailSaved: boolean

  // 액션
  handleGenerate: () => Promise<void>
  handleRenderVideo: () => Promise<void>
  handleSelectThumbnail: (imageUrl: string) => Promise<void>
  handleAbort: () => void
  resetAll: () => void
}

const GenerationContext = createContext<GenerationContextType | null>(null)

const INITIAL_STREAMING: StreamingState = {
  step: '',
  message: '',
  scenes: null,
  images: [],
  title: '',
  jobId: null,
}

// ── Provider ──
export function GenerationProvider({ children }: { children: ReactNode }) {
  // 프롬프트 & 카테고리
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

  // 스트리밍
  const [streaming, setStreaming] = useState<StreamingState>(INITIAL_STREAMING)

  // 영상
  const [videoLoading, setVideoLoading] = useState(false)
  const [videoStep, setVideoStep] = useState<'idle' | 'subtitles' | 'video' | 'done'>('idle')
  const [videoUrl, setVideoUrl] = useState<string | null>(null)
  const [videoError, setVideoError] = useState('')

  // 썸네일
  const [selectedThumbnail, setSelectedThumbnail] = useState<string | null>(null)
  const [thumbnailSaving, setThumbnailSaving] = useState(false)
  const [thumbnailSaved, setThumbnailSaved] = useState(false)

  const abortRef = useRef<AbortController | null>(null)

  // ── 6컷 SSE 스트리밍 생성 ──
  const handleGenerate = useCallback(async () => {
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
    setStreaming({ ...INITIAL_STREAMING, message: '준비 중...' })

    const controller = new AbortController()
    abortRef.current = controller

    try {
      const token = localStorage.getItem('access_token')
      const response = await fetch(`${API_BASE_URL}/api/v1/generation/stream`, {
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

      if (!response.ok) throw new Error(`서버 오류: ${response.status}`)

      const reader = response.body?.getReader()
      if (!reader) throw new Error('스트림을 읽을 수 없습니다.')

      const decoder = new TextDecoder()
      let buffer = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        buffer += decoder.decode(value, { stream: true })
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
                setStreaming(prev => ({ ...prev, step: event.step, message: event.message }))
                break
              case 'script':
                setStreaming(prev => ({ ...prev, scenes: event.scenes, title: event.title, jobId: event.job_id }))
                break
              case 'image':
                setStreaming(prev => ({
                  ...prev,
                  images: [...prev.images, { scene_order: event.scene_order, image_url: event.image_url }],
                }))
                break
              case 'done':
                setResult({
                  job_id: event.job_id,
                  title: event.title,
                  category_id: event.category_id,
                  selected_template_image: event.selected_template_image,
                  scenes: event.scenes,
                  images: event.images,
                })
                setStreaming(INITIAL_STREAMING)
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
  }, [prompt, selectedCategory, artStyle, genre, imageQuality])

  // ── 영상 생성 (SVD/Minimax) ──
  const handleRenderVideo = useCallback(async () => {
    if (!result) return

    setVideoLoading(true)
    setVideoError('')
    setVideoUrl(null)
    setVideoStep('video')

    try {
      const videoRes = await generationApi.renderVideoSvd({
        job_id: result.job_id,
        images: result.images.map(img => ({
          scene_order: img.scene_order,
          image_url: img.image_url,
        })),
        scenes: result.scenes.map(s => ({
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
  }, [result, motionIntensity])

  // ── 썸네일 선택 ──
  const handleSelectThumbnail = useCallback(async (imageUrl: string) => {
    if (!result) return
    setSelectedThumbnail(imageUrl)
    setThumbnailSaving(true)
    try {
      const res = await generationApi.selectThumbnail({
        job_id: result.job_id,
        thumbnail_url: imageUrl,
      })
      if (res.data.success) setThumbnailSaved(true)
    } catch (err) {
      console.error('Thumbnail save error:', err)
    } finally {
      setThumbnailSaving(false)
    }
  }, [result])

  // ── 중단 ──
  const handleAbort = useCallback(() => {
    abortRef.current?.abort()
    abortRef.current = null
  }, [])

  // ── 전체 초기화 ──
  const resetAll = useCallback(() => {
    handleAbort()
    setPrompt('')
    setSelectedCategory(1)
    setLoading(false)
    setError('')
    setResult(null)
    setStreaming(INITIAL_STREAMING)
    setVideoLoading(false)
    setVideoStep('idle')
    setVideoUrl(null)
    setVideoError('')
    setSelectedThumbnail(null)
    setThumbnailSaving(false)
    setThumbnailSaved(false)
  }, [handleAbort])

  return (
    <GenerationContext.Provider
      value={{
        prompt, setPrompt,
        selectedCategory, setSelectedCategory,
        loading, error, setError,
        result, setResult,
        streaming,
        artStyle, setArtStyle,
        genre, setGenre,
        imageQuality, setImageQuality,
        motionIntensity, setMotionIntensity,
        videoLoading, videoStep, videoUrl, videoError,
        selectedThumbnail, setSelectedThumbnail,
        thumbnailSaving, thumbnailSaved,
        handleGenerate, handleRenderVideo, handleSelectThumbnail,
        handleAbort, resetAll,
      }}
    >
      {children}
    </GenerationContext.Provider>
  )
}

// ── Hook ──
export function useGeneration() {
  const ctx = useContext(GenerationContext)
  if (!ctx) throw new Error('useGeneration must be used within GenerationProvider')
  return ctx
}
