import { useState, useEffect, useCallback, useMemo, useRef, Fragment } from "react";
import { getBooks } from "@/api/books";
import { useGenres } from "@/context/GenreContext";
import { Panel } from "@/components/Panel";
import { SEG, CARPET_W, ROWS } from "@/constants/corridor";

export default function CorridorView({ onOpenShelf, hidden = false }) {
  const { genres, ready } = useGenres();
  const [books, setBooks] = useState(null);
  const [error, setError] = useState(null);
  const [step, setStep] = useState(0);

  useEffect(() => {
    getBooks()
      .then(setBooks)
      .catch((e) => setError(e.message));
  }, []);

  const booksByGenre = useMemo(() => {
    const m = {};
    for (const b of books || []) (m[b.genreCode] ||= []).push(b);
    for (const k in m) m[k].sort((a, b) => a.id - b.id);
    return m;
  }, [books]);

  const bookcases = useMemo(() => {
    if (!ready) return [];
    const tops = genres.filter((g) => !g.parentCode);
    const out = [];
    for (const top of tops) {
      const subs = genres.filter((g) => g.parentCode === top.code);
      const partCount = Math.max(1, Math.ceil(subs.length / ROWS));
      for (let p = 0; p < partCount; p++) {
        out.push({
          top,
          subs: subs.slice(p * ROWS, p * ROWS + ROWS),
          part: p,
          partCount,
        });
      }
    }
    return out;
  }, [genres, ready]);

  const segments = useMemo(() => {
    const groups = [];
    for (const bc of bookcases) {
      const last = groups[groups.length - 1];
      if (last && last[0].top.code === bc.top.code) last.push(bc);
      else groups.push([bc]);
    }
    const left = [];
    const right = [];
    for (const g of groups) {
      const target = left.length <= right.length ? left : right;
      target.push(...g);
    }
    const n = Math.max(left.length, right.length);
    return Array.from({ length: n }, (_, i) => ({
      left: left[i] || null,
      right: right[i] || null,
    }));
  }, [bookcases]);

  const maxStep = Math.max(0, segments.length - 1);
  const totalCorridorLen = Math.max(segments.length, 1) * SEG;

  const forward = useCallback(
    () => setStep((s) => Math.min(maxStep, s + 1)),
    [maxStep],
  );
  const back = useCallback(() => setStep((s) => Math.max(0, s - 1)), []);

  const maxStepRef = useRef(maxStep);
  useEffect(() => {
    maxStepRef.current = maxStep;
  }, [maxStep]);
  useEffect(() => {
    const onKey = (e) => {
      if (["ArrowUp", "w", "W"].includes(e.key)) {
        setStep((s) => Math.min(maxStepRef.current, s + 1));
      } else if (["ArrowDown", "s", "S"].includes(e.key)) {
        setStep((s) => Math.max(0, s - 1));
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className={`corridor-root${hidden ? ' is-hidden' : ''}`}>
      <div className='scene'>
        {/* CSS transition으로 GPU 애니메이션 — Framer Motion JS 루프 대신 */}
        <div
          className='world'
          style={{ transform: `translateZ(${step * SEG}px)` }}>
          <div
            className='corridor-floor'
            style={{
              width: 2400,
              height: totalCorridorLen + 1008,
              marginLeft: -1200,
              top: -totalCorridorLen,
              transformOrigin: `50% ${totalCorridorLen}px`,
              "--carpet-w": `${CARPET_W}px`,
            }}
          />

          {segments.map((seg, i) => (
            <Fragment key={i}>
              <Panel
                bookcase={seg.left}
                booksByGenre={booksByGenre}
                side='left'
                segIndex={i}
                onOpenSub={onOpenShelf}
              />
              <Panel
                bookcase={seg.right}
                booksByGenre={booksByGenre}
                side='right'
                segIndex={i}
                onOpenSub={onOpenShelf}
              />
            </Fragment>
          ))}

        </div>

        {error && (
          <div className='scene-msg'>
            json-server가 실행되어 있지 않아요.
            <br />
            <code>npm run server</code> 실행 후 새로고침하세요.
          </div>
        )}
        {!ready && !error && <div className='scene-msg'>불러오는 중…</div>}
      </div>

      <div className='corridor-nav'>
        <button className='nav-arrow' onClick={back} disabled={step === 0}>
          ◀
        </button>
        <div className='nav-dots'>
          {segments.map((_, i) => (
            <button
              key={i}
              className={`nav-dot ${i === step ? "on" : ""}`}
              onClick={() => setStep(i)}
            />
          ))}
        </div>
        <button
          className='nav-arrow'
          onClick={forward}
          disabled={step === maxStep}>
          ▶
        </button>
      </div>
      <p className='nav-hint'>W / S · ↑ / ↓ · 또는 화살표 버튼으로 앞뒤 이동</p>
    </div>
  );
}
