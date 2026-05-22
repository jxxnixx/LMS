import { useState, useEffect } from 'react'
import { useOutletContext } from 'react-router-dom'
import { getBooks } from '../api/books'
import { genreLabel } from '../theme'
import BookCard from '../components/BookCard'
import GenreSelect from '../components/GenreSelect'

export default function BookList() {
  const { genres } = useOutletContext()
  const [books, setBooks] = useState(null)
  const [error, setError] = useState(null)
  const [search, setSearch] = useState('')
  const [topCode, setTopCode] = useState('')
  const [subCode, setSubCode] = useState('')
  const [likedOnly, setLikedOnly] = useState(false)

  useEffect(() => {
    const parts = []
    if (search.trim()) parts.push(`title_like=${encodeURIComponent(search.trim())}`)
    if (subCode) parts.push(`genreCode=${subCode}`)
    else if (topCode) parts.push(`genreCode_like=${topCode}`)
    if (likedOnly) parts.push('isLiked=true')
    parts.push('_sort=createdAt', '_order=desc')
    const query = parts.join('&')

    const timer = setTimeout(() => {
      setError(null)
      getBooks(query)
        .then(setBooks)
        .catch((e) => {
          setError(e.message)
          setBooks(null)
        })
    }, 250)
    return () => clearTimeout(timer)
  }, [search, topCode, subCode, likedOnly])

  return (
    <div className="cat-page">
      <div className="cat-page-head">
        <h2>전체 도서</h2>
        <p>제목 · 장르로 찾아보거나 새 도서를 등록해 보세요</p>
      </div>

      <div className="cat-toolbar">
        <input
          className="cat-search"
          type="text"
          placeholder="🔍 제목으로 검색…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <GenreSelect
          genres={genres}
          topCode={topCode}
          subCode={subCode}
          onChange={(top, sub) => {
            setTopCode(top)
            setSubCode(sub)
          }}
          variant="pill"
        />
        <button
          className={`like-toggle ${likedOnly ? 'on' : ''}`}
          onClick={() => setLikedOnly((v) => !v)}
        >
          ❤️ 책장만
        </button>
      </div>

      {error && (
        <div className="cat-state">
          json-server에 연결할 수 없어요.<br />
          <code>npm run server</code> 실행 후 새로고침하세요.
        </div>
      )}
      {!books && !error && <div className="cat-state">불러오는 중…</div>}
      {books && books.length === 0 && (
        <div className="cat-state">조건에 맞는 책이 없어요.</div>
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
    </div>
  )
}
