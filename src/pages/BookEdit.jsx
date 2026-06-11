import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getBook, updateBook } from '@/api/books'
import { useGenres } from '@/context/GenreContext'
import BookForm from '@/components/book/BookForm'
import StateMessage from '@/components/ui/StateMessage'
import Page, { PageHeader } from '@/components/ui/Page'

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
      <Page>
        <StateMessage status="server-error" />
      </Page>
    )
  }
  if (!book || !ready) {
    return (
      <Page>
        <StateMessage status="loading" />
      </Page>
    )
  }

  return (
    <Page>
      <PageHeader title="📝 도서 수정">{book.title}</PageHeader>
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
    </Page>
  )
}
