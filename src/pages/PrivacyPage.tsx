import PublicLayout from '../components/PublicLayout'

const sections = [
  { title: '1. 수집하는 개인정보', content: '회원가입 시: 이메일 주소, 이름(닉네임), 프로필 이미지(선택). 서비스 이용 시: 생성 기록, 접속 로그, 서비스 이용 기록.' },
  { title: '2. 개인정보 이용 목적', content: '회원 식별 및 가입 확인, 서비스 제공 및 개선, 이용 통계 분석, 고객 지원 및 공지사항 전달에 활용됩니다.' },
  { title: '3. 개인정보 보유 기간', content: '회원 탈퇴 시까지 보유하며, 탈퇴 후 지체 없이 파기합니다. 다만 관련 법령에 따라 일정 기간 보관이 필요한 경우 해당 기간 동안 보관합니다.' },
  { title: '4. 제3자 제공', content: '이용자의 동의 없이 개인정보를 제3자에게 제공하지 않습니다. 다만 법률에 특별한 규정이 있는 경우는 예외로 합니다.' },
  { title: '5. 이용자의 권리', content: '이용자는 언제든지 자신의 개인정보를 조회, 수정, 삭제할 수 있으며, 회원 탈퇴를 통해 개인정보 처리 정지를 요청할 수 있습니다.' },
  { title: '6. 연락처', content: '개인정보 관련 문의사항은 고객센터(support@aivid.studio)로 연락 주시기 바랍니다.' },
]

export default function PrivacyPage() {
  return (
    <PublicLayout>
      <div className="max-w-3xl mx-auto px-6 py-16">
        <span className="text-[#c87533] font-bold text-sm tracking-widest uppercase">Privacy Policy</span>
        <h1 className="text-3xl font-black text-[#2d2926] mt-2 mb-10">개인정보처리방침</h1>

        <div className="space-y-8">
          {sections.map((s) => (
            <section key={s.title} className="bg-white rounded-xl border border-[#e5ddd3] p-6">
              <h2 className="font-bold text-[#2d2926] mb-3">{s.title}</h2>
              <p className="text-sm text-[#8a7d72] leading-relaxed">{s.content}</p>
            </section>
          ))}
        </div>

        <p className="text-center text-[#8a7d72] text-xs mt-12">최종 수정일: 2025년 1월 1일</p>
      </div>
    </PublicLayout>
  )
}
