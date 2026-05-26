import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getBook, updateBook } from '../api/books'
import { useGenres } from '../context/GenreContext'
import BookForm from '../components/BookForm'

export default function BookEdit() {
  const { id } = useParams()
  const { ready } = useGenres()
  const navigate = useNavigate()

  const [book, setBook] = useState(null)
  const [loadError, setLoadError] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    getBook(id)
      .then(setBook)
      .catch((e) => setLoadError(e.message))
  }, [id])

  async function handleSubmit(data) {
    setSubmitting(true)
    setError(null)
    try {
      await updateBook(id, { ...data, updatedAt: new Date().toISOString() })
      navigate(`/books/${id}`)
    } catch (e) {
      setError(e.message)
      setSubmitting(false)
    }
  }

  if (loadError) {
    return (
      <div className="cat-page">
        <div className="cat-state">책 정보를 불러오지 못했어요.</div>
      </div>
    )
  }
  if (!book || !ready) {
    return (
      <div className="cat-page">
        <div className="cat-state">불러오는 중…</div>
      </div>
    )
  }

  return (
    <div className="cat-page">
      <div className="cat-page-head">
        <h2>📝 도서 수정</h2>
        <p>{book.title}</p>
      </div>
      <BookForm
        initial={{
          title: book.title,
          author: book.author,
          genreCode: book.genreCode,
          content: book.content,
        }}
        submitLabel="저장하기"
        submitting={submitting}
        error={error}
        onSubmit={handleSubmit}
        cancelTo={`/books/${id}`}
      />
    </div>
  )
}
