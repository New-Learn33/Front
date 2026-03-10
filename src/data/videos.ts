// 비디오 & 댓글 타입 정의
export interface Video {
  id: number
  title: string
  duration: string
  creator: string
  likes: number
  comments: number
  createdAt: string
  image: string
  avatar: string
  description: string
}

export interface Comment {
  id: number
  videoId: number
  author: string
  avatar: string
  content: string
  createdAt: string
  likes: number
}

// 좋아요 수 포맷팅
export function formatCount(n: number): string {
  if (n >= 1000) return (n / 1000).toFixed(1).replace(/\.0$/, '') + 'k'
  return String(n)
}

// 날짜 포맷팅 (2025-03-01 → 2025년 3월 1일)
export function formatDate(dateStr: string): string {
  const d = new Date(dateStr)
  return `${d.getFullYear()}년 ${d.getMonth() + 1}월 ${d.getDate()}일`
}

// 목업 비디오 데이터 (나중에 API로 교체)
export const allVideos: Video[] = [
  {
    id: 1,
    title: '꿈결 같은 안개 숲',
    duration: '0:05',
    creator: '@김크리에이터',
    likes: 1200,
    comments: 48,
    createdAt: '2025-03-01',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDTAI4aYv_sB1OhV7VdKQxvJpUouds_RHNz6TW850uYorEuduuG30geSXEKfPY_CZ2IcPCKgivruLeW-MEUV56onbKRSElishFE68T8wkI7BL0Fhag1y8QZtpnW3NUTc4IZ6lDWn0nV7Xg1Fc1Qx_zD1435GEgVWw8TjGPRX-unJiKVaFkpAAHm984LsYjxsqTffuQtkyh4f9UR0nXHMWFUgo7_P-9Sn9vFi-eQbDH5IQaxgRuXkDvseDvaW85KtrgXXV3wj5M6jac',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBF6m7WQzSM4gCuz4SMrGsnu0KVil-wEXqmwLrWsBs-JWFwpKb7rzgy51veJ1i7-kstCb-HRvNnEYSNyCMKkZ5FbsNpGie4INDFNSPPAE-QS2SkMHOVqgrG50TjNtwaoN1PdPLLuMbOZpZAJqqz3vcmzIIupsW9350CPsZ4GxH0k-xoxHRNuyRVQ_BpivH0Vb6YDWgr5K2lcQRDp-Wx19ISGdx1kjp5jhF7670qIpAdj4kbZMEDQKlSaf0ix1vOzIdllcY1RKIgTNA',
    description: '이른 아침, 안개가 자욱하게 내린 숲 속을 AI로 표현했습니다. 빛이 나뭇잎 사이로 스며들며 만들어내는 몽환적인 분위기를 담았습니다.',
  },
  {
    id: 2,
    title: '네온 사이버 펑크 시티',
    duration: '0:04',
    creator: '@미래소년',
    likes: 856,
    comments: 22,
    createdAt: '2025-03-05',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDRZw0uCOL4Yhq1G73IyqGjMc6iq1rogHIkZKLDrZL39IsIRp9Ut8LdIMurftjB5FJ_tiUGJWlD6jPwUoIbshwUziICLM8bpESe6gsVPt-D5wl01faHMULJdU07pyqRigW6OnOo6MrvGIU-_vf-3VRfS2izwYcGEuL8zNG7JhGg-OMtwhSd1UO8xXwzBsPaAKqfmEtRRE_sNCFUN8Vm07qrhsGLHzD-D56r7poqJOcnmHLz2o8qrAzkkjrczkThWxAlhQEwihJMAt8',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAtqvxnKrcES5TKdSvM-8pT6NE99lKiJ0z0Pu3raOriVevx0uAVtsckwWoCweUGj6jxOND-btvN91i0GdRDtRTrpEpGpc-UC84bfGHCMGaUac3qPC7gBAj0FBhGIh8jA_z51-V3pyHqKW4pJWXB91l7-vuq5SC1Zpw0p4EPFoUtTjoEiO3t7iH00JDwh8bXlLv5Xu0bACjfYUeDOPkMK8rEuDU_GFFInwtSbWVt0V03B7uYIQEjH4GewNNP24DrPR8SqiB2JGeIDBM',
    description: '미래 도시의 네온 불빛이 반사되는 거리를 AI로 생성했습니다. 사이버펑크 감성의 비 내리는 밤거리, 홀로그램 간판들이 빛나는 풍경입니다.',
  },
  {
    id: 3,
    title: '부드러운 구름의 노래',
    duration: '0:03',
    creator: '@구름아트',
    likes: 2400,
    comments: 112,
    createdAt: '2025-02-20',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDEFw6p-H7x6kx-cArjN7cPbGWVeT2Xh470ZPe_b75pNfjGxdFy1DCo1Mn23evt4lPfrtv8MZpEDv_LPbi5-nOXj9_-GsUipzTSW93ssShpo44CQElf-g29JaKYYqlzqjriJuJayf9JDgjh_o0rCeObIreek_W6FJcLT-tcgBBDNXOXFuHxdZhsL-SGknHsxD5eVx803J_N6v-5WWZjcoiQXvPyaz72_eoCWkb0LVVOCGFIbqC8tM_oqWDaDAc9oJg8MmaAjUEN5cE',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCZEpg-bd44I70fmojMRdZtMlzyN3rnl8dzhsENemknZ_83RZithQFxV9sj1dee1sKAdy2YZ3Fxg_iR8-ACKwI3ZbJqthyiNlHYd9K60_yxN74RuibdOLKG9UQF3waSaVkJ2qygheutbSXW4biDh9WIGsZY7vUTna3G7ctiVTtoiZq_uM4_LpwysKBzMqo48608D2cbzrfXJKQDmCYQQheEtSA5T6RLaiqpGBdz_EmlFgXuLBC0QcIAGFMkbZ70u11XQQOO8vYfh6U',
    description: '하늘에 떠 있는 구름을 부드러운 파스텔톤으로 표현했습니다. 구름 사이로 비치는 햇살과 함께 평온한 하늘의 풍경을 담았습니다.',
  },
  {
    id: 4,
    title: '기하학적 질서',
    duration: '0:05',
    creator: '@디자인Lab',
    likes: 530,
    comments: 15,
    createdAt: '2025-03-08',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBlnc59Q30kC7ELT6Q4Hs2-EvY4__dSgKR4KHwTwyTtM1uzPlEv4ACmesyt9SD7SlyHrrBNZChvqd9Mwf1VNVwT9XLG5TNYyat4Fn6vhCHIAq3iKQUInZc10Xyv8MjhvnHnzEhVsEa4qaklEYESz1ham4JrRUA3cAQ14zgTcLGSd0hdF5slhXPu5dMdnodyKWGvML7JwjS7F3aSbIdxd4jDTsnAwIts_KQu8vMLwuinfQVTo0ZR2Ynlu8Co9KukUdhnvowSqdV2YlQ',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC8jwGk8rMg-zE-WtvLd-gvFnb6q9KLGfkpFYVMOEKzYNWEWjl7GxueWpQRyq5Lw8juceO_VACPFJ0FV6JX0yoLJyVXHpGZyObbNI-FLtN7-XSzF2KyFInrCSu1md_raU5gEBcvuaYwT7_KUn0oFbjC0Say5ZGk4hS00Hkvfq6p65_uyfKt2xm537bZpI-vfF-w6QHqcuiDHDdBBsOKGI8ICk-bugxsfpS840fhYuJ0K5I6-bwFKAEp8FJjxpVxMTx_ilBPItearAI',
    description: '건축적인 기하학 패턴들이 반복되며 만들어내는 시각적 질서를 AI로 구현했습니다. 미니멀리즘과 대칭의 아름다움을 탐구합니다.',
  },
  {
    id: 5,
    title: '황금빛 잔상',
    duration: '0:04',
    creator: '@골든아워',
    likes: 1100,
    comments: 34,
    createdAt: '2025-02-28',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCu9cto7xDSj4gK2v-v7peNDgh-M6kOLYY5Q-BzkgKyhm8sCW3DZzRJGrZDnqVN-u9eI1AMjkXq3m-z5W8hOz43l79mxWnqnJMV3H0HV_S43sUKFUiQYCpVpENV6mvLLK7HSjBntkj4PiiuJgTJcDp-g8xqcb4YTknG2nEUnaWzsOEJy_AcrQFFn38aCJeqwdB_PphEv8mOt5K1ilPbIuQl748FVaijZkZ4gEQGuxn7XsLtlS3K6Fx5CpbyyZUrng2cz_FiQ2HVOwM',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAsnM3wcNr-Jns8tb4q1dXrUgLjHMdkCoJfsmV1Gl57ZTIwQT3ag7bTVZS1qQ-LiqRkD4sNQxwmepe6y1KZqP9A0kmrloQyO3CFqXOm37skQQDgnm1sAh4LZR3JMPVAkqjDRkn-Lwt55CXTsnVDpmSLeR5-LyCywE4jbXfaeYDzUuB9xh8qmSgKD_V3qt6betrmgwu5VhsM830Kd4tmoOCcVuMlhscaEZfI5VV9iv8j2jSn1dWeE5Ezy47QojNKSCAY3XOcXBQrLBo',
    description: '해 질 녘 골든 아워 시간대의 따뜻한 빛을 포착했습니다. 황금빛으로 물든 풍경 속에서 빛의 잔상이 아름답게 퍼져나갑니다.',
  },
  {
    id: 6,
    title: '심해의 형광색채',
    duration: '0:05',
    creator: '@심해탐험가',
    likes: 720,
    comments: 19,
    createdAt: '2025-03-03',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD0B54p3TTc3benJlpw55FcP9tKcX5ZigvFXuQjv03cZ4owjeO531bjA2r00a25MrMLZNHeMu2R6-V34PXUvSwiEO72rlHRiFEFutPh6afv5L_tMnve6WV1yNIPChuZDECzxMD2bf2TYkwa31-KtvDU2VYoH791V_63pIJstvMyzYVT_2wG9Qs24xOXVoNnwilcP0uXE7seinQFHAzFxZLTUlVa3TEj4N6wV4gKiNoRXozqdOtOy-rqWBHJpDei5i1h1a5swSVLU4w',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB2vG3zfYBlakAVXvpNBIjw_9_Zd-U61-7cBq36DChLW-gm_jEqYgD7xWS8nQ5CdndX_TRKloNYIY4eVJ2zpS6-o2zqTaA9sFMXO2j-_9o5Vuue_1sSx2wXlnLW6CWjy-RznwDF0xQQ7rKGBR0j1xVF0UDpAARod_Gg_knclu1yHqvTVQi2M7ysDb_QIEhI3NPPvB8RoCcupeZpli1TMwdthO5njaUnAaPiJDPAMA_1bR-spyoto8a_NTLs4YJCQMMAai4HvjfTQRw',
    description: '깊은 바다 속 발광 생물들의 신비로운 색채를 표현했습니다. 형광빛 해파리와 심해 생물들이 어둠 속에서 빛나는 장관을 담았습니다.',
  },
  {
    id: 7,
    title: '한여름 밤의 페스티벌',
    duration: '0:03',
    creator: '@Vibes',
    likes: 1500,
    comments: 88,
    createdAt: '2025-02-15',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAcNRCxsKqH5LlaGSQoiNZbjlQaHtBNuskMuM-bIH5EgB-0Buporx03rHiqJJWGLLp05ajHy6fVJxLIoE18mEDPNFEEalIwwjl37IBOSY4S14z3aI2txl1bHZA1il_h0bcYFhElpwodhe3A2kFtD_HQLs43nQIfLYTUrg1ieG2nPPcMQyO6XAFnGWtO0VHTc2yEPt7KYMXygCRU9yCnQZsLbK5zmM_p0qOehKWxaFcHoGHxcfcA-X9kz4niaAn0Oad1nNgLu0JdCK0',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD5nmFZAmzAe1lf21oqh9O54BTg1zGt2kdlBQktWeKbfRxrXbwWI3AOMYGbgNTK9iZzwjfiIQFeiJPfsfyr_KlqjP0ou68sSXiXYCeoeRoJUFhFtMu1NlWbwdEzoAMLlq-_FUVfzxmex3ukVGKHqtz2XA9Rnq4s0oNCxejhSmtUfqAt7hF0BZNMiQtpRdi0sduSAN5qbWpZTLRX8uRxebufNm1XG0zboT9g0B0Dh2xlNE4HL5cZePauPXJet4Uuo7M_nUVzEoq8_D8',
    description: '여름 밤의 뮤직 페스티벌 현장을 AI로 재현했습니다. 화려한 조명과 열정적인 군중, 음악이 가득한 축제의 에너지를 담았습니다.',
  },
  {
    id: 8,
    title: '알프스의 별이 쏟아지는 밤',
    duration: '0:05',
    creator: '@자연인',
    likes: 3200,
    comments: 210,
    createdAt: '2025-01-25',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCrOq_8VxTuRVJEe-wwrmHFJLSgCfejvEShTIOiMQ-Gumxw5S8w6FmHmiEplVUP3ct85dT5EO42fNjUSc1qm1JEdVvtpCz7RH3JLLC7pxC5BDvVPTQZ8_z0GwEEUCIldCyKr6BU-VzrOuy92HrZ6l4HJQHYvM6fOW92UvvSEyhnMl7dztgvHiHgHVz3tFQ15nQDSENXq8YrKh1ok4hl2b41B_k4a44XDUaIKAs3HOkmACSXXVFCZo4JKbwbg-7q7S_2uIcLQ-TAlhg',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAj0LFk4-RVortxSXWAdJrNrK3cA4iqa3CM-WTQ5IN8lBRK-64_7E2lLhiB1zWmwze1NDg4Ap3eRdkZ_EQNiEOt16kx-R2OjHoSHzooZiBTl3LHvBH2gLq6yyx5kSqzOoBj84uA1etx3iPwfIgXT-7iH4HtZEO-DjMQ6KvBp0O2iaYoRhdspS4CANBHb6i2iHhdVgQ5M9NliunLLLHAOzAV4rQb_s6TOeKIPS0tppMAHqMpdRPQG0JtrDcorGVB4wJ5l6A9LY1JMdU',
    description: '알프스 산맥 위로 쏟아지는 은하수를 타임랩스 스타일로 제작했습니다. 수천 개의 별이 회전하는 장관을 AI로 구현했습니다.',
  },
  {
    id: 9,
    title: '도시의 밤하늘 타임랩스',
    duration: '0:04',
    creator: '@NightOwl',
    likes: 980,
    comments: 41,
    createdAt: '2025-03-07',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA0axGwduWJFuBD4VFEfbR7s5fFT1VSI49rZfr56GGk7CSqc-e2ZI9VsnQWqEjXgbygd-gr6zCwPry_sJdqOe0dOQ2sXt3H0BWpoV3Hw8YKum32NbHare4s8Q3eH4EuowF5tTw7og8AIOXkA1Zxe8IOeQ0l0qxLgfCViJC2XSwqk6JAmWE35Uqry9PVXY5cwuBpikPszU-v1CJriSgG8QKjQOUW9HD_LPa_9ZKQUTGV9sfahnNznZHJ6QJUIAPIbsH_M21J_eeo_kE',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBF6m7WQzSM4gCuz4SMrGsnu0KVil-wEXqmwLrWsBs-JWFwpKb7rzgy51veJ1i7-kstCb-HRvNnEYSNyCMKkZ5FbsNpGie4INDFNSPPAE-QS2SkMHOVqgrG50TjNtwaoN1PdPLLuMbOZpZAJqqz3vcmzIIupsW9350CPsZ4GxH0k-xoxHRNuyRVQ_BpivH0Vb6YDWgr5K2lcQRDp-Wx19ISGdx1kjp5jhF7670qIpAdj4kbZMEDQKlSaf0ix1vOzIdllcY1RKIgTNA',
    description: '도심 한복판에서 바라본 밤하늘의 변화를 타임랩스로 담았습니다. 빌딩 사이로 보이는 별과 구름의 움직임이 인상적입니다.',
  },
  {
    id: 10,
    title: '빛과 그림자의 춤',
    duration: '0:05',
    creator: '@라이팅마스터',
    likes: 1850,
    comments: 67,
    createdAt: '2025-02-10',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBfVYyP6diotm5_HohdK2PInE1iZEy2bNpSF7bJ0cu7-ZMCXZxhCOSxFsSd0t7D4PjVFiDgHVm9sWtS9SveHETBdFk1mM-2VLm1rxkhbTtEW__KwmDkSUEumLjk5ZraHRmq8q9vhYwGlwOlLuFrEhqPidbNHwZHDsqbNzL1C_-2kzXx53781HGzSBeJAdH3RTE3IIwSTjwrqs9MCAKmb4U4Cgeq44uTJZh6c3ZOIDCYW7WR2-gwKLq_04uUjo_p9HVazy2hKjG8bhY',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAtqvxnKrcES5TKdSvM-8pT6NE99lKiJ0z0Pu3raOriVevx0uAVtsckwWoCweUGj6jxOND-btvN91i0GdRDtRTrpEpGpc-UC84bfGHCMGaUac3qPC7gBAj0FBhGIh8jA_z51-V3pyHqKW4pJWXB91l7-vuq5SC1Zpw0p4EPFoUtTjoEiO3t7iH00JDwh8bXlLv5Xu0bACjfYUeDOPkMK8rEuDU_GFFInwtSbWVt0V03B7uYIQEjH4GewNNP24DrPR8SqiB2JGeIDBM',
    description: '빛과 그림자가 만들어내는 추상적인 무용을 표현했습니다. 자연광이 오브제를 통과하며 만들어내는 패턴의 변화를 담았습니다.',
  },
  {
    id: 11,
    title: '수채화 풍의 봄',
    duration: '0:03',
    creator: '@ArtPainter',
    likes: 640,
    comments: 25,
    createdAt: '2025-03-09',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBZnVxR6zdh26SiVUkrSUYlI9YlGDruDCMKtbKftXQWAG1OfTpyOEySjB9-Qv0r5tyicE-CAyx5WNh4AnA-YOMLZIiPFq9totMF7QPiB0CZ_2z0BEOQ-f-H6ALlC-Fy0oNKJA3Tcg2sRJW7dAOQCmgs4bfNeX8OcAxYqeIIkxQr9JItjTdPtJ6ejDDa0hIi5j1NlBS6mG54K_OPS8gVm-TaLJ8FPZubW8ZyeFypd6nXNiNRRtLyycpDKplyCx_ORgpl99rFi52QuN4',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCZEpg-bd44I70fmojMRdZtMlzyN3rnl8dzhsENemknZ_83RZithQFxV9sj1dee1sKAdy2YZ3Fxg_iR8-ACKwI3ZbJqthyiNlHYd9K60_yxN74RuibdOLKG9UQF3waSaVkJ2qygheutbSXW4biDh9WIGsZY7vUTna3G7ctiVTtoiZq_uM4_LpwysKBzMqo48608D2cbzrfXJKQDmCYQQheEtSA5T6RLaiqpGBdz_EmlFgXuLBC0QcIAGFMkbZ70u11XQQOO8vYfh6U',
    description: '수채화 스타일로 봄의 풍경을 재현했습니다. 벚꽃이 흩날리는 공원과 따뜻한 봄 햇살이 어우러진 아름다운 장면입니다.',
  },
  {
    id: 12,
    title: '로봇과 나비',
    duration: '0:04',
    creator: '@SciFiArt',
    likes: 2100,
    comments: 95,
    createdAt: '2025-02-05',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBUbUMQ7W_wmlD51lAhDW0qzsTKZrAxt3VkgI0vHs5vXf6UXU1e_JGHUsqG2L--C1S03ZsBf0HG5-CPJu8SD4oE_b7GFGWILDxu6r_Zcpo8K5DHUx8nMQ28_Olt4CQyn-eMKof-CgG6GLuzxe-QH14ZmfS9mGlgXunGOwjkGzB6rgoNcv6lL77did18E8ruTnYMe8XlcuK9CHd5yBLBV1vLfNzVrw_GcCQ2NAI3zkR1mQqKOknY1-_n5faggq-JoEk0vrkgX2pgSP4',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC8jwGk8rMg-zE-WtvLd-gvFnb6q9KLGfkpFYVMOEKzYNWEWjl7GxueWpQRyq5Lw8juceO_VACPFJ0FV6JX0yoLJyVXHpGZyObbNI-FLtN7-XSzF2KyFInrCSu1md_raU5gEBcvuaYwT7_KUn0oFbjC0Say5ZGk4hS00Hkvfq6p65_uyfKt2xm537bZpI-vfF-w6QHqcuiDHDdBBsOKGI8ICk-bugxsfpS840fhYuJ0K5I6-bwFKAEp8FJjxpVxMTx_ilBPItearAI',
    description: '로봇의 손 위에 나비가 앉아있는 장면을 통해 기술과 자연의 공존을 표현했습니다. SF적 감성과 자연의 아름다움을 동시에 담았습니다.',
  },
  {
    id: 13,
    title: '오로라 비단',
    duration: '0:05',
    creator: '@북극여행자',
    likes: 4100,
    comments: 320,
    createdAt: '2025-01-20',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCu9cto7xDSj4gK2v-v7peNDgh-M6kOLYY5Q-BzkgKyhm8sCW3DZzRJGrZDnqVN-u9eI1AMjkXq3m-z5W8hOz43l79mxWnqnJMV3H0HV_S43sUKFUiQYCpVpENV6mvLLK7HSjBntkj4PiiuJgTJcDp-g8xqcb4YTknG2nEUnaWzsOEJy_AcrQFFn38aCJeqwdB_PphEv8mOt5K1ilPbIuQl748FVaijZkZ4gEQGuxn7XsLtlS3K6Fx5CpbyyZUrng2cz_FiQ2HVOwM',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAsnM3wcNr-Jns8tb4q1dXrUgLjHMdkCoJfsmV1Gl57ZTIwQT3ag7bTVZS1qQ-LiqRkD4sNQxwmepe6y1KZqP9A0kmrloQyO3CFqXOm37skQQDgnm1sAh4LZR3JMPVAkqjDRkn-Lwt55CXTsnVDpmSLeR5-LyCywE4jbXfaeYDzUuB9xh8qmSgKD_V3qt6betrmgwu5VhsM830Kd4tmoOCcVuMlhscaEZfI5VV9iv8j2jSn1dWeE5Ezy47QojNKSCAY3XOcXBQrLBo',
    description: '북극에서 촬영한 오로라를 AI로 더욱 환상적으로 표현했습니다. 비단처럼 흐르는 초록빛 오로라가 밤하늘을 수놓는 장관입니다.',
  },
  {
    id: 14,
    title: '미니멀 건축 여행',
    duration: '0:04',
    creator: '@건축학개론',
    likes: 390,
    comments: 8,
    createdAt: '2025-03-10',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD0B54p3TTc3benJlpw55FcP9tKcX5ZigvFXuQjv03cZ4owjeO531bjA2r00a25MrMLZNHeMu2R6-V34PXUvSwiEO72rlHRiFEFutPh6afv5L_tMnve6WV1yNIPChuZDECzxMD2bf2TYkwa31-KtvDU2VYoH791V_63pIJstvMyzYVT_2wG9Qs24xOXVoNnwilcP0uXE7seinQFHAzFxZLTUlVa3TEj4N6wV4gKiNoRXozqdOtOy-rqWBHJpDei5i1h1a5swSVLU4w',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB2vG3zfYBlakAVXvpNBIjw_9_Zd-U61-7cBq36DChLW-gm_jEqYgD7xWS8nQ5CdndX_TRKloNYIY4eVJ2zpS6-o2zqTaA9sFMXO2j-_9o5Vuue_1sSx2wXlnLW6CWjy-RznwDF0xQQ7rKGBR0j1xVF0UDpAARod_Gg_knclu1yHqvTVQi2M7ysDb_QIEhI3NPPvB8RoCcupeZpli1TMwdthO5njaUnAaPiJDPAMA_1bR-spyoto8a_NTLs4YJCQMMAai4HvjfTQRw',
    description: '세계 각지의 미니멀한 건축물들을 여행하며 촬영한 영상입니다. 깨끗한 선과 공간의 미학을 AI 영상으로 담았습니다.',
  },
  {
    id: 15,
    title: '몽환적인 수중 세계',
    duration: '0:05',
    creator: '@DeepBlue',
    likes: 1750,
    comments: 73,
    createdAt: '2025-02-18',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAcNRCxsKqH5LlaGSQoiNZbjlQaHtBNuskMuM-bIH5EgB-0Buporx03rHiqJJWGLLp05ajHy6fVJxLIoE18mEDPNFEEalIwwjl37IBOSY4S14z3aI2txl1bHZA1il_h0bcYFhElpwodhe3A2kFtD_HQLs43nQIfLYTUrg1ieG2nPPcMQyO6XAFnGWtO0VHTc2yEPt7KYMXygCRU9yCnQZsLbK5zmM_p0qOehKWxaFcHoGHxcfcA-X9kz4niaAn0Oad1nNgLu0JdCK0',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD5nmFZAmzAe1lf21oqh9O54BTg1zGt2kdlBQktWeKbfRxrXbwWI3AOMYGbgNTK9iZzwjfiIQFeiJPfsfyr_KlqjP0ou68sSXiXYCeoeRoJUFhFtMu1NlWbwdEzoAMLlq-_FUVfzxmex3ukVGKHqtz2XA9Rnq4s0oNCxejhSmtUfqAt7hF0BZNMiQtpRdi0sduSAN5qbWpZTLRX8uRxebufNm1XG0zboT9g0B0Dh2xlNE4HL5cZePauPXJet4Uuo7M_nUVzEoq8_D8',
    description: '깊은 바다 속 산호초 정원과 열대어들이 어우러진 수중 세계를 AI로 구현했습니다. 몽환적인 빛과 색감이 특징입니다.',
  },
  {
    id: 16,
    title: '빈티지 필름 감성',
    duration: '0:03',
    creator: '@RetroVibes',
    likes: 920,
    comments: 56,
    createdAt: '2025-03-02',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCrOq_8VxTuRVJEe-wwrmHFJLSgCfejvEShTIOiMQ-Gumxw5S8w6FmHmiEplVUP3ct85dT5EO42fNjUSc1qm1JEdVvtpCz7RH3JLLC7pxC5BDvVPTQZ8_z0GwEEUCIldCyKr6BU-VzrOuy92HrZ6l4HJQHYvM6fOW92UvvSEyhnMl7dztgvHiHgHVz3tFQ15nQDSENXq8YrKh1ok4hl2b41B_k4a44XDUaIKAs3HOkmACSXXVFCZo4JKbwbg-7q7S_2uIcLQ-TAlhg',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAj0LFk4-RVortxSXWAdJrNrK3cA4iqa3CM-WTQ5IN8lBRK-64_7E2lLhiB1zWmwze1NDg4Ap3eRdkZ_EQNiEOt16kx-R2OjHoSHzooZiBTl3LHvBH2gLq6yyx5kSqzOoBj84uA1etx3iPwfIgXT-7iH4HtZEO-DjMQ6KvBp0O2iaYoRhdspS4CANBHb6i2iHhdVgQ5M9NliunLLLHAOzAV4rQb_s6TOeKIPS0tppMAHqMpdRPQG0JtrDcorGVB4wJ5l6A9LY1JMdU',
    description: '8mm 필름 카메라로 촬영한 듯한 빈티지 감성의 영상입니다. 레트로한 색감과 필름 그레인이 nostalgic한 느낌을 줍니다.',
  },
]

