import { useParams, useNavigate } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'
import { useFetchBooksIdQuery } from '@/api/lms/books/useBooksQueries'
import { useModifyBooksIdMutation } from '@/api/lms/books/useBooksMutations'
import { useGenres } from '@/context/GenreContext'
import BookForm from '@/components/book/BookForm'
import StateMessage from '@/components/ui/StateMessage'
import Page, { PageHeader } from '@/components/ui/Page'

export default function BookEdit() {
  const { id } = useParams()
  const { ready } = useGenres()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const { data: book, isError: loadError } = useFetchBooksIdQuery({ path: { id } })
  const updateMutation = useModifyBooksIdMutation()

  async function handleSubmit(data) {
    try {
      await updateMutation.mutateAsync({ params: { path: { id } }, body: data })
      queryClient.invalidateQueries({ queryKey: ['fetchBooksId'] })
      queryClient.invalidateQueries({ queryKey: ['fetchBooks'] })
      navigate(`/books/${id}`)
    } catch {
      // 실패 메시지는 updateMutation.error로 표시
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
        submitting={updateMutation.isPending}
        error={updateMutation.error?.message}
        onSubmit={handleSubmit}
        cancelTo={`/books/${id}`}
      />
    </Page>
  )
}
