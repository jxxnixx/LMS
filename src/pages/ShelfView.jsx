import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { getBooks } from "../api/books";
import { useGenres } from "../context/GenreContext";

function MiniBook({ book, color }) {
  const navigate = useNavigate();
  return (
    <button className='mini-book' onClick={() => navigate(`/books/${book.id}`)}>
      <div className='mini-cover'>
        {book.coverImageUrl ? (
          <img src={book.coverImageUrl} alt={book.title} />
        ) : (
          <div
            className='mini-ph'
            style={{
              background: `linear-gradient(150deg, ${color}, ${color}aa)`,
            }}>
            <span>{book.title}</span>
          </div>
        )}
      </div>
      <span className='mini-title'>{book.title}</span>
      <span className='mini-author'>{book.author}</span>
    </button>
  );
}

// 3D 복도에서 책장(대분류)을 클릭하면 그 대분류 전체를 소분류 선반으로 펼쳐 보여준다
export default function ShelfView({ genre, onBack }) {
  const { get, subsOf, themeFor } = useGenres();
  const navigate = useNavigate();
  const [books, setBooks] = useState(null);
  const [error, setError] = useState(null);

  const topCode = genre.parentCode || genre.code.split("-")[0];
  const top = get(topCode);
  const subs = subsOf(topCode);
  const t = themeFor(topCode);

  useEffect(() => {
    setError(null);
    getBooks(`genreCode_like=${topCode}&_sort=id`)
      .then(setBooks)
      .catch((e) => setError(e.message));
  }, [topCode]);

  return (
    <motion.div
      className='shelf-root'
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}>
      <header className='shelf-header'>
        <button className='back-btn' onClick={onBack}>
          ← 복도로 돌아가기
        </button>
        <span className='shelf-code' style={{ color: t.color }}>
          {topCode}
        </span>
        <h2 className='shelf-name'>{top ? top.label : t.label}</h2>
        <button className='shelf-list-btn' onClick={() => navigate("/books")}>
          전체 목록 보기 ▦
        </button>
      </header>

      <div className='shelf-body'>
        {error && (
          <p className='cat-state'>
            json-server에 연결할 수 없어요. <code>npm run server</code>
          </p>
        )}
        {!books && !error && <p className='cat-state'>불러오는 중…</p>}
        {books && (
          <div className='bookcase-unit'>
            {subs.map((sub) => {
              const list = books.filter((b) => b.genreCode === sub.code);
              return (
                <section
                  key={sub.code}
                  className={`shelf-tier ${sub.code === genre.code ? "is-active" : ""}`}>
                  <div className='tier-head'>
                    <span className='tier-name'>{sub.label}</span>
                    <span className='tier-count'>{list.length}권</span>
                  </div>
                  <div className='tier-books'>
                    {list.length === 0 ? (
                      <p className='tier-empty'>아직 등록된 책이 없어요</p>
                    ) : (
                      list.map((b) => (
                        <MiniBook key={b.id} book={b} color={t.color} />
                      ))
                    )}
                  </div>
                  <div className='tier-plank' />
                </section>
              );
            })}
          </div>
        )}
      </div>
    </motion.div>
  );
}
