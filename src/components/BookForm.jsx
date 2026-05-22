import { useState } from 'react'
import { Link } from 'react-router-dom'
import GenreSelect from './GenreSelect'

// 등록 / 수정 공용 폼. 검증은 내부에서, API 호출·이동은 onSubmit 으로 위임.
export default function BookForm({
  genres,
  initial,
  submitLabel,
  submitting,
  error,
  onSubmit,
  cancelTo,
}) {
  const initialSub = genres.find((g) => g.code === initial.genreCode)
  const [title, setTitle] = useState(initial.title)
  const [author, setAuthor] = useState(initial.author)
  const [topCode, setTopCode] = useState(initialSub ? initialSub.parentCode : '')
  const [genreCode, setGenreCode] = useState(initial.genreCode)
  const [content, setContent] = useState(initial.content)
  const [localError, setLocalError] = useState(null)

  function handleSubmit(e) {
    e.preventDefault()
    if (!title.trim() || !author.trim() || !genreCode || !content.trim()) {
      setLocalError('제목 · 작가 · 장르 · 본문은 모두 필수예요.')
      return
    }
    setLocalError(null)
    onSubmit({
      title: title.trim(),
      author: author.trim(),
      genreCode,
      content: content.trim(),
    })
  }

  return (
    <form className="form-card" onSubmit={handleSubmit}>
      <div className="field">
        <label>제목 *</label>
        <input
          type="text"
          placeholder="작품 제목"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      <div className="field">
        <label>작가명 *</label>
        <input
          type="text"
          placeholder="필명 또는 이름"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
        />
      </div>

      <div className="field">
        <label>장르 *</label>
        <GenreSelect
          genres={genres}
          topCode={topCode}
          subCode={genreCode}
          onChange={(top, sub) => {
            setTopCode(top)
            setGenreCode(sub)
          }}
          variant="field"
        />
      </div>

      <div className="field">
        <label>본문 내용 *</label>
        <textarea
          placeholder="줄거리나 내용을 입력하세요. AI가 이 내용을 바탕으로 표지를 그려요."
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <div className="char-count">{content.length}자</div>
      </div>

      {(localError || error) && (
        <p className="form-error">⚠ {localError || error}</p>
      )}

      <div className="form-actions">
        <Link className="btn btn-ghost" to={cancelTo}>취소</Link>
        <button className="btn btn-wood" type="submit" disabled={submitting}>
          {submitting ? '저장 중…' : submitLabel}
        </button>
      </div>
    </form>
  )
}
