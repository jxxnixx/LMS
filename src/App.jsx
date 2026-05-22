import { useState, useEffect } from "react";
import { Routes, Route, Outlet } from "react-router-dom";
import Header from "./components/Header";
import LibraryScene from "./pages/LibraryScene";
import BookList from "./pages/BookList";
import BookDetail from "./pages/BookDetail";
import BookCreate from "./pages/BookCreate";
import BookEdit from "./pages/BookEdit";
import Bookshelf from "./pages/Bookshelf";
import { getGenres } from "./api/genres";
import "./App.css";
import "./styles/catalog.css";

// 전 화면 공통 셸 — 헤더 + 장르 데이터 1회 로드
function AppLayout() {
  const [genres, setGenres] = useState([]);

  useEffect(() => {
    getGenres()
      .then(setGenres)
      .catch(() => setGenres([]));
  }, []);

  return (
    <div className='app-shell'>
      <Header />
      <main className='app-main'>
        <Outlet context={{ genres }} />
      </main>
    </div>
  );
}

export default function App() {
  return (
    <div className='library-app'>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path='/' element={<LibraryScene />} />
          <Route path='/books' element={<BookList />} />
          <Route path='/books/new' element={<BookCreate />} />
          <Route path='/books/:id' element={<BookDetail />} />
          <Route path='/books/:id/edit' element={<BookEdit />} />
          <Route path='/shelf' element={<Bookshelf />} />
        </Route>
      </Routes>
    </div>
  );
}
