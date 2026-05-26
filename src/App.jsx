import { Routes, Route, Outlet } from "react-router-dom";
import Header from "./components/Header";
import LibraryScene from "./pages/LibraryScene";
import BookList from "./pages/BookList";
import BookDetail from "./pages/BookDetail";
import BookCreate from "./pages/BookCreate";
import BookEdit from "./pages/BookEdit";
import Bookshelf from "./pages/Bookshelf";
import { GenreProvider } from "./context/GenreContext";
import "./App.css";
import "./styles/catalog.css";

function AppLayout() {
  return (
    <div className='app-shell'>
      <Header />
      <main className='app-main'>
        <Outlet />
      </main>
    </div>
  );
}

export default function App() {
  return (
    <div className='library-app'>
      <GenreProvider>
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
      </GenreProvider>
    </div>
  );
}
