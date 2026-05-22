import { useState, useEffect } from 'react';
import { getBooks } from '../api/books'; 
import BookCard from '../components/BookCard'; 

// 🌟 App.jsx에서 넘겨준 onSelectBook을 props로 받습니다.
export default function BookList({ onSelectBook }) {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState(''); 

  useEffect(() => {
    async function fetchBooks() {
      try {
        setLoading(true);
        const data = await getBooks(); 
        setBooks(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchBooks();
  }, []);

  const filteredBooks = books.filter(book =>
    book.title.includes(searchQuery) || book.author.includes(searchQuery)
  );

  if (loading) return <div className="status-msg">📚 도서 정보를 불러오는 중입니다...</div>;
  if (error) return <div className="status-msg error">❌ 에러 발생: {error}</div>;

  return (
    <main>
      <div className="search-bar">
        <input
          type="text"
          placeholder="도서명 또는 작가를 검색해보세요"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {filteredBooks.length === 0 ? (
        <p className="empty-msg">조건에 맞는 도서가 없습니다. 첫 도서를 등록해 보세요!</p>
      ) : (
        <ul className="book-list">
          {filteredBooks.map(book => (
            <BookCard 
              key={book.id} 
              book={book} 
              onClick={() => onSelectBook(book.id)} // 🌟 카드를 클릭하면 이 책의 id를 부모로 올려보냅니다!
            />
          ))}
        </ul>
      )}
    </main>
  );
}