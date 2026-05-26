import { useState, useEffect, useRef } from 'react';
import { getBooks, updateBook } from '../api/books';
import { getGenres, findGenreLabel } from '../api/genres';
import { generateCoverImage } from '../api/imageGen';

export default function ImageGenAdmin() {
  const [books, setBooks] = useState([]);
  const [genres, setGenres] = useState([]);
  const [quality, setQuality] = useState('medium');
  const [running, setRunning] = useState(false);
  const [current, setCurrent] = useState(null);
  const [log, setLog] = useState([]);
  const stopRef = useRef(false);
  const logEndRef = useRef(null);

  useEffect(() => {
    Promise.all([getBooks(), getGenres()]).then(([b, g]) => {
      setBooks(b);
      setGenres(g);
    });
  }, []);

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [log]);

  function addLog(msg, type = 'info') {
    setLog((prev) => [...prev, { msg, type, time: new Date().toLocaleTimeString() }]);
  }

  // 브라우저 단건 생성 (base64 data URL → db.json 저장)
  async function handleGenOne(book) {
    setCurrent(book.id);
    addLog(`"${book.title}" 생성 중...`);
    try {
      const dataUrl = await generateCoverImage(book, quality);
      const updated = await updateBook(book.id, { ...book, coverImageUrl: dataUrl });
      setBooks((prev) => prev.map((b) => (b.id === book.id ? updated : b)));
      addLog(`✓ "${book.title}" 완료`, 'success');
    } catch (err) {
      addLog(`✗ "${book.title}" 실패: ${err.message}`, 'error');
    } finally {
      setCurrent(null);
    }
  }

  // 브라우저 전체 순차 생성
  async function handleGenAll() {
    stopRef.current = false;
    setRunning(true);
    setLog([]);

    const targets = books.filter((b) => !b.coverImageUrl);
    addLog(`미생성 ${targets.length}권 순차 생성 시작`);

    for (let i = 0; i < targets.length; i++) {
      if (stopRef.current) { addLog('중단됨', 'warn'); break; }

      const book = targets[i];
      setCurrent(book.id);
      addLog(`[${i + 1}/${targets.length}] "${book.title}" 생성 중...`);

      try {
        const dataUrl = await generateCoverImage(book, quality);
        const updated = await updateBook(book.id, { ...book, coverImageUrl: dataUrl });
        setBooks((prev) => prev.map((b) => (b.id === book.id ? updated : b)));
        addLog(`✓ "${book.title}" 완료`, 'success');
      } catch (err) {
        addLog(`✗ "${book.title}" 실패: ${err.message}`, 'error');
      }

      if (i < targets.length - 1 && !stopRef.current) {
        addLog('5초 대기...');
        await new Promise((r) => setTimeout(r, 5000));
      }
    }

    setCurrent(null);
    setRunning(false);
    addLog('완료!', 'success');
  }

  const hasCover = books.filter((b) => b.coverImageUrl).length;
  const noCover = books.length - hasCover;
  const progress = books.length ? Math.round((hasCover / books.length) * 100) : 0;

  return (
    <div className="admin-page">
      <h2>AI 표지 이미지 생성</h2>

      <div className="admin-tip">
        <strong>💡 51권 전체 생성 권장 방법:</strong> 터미널에서{' '}
        <code>npm run gen-covers</code> 실행 → <code>public/covers/</code>에 PNG 저장됨
      </div>

      <div className="admin-summary">
        <span>전체 {books.length}권</span>
        <span>완료 {hasCover}권</span>
        <span>미생성 {noCover}권</span>
      </div>

      <div className="progress-bar">
        <div className="progress-fill" style={{ width: `${progress}%` }} />
        <span>{progress}%</span>
      </div>

      <div className="admin-controls">
        <select
          value={quality}
          onChange={(e) => setQuality(e.target.value)}
          disabled={running}
          style={{ height: 36, padding: '0 10px', borderRadius: 7, border: '1px solid #d4d4d8', fontSize: 13 }}
        >
          <option value="low">저품질 (빠름, 저비용)</option>
          <option value="medium">중품질 (권장)</option>
          <option value="high">고품질 (느림, 고비용)</option>
        </select>
        <button onClick={handleGenAll} disabled={running || noCover === 0}>
          {running ? '생성 중...' : `미생성 ${noCover}권 생성`}
        </button>
        {running && (
          <button onClick={() => { stopRef.current = true; }}>중단</button>
        )}
      </div>
      <p style={{ fontSize: 12, color: '#999', margin: 0 }}>
        터미널 bulk 생성: <code>npm run gen-covers</code> · <code>npm run gen-covers:force -- --quality=high</code>
      </p>

      {log.length > 0 && (
        <div className="admin-log">
          {log.map((entry, i) => (
            <div key={i} className={`log-line log-${entry.type}`}>
              <span className="log-time">{entry.time}</span> {entry.msg}
            </div>
          ))}
          <div ref={logEndRef} />
        </div>
      )}

      <div className="book-gen-grid">
        {books.map((book) => (
          <div key={book.id} className={`gen-card ${current === book.id ? 'gen-card--active' : ''}`}>
            <div className="gen-cover">
              {book.coverImageUrl ? (
                <img src={book.coverImageUrl} alt={book.title} />
              ) : current === book.id ? (
                <div className="gen-spinner">생성 중...</div>
              ) : (
                <div className="gen-placeholder">미생성</div>
              )}
            </div>
            <div className="gen-info">
              <p className="gen-title">{book.title}</p>
              <p className="gen-genre">{findGenreLabel(genres, book.genreCode)}</p>
              <button
                onClick={() => handleGenOne(book)}
                disabled={running || current === book.id}
              >
                {book.coverImageUrl ? '재생성' : '생성'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
