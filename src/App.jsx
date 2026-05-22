import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Header from './components/Header';
import BookList from './pages/BookList';
import BookDetail from './pages/BookDetail';
import BookCreate from './pages/BookCreate';
import BookEdit from './pages/BookEdit';
import Bookshelf from './pages/Bookshelf';
import './App.css';

const AnimatedRoutes = () => {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<BookList />} />
        <Route path="/books/:id" element={<BookDetail />} />
        <Route path="/create" element={<BookCreate />} />
        <Route path="/edit/:id" element={<BookEdit />} />
        <Route path="/bookshelf" element={<Bookshelf />} />
      </Routes>
    </AnimatePresence>
  );
};

function App() {
  return (
    <Router>
      <div className="app-container">
        <Header />
        <main style={{ padding: '1rem', overflowX: 'hidden' }}>
          <AnimatedRoutes />
        </main>
      </div>
    </Router>
  );
}

export default App;
