import PublicLayout from '../components/PublicLayout'

const faqs = [
  { q: 'AI 영상 생성은 어떻게 하나요?', a: '스튜디오에서 프롬프트를 입력하고 스타일을 선택한 뒤 "생성" 버튼을 누르면 AI가 자동으로 영상을 만들어줍니다.' },
  { q: '영상을 몇 개까지 만들 수 있나요?', a: '현재는 별도의 생성 제한 없이 자유롭게 영상을 만들 수 있습니다.' },
  { q: '생성된 영상의 저작권은 누구에게 있나요?', a: 'AI로 생성된 영상은 이용약관에 따라 생성자가 자유롭게 사용할 수 있습니다.' },
  { q: '영상 화질을 변경할 수 있나요?', a: '환경설정에서 기본 화질을 설정할 수 있으며, Pro 플랜 이상에서 1080p 이상의 화질을 지원합니다.' },
  { q: '계정을 삭제하고 싶어요.', a: '마이페이지 > 환경설정에서 계정 삭제를 진행할 수 있습니다. 삭제 시 모든 데이터가 영구 제거됩니다.' },
]

const contacts = [
  { icon: 'mail', label: '이메일', value: 'support@aivid.studio' },
  { icon: 'schedule', label: '운영 시간', value: '평일 10:00 - 18:00 (KST)' },
  { icon: 'chat', label: '응답 시간', value: '평균 24시간 이내' },
]

export default function SupportPage() {
  return (
    <PublicLayout>
      <div className="max-w-3xl mx-auto px-6 py-16">
        <span className="text-[#c87533] font-bold text-sm tracking-widest uppercase">Support</span>
        <h1 className="text-3xl font-black text-[#2d2926] mt-2">고객센터</h1>
        <p className="text-[#8a7d72] mt-2 mb-12">궁금한 점이 있으신가요? 자주 묻는 질문을 확인해보세요.</p>

        {/* FAQ */}
        <div className="space-y-4 mb-16">
          <h2 className="text-lg font-bold text-[#2d2926] mb-4">자주 묻는 질문</h2>
          {faqs.map((faq) => (
            <details key={faq.q} className="bg-white rounded-xl border border-[#e5ddd3] group">
              <summary className="p-5 font-medium text-[#2d2926] cursor-pointer flex items-center justify-between text-sm hover:bg-[#faf5ef] rounded-xl transition-colors">
                {faq.q}
                <span className="material-symbols-outlined text-[#8a7d72] group-open:rotate-180 transition-transform">expand_more</span>
              </summary>
              <p className="px-5 pb-5 text-sm text-[#8a7d72] leading-relaxed">{faq.a}</p>
            </details>
          ))}
        </div>

        {/* Contact */}
        <div className="bg-white rounded-2xl border border-[#e5ddd3] p-8">
          <h2 className="text-lg font-bold text-[#2d2926] mb-6">직접 문의하기</h2>
          <div className="grid sm:grid-cols-3 gap-6">
            {contacts.map((c) => (
              <div key={c.label} className="flex items-start gap-3">
                <div className="size-10 rounded-xl bg-[#f5ede4] flex items-center justify-center text-[#c87533]">
                  <span className="material-symbols-outlined text-xl">{c.icon}</span>
                </div>
                <div>
                  <p className="text-xs text-[#8a7d72]">{c.label}</p>
                  <p className="text-sm font-medium text-[#2d2926]">{c.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PublicLayout>
  )
}
