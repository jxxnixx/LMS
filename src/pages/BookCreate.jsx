import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { createBook, generateBookCover } from '../api/books'; // 공용 메소드 사용
import GenreSelect from '../components/GenreSelect';

const BookCreate = () => {
  const navigate = useNavigate();
  const [isGenerating, setIsGenerating] = useState(false);
  const [formData, setFormData] = useState({
    title: '', author: '', content: '', genreCode: '', coverImageUrl: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleGenerateAIImage = async () => {
    if (!formData.title || !formData.content) {
      alert('제목과 책 소개를 먼저 입력해주세요.');
      return;
    }

    setIsGenerating(true);
    try {
      const imageUrl = await generateBookCover(formData.title, formData.content);
      setFormData(prev => ({ 
        ...prev, 
        coverImageUrl: imageUrl 
      }));
      alert('입력하신 내용을 바탕으로 AI 표지가 생성되었습니다!');
    } catch (error) {
      alert(`이미지 생성 실패: ${error.message}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.genreCode) { alert('장르를 선택해주세요.'); return; }
    try {
      await createBook(formData);
      alert('도서가 등록되었습니다.');
      navigate('/');
    } catch (error) { alert('등록에 실패했습니다.'); }
  };

  return (
    <motion.div className="form-page" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <div className="form-header">
        <h2>새 도서 등록</h2>
        <p>새로운 도서 정보를 입력하고 AI 표지를 생성해보세요.</p>
      </div>
      <form onSubmit={handleSubmit} className="book-form">
        <div className="form-group">
          <label>제목</label>
          <input name="title" value={formData.title} onChange={handleChange} required placeholder="제목을 입력하세요" />
        </div>
        <div className="form-group">
          <label>저자</label>
          <input name="author" value={formData.author} onChange={handleChange} required placeholder="저자명을 입력하세요" />
        </div>
        <div className="form-group">
          <label>장르</label>
          <GenreSelect value={formData.genreCode} onChange={(val) => setFormData(prev => ({ ...prev, genreCode: val }))} />
        </div>
        <div className="form-group">
          <label>책 소개</label>
          <textarea name="content" value={formData.content} onChange={handleChange} required rows="6" placeholder="소개글을 입력하세요" />
        </div>
        <div className="form-group">
          <label>표지 이미지</label>
          <div className="ai-gen-container">
            <input name="coverImageUrl" value={formData.coverImageUrl} onChange={handleChange} placeholder="이미지 URL" style={{ flex: 1 }} />
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
          <button type="submit" className="btn-submit" disabled={isGenerating}>등록하기</button>
          <button type="button" onClick={() => navigate(-1)} className="btn-cancel">취소</button>
        </div>
      </form>
      <style dangerouslySetInnerHTML={{ __html: `
        .form-page { max-width: 700px; margin: 2rem auto; background: white; padding: 3rem; border-radius: 16px; box-shadow: 0 10px 30px rgba(0,0,0,0.05); }
        .form-header { margin-bottom: 2rem; text-align: center; }
        .form-header h2 { color: #333; }
        .form-group { display: flex; flex-direction: column; gap: 0.6rem; margin-bottom: 1.5rem; }
        .form-group label { font-weight: 600; color: #444; }
        .form-group input, .form-group textarea { padding: 1rem; border: 1px solid #ddd; border-radius: 8px; font-size: 1rem; background: #fff; color: #000 !important; }
        .ai-gen-container { display: flex; gap: 1rem; }
        .btn-ai-gen { background: #6741d9; color: white; border: none; padding: 0 1.5rem; border-radius: 8px; font-weight: bold; cursor: pointer; }
        .image-preview { margin-top: 1rem; max-width: 200px; border-radius: 8px; overflow: hidden; }
        .image-preview img { width: 100%; }
        .form-actions { display: flex; gap: 1rem; margin-top: 1.5rem; }
        .btn-submit { flex: 2; background: #007bff; color: white; padding: 1.2rem; border: none; border-radius: 8px; font-weight: bold; cursor: pointer; }
        .btn-cancel { flex: 1; background: #eee; color: #333; padding: 1.2rem; border: none; border-radius: 8px; font-weight: bold; cursor: pointer; }
      `}} />
    </motion.div>
  );
};

export default BookCreate;
