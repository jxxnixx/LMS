import { useState, useEffect } from 'react';
import { getBookById } from '../api/books'; // 상세 조회 API 불러오기

// 부모 컴포넌트(App)에서 클릭한 책의 id를 props로 전달받는다고 가정합니다.
export default function BookDetail({ bookId, onBack }) {
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchDetail() {
      try {
        setLoading(true);
        // 전달받은 bookId를 이용해 서버에 단건 조회 요청!
        const data = await getBookById(bookId); 
        setBook(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    
    // bookId가 있을 때만 실행
    if (bookId) fetchDetail(); 
  }, [bookId]); // 🌟 주의: bookId가 바뀔 때마다 새로 불러와야 하므로 배열에 넣습니다.

  if (loading) return <div className="status-msg">도서 상세 정보를 불러오는 중...</div>;
  if (error) return <div className="status-msg error">에러: {error}</div>;
  if (!book) return null;

  return (
    <div className="book-detail-page">
      <button className="back-btn" onClick={onBack}>⬅️ 목록으로 돌아가기</button>
      
      <div className="detail-container">
        <div className="detail-cover">
          {book.coverImageUrl ? (
            <img src={book.coverImageUrl} alt="표지" />
          ) : (
            <div className="no-cover">표지 없음</div>
          )}
        </div>
        
        <div className="detail-info">
          <h2>{book.title}</h2>
          <p className="author"><strong>작가:</strong> {book.author}</p>
          <p className="genre"><strong>장르 코드:</strong> {book.genreCode}</p>
          
          <div className="content-box">
            <h3>책 내용</h3>
            <p>{book.content}</p>
          </div>

          <p className="date">등록일: {new Date(book.createdAt).toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
}