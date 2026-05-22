import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getBookById, deleteBook, toggleLike } from '../api/books';
import LoadingSpinner from '../components/LoadingSpinner';

const BookDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getBookById(id)
      .then(setBook)
      .catch(() => {
        alert('도서를 찾을 수 없습니다.');
        navigate('/');
      })
      .finally(() => setLoading(false));
  }, [id, navigate]);

  const handleDelete = async () => {
    if (window.confirm('정말 이 도서를 삭제하시겠습니까?')) {
      try {
        await deleteBook(id);
        alert('삭제되었습니다.');
        navigate('/');
      } catch (error) {
        alert('삭제에 실패했습니다.');
      }
    }
  };

  const handleToggleLike = async () => {
    try {
      await toggleLike(id, book.isLiked);
      setBook({ ...book, isLiked: !book.isLiked });
    } catch (error) {
      alert('좋아요 처리에 실패했습니다.');
    }
  };

  if (loading) return <LoadingSpinner />;
  if (!book) return null;

  return (
    <motion.div 
      className="book-detail"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30 }}
      transition={{ duration: 0.4 }}
    >
      <div className="detail-container">
        <motion.div 
          className="detail-image"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          {book.coverImageUrl ? (
            <img src={book.coverImageUrl} alt={book.title} />
          ) : (
            <div className="no-image-large">📖</div>
          )}
        </motion.div>
        
        <motion.div 
          className="detail-info"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="info-header">
            <span className="genre-label">{book.genreCode}</span>
            <motion.button 
              className="like-btn-large" 
              whileTap={{ scale: 0.8 }}
              onClick={handleToggleLike}
            >
              {book.isLiked ? '❤️' : '🤍'}
            </motion.button>
          </div>
          
          <h1 className="detail-title">{book.title}</h1>
          <p className="detail-author">저자: {book.author}</p>
          <div className="detail-meta">
            <span>등록일: {new Date(book.createdAt).toLocaleDateString()}</span>
          </div>
          
          <div className="detail-content">
            <h3>책 소개</h3>
            <p>{book.content}</p>
          </div>

          <div className="detail-actions">
            <Link to={`/edit/${id}`} className="btn-edit">수정하기</Link>
            <button onClick={handleDelete} className="btn-delete">삭제하기</button>
            <button onClick={() => navigate(-1)} className="btn-back">목록으로</button>
          </div>
        </motion.div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .book-detail {
          max-width: 900px;
          margin: 2rem auto;
          background: white;
          padding: 3rem;
          border-radius: 16px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.05);
        }
        .detail-container {
          display: flex;
          gap: 4rem;
        }
        .detail-image {
          flex: 1;
          max-width: 320px;
        }
        .no-image-large {
          height: 450px;
          background: #f8f9fa;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 5rem;
          border-radius: 12px;
          border: 1px solid #eee;
        }
        .detail-image img {
          width: 100%;
          border-radius: 12px;
          box-shadow: 0 4px 15px rgba(0,0,0,0.1);
        }
        .detail-info {
          flex: 1.5;
          display: flex;
          flex-direction: column;
        }
        .info-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 1.5rem;
        }
        .genre-label {
          background: #e7f5ff;
          color: #228be6;
          padding: 0.4rem 1rem;
          border-radius: 20px;
          font-weight: bold;
          font-size: 0.9rem;
        }
        .like-btn-large {
          background: none;
          border: none;
          font-size: 2.2rem;
          cursor: pointer;
          filter: drop-shadow(0 2px 4px rgba(0,0,0,0.1));
        }
        .detail-title {
          margin: 0 0 1rem;
          font-size: 2.5rem;
          color: #212529;
          line-height: 1.2;
        }
        .detail-author {
          font-size: 1.2rem;
          color: #495057;
          margin-bottom: 0.5rem;
        }
        .detail-meta {
          font-size: 0.9rem;
          color: #adb5bd;
          margin-bottom: 2rem;
          padding-bottom: 1.5rem;
          border-bottom: 1px solid #f1f3f5;
        }
        .detail-content {
          margin-bottom: 3rem;
          line-height: 1.8;
          color: #495057;
          flex-grow: 1;
        }
        .detail-content h3 {
          margin-bottom: 1rem;
          color: #212529;
        }
        .detail-actions {
          display: flex;
          gap: 1rem;
          margin-top: auto;
        }
        .detail-actions button, .detail-actions a {
          padding: 1rem 1.5rem;
          border-radius: 8px;
          text-decoration: none;
          font-weight: bold;
          cursor: pointer;
          border: none;
          transition: all 0.2s;
          text-align: center;
        }
        .btn-edit { background: #007bff; color: white; flex: 1; }
        .btn-edit:hover { background: #0056b3; }
        .btn-delete { background: #fa5252; color: white; flex: 1; }
        .btn-delete:hover { background: #e03131; }
        .btn-back { background: #e9ecef; color: #495057; flex: 1; }
        .btn-back:hover { background: #ced4da; }
      `}} />
    </motion.div>
  );
};

export default BookDetail;
