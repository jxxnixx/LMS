// 🌟 BookList에서 넘겨준 onClick을 받습니다.
export default function BookCard({ book, onClick }) {
  return (
    // 🌟 <li> 태그에 onClick을 달고, 마우스를 올리면 손가락 모양(pointer)이 되게 스타일을 추가합니다.
    <li className="book-card" onClick={onClick} style={{ cursor: 'pointer' }}>
      <div className="book-cover">
        {book.coverImageUrl ? (
          <img src={book.coverImageUrl} alt={`${book.title} 표지`} />
        ) : (
          <div className="no-cover">표지 없음</div>
        )}
      </div>
      
      <div className="book-info">
        <h2>{book.title}</h2>
        <p className="author">✍️ {book.author}</p>
        <p className="content">{book.content}</p>
        <p className="date">등록일: {new Date(book.createdAt).toLocaleDateString()}</p>
      </div>
    </li>
  );
}