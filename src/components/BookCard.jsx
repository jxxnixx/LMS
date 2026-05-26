import { Link } from 'react-router-dom'
import { useGenres } from '../context/GenreContext'

const fmtDate = (s) => (s ? s.slice(0, 10).replace(/-/g, '.') : '')

export default function BookCard({ book }) {
  const { themeFor, labelFor } = useGenres()
  const t = themeFor(book.genreCode)

  return (
    <Link to={`/books/${book.id}`} className="book-card">
      <div className="card-cover">
        {book.coverImageUrl ? (
          <img src={book.coverImageUrl} alt={book.title} />
        ) : (
          <div
            className="card-cover-ph"
            style={{ background: `linear-gradient(150deg, ${t.color}, ${t.color}99)` }}
          >
            <span className="ph-title">{book.title}</span>
            <span className="ph-tag">표지 준비 중</span>
          </div>
        )}
        {book.isLiked && <span className="card-like">❤</span>}
      </div>
      <div className="card-meta">
        <span
          className="card-genre"
          style={{ color: t.color, background: `${t.color}14` }}
        >
          {labelFor(book.genreCode)}
        </span>
        <h3>{book.title}</h3>
        <p>{book.author} · {fmtDate(book.createdAt)}</p>
      </div>
    </Link>
  )
}
