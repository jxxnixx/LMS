import { useState, useEffect } from "react";
import { useFetchBooksQuery } from "@/api/lms/books/useBooksQueries";
import BookCard from "@/components/book/BookCard";
import GenreSelect from "@/components/book/GenreSelect";
import StateMessage from "@/components/ui/StateMessage";
import Page, { PageHeader } from "@/components/ui/Page";
import Pagination from "@/components/ui/Pagination";
import { useAuth } from "@/context/AuthContext";

const ITEMS_PER_PAGE = 10;

const SORT_OPTIONS = [
  { value: "title-asc", label: "제목 가나다순", _sort: "title", _order: "asc" },
  { value: "title-desc", label: "제목 역순", _sort: "title", _order: "desc" },
  {
    value: "author-asc",
    label: "저자 가나다순",
    _sort: "author",
    _order: "asc",
  },
  { value: "newest", label: "최신 등록순", _sort: "createdAt", _order: "desc" },
  { value: "oldest", label: "오래된 순", _sort: "createdAt", _order: "asc" },
];

export default function BookList() {
  const { isAuthed } = useAuth();

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [topCode, setTopCode] = useState("");
  const [subCode, setSubCode] = useState("");
  const [likedOnly, setLikedOnly] = useState(false);
  const [sort, setSort] = useState("title-asc");
  const [page, setPage] = useState(1);

  // 검색어 디바운스 (입력 멈추고 250ms 뒤 반영)
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search.trim()), 250);
    return () => clearTimeout(t);
  }, [search]);

  // 필터가 바뀌면 첫 페이지로
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, topCode, subCode, likedOnly, sort]);

  const sortOpt = SORT_OPTIONS.find((o) => o.value === sort);
  // 백엔드가 페이지 단위로 응답하므로 페이지네이션을 서버에 위임 (Spring은 0-base)
  const query = {
    _sort: sortOpt._sort,
    _order: sortOpt._order,
    page: page - 1,
    size: ITEMS_PER_PAGE,
  };
  if (debouncedSearch) query.title_like = debouncedSearch;
  if (subCode) query.genreCode = subCode;
  else if (topCode) query.genreCode_like = topCode;
  if (likedOnly) query.isLiked = true;

  const { data, isError: error } = useFetchBooksQuery({ query });

  const books = data?.content ?? [];
  const totalPages = data?.totalPages ?? 1;

  return (
    <Page>
      <PageHeader title='전체 도서'>
        제목 · 장르로 찾아보거나 새 도서를 등록해 보세요
      </PageHeader>

      <div className='cat-toolbar'>
        <input
          className='cat-search'
          type='text'
          placeholder='🔍 제목으로 검색…'
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <GenreSelect
          topCode={topCode}
          subCode={subCode}
          onChange={(top, sub) => {
            setTopCode(top);
            setSubCode(sub);
          }}
          variant='pill'
        />
        {isAuthed ? (
          <button
            className={`like-toggle ${likedOnly ? "on" : ""}`}
            onClick={() => setLikedOnly((v) => !v)}>
            ❤️ 책장만
          </button>
        ) : (
          <></>
        )}

        <select
          className='cat-sort'
          value={sort}
          onChange={(e) => setSort(e.target.value)}>
          {SORT_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </div>

      {error && <StateMessage status='server-error' />}
      {!data && !error && <StateMessage status='loading' />}
      {data && books.length === 0 && (
        <StateMessage>조건에 맞는 책이 없어요.</StateMessage>
      )}
      {data && books.length > 0 && (
        <>
          <div className='book-grid'>
            {books.map((b) => (
              <BookCard key={b.id} book={b} />
            ))}
          </div>

          <Pagination page={page} totalPages={totalPages} onChange={setPage} />
        </>
      )}
    </Page>
  );
}
