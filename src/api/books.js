import { request, jsonBody } from './client'

// 목록 / 검색 / 필터 — query 예: "title_like=별&genreCode=NV-01"
export const getBooks = (query = '') =>
  request(`/books${query ? `?${query}` : ''}`)

// 상세 조회
export const getBook = (id) => request(`/books/${id}`)

// 특정 장르의 책 (3D 책장 뷰에서 사용)
export const getBooksByGenre = (genreCode) =>
  request(`/books?genreCode=${encodeURIComponent(genreCode)}`)

// 등록
export const createBook = (data) =>
  request('/books', { method: 'POST', ...jsonBody(data) })

// 수정 (부분 갱신 — 좋아요 토글, 표지 저장 포함)
export const updateBook = (id, patch) =>
  request(`/books/${id}`, { method: 'PATCH', ...jsonBody(patch) })

// 삭제
export const deleteBook = (id) =>
  request(`/books/${id}`, { method: 'DELETE' })

// ★ [추가] 좋아요 토글 (true ↔ false)
export const toggleLike = (id) =>
  request(`/books/${id}/like`, { method: 'PATCH' })

// ── OpenAI 표지 이미지 생성 ──
// 생성된 이미지를 Data URL로 반환 → updateBook(id, { coverImageUrl }) 로 저장
export async function generateCover({ apiKey, prompt, quality = 'medium' }) {
  let res
  try {
    res = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-image-1',
        prompt,
        n: 1,
        size: '1024x1536',
        quality,
      }),
    })
  } catch {
    throw new Error('OpenAI 서버에 연결할 수 없어요.')
  }
  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    throw new Error(data?.error?.message || `이미지 생성 실패 (${res.status})`)
  }
  const b64 = data?.data?.[0]?.b64_json
  if (!b64) throw new Error('이미지 데이터를 받지 못했어요.')
  return `data:image/png;base64,${b64}`
}

