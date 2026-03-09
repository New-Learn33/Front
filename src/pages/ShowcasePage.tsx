import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useScrollReveal } from '../hooks/useScrollReveal'

const filters = [
  { label: '인기순', icon: 'trending_up' },
  { label: '최신순', icon: 'schedule' },
  { label: '시네마틱', icon: 'movie' },
  { label: '애니메이션', icon: 'animation' },
  { label: '자연 풍경', icon: 'landscape' },
]

const videos = [
  {
    title: '꿈결 같은 안개 숲',
    duration: '0:05',
    creator: '@김크리에이터',
    likes: '1.2k',
    comments: '48',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDTAI4aYv_sB1OhV7VdKQxvJpUouds_RHNz6TW850uYorEuduuG30geSXEKfPY_CZ2IcPCKgivruLeW-MEUV56onbKRSElishFE68T8wkI7BL0Fhag1y8QZtpnW3NUTc4IZ6lDWn0nV7Xg1Fc1Qx_zD1435GEgVWw8TjGPRX-unJiKVaFkpAAHm984LsYjxsqTffuQtkyh4f9UR0nXHMWFUgo7_P-9Sn9vFi-eQbDH5IQaxgRuXkDvseDvaW85KtrgXXV3wj5M6jac',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBF6m7WQzSM4gCuz4SMrGsnu0KVil-wEXqmwLrWsBs-JWFwpKb7rzgy51veJ1i7-kstCb-HRvNnEYSNyCMKkZ5FbsNpGie4INDFNSPPAE-QS2SkMHOVqgrG50TjNtwaoN1PdPLLuMbOZpZAJqqz3vcmzIIupsW9350CPsZ4GxH0k-xoxHRNuyRVQ_BpivH0Vb6YDWgr5K2lcQRDp-Wx19ISGdx1kjp5jhF7670qIpAdj4kbZMEDQKlSaf0ix1vOzIdllcY1RKIgTNA',
  },
  {
    title: '네온 사이버 펑크 시티',
    duration: '0:04',
    creator: '@미래소년',
    likes: '856',
    comments: '22',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDRZw0uCOL4Yhq1G73IyqGjMc6iq1rogHIkZKLDrZL39IsIRp9Ut8LdIMurftjB5FJ_tiUGJWlD6jPwUoIbshwUziICLM8bpESe6gsVPt-D5wl01faHMULJdU07pyqRigW6OnOo6MrvGIU-_vf-3VRfS2izwYcGEuL8zNG7JhGg-OMtwhSd1UO8xXwzBsPaAKqfmEtRRE_sNCFUN8Vm07qrhsGLHzD-D56r7poqJOcnmHLz2o8qrAzkkjrczkThWxAlhQEwihJMAt8',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAtqvxnKrcES5TKdSvM-8pT6NE99lKiJ0z0Pu3raOriVevx0uAVtsckwWoCweUGj6jxOND-btvN91i0GdRDtRTrpEpGpc-UC84bfGHCMGaUac3qPC7gBAj0FBhGIh8jA_z51-V3pyHqKW4pJWXB91l7-vuq5SC1Zpw0p4EPFoUtTjoEiO3t7iH00JDwh8bXlLv5Xu0bACjfYUeDOPkMK8rEuDU_GFFInwtSbWVt0V03B7uYIQEjH4GewNNP24DrPR8SqiB2JGeIDBM',
  },
  {
    title: '부드러운 구름의 노래',
    duration: '0:03',
    creator: '@구름아트',
    likes: '2.4k',
    comments: '112',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDEFw6p-H7x6kx-cArjN7cPbGWVeT2Xh470ZPe_b75pNfjGxdFy1DCo1Mn23evt4lPfrtv8MZpEDv_LPbi5-nOXj9_-GsUipzTSW93ssShpo44CQElf-g29JaKYYqlzqjriJuJayf9JDgjh_o0rCeObIreek_W6FJcLT-tcgBBDNXOXFuHxdZhsL-SGknHsxD5eVx803J_N6v-5WWZjcoiQXvPyaz72_eoCWkb0LVVOCGFIbqC8tM_oqWDaDAc9oJg8MmaAjUEN5cE',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCZEpg-bd44I70fmojMRdZtMlzyN3rnl8dzhsENemknZ_83RZithQFxV9sj1dee1sKAdy2YZ3Fxg_iR8-ACKwI3ZbJqthyiNlHYd9K60_yxN74RuibdOLKG9UQF3waSaVkJ2qygheutbSXW4biDh9WIGsZY7vUTna3G7ctiVTtoiZq_uM4_LpwysKBzMqo48608D2cbzrfXJKQDmCYQQheEtSA5T6RLaiqpGBdz_EmlFgXuLBC0QcIAGFMkbZ70u11XQQOO8vYfh6U',
  },
  {
    title: '기하학적 질서',
    duration: '0:05',
    creator: '@디자인Lab',
    likes: '530',
    comments: '15',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBlnc59Q30kC7ELT6Q4Hs2-EvY4__dSgKR4KHwTwyTtM1uzPlEv4ACmesyt9SD7SlyHrrBNZChvqd9Mwf1VNVwT9XLG5TNYyat4Fn6vhCHIAq3iKQUInZc10Xyv8MjhvnHnzEhVsEa4qaklEYESz1ham4JrRUA3cAQ14zgTcLGSd0hdF5slhXPu5dMdnodyKWGvML7JwjS7F3aSbIdxd4jDTsnAwIts_KQu8vMLwuinfQVTo0ZR2Ynlu8Co9KukUdhnvowSqdV2YlQ',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC8jwGk8rMg-zE-WtvLd-gvFnb6q9KLGfkpFYVMOEKzYNWEWjl7GxueWpQRyq5Lw8juceO_VACPFJ0FV6JX0yoLJyVXHpGZyObbNI-FLtN7-XSzF2KyFInrCSu1md_raU5gEBcvuaYwT7_KUn0oFbjC0Say5ZGk4hS00Hkvfq6p65_uyfKt2xm537bZpI-vfF-w6QHqcuiDHDdBBsOKGI8ICk-bugxsfpS840fhYuJ0K5I6-bwFKAEp8FJjxpVxMTx_ilBPItearAI',
  },
  {
    title: '황금빛 잔상',
    duration: '0:04',
    creator: '@골든아워',
    likes: '1.1k',
    comments: '34',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCu9cto7xDSj4gK2v-v7peNDgh-M6kOLYY5Q-BzkgKyhm8sCW3DZzRJGrZDnqVN-u9eI1AMjkXq3m-z5W8hOz43l79mxWnqnJMV3H0HV_S43sUKFUiQYCpVpENV6mvLLK7HSjBntkj4PiiuJgTJcDp-g8xqcb4YTknG2nEUnaWzsOEJy_AcrQFFn38aCJeqwdB_PphEv8mOt5K1ilPbIuQl748FVaijZkZ4gEQGuxn7XsLtlS3K6Fx5CpbyyZUrng2cz_FiQ2HVOwM',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAsnM3wcNr-Jns8tb4q1dXrUgLjHMdkCoJfsmV1Gl57ZTIwQT3ag7bTVZS1qQ-LiqRkD4sNQxwmepe6y1KZqP9A0kmrloQyO3CFqXOm37skQQDgnm1sAh4LZR3JMPVAkqjDRkn-Lwt55CXTsnVDpmSLeR5-LyCywE4jbXfaeYDzUuB9xh8qmSgKD_V3qt6betrmgwu5VhsM830Kd4tmoOCcVuMlhscaEZfI5VV9iv8j2jSn1dWeE5Ezy47QojNKSCAY3XOcXBQrLBo',
  },
  {
    title: '심해의 형광색채',
    duration: '0:05',
    creator: '@심해탐험가',
    likes: '720',
    comments: '19',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD0B54p3TTc3benJlpw55FcP9tKcX5ZigvFXuQjv03cZ4owjeO531bjA2r00a25MrMLZNHeMu2R6-V34PXUvSwiEO72rlHRiFEFutPh6afv5L_tMnve6WV1yNIPChuZDECzxMD2bf2TYkwa31-KtvDU2VYoH791V_63pIJstvMyzYVT_2wG9Qs24xOXVoNnwilcP0uXE7seinQFHAzFxZLTUlVa3TEj4N6wV4gKiNoRXozqdOtOy-rqWBHJpDei5i1h1a5swSVLU4w',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB2vG3zfYBlakAVXvpNBIjw_9_Zd-U61-7cBq36DChLW-gm_jEqYgD7xWS8nQ5CdndX_TRKloNYIY4eVJ2zpS6-o2zqTaA9sFMXO2j-_9o5Vuue_1sSx2wXlnLW6CWjy-RznwDF0xQQ7rKGBR0j1xVF0UDpAARod_Gg_knclu1yHqvTVQi2M7ysDb_QIEhI3NPPvB8RoCcupeZpli1TMwdthO5njaUnAaPiJDPAMA_1bR-spyoto8a_NTLs4YJCQMMAai4HvjfTQRw',
  },
  {
    title: '한여름 밤의 페스티벌',
    duration: '0:03',
    creator: '@Vibes',
    likes: '1.5k',
    comments: '88',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAcNRCxsKqH5LlaGSQoiNZbjlQaHtBNuskMuM-bIH5EgB-0Buporx03rHiqJJWGLLp05ajHy6fVJxLIoE18mEDPNFEEalIwwjl37IBOSY4S14z3aI2txl1bHZA1il_h0bcYFhElpwodhe3A2kFtD_HQLs43nQIfLYTUrg1ieG2nPPcMQyO6XAFnGWtO0VHTc2yEPt7KYMXygCRU9yCnQZsLbK5zmM_p0qOehKWxaFcHoGHxcfcA-X9kz4niaAn0Oad1nNgLu0JdCK0',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD5nmFZAmzAe1lf21oqh9O54BTg1zGt2kdlBQktWeKbfRxrXbwWI3AOMYGbgNTK9iZzwjfiIQFeiJPfsfyr_KlqjP0ou68sSXiXYCeoeRoJUFhFtMu1NlWbwdEzoAMLlq-_FUVfzxmex3ukVGKHqtz2XA9Rnq4s0oNCxejhSmtUfqAt7hF0BZNMiQtpRdi0sduSAN5qbWpZTLRX8uRxebufNm1XG0zboT9g0B0Dh2xlNE4HL5cZePauPXJet4Uuo7M_nUVzEoq8_D8',
  },
  {
    title: '알프스의 별이 쏟아지는 밤',
    duration: '0:05',
    creator: '@자연인',
    likes: '3.2k',
    comments: '210',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCrOq_8VxTuRVJEe-wwrmHFJLSgCfejvEShTIOiMQ-Gumxw5S8w6FmHmiEplVUP3ct85dT5EO42fNjUSc1qm1JEdVvtpCz7RH3JLLC7pxC5BDvVPTQZ8_z0GwEEUCIldCyKr6BU-VzrOuy92HrZ6l4HJQHYvM6fOW92UvvSEyhnMl7dztgvHiHgHVz3tFQ15nQDSENXq8YrKh1ok4hl2b41B_k4a44XDUaIKAs3HOkmACSXXVFCZo4JKbwbg-7q7S_2uIcLQ-TAlhg',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAj0LFk4-RVortxSXWAdJrNrK3cA4iqa3CM-WTQ5IN8lBRK-64_7E2lLhiB1zWmwze1NDg4Ap3eRdkZ_EQNiEOt16kx-R2OjHoSHzooZiBTl3LHvBH2gLq6yyx5kSqzOoBj84uA1etx3iPwfIgXT-7iH4HtZEO-DjMQ6KvBp0O2iaYoRhdspS4CANBHb6i2iHhdVgQ5M9NliunLLLHAOzAV4rQb_s6TOeKIPS0tppMAHqMpdRPQG0JtrDcorGVB4wJ5l6A9LY1JMdU',
  },
]

