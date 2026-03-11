import PublicLayout from '../components/PublicLayout'

const sections = [
  { title: '제1조 (목적)', content: '이 약관은 AI 비디오 스튜디오(이하 "서비스")가 제공하는 AI 기반 영상 생성 서비스의 이용과 관련하여 회사와 이용자 간의 권리, 의무 및 책임사항을 규정함을 목적으로 합니다.' },
  { title: '제2조 (정의)', content: '"서비스"란 회사가 제공하는 AI 기반 영상 생성, 편집, 공유 등 관련 제반 서비스를 의미합니다. "이용자"란 이 약관에 따라 서비스를 이용하는 회원 및 비회원을 말합니다.' },
  { title: '제3조 (약관의 효력)', content: '이 약관은 서비스를 이용하고자 하는 모든 이용자에게 적용됩니다. 약관의 내용은 서비스 화면에 게시하거나 기타 방법으로 이용자에게 공지합니다.' },
  { title: '제4조 (서비스 이용)', content: '서비스는 연중무휴, 1일 24시간 제공함을 원칙으로 합니다. 다만 시스템 점검 등의 사유로 서비스가 일시 중단될 수 있습니다.' },
  { title: '제5조 (저작권)', content: 'AI를 통해 생성된 콘텐츠의 저작권은 관련 법령에 따라 처리되며, 이용자는 서비스를 통해 생성한 콘텐츠를 자유롭게 사용할 수 있습니다.' },
  { title: '제6조 (면책)', content: '회사는 천재지변, 불가항력 등으로 인한 서비스 중단에 대해 책임을 지지 않습니다. AI가 생성한 결과물의 정확성이나 적합성에 대해 보증하지 않습니다.' },
]

export default function TermsPage() {
  return (
    <PublicLayout>
      <div className="max-w-3xl mx-auto px-6 py-16">
        <span className="text-[#c87533] font-bold text-sm tracking-widest uppercase">Terms of Service</span>
        <h1 className="text-3xl font-black text-[#2d2926] mt-2 mb-10">이용약관</h1>

        <div className="space-y-8">
          {sections.map((s) => (
            <section key={s.title} className="bg-white rounded-xl border border-[#e5ddd3] p-6">
              <h2 className="font-bold text-[#2d2926] mb-3">{s.title}</h2>
              <p className="text-sm text-[#8a7d72] leading-relaxed">{s.content}</p>
            </section>
          ))}
        </div>

        <p className="text-center text-[#8a7d72] text-xs mt-12">시행일: 2025년 1월 1일</p>
      </div>
    </PublicLayout>
  )
}
