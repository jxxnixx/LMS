import React, { useEffect, useState } from 'react';
import { getGenres } from '../api/genres';

const GenreSelect = ({ value, onChange, isFilter = false }) => {
  const [genres, setGenres] = useState([]);

  useEffect(() => {
    getGenres().then(setGenres).catch(console.error);
  }, []);

  // 계층 구조를 단순화하여 표시 (예: 소설 > 로맨스)
  const renderOptions = () => {
    const mainGenres = genres.filter(g => !g.parentCode);
    
    return mainGenres.map(main => {
      const subGenres = genres.filter(g => g.parentCode === main.code);
      return (
        <React.Fragment key={main.code}>
          <option value={main.code}>{main.label}</option>
          {subGenres.map(sub => (
            <option key={sub.code} value={sub.code}>
              &nbsp;&nbsp;ㄴ {sub.label}
            </option>
          ))}
        </React.Fragment>
      );
    });
  };

  return (
    <div className="genre-select-container">
      <select 
        value={value} 
        onChange={(e) => onChange(e.target.value)}
        className="genre-select"
      >
        {isFilter && <option value="">전체 장르</option>}
        {!isFilter && <option value="" disabled>장르를 선택하세요</option>}
        {renderOptions()}
      </select>

      <style dangerouslySetInnerHTML={{ __html: `
        .genre-select-container {
          margin-bottom: 1rem;
        }
        .genre-select {
          width: 100%;
          padding: 0.6rem;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 1rem;
          outline: none;
        }
        .genre-select:focus {
          border-color: #007bff;
        }
      `}} />
    </div>
  );
};

export default GenreSelect;
