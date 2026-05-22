import { useState } from 'react';
import Header from './components/Header';
import BookList from './pages/BookList';
import BookDetail from './pages/BookDetail'; // 🌟 상세 페이지 불러오기
import './App.css';

function App() {
  // 어떤 책을 선택했는지 기억하는 상태 (null이면 목록 화면)
  const [selectedBookId, setSelectedBookId] = useState(null);

  return (
    <div className="app-container">
      <Header />
      
      {/* selectedBookId가 있으면 상세 페이지, 없으면 목록 페이지를 보여줍니다 */}
      {selectedBookId ? (
        <BookDetail 
          bookId={selectedBookId} 
          onBack={() => setSelectedBookId(null)} // 뒤로가기 누르면 다시 null로!
        />
      ) : (
        <BookList 
          onSelectBook={(id) => setSelectedBookId(id)} // 책을 클릭하면 id를 저장!
        />
      )}
    </div>
  );
}

export default App;