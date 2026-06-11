import { fetchApiNaver } from '@/api/lms/api/apiAPI'
import { createAiChat } from '@/api/lms/ai/aiAPI'

// 네이버 책 검색 — 생성된 fetchApiNaver(백엔드 /api/naver 프록시)로 호출.
// 백엔드 NaverProxyController는 naverPath를 뺀 나머지 flat 쿼리를 그대로 네이버로 넘긴다.
const searchNaverBook = (title) =>
  fetchApiNaver({
    query: { naverPath: 'v1/search/book_adv.json', d_titl: title, display: 1, start: 1 },
  })

async function getGptRecommendations(likedBooks, genres) {
  const genreMap = Object.fromEntries(genres.map(g => [g.code, g.label]))
  const bookList = likedBooks
    .slice(0, 10)
    .map(b => `"${b.title}" (저자: ${b.author}, 장르: ${genreMap[b.genreCode] ?? b.genreCode})`)
    .join('\n')

  // 생성된 createAiChat → 백엔드 /ai/chat 프록시 경유 (키는 서버에만, CORS 없음)
  const data = await createAiChat({
    model: 'gpt-4o-mini',
    messages: [{
      role: 'user',
      content: `다음 책들을 좋아하는 사람에게 취향이 비슷한 책 6권을 추천해주세요.\n\n${bookList}\n\n중요 조건:\n- 반드시 실제로 출판된 책이어야 합니다\n- 제목이 정확해야 합니다 (교보문고나 yes24에서 검색되는 정확한 제목)\n- 위 목록에 있는 책은 제외\n- 확실하지 않은 책은 추천하지 마세요\n\n반드시 다음 JSON 형식으로만 응답하세요:\n{"books":[{"title":"정확한제목","author":"저자명"},...]}`,
    }],
    response_format: { type: 'json_object' },
  })

  const parsed = JSON.parse(data.choices[0].message.content)
  return parsed.books ?? []
}

export async function fetchRecommendations(likedBooks, genres) {
  const gptRecs = await getGptRecommendations(likedBooks, genres)

  const settled = await Promise.allSettled(
    gptRecs.map(rec => searchNaverBook(rec.title))
  )

  const results = settled
    .filter(r => r.status === 'fulfilled' && r.value.items?.length > 0)
    .map(r => r.value.items[0])
    .slice(0, 3)

  return results
}