// 목업 댓글 데이터
export const mockComments: Comment[] = [
  {
    id: 1, videoId: 1, author: '@시네마틱', likes: 24,
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCZEpg-bd44I70fmojMRdZtMlzyN3rnl8dzhsENemknZ_83RZithQFxV9sj1dee1sKAdy2YZ3Fxg_iR8-ACKwI3ZbJqthyiNlHYd9K60_yxN74RuibdOLKG9UQF3waSaVkJ2qygheutbSXW4biDh9WIGsZY7vUTna3G7ctiVTtoiZq_uM4_LpwysKBzMqo48608D2cbzrfXJKQDmCYQQheEtSA5T6RLaiqpGBdz_EmlFgXuLBC0QcIAGFMkbZ70u11XQQOO8vYfh6U',
    content: '색감이 정말 환상적이에요! 어떤 프롬프트를 사용하셨나요?',
    createdAt: '2025-03-02',
  },
  {
    id: 2, videoId: 1, author: '@디지털아트', likes: 12,
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAtqvxnKrcES5TKdSvM-8pT6NE99lKiJ0z0Pu3raOriVevx0uAVtsckwWoCweUGj6jxOND-btvN91i0GdRDtRTrpEpGpc-UC84bfGHCMGaUac3qPC7gBAj0FBhGIh8jA_z51-V3pyHqKW4pJWXB91l7-vuq5SC1Zpw0p4EPFoUtTjoEiO3t7iH00JDwh8bXlLv5Xu0bACjfYUeDOPkMK8rEuDU_GFFInwtSbWVt0V03B7uYIQEjH4GewNNP24DrPR8SqiB2JGeIDBM',
    content: '이 분위기 너무 좋습니다. 저도 비슷한 느낌으로 만들어보고 싶네요.',
    createdAt: '2025-03-03',
  },
  {
    id: 3, videoId: 1, author: '@크리에이티브킹', likes: 8,
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC8jwGk8rMg-zE-WtvLd-gvFnb6q9KLGfkpFYVMOEKzYNWEWjl7GxueWpQRyq5Lw8juceO_VACPFJ0FV6JX0yoLJyVXHpGZyObbNI-FLtN7-XSzF2KyFInrCSu1md_raU5gEBcvuaYwT7_KUn0oFbjC0Say5ZGk4hS00Hkvfq6p65_uyfKt2xm537bZpI-vfF-w6QHqcuiDHDdBBsOKGI8ICk-bugxsfpS840fhYuJ0K5I6-bwFKAEp8FJjxpVxMTx_ilBPItearAI',
    content: 'AI 영상 퀄리티가 이 정도까지 올라왔군요. 대단합니다!',
    createdAt: '2025-03-04',
  },
  {
    id: 4, videoId: 2, author: '@미래도시', likes: 15,
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAsnM3wcNr-Jns8tb4q1dXrUgLjHMdkCoJfsmV1Gl57ZTIwQT3ag7bTVZS1qQ-LiqRkD4sNQxwmepe6y1KZqP9A0kmrloQyO3CFqXOm37skQQDgnm1sAh4LZR3JMPVAkqjDRkn-Lwt55CXTsnVDpmSLeR5-LyCywE4jbXfaeYDzUuB9xh8qmSgKD_V3qt6betrmgwu5VhsM830Kd4tmoOCcVuMlhscaEZfI5VV9iv8j2jSn1dWeE5Ezy47QojNKSCAY3XOcXBQrLBo',
    content: '블레이드 러너 느낌이 물씬 나네요. 네온 톤이 완벽합니다.',
    createdAt: '2025-03-06',
  },
  {
    id: 5, videoId: 2, author: '@CyberPunk2077', likes: 9,
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB2vG3zfYBlakAVXvpNBIjw_9_Zd-U61-7cBq36DChLW-gm_jEqYgD7xWS8nQ5CdndX_TRKloNYIY4eVJ2zpS6-o2zqTaA9sFMXO2j-_9o5Vuue_1sSx2wXlnLW6CWjy-RznwDF0xQQ7rKGBR0j1xVF0UDpAARod_Gg_knclu1yHqvTVQi2M7ysDb_QIEhI3NPPvB8RoCcupeZpli1TMwdthO5njaUnAaPiJDPAMA_1bR-spyoto8a_NTLs4YJCQMMAai4HvjfTQRw',
    content: '이런 퀄리티면 단편 영화도 만들 수 있겠어요!',
    createdAt: '2025-03-07',
  },
  {
    id: 6, videoId: 3, author: '@하늘사진가', likes: 30,
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD5nmFZAmzAe1lf21oqh9O54BTg1zGt2kdlBQktWeKbfRxrXbwWI3AOMYGbgNTK9iZzwjfiIQFeiJPfsfyr_KlqjP0ou68sSXiXYCeoeRoJUFhFtMu1NlWbwdEzoAMLlq-_FUVfzxmex3ukVGKHqtz2XA9Rnq4s0oNCxejhSmtUfqAt7hF0BZNMiQtpRdi0sduSAN5qbWpZTLRX8uRxebufNm1XG0zboT9g0B0Dh2xlNE4HL5cZePauPXJet4Uuo7M_nUVzEoq8_D8',
    content: '파스텔톤 색감이 정말 아름답습니다. 힐링되는 영상이네요.',
    createdAt: '2025-02-21',
  },
  {
    id: 7, videoId: 8, author: '@별지기', likes: 45,
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBF6m7WQzSM4gCuz4SMrGsnu0KVil-wEXqmwLrWsBs-JWFwpKb7rzgy51veJ1i7-kstCb-HRvNnEYSNyCMKkZ5FbsNpGie4INDFNSPPAE-QS2SkMHOVqgrG50TjNtwaoN1PdPLLuMbOZpZAJqqz3vcmzIIupsW9350CPsZ4GxH0k-xoxHRNuyRVQ_BpivH0Vb6YDWgr5K2lcQRDp-Wx19ISGdx1kjp5jhF7670qIpAdj4kbZMEDQKlSaf0ix1vOzIdllcY1RKIgTNA',
    content: '알프스에서 보는 은하수라니... AI가 이런 영상을 만들 수 있다니 놀랍습니다.',
    createdAt: '2025-01-26',
  },
  {
    id: 8, videoId: 13, author: '@여행가이드', likes: 52,
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAj0LFk4-RVortxSXWAdJrNrK3cA4iqa3CM-WTQ5IN8lBRK-64_7E2lLhiB1zWmwze1NDg4Ap3eRdkZ_EQNiEOt16kx-R2OjHoSHzooZiBTl3LHvBH2gLq6yyx5kSqzOoBj84uA1etx3iPwfIgXT-7iH4HtZEO-DjMQ6KvBp0O2iaYoRhdspS4CANBHb6i2iHhdVgQ5M9NliunLLLHAOzAV4rQb_s6TOeKIPS0tppMAHqMpdRPQG0JtrDcorGVB4wJ5l6A9LY1JMdU',
    content: '오로라 영상 중에서 제가 본 것 중 최고입니다. 북극에 가고 싶어지네요!',
    createdAt: '2025-01-22',
  },
]

// 특정 비디오의 댓글 가져오기 (없으면 범용 댓글 반환)
export function getCommentsForVideo(videoId: number): Comment[] {
  const videoComments = mockComments.filter((c) => c.videoId === videoId)
  if (videoComments.length > 0) return videoComments
  // 해당 비디오 전용 댓글이 없으면 범용 댓글 3개 반환
  return mockComments.slice(0, 3).map((c, i) => ({ ...c, id: 100 + i, videoId }))
}
