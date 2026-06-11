export async function searchNaverBooks(title, display = 10, start = 1) {
  const params = new URLSearchParams({ naverPath: 'v1/search/book_adv.json', d_titl: title, display, start })
  const res = await fetch(`/api/naver?${params}`)
  if (!res.ok) throw new Error('네이버 책 검색 실패')
  return res.json()
}
