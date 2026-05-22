import { useState, useEffect } from 'react'
import { useOutletContext } from 'react-router-dom'
import { getBooks } from '../api/books'
import { genreLabel } from '../theme'
import BookCard from '../components/BookCard'

export default function Bookshelf() {
  const { genres } = useOutletContext()
  const [books, setBooks] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    getBooks('isLiked=true&_sort=updatedAt&_order=desc')
      .then(setBooks)
      .catch((e) => setError(e.message))
  }, [])

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
    </div>
  )
}
