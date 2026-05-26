import { useState, useEffect } from 'react'
import { getBooks } from '../api/books'
import BookCard from '../components/BookCard'
import GenreSelect from '../components/GenreSelect'

const ITEMS_PER_PAGE = 10

export default function BookList() {
  const [books, setBooks] = useState(null)
  const [error, setError] = useState(null)
  const [search, setSearch] = useState('')
  const [topCode, setTopCode] = useState('')
  const [subCode, setSubCode] = useState('')
  const [likedOnly, setLikedOnly] = useState(false)
  const [sort, setSort] = useState('title-asc')
  const [page, setPage] = useState(1)

  const SORT_OPTIONS = [
    { value: 'title-asc',   label: '제목 가나다순',  _sort: 'title',     _order: 'asc'  },
    { value: 'title-desc',  label: '제목 역순',      _sort: 'title',     _order: 'desc' },
    { value: 'author-asc',  label: '저자 가나다순',  _sort: 'author',    _order: 'asc'  },
    { value: 'newest',      label: '최신 등록순',    _sort: 'createdAt', _order: 'desc' },
    { value: 'oldest',      label: '오래된 순',      _sort: 'createdAt', _order: 'asc'  },
  ]

  useEffect(() => {
    const parts = []
    if (search.trim()) parts.push(`title_like=${encodeURIComponent(search.trim())}`)
    if (subCode) parts.push(`genreCode=${subCode}`)
    else if (topCode) parts.push(`genreCode_like=${topCode}`)
    if (likedOnly) parts.push('isLiked=true')
    const { _sort, _order } = SORT_OPTIONS.find(o => o.value === sort)
    parts.push(`_sort=${_sort}`, `_order=${_order}`)
    const query = parts.join('&')

    const timer = setTimeout(() => {
      setError(null)
      setPage(1)
      getBooks(query)
        .then(setBooks)
        .catch((e) => {
          setError(e.message)
          setBooks(null)
        })
    }, 250)
    return () => clearTimeout(timer)
  }, [search, topCode, subCode, likedOnly, sort])

  const totalPages = books ? Math.max(1, Math.ceil(books.length / ITEMS_PER_PAGE)) : 1
  const paginated = books ? books.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE) : []

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
        <select
          className="cat-sort"
          value={sort}
          onChange={(e) => setSort(e.target.value)}
        >
          {SORT_OPTIONS.map(o => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
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
        <>
          <div className="book-grid">
            {paginated.map((b) => (
              <BookCard key={b.id} book={b} />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="cat-pagination">
              <button className="page-btn" onClick={() => setPage(p => p - 1)} disabled={page === 1}>
                이전
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                <button
                  key={p}
                  className={`page-btn${p === page ? ' active' : ''}`}
                  onClick={() => setPage(p)}
                >
                  {p}
                </button>
              ))}
              <button className="page-btn" onClick={() => setPage(p => p + 1)} disabled={page === totalPages}>
                다음
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
