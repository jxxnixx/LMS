import { useState, useEffect, useRef } from 'react'
import { useOutletContext } from 'react-router-dom'
import { getBooks } from '../api/books'
import { genreLabel } from '../theme'
import BookCard from '../components/BookCard'
import { fetchRecommendations } from '../api/recommend'

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
  const { genres } = useOutletContext()
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
    if (!books || genres.length === 0) return
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
  }, [books, genres])

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
            <BookCard
              key={b.id}
              book={b}
              genreText={genreLabel(genres, b.genreCode)}
            />
          ))}
        </div>
      )}

      {/* 취향 기반 추천 */}
      <section style={{ marginTop: '4rem', borderTop: '1px solid var(--border, #e5e7eb)', paddingTop: '2.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 600, margin: 0 }}>취향 기반 추천 도서</h3>
            {cacheTs && (
              <p style={{ fontSize: '0.75rem', color: 'var(--muted, #6b7280)', marginTop: '0.25rem' }}>
                {formatNextRefresh(cacheTs)}
              </p>
            )}
          </div>
          {books && books.length > 0 && (
            <button
              onClick={handleForceRefresh}
              disabled={recLoading}
              style={{ fontSize: '0.8rem', padding: '0.3rem 0.7rem', cursor: recLoading ? 'not-allowed' : 'pointer', opacity: recLoading ? 0.6 : 1 }}
            >
              {recLoading ? '분석 중…' : '🔄 새로 받기'}
            </button>
          )}
        </div>

        {books && books.length === 0 && (
          <p style={{ fontSize: '0.875rem', color: 'var(--muted, #6b7280)', textAlign: 'center', padding: '2rem 0' }}>
            책장에 책을 추가하면 취향에 맞는 책을 추천해드립니다.
          </p>
        )}
        {recLoading && (
          <p style={{ fontSize: '0.875rem', color: 'var(--muted, #6b7280)', textAlign: 'center', padding: '2rem 0' }}>
            GPT가 추천 도서를 분석 중입니다…
          </p>
        )}
        {recError && (
          <p style={{ fontSize: '0.875rem', color: '#ef4444', padding: '1rem 0' }}>{recError}</p>
        )}
        {!recLoading && recommendations.length > 0 && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '1.5rem' }}>
            {recommendations.map((item, i) => (
              <a
                key={i}
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                style={{ textDecoration: 'none', color: 'inherit', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}
              >
                <div style={{ aspectRatio: '2/3', overflow: 'hidden', borderRadius: '0.5rem', background: '#f3f4f6' }}>
                  {item.image
                    ? <img src={item.image} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', color: '#9ca3af' }}>이미지 없음</div>
                  }
                </div>
                <p style={{ fontSize: '0.8rem', fontWeight: 500, margin: 0, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}
                  dangerouslySetInnerHTML={{ __html: item.title }}
                />
                <p style={{ fontSize: '0.75rem', color: '#6b7280', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                  dangerouslySetInnerHTML={{ __html: item.author }}
                />
                <span style={{ fontSize: '0.7rem', color: '#9ca3af' }}>📚 네이버 도서</span>
              </a>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
