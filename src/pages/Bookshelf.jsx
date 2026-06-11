import { useState, useEffect, useRef } from 'react'
import { getBooks } from '@/api/books'
import BookCard from '@/components/book/BookCard'
import { useGenres } from '@/context/GenreContext'
import { fetchRecommendations } from '@/api/recommend'

const REC_CACHE_KEY = 'lms_recommendations'
const REC_TTL = 12 * 60 * 60 * 1000

function getCached() {
  try {
    const raw = localStorage.getItem(REC_CACHE_KEY)
    if (!raw) return null
    const { items, ts } = JSON.parse(raw)
    if (Date.now() - ts > REC_TTL) return null
    return { items, ts }
  } catch { return null }
}

function setCache(items) {
  localStorage.setItem(REC_CACHE_KEY, JSON.stringify({ items, ts: Date.now() }))
}

function formatNextRefresh(ts) {
  const remaining = ts + REC_TTL - Date.now()
  const m = Math.ceil(remaining / 60000)
  return m > 0 ? `${m}분 후 갱신` : '곧 갱신'
}

export default function Bookshelf() {
  const { genres, ready } = useGenres()
  const [books, setBooks] = useState(null)
  const [error, setError] = useState(null)

  const [recommendations, setRecommendations] = useState([])
  const [recLoading, setRecLoading] = useState(false)
  const [recError, setRecError] = useState('')
  const [cacheTs, setCacheTs] = useState(null)
  const recFetched = useRef(false)

  useEffect(() => {
    getBooks('isLiked=true&_sort=updatedAt&_order=desc')
      .then(setBooks)
      .catch((e) => setError(e.message))
  }, [])

  useEffect(() => {
    if (recFetched.current) return
    if (!books || !ready) return
    recFetched.current = true

    const cached = getCached()
    if (cached) {
      setRecommendations(cached.items)
      setCacheTs(cached.ts)
      return
    }

    if (books.length === 0) return

    setRecLoading(true)
    setRecError('')
    fetchRecommendations(books, genres)
      .then(items => {
        setRecommendations(items)
        setCache(items)
        setCacheTs(Date.now())
      })
      .catch(e => setRecError(e.message ?? '추천 도서를 불러오지 못했습니다.'))
      .finally(() => setRecLoading(false))
  }, [books, genres, ready])

  const handleForceRefresh = () => {
    if (!books || books.length === 0) return
    localStorage.removeItem(REC_CACHE_KEY)
    setRecLoading(true)
    setRecError('')
    setRecommendations([])
    fetchRecommendations(books, genres)
      .then(items => {
        setRecommendations(items)
        setCache(items)
        setCacheTs(Date.now())
      })
      .catch(e => setRecError(e.message ?? '추천 도서를 불러오지 못했습니다.'))
      .finally(() => setRecLoading(false))
  }

  return (
    <div className="cat-page">
      <div className="cat-page-head">
        <h2>내 책장</h2>
        <p>❤️ 표시한 책들을 모았어요</p>
      </div>

      {error && (
        <div className="cat-state">
          json-server에 연결할 수 없어요.<br />
          <code>npm run server</code> 실행 후 새로고침하세요.
        </div>
      )}
      {!books && !error && <div className="cat-state">불러오는 중…</div>}
      {books && books.length === 0 && (
        <div className="cat-state">아직 책장에 담은 책이 없어요.</div>
      )}
      {books && books.length > 0 && (
        <div className="book-grid">
          {books.map((b) => (
            <BookCard key={b.id} book={b} />
          ))}
        </div>
      )}

      {/* 취향 기반 추천 */}
      <section className="rec-section">
        <div className="rec-head">
          <div>
            <h3 className="rec-title">취향 기반 추천 도서</h3>
            {cacheTs && (
              <p className="rec-refresh-note">{formatNextRefresh(cacheTs)}</p>
            )}
          </div>
          {books && books.length > 0 && (
            <button
              className="rec-refresh-btn"
              onClick={handleForceRefresh}
              disabled={recLoading}
            >
              {recLoading ? '분석 중…' : '🔄 새로 받기'}
            </button>
          )}
        </div>

        {books && books.length === 0 && (
          <p className="rec-msg">
            책장에 책을 추가하면 취향에 맞는 책을 추천해드립니다.
          </p>
        )}
        {recLoading && (
          <p className="rec-msg">GPT가 추천 도서를 분석 중입니다…</p>
        )}
        {recError && <p className="rec-error">{recError}</p>}
        {!recLoading && recommendations.length > 0 && (
          <div className="rec-grid">
            {recommendations.map((item, i) => (
              <a
                key={i}
                className="rec-item"
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
              >
                <div className="rec-cover">
                  {item.image
                    ? <img src={item.image} alt={item.title} />
                    : <div className="rec-cover-empty">이미지 없음</div>
                  }
                </div>
                <p
                  className="rec-item-title"
                  dangerouslySetInnerHTML={{ __html: item.title }}
                />
                <p
                  className="rec-item-author"
                  dangerouslySetInnerHTML={{ __html: item.author }}
                />
                <span className="rec-source">📚 네이버 도서</span>
              </a>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
