import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { getBooks, toggleLike } from '../api/books';
import BookCard from '../components/BookCard';
import GenreSelect from '../components/GenreSelect';
import LoadingSpinner from '../components/LoadingSpinner';

const BookList = () => {
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchBooks = async () => {
    try {
      const data = await getBooks();
      setBooks(data);
      setFilteredBooks(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  useEffect(() => {
    if (selectedGenre) {
      setFilteredBooks(books.filter(book => 
        book.genreCode === selectedGenre || book.genreCode.startsWith(selectedGenre + '-')
      ));
    } else {
      setFilteredBooks(books);
    }
  }, [selectedGenre, books]);

  const handleToggleLike = async (id, currentIsLiked) => {
    try {
      await toggleLike(id, currentIsLiked);
      setBooks(prev => prev.map(book => 
        book.id === id ? { ...book, isLiked: !currentIsLiked } : book
      ));
    } catch (error) {
      alert('좋아요 처리에 실패했습니다.');
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <motion.div 
      className="book-list-page"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <div className="list-header">
        <h2>전체 도서 목록</h2>
        <GenreSelect 
          value={selectedGenre} 
          onChange={setSelectedGenre} 
          isFilter={true} 
        />
      </div>

      {filteredBooks.length === 0 ? (
        <motion.p 
          className="empty-msg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          해당 조건의 도서가 없습니다.
        </motion.p>
      ) : (
        <motion.div 
          className="book-grid"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: { staggerChildren: 0.1 }
            }
          }}
        >
          {filteredBooks.map(book => (
            <BookCard 
              key={book.id} 
              book={book} 
              onToggleLike={handleToggleLike} 
            />
          ))}
        </motion.div>
      )}

      <style dangerouslySetInnerHTML={{ __html: `
        .book-list-page {
          max-width: 1200px;
          margin: 0 auto;
        }
        .list-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
        }
        .book-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
          gap: 2rem;
        }
        .empty-msg {
          text-align: center;
          padding: 4rem;
          color: #868e96;
          font-size: 1.1rem;
          background: #f8f9fa;
          border-radius: 12px;
        }
      `}} />
    </motion.div>
  );
};

export default BookList;
