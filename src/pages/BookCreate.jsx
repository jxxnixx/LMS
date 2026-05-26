import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createBook } from '../api/books'
import { useGenres } from '../context/GenreContext'
import BookForm from '../components/BookForm'

export default function BookCreate() {
  const { ready } = useGenres()
  const navigate = useNavigate()
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)

  async function handleSubmit(data) {
    setSubmitting(true)
    setError(null)
    const now = new Date().toISOString()
    try {
      const created = await createBook({
        ...data,
        coverImageUrl: '',
        isLiked: false,
        createdAt: now,
        updatedAt: now,
      })
      navigate(`/books/${created.id}`)
    } catch (e) {
      setError(e.message)
      setSubmitting(false)
    }
  }

  if (!ready) {
    return (
      <div className="cat-page">
        <div className="cat-state">불러오는 중…</div>
      </div>
    )
  }

  return (
    <div className="cat-page">
      <div className="cat-page-head">
        <h2>📝 새 도서 등록</h2>
        <p>본문 내용은 AI 표지 생성의 바탕이 돼요</p>
      </div>
      <BookForm
        initial={{ title: '', author: '', genreCode: '', content: '' }}
        submitLabel="등록하기"
        submitting={submitting}
        error={error}
        onSubmit={handleSubmit}
        cancelTo="/books"
      />
    </div>
  )
}
