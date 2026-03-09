import { useState } from 'react'

const styles = [
  { id: 'cinematic', label: '시네마틱', icon: 'movie', desc: '영화같은 색감과 조명' },
  { id: 'animation', label: '애니메이션', icon: 'animation', desc: '생동감 넘치는 2D 스타일' },
  { id: 'cyberpunk', label: '사이버펑크', icon: 'blur_on', desc: '네온과 미래적 분위기' },
  { id: 'watercolor', label: '수채화', icon: 'brush', desc: '부드러운 예술적 터치' },
  { id: 'vintage', label: '빈티지', icon: 'photo_camera', desc: '클래식하고 따뜻한 톤' },
  { id: '3d', label: '3D', icon: 'view_in_ar', desc: '입체감 있는 3D 렌더링' },
]

export default function VisualCreationPage() {
  const [prompt, setPrompt] = useState('')
  const [selectedStyle, setSelectedStyle] = useState('cinematic')
  const [lighting, setLighting] = useState(60)
  const [contrast, setContrast] = useState(50)
  const [saturation, setSaturation] = useState(70)
  const [motionSpeed, setMotionSpeed] = useState(40)

  return (
    <div className="flex gap-6 min-h-[calc(100vh-8rem)]">
      {/* Left Panel - Prompt & Style */}
      <div className="flex-1 space-y-6">
        {/* Prompt Input */}
        <div className="space-y-3">
          <h1 className="text-2xl font-bold text-[#2d2926]">비주얼 생성</h1>
          <p className="text-warm-muted text-sm">원하는 장면을 설명해 주세요. AI가 영상을 만들어 드립니다.</p>
        </div>

        <div className="bg-white rounded-2xl border border-[#e5ddd3] p-5 space-y-3">
          <label className="text-sm font-semibold text-[#2d2926]">프롬프트</label>
          <textarea
            className="w-full h-32 bg-[#f9f6f0] rounded-xl p-4 text-sm outline-none focus:ring-2 focus:ring-primary/20 border border-[#e5ddd3] resize-none placeholder:text-warm-muted/50"
            placeholder="비행 자동차와 네온사인이 가득한 미래 도시, 시네마틱한 조명과 비 오는 밤..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
          <div className="flex items-center justify-between text-xs text-warm-muted">
            <span>상세할수록 더 좋은 결과를 얻을 수 있습니다</span>
            <span>{prompt.length}/500</span>
          </div>
        </div>

        {/* Style Selection */}
        <div className="space-y-3">
          <h2 className="text-lg font-bold text-[#2d2926]">스타일 선택</h2>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
            {styles.map((s) => (
              <button
                key={s.id}
                onClick={() => setSelectedStyle(s.id)}
                className={`p-4 rounded-2xl border-2 text-left transition-all ${
                  selectedStyle === s.id
                    ? 'border-primary bg-primary/5'
                    : 'border-[#e5ddd3] bg-white hover:border-primary/30'
                }`}
              >
                <div className={`size-10 rounded-xl flex items-center justify-center mb-3 ${
                  selectedStyle === s.id ? 'bg-primary text-white' : 'bg-primary/10 text-primary'
                }`}>
                  <span className="material-symbols-outlined">{s.icon}</span>
                </div>
                <p className="text-sm font-bold text-[#2d2926]">{s.label}</p>
                <p className="text-xs text-warm-muted mt-1">{s.desc}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Preview Placeholder */}
        <div className="bg-white rounded-2xl border border-[#e5ddd3] p-8 flex flex-col items-center justify-center min-h-[240px]">
          <div className="size-16 rounded-2xl bg-[#f9f6f0] flex items-center justify-center mb-4">
            <span className="material-symbols-outlined text-3xl text-primary/40">smart_display</span>
          </div>
          <p className="text-sm font-semibold text-[#2d2926]">미리보기</p>
          <p className="text-xs text-warm-muted mt-1">프롬프트를 입력하고 생성 버튼을 누르세요</p>
        </div>
      </div>

      {/* Right Panel - Settings */}
      <div className="w-80 shrink-0 space-y-5">
        <div className="bg-white rounded-2xl border border-[#e5ddd3] p-5 space-y-6">
          <h3 className="text-base font-bold text-[#2d2926]">세부 설정</h3>

          {/* Lighting */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-[#2d2926]">조명</label>
              <span className="text-xs text-warm-muted">{lighting}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={lighting}
              onChange={(e) => setLighting(Number(e.target.value))}
              className="w-full accent-primary"
            />
          </div>

          {/* Contrast */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-[#2d2926]">대비</label>
              <span className="text-xs text-warm-muted">{contrast}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={contrast}
              onChange={(e) => setContrast(Number(e.target.value))}
              className="w-full accent-primary"
            />
          </div>

          {/* Saturation */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-[#2d2926]">색상 채도</label>
              <span className="text-xs text-warm-muted">{saturation}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={saturation}
              onChange={(e) => setSaturation(Number(e.target.value))}
              className="w-full accent-primary"
            />
          </div>

          {/* Motion Speed */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-[#2d2926]">모션 속도</label>
              <span className="text-xs text-warm-muted">{motionSpeed}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={motionSpeed}
              onChange={(e) => setMotionSpeed(Number(e.target.value))}
              className="w-full accent-primary"
            />
          </div>
        </div>

        {/* Aspect Ratio */}
        <div className="bg-white rounded-2xl border border-[#e5ddd3] p-5 space-y-3">
          <h3 className="text-sm font-bold text-[#2d2926]">화면 비율</h3>
          <div className="grid grid-cols-3 gap-2">
            {['9:16', '1:1', '16:9'].map((ratio) => (
              <button
                key={ratio}
                className="py-2 rounded-lg border border-[#e5ddd3] text-xs font-medium text-warm-muted hover:border-primary hover:text-primary transition-all first:border-primary first:text-primary first:bg-primary/5"
              >
                {ratio}
              </button>
            ))}
          </div>
        </div>

        {/* Duration */}
        <div className="bg-white rounded-2xl border border-[#e5ddd3] p-5 space-y-3">
          <h3 className="text-sm font-bold text-[#2d2926]">영상 길이</h3>
          <div className="grid grid-cols-3 gap-2">
            {['5초', '15초', '30초'].map((d) => (
              <button
                key={d}
                className="py-2 rounded-lg border border-[#e5ddd3] text-xs font-medium text-warm-muted hover:border-primary hover:text-primary transition-all first:border-primary first:text-primary first:bg-primary/5"
              >
                {d}
              </button>
            ))}
          </div>
        </div>

        {/* Generate Button */}
        <button className="w-full bg-primary hover:bg-[#b05d3f] text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/20">
          <span className="material-symbols-outlined">auto_awesome</span>
          영상 생성하기
        </button>
      </div>
    </div>
  )
}
