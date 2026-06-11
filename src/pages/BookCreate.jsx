import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createBook } from '@/api/books'
import { useGenres } from '@/context/GenreContext'
import BookForm from '@/components/book/BookForm'
import StateMessage from '@/components/ui/StateMessage'
import Page, { PageHeader } from '@/components/ui/Page'

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
      <Page>
        <StateMessage status="loading" />
      </Page>
    )
  }

  return (
    <Page>
      <PageHeader title="📝 새 도서 등록">
        본문 내용은 AI 표지 생성의 바탕이 돼요
      </PageHeader>
      <BookForm
        initial={{ title: '', author: '', genreCode: '', content: '' }}
        submitLabel="등록하기"
        submitting={submitting}
        error={error}
        onSubmit={handleSubmit}
        cancelTo="/books"
      />
    </Page>
  )
}
