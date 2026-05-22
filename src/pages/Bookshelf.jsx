import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { getBooks, toggleLike } from '../api/books';
import BookCard from '../components/BookCard';
import LoadingSpinner from '../components/LoadingSpinner';

const Bookshelf = () => {
  const [likedBooks, setLikedBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchLikedBooks = async () => {
    try {
      const data = await getBooks();
      setLikedBooks(data.filter(book => book.isLiked));
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLikedBooks();
  }, []);

  const handleToggleLike = async (id, currentIsLiked) => {
    try {
      await toggleLike(id, currentIsLiked);
      setLikedBooks(prev => prev.filter(book => book.id !== id));
    } catch (error) {
      alert('좋아요 처리에 실패했습니다.');
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <motion.div 
      className="bookshelf-page"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ marginBottom: '0.5rem' }}>나의 서재</h2>
        <p style={{ color: '#868e96', margin: 0 }}>좋아요를 누른 도서들입니다.</p>
      </div>

      {likedBooks.length === 0 ? (
        <motion.div 
          className="empty-bookshelf"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <span style={{ fontSize: '4rem', display: 'block', marginBottom: '1rem' }}>🏜️</span>
          <p>서재가 비어 있습니다. 관심 있는 책에 좋아요를 눌러보세요!</p>
        </motion.div>
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
          {likedBooks.map(book => (
            <BookCard 
              key={book.id} 
              book={book} 
              onToggleLike={handleToggleLike} 
            />
          ))}
        </motion.div>
      )}

      <style dangerouslySetInnerHTML={{ __html: `
        .bookshelf-page {
          max-width: 1200px;
          margin: 0 auto;
        }
        .book-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
          gap: 2rem;
        }
        .empty-bookshelf {
          text-align: center;
          padding: 5rem 2rem;
          background: #f8f9fa;
          border-radius: 12px;
          color: #495057;
          font-size: 1.1rem;
        }
      `}} />
    </motion.div>
  );
};

export default Bookshelf;
