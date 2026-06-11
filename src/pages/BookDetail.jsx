import { useState, useEffect } from "react";
import {
  useParams,
  useNavigate,
  Link,
} from "react-router-dom";
import { getBook, updateBook, deleteBook, generateCover } from "@/api/books";
import { buildPrompt } from "@/api/imageGen";
import { fmtDate } from "@/utils/bookUtils";
import Button from "@/components/ui/Button";
import StateMessage from "@/components/ui/StateMessage";
import Page from "@/components/ui/Page";
import BookCover from "@/components/book/BookCover";
import GenreBadge from "@/components/book/GenreBadge";

export default function BookDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [book, setBook] = useState(null);
  const [error, setError] = useState(null);
  const [busy, setBusy] = useState(false);

  // AI 표지 생성
  const [aiOpen, setAiOpen] = useState(false);
  const [apiKey, setApiKey] = useState(
    () => localStorage.getItem("openai_key") || "",
  );
  const [quality, setQuality] = useState("medium");
  const [generating, setGenerating] = useState(false);
  const [preview, setPreview] = useState("");
  const [aiError, setAiError] = useState(null);

  useEffect(() => {
    getBook(id)
      .then((b) => {
        setBook(b);
        setError(null);
      })
      .catch((e) => setError(e.message));
  }, [id]);

  async function toggleLike() {
    setBusy(true);
    try {
      const updated = await updateBook(id, {
        isLiked: !book.isLiked,
        updatedAt: new Date().toISOString(),
      });
      setBook(updated);
    } catch (e) {
      alert(e.message);
    } finally {
      setBusy(false);
    }
  }

  async function handleDelete() {
    if (!window.confirm(`'${book.title}'을(를) 삭제할까요?`)) return;
    setBusy(true);
    try {
      await deleteBook(id);
      navigate("/books");
    } catch (e) {
      alert(e.message);
      setBusy(false);
    }
  }

  async function handleGenerate() {
    if (!apiKey.trim()) {
      setAiError("OpenAI API Key를 입력해 주세요.");
      return;
    }
    localStorage.setItem("openai_key", apiKey.trim());
    setGenerating(true);
    setAiError(null);
    setPreview("");
    try {
      const dataUrl = await generateCover({
        apiKey: apiKey.trim(),
        prompt: buildPrompt(book),
        quality,
      });
      setPreview(dataUrl);
    } catch (e) {
      setAiError(e.message);
    } finally {
      setGenerating(false);
    }
  }

  async function saveCover() {
    setBusy(true);
    try {
      const updated = await updateBook(id, {
        coverImageUrl: preview,
        updatedAt: new Date().toISOString(),
      });
      setBook(updated);
      setPreview("");
      setAiOpen(false);
    } catch (e) {
      alert(e.message);
    } finally {
      setBusy(false);
    }
  }

  if (error) {
    return (
      <Page>
        <Link to='/books' className='detail-back'>
          ← 목록으로
        </Link>
        <StateMessage status='server-error' />
      </Page>
    );
  }
  if (!book) {
    return (
      <Page>
        <StateMessage status='loading' />
      </Page>
    );
  }

  return (
    <Page>
      <Link to='/books' className='detail-back'>
        ← 목록으로
      </Link>

      <div className='detail-card'>
        <BookCover book={book} variant='detail' />

        <div className='detail-body'>
          <GenreBadge code={book.genreCode} variant='detail' />
          <h2>{book.title}</h2>
          <p className='detail-author'>✍️ {book.author}</p>
          <p className='detail-dates'>
            등록 {fmtDate(book.createdAt)} · 수정 {fmtDate(book.updatedAt)}
          </p>
          <div className='detail-content'>{book.content}</div>

          <div className='detail-actions'>
            <Button variant='ai' onClick={() => setAiOpen((v) => !v)}>
              ✨ AI 표지 생성
            </Button>
            <Button
              variant='like'
              active={book.isLiked}
              onClick={toggleLike}
              disabled={busy}>
              {book.isLiked ? "❤️ 책장에 담김" : "🤍 책장 담기"}
            </Button>
            <Button variant='ghost' to={`/books/${id}/edit`}>
              ✏️ 수정
            </Button>
            <Button variant='danger' onClick={handleDelete} disabled={busy}>
              🗑️ 삭제
            </Button>
          </div>

          {aiOpen && (
            <div className='ai-panel'>
              <h4>✨ AI 표지 생성</h4>
              <p className='ai-notice'>⚠ 표지 생성 시 OpenAI API 비용이 발생합니다. 생성 전 확인해 주세요.</p>
              <div className='ai-row'>
                <label>OpenAI API Key</label>
                <input
                  className='ai-input'
                  type='password'
                  placeholder='sk-…'
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                />
              </div>
              <div className='ai-row'>
                <label>이미지 품질</label>
                <select
                  className='ai-input'
                  value={quality}
                  onChange={(e) => setQuality(e.target.value)}>
                  <option value='low'>low — 빠름</option>
                  <option value='medium'>medium — 권장</option>
                  <option value='high'>high — 고품질</option>
                </select>
              </div>
              <Button
                variant='ai'
                onClick={handleGenerate}
                disabled={generating}>
                {generating ? "🎨 생성 중…" : "🎨 표지 생성하기"}
              </Button>
              {generating && (
                <p className='ai-spinner'>
                  이미지를 그리고 있어요. 최대 1분 정도 걸려요…
                </p>
              )}
              {aiError && <p className='ai-error'>⚠ {aiError}</p>}
              {preview && (
                <div className='ai-preview'>
                  <img src={preview} alt='생성된 표지 미리보기' />
                  <div className='ai-preview-actions'>
                    <Button variant='wood' onClick={saveCover} disabled={busy}>
                      💾 이 표지로 저장
                    </Button>
                    <Button
                      variant='ghost'
                      onClick={handleGenerate}
                      disabled={generating}>
                      🔄 다시 생성
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </Page>
  );
}