export default function ShowcasePage() {
  const [activeFilter, setActiveFilter] = useState(0)
  const heroRef = useScrollReveal<HTMLDivElement>({ threshold: 0.1 })
  const filtersRef = useScrollReveal<HTMLDivElement>()
  const gridRef = useScrollReveal<HTMLDivElement>()

  return (
    <div className="bg-[#f2ece1] font-display text-slate-900 antialiased min-h-screen flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-[#e5ddd3]/50 bg-[#f2ece1]/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 lg:px-20 h-20 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-3">
              <div className="size-8 bg-primary rounded-lg flex items-center justify-center text-white">
                <span className="material-symbols-outlined text-xl">movie_filter</span>
              </div>
              <h2 className="text-lg font-bold tracking-tight text-[#1a1a1a]">AI 비디오</h2>
            </Link>
            <nav className="hidden md:flex items-center gap-6">
              <Link className="text-sm font-medium text-slate-600 hover:text-primary transition-colors" to="/">홈</Link>
              <Link className="text-sm font-semibold text-primary" to="/showcase">쇼케이스</Link>
              <Link className="text-sm font-medium text-slate-600 hover:text-primary transition-colors" to="#">요금제</Link>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/login" className="hidden sm:block text-sm font-medium text-slate-600">로그인</Link>
            <Link to="/signup" className="bg-primary hover:bg-[#b05d3f] text-white text-sm font-bold px-5 py-2 rounded-lg transition-all">시작하기</Link>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full px-6 lg:px-20 py-10">
        {/* Hero */}
        <div ref={heroRef} className="reveal-up flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="space-y-2">
            <span className="text-primary font-bold text-sm tracking-widest uppercase">Community Showcase</span>
            <h2 className="text-4xl md:text-5xl font-black text-[#2d2926] tracking-tight">커뮤니티 쇼케이스</h2>
            <p className="text-[#5e5452] text-lg max-w-xl">전 세계 크리에이터들이 AI로 창조한 마법 같은 순간들을 감상해보세요.</p>
          </div>
          <button className="flex items-center gap-2 bg-primary/10 text-primary hover:bg-primary/20 px-6 py-3 rounded-xl font-bold transition-all border border-primary/20">
            <span className="material-symbols-outlined">share</span>
            내 비디오 공유하기
          </button>
        </div>

        {/* Filters */}
        <div ref={filtersRef} className="reveal-up flex flex-col gap-6 mb-10">
          <div className="flex items-center gap-3 overflow-x-auto pb-2 no-scrollbar">
            {filters.map((filter, i) => (
              <button
                key={filter.label}
                onClick={() => setActiveFilter(i)}
                className={`flex items-center gap-2 px-5 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                  activeFilter === i
                    ? 'bg-primary text-white'
                    : 'bg-white border border-[#e5ddd3] hover:border-primary'
                }`}
              >
                <span className="material-symbols-outlined text-sm">{filter.icon}</span>
                {filter.label}
              </button>
            ))}
          </div>
          <div className="relative w-full">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">search</span>
            <input
              className="w-full pl-12 pr-4 py-4 bg-white border border-[#e5ddd3] rounded-2xl text-base focus:ring-2 focus:ring-primary/20 focus:border-primary shadow-sm outline-none transition-all"
              placeholder="비디오 제목이나 크리에이터 검색..."
              type="text"
            />
          </div>
        </div>

        {/* Video Grid */}
        <div ref={gridRef} className="reveal-stagger grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {videos.map((video) => (
            <div
              key={video.title}
              className="group relative flex flex-col bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-[#eee6d8]"
            >
              <div className="relative aspect-[9/16] w-full overflow-hidden">
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                  style={{ backgroundImage: `url("${video.image}")` }}
                />
                <div className="absolute inset-0 video-card-gradient opacity-60" />
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white">
                  <span className="text-xs bg-black/40 backdrop-blur-md px-2 py-1 rounded">{video.duration}</span>
                  <span className="material-symbols-outlined text-lg">play_arrow</span>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-bold text-[#2d2926] mb-2 truncate">{video.title}</h3>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="size-6 rounded-full overflow-hidden">
                      <img className="w-full h-full object-cover" src={video.avatar} alt={video.creator} />
                    </div>
                    <span className="text-xs font-medium text-[#5e5452]">{video.creator}</span>
                  </div>
                  <div className="flex items-center gap-3 text-[#5e5452]">
                    <button className="flex items-center gap-1 hover:text-primary transition-colors">
                      <span className="material-symbols-outlined text-sm">favorite</span>
                      <span className="text-xs">{video.likes}</span>
                    </button>
                    <button className="flex items-center gap-1 hover:text-primary transition-colors">
                      <span className="material-symbols-outlined text-sm">chat_bubble</span>
                      <span className="text-xs">{video.comments}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Load More */}
        <div className="flex justify-center mt-16">
          <button className="px-8 py-3 bg-white border border-[#e5ddd3] rounded-xl font-bold text-[#5e5452] hover:border-primary hover:text-primary transition-all shadow-sm">
            더 많은 비디오 불러오기
          </button>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-20 border-t border-[#e5ddd3]/50 bg-[#f9f6f0]/30 px-6 lg:px-20 py-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-3">
            <div className="size-8 bg-primary/20 flex items-center justify-center rounded-lg text-primary">
              <span className="material-symbols-outlined text-xl">movie_filter</span>
            </div>
            <span className="font-bold text-[#2d2926]">AI 비디오</span>
          </div>
          <div className="flex gap-8 text-sm text-[#5e5452]">
            <a className="hover:text-primary transition-colors" href="#">이용약관</a>
            <a className="hover:text-primary transition-colors" href="#">개인정보처리방침</a>
            <a className="hover:text-primary transition-colors" href="#">고객센터</a>
          </div>
          <p className="text-sm text-slate-400">© 2024 AI Video Studio. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
