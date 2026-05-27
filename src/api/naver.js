const GENRE_KEYWORDS = {
  NV: '소설', 'NV-01': '로맨스소설', 'NV-02': '판타지소설',
  'NV-03': '스릴러미스터리', 'NV-04': 'SF소설', 'NV-05': '호러소설',
  'NV-06': '역사소설', 'NV-07': '순문학',
  LT: '시에세이', 'LT-01': '시집', 'LT-02': '에세이수필',
  'LT-03': '여행에세이', 'LT-04': '일기다이어리',
  HU: '인문교양', 'HU-01': '철학', 'HU-02': '역사',
  'HU-03': '심리학', 'HU-04': '종교사상', 'HU-05': '언어문화',
  SS: '경제경영', 'SS-01': '경제', 'SS-02': '경영마케팅',
  'SS-03': '정치사회', 'SS-04': '법률',
  SC: '과학기술', 'SC-01': 'IT컴퓨터', 'SC-02': 'AI인공지능',
  'SC-03': '수학', 'SC-04': '자연과학', 'SC-05': '공학',
  ED: '교육참고서', 'ED-01': '수능참고서', 'ED-02': '어학교재',
  EX: '수험서자격증', 'EX-01': '공무원시험', 'EX-02': 'IT자격증',
  'EX-03': '어학시험', 'EX-04': '전문자격증', 'EX-05': '금융자격증',
  SD: '자기계발', 'SD-01': '동기부여', 'SD-02': '리더십',
  'SD-03': '시간관리생산성', 'SD-04': '인간관계소통',
  AR: '예술취미', 'AR-01': '미술디자인', 'AR-02': '음악',
  'AR-03': '요리제과', 'AR-04': '여행지리', 'AR-05': '스포츠레저',
  KD: '어린이청소년', 'KD-01': '그림책', 'KD-02': '동화',
  'KD-03': '청소년소설', 'KD-04': '학습만화',
  HE: '건강의학', 'HE-01': '건강관리', 'HE-02': '의학약학',
  'HE-03': '운동다이어트', 'HE-04': '정신건강',
}

export function getKeywordFromGenres(likedBooks) {
  const freq = {}
  likedBooks.forEach(b => {
    const parent = b.genreCode?.split('-')[0]
    if (parent) freq[parent] = (freq[parent] || 0) + 1
    if (b.genreCode) freq[b.genreCode] = (freq[b.genreCode] || 0) + 1
  })
  const top = Object.entries(freq).sort((a, b) => b[1] - a[1])[0]
  return top ? (GENRE_KEYWORDS[top[0]] ?? top[0]) : '베스트셀러'
}

export async function searchNaverBooks(title, display = 10, start = 1) {
  const params = new URLSearchParams({ naverPath: 'v1/search/book_adv.json', d_titl: title, display, start })
  const res = await fetch(`/api/naver?${params}`)
  if (!res.ok) throw new Error('네이버 책 검색 실패')
  return res.json()
}
