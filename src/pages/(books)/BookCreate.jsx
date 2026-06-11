import { useNavigate } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'
import { useCreateBooksMutation } from '@/api/lms/books/useBooksMutations'
import { useGenres } from '@/context/GenreContext'
import BookForm from '@/components/book/BookForm'
import StateMessage from '@/components/ui/StateMessage'
import Page, { PageHeader } from '@/components/ui/Page'

export default function BookCreate() {
  const { ready } = useGenres()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const createMutation = useCreateBooksMutation()

  async function handleSubmit(data) {
    try {
      const created = await createMutation.mutateAsync({ ...data, coverImageUrl: '' })
      queryClient.invalidateQueries({ queryKey: ['fetchBooks'] })
      navigate(`/books/${created.id}`)
    } catch {
      // 실패 메시지는 createMutation.error로 표시
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
        submitting={createMutation.isPending}
        error={createMutation.error?.message}
        onSubmit={handleSubmit}
        cancelTo="/books"
      />
    </Page>
  )
}
