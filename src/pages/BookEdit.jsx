import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { getBookById, updateBook, generateBookCover } from '../api/books';
import GenreSelect from '../components/GenreSelect';
import LoadingSpinner from '../components/LoadingSpinner';

const BookEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  
  // DB에서 가져온 원본 데이터를 보관할 상태
  const [dbData, setDbData] = useState(null);
  
  // 사용자가 수정 중인 데이터를 보관할 상태
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    content: '',
    genreCode: '',
    coverImageUrl: '',
    isLiked: false
  });

  useEffect(() => {
    const fetchBookData = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const data = await getBookById(id);
        const bookData = Array.isArray(data) ? data[0] : data;
        
        if (bookData) {
          // 원본 저장
          setDbData(bookData);
          
          // 폼 초기값 설정
          setFormData({
            title: bookData.title || '',
            author: bookData.author || '',
            content: bookData.content || '',
            genreCode: bookData.genreCode || '',
            coverImageUrl: bookData.coverImageUrl || '',
            isLiked: bookData.isLiked || false,
            id: bookData.id
          });
        }
      } catch (error) {
        console.error('데이터 불러오기 실패:', error);
        alert('도서 정보를 가져오지 못했습니다.');
        navigate('/');
      } finally {
        setLoading(false);
      }
    };
    fetchBookData();
  }, [id, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateBook(id, formData);
      alert('도서 정보가 수정되었습니다.');
      navigate(`/books/${id}`);
    } catch (error) {
      alert('수정에 실패했습니다.');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleGenerateAIImage = async () => {
    // 수정 메뉴에서는 DB에 저장된 정보를 우선 사용
    const targetTitle = dbData?.title || formData.title;
    const targetContent = dbData?.content || formData.content;

    if (!targetTitle || !targetContent) {
      alert('도서 정보가 부족하여 이미지를 생성할 수 없습니다.');
      return;
    }

    setIsGenerating(true);
    try {
      const imageUrl = await generateBookCover(targetTitle, targetContent);
      setFormData(prev => ({ 
        ...prev, 
        coverImageUrl: imageUrl 
      }));
      alert('DB 정보를 바탕으로 AI 표지가 생성되었습니다!');
    } catch (error) {
      alert(`이미지 생성 실패: ${error.message}`);
    } finally {
      setIsGenerating(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <motion.div 
      className="form-page"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="form-header">
        <h2>도서 정보 수정</h2>
        <p>기존 도서 정보를 수정합니다. (AI 표지는 저장된 정보를 바탕으로 생성됩니다)</p>
      </div>

      <form onSubmit={handleSubmit} className="book-form">
        <div className="form-group">
          <label>제목</label>
          <input name="title" value={formData.title} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label>저자</label>
          <input name="author" value={formData.author} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label>장르</label>
          <GenreSelect 
            value={formData.genreCode} 
            onChange={(val) => setFormData(prev => ({ ...prev, genreCode: val }))} 
          />
        </div>

        <div className="form-group">
          <label>책 소개</label>
          <textarea name="content" value={formData.content} onChange={handleChange} required rows="8" />
        </div>

        <div className="form-group">
          <label>표지 이미지</label>
          <div className="ai-gen-container">
            <input 
              name="coverImageUrl" 
              value={formData.coverImageUrl} 
              onChange={handleChange} 
              placeholder="이미지 URL"
              style={{ flex: 1 }}
            />
            <button type="button" className="btn-ai-gen" onClick={handleGenerateAIImage} disabled={isGenerating}>
              {isGenerating ? '생성 중...' : '✨ AI 생성'}
            </button>
          </div>
          <AnimatePresence>
            {formData.coverImageUrl && (
              <motion.div className="image-preview" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <img src={formData.coverImageUrl} alt="Preview" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn-submit" disabled={isGenerating}>저장하기</button>
          <button type="button" onClick={() => navigate(-1)} className="btn-cancel">취소</button>
        </div>
      </form>

      <style dangerouslySetInnerHTML={{ __html: `
        .form-page { max-width: 700px; margin: 2rem auto; background: white; padding: 3rem; border-radius: 16px; box-shadow: 0 10px 30px rgba(0,0,0,0.05); }
        .form-header { margin-bottom: 2rem; text-align: center; }
        .form-header h2 { color: #333; }
        .book-form { display: flex; flex-direction: column; gap: 1.5rem; }
        .form-group { display: flex; flex-direction: column; gap: 0.6rem; }
        .form-group label { font-weight: 600; color: #444; }
        
        /* 글자색 검은색 고정 */
        .form-group input, .form-group textarea { 
          padding: 1rem; 
          border: 1px solid #ddd; 
          border-radius: 8px; 
          font-size: 1rem; 
          background: #fff; 
          color: #000 !important; 
        }
        
        .ai-gen-container { display: flex; gap: 1rem; }
        .btn-ai-gen { background: #6741d9; color: white; border: none; padding: 0 1.5rem; border-radius: 8px; font-weight: bold; cursor: pointer; }
        .image-preview { margin-top: 1rem; max-width: 250px; border-radius: 8px; overflow: hidden; }
        .image-preview img { width: 100%; }
        .form-actions { display: flex; gap: 1rem; margin-top: 1.5rem; }
        .btn-submit { flex: 2; background: #40c057; color: white; padding: 1.2rem; border: none; border-radius: 8px; font-weight: bold; cursor: pointer; }
        .btn-cancel { flex: 1; background: #eee; color: #333; padding: 1.2rem; border: none; border-radius: 8px; font-weight: bold; cursor: pointer; }
      `}} />
    </motion.div>
  );
};

export default BookEdit;
