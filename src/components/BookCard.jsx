import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const BookCard = ({ book, onToggleLike }) => {
  const { id, title, author, genreCode, isLiked, coverImageUrl } = book;

  return (
    <motion.div 
      className="book-card"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -8, boxShadow: "0 10px 20px rgba(0,0,0,0.12)" }}
      transition={{ duration: 0.2 }}
    >
      <Link to={`/books/${id}`} className="card-link">
        <div className="cover-placeholder">
          {coverImageUrl ? (
            <img src={coverImageUrl} alt={title} />
          ) : (
            <div className="no-image">📖</div>
          )}
        </div>
        <div className="card-content">
          <span className="genre-tag">{genreCode}</span>
          <h3 className="title">{title}</h3>
          <p className="author">{author}</p>
        </div>
      </Link>
      <motion.button 
        className={`like-button ${isLiked ? 'liked' : ''}`}
        whileTap={{ scale: 0.8 }}
        onClick={(e) => {
          e.preventDefault();
          onToggleLike(id, isLiked);
        }}
      >
        {isLiked ? '❤️' : '🤍'}
      </motion.button>

      <style dangerouslySetInnerHTML={{ __html: `
        .book-card {
          background: white;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 10px rgba(0,0,0,0.05);
          position: relative;
          display: flex;
          flex-direction: column;
        }
        .card-link {
          text-decoration: none;
          color: inherit;
          display: flex;
          flex-direction: column;
          height: 100%;
        }
        .cover-placeholder {
          height: 220px;
          background: #f8f9fa;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 3rem;
          border-bottom: 1px solid #f1f3f5;
        }
        .cover-placeholder img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .card-content {
          padding: 1.2rem;
          flex: 1;
        }
        .genre-tag {
          font-size: 0.75rem;
          background: #e7f5ff;
          padding: 0.3rem 0.6rem;
          border-radius: 20px;
          color: #228be6;
          font-weight: bold;
        }
        .title {
          margin: 0.8rem 0 0.4rem;
          font-size: 1.15rem;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .author {
          font-size: 0.9rem;
          color: #868e96;
          margin: 0;
        }
        .like-button {
          position: absolute;
          top: 0.8rem;
          right: 0.8rem;
          background: rgba(255, 255, 255, 0.9);
          border: none;
          border-radius: 50%;
          width: 36px;
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          box-shadow: 0 2px 8px rgba(0,0,0,0.15);
          font-size: 1.2rem;
        }
      `}} />
    </motion.div>
  );
};

export default BookCard;
