import PublicLayout from '../components/PublicLayout'

const plans = [
  {
    name: 'Free',
    price: '₩0',
    period: '월',
    desc: '가볍게 시작하기',
    features: ['월 5회 영상 생성', '720p 화질', '기본 스타일 3종', '커뮤니티 접근'],
    cta: '현재 플랜',
    highlight: false,
  },
  {
    name: 'Pro',
    price: '₩9,900',
    period: '월',
    desc: '크리에이터를 위한 플랜',
    features: ['월 50회 영상 생성', '1080p 화질', '모든 스타일 사용', '우선 생성 큐', '워터마크 제거'],
    cta: '시작하기',
    highlight: true,
  },
  {
    name: 'Enterprise',
    price: '문의',
    period: '',
    desc: '팀과 기업을 위한 플랜',
    features: ['무제한 영상 생성', '4K 화질', '커스텀 스타일', 'API 액세스', '전담 지원'],
    cta: '문의하기',
    highlight: false,
  },
]

export default function PricingPage() {
  return (
    <PublicLayout activeNav="pricing">
      <div className="max-w-5xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <span className="text-[#c87533] font-bold text-sm tracking-widest uppercase">Pricing</span>
          <h1 className="text-4xl font-black text-[#2d2926] mt-2">요금제</h1>
          <p className="text-[#8a7d72] mt-3 text-lg">나에게 맞는 플랜을 선택하세요</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`rounded-2xl p-8 border transition-all ${
                plan.highlight
                  ? 'bg-[#c87533] text-white border-[#c87533] shadow-xl scale-105'
                  : 'bg-white border-[#e5ddd3] hover:shadow-lg'
              }`}
            >
              <h3 className={`text-lg font-bold ${plan.highlight ? 'text-white/90' : 'text-[#8a7d72]'}`}>{plan.name}</h3>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-4xl font-black">{plan.price}</span>
                {plan.period && <span className={`text-sm ${plan.highlight ? 'text-white/70' : 'text-[#8a7d72]'}`}>/{plan.period}</span>}
              </div>
              <p className={`mt-2 text-sm ${plan.highlight ? 'text-white/80' : 'text-[#8a7d72]'}`}>{plan.desc}</p>

              <ul className="mt-8 space-y-3">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm">
                    <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                    {f}
                  </li>
                ))}
              </ul>

              <button
                className={`mt-8 w-full py-3 rounded-xl font-bold text-sm transition-colors ${
                  plan.highlight
                    ? 'bg-white text-[#c87533] hover:bg-white/90'
                    : 'bg-[#f5ede4] text-[#c87533] hover:bg-[#ecdfd3]'
                }`}
              >
                {plan.cta}
              </button>
            </div>
          ))}
        </div>

        <p className="text-center text-[#8a7d72] text-sm mt-12">
          모든 플랜은 언제든 변경하거나 해지할 수 있습니다.
        </p>
      </div>
    </PublicLayout>
  )
}
