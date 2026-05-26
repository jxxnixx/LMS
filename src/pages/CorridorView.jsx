import { useState, useEffect, useCallback, useMemo, Fragment } from "react";
import { motion } from "framer-motion";
import { getBooks } from "../api/books"; // 경로 확인 필요
import { useGenres } from "../context/GenreContext"; // 경로 확인 필요
import { Panel, DummyPanel } from "../components/Panel";
import { SEG, CARPET_W, ROWS } from "../constants/corridor";

export default function CorridorView({ onOpenShelf }) {
  const { genres, ready } = useGenres();
  const [books, setBooks] = useState(null);
  const [error, setError] = useState(null);
  const [step, setStep] = useState(0);
  const [activeTip, setActiveTip] = useState(null);

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
    const rows = [];
    const n = Math.max(left.length, right.length);
    for (let i = 0; i < n; i++) {
      rows.push({ left: left[i] || null, right: right[i] || null });
    }
    return rows;
  }, [bookcases]);

  const DUMMY_COUNT = 14;
  const totalSegments = segments.length + DUMMY_COUNT;
  const maxStep = Math.max(0, segments.length - 1);
  const totalCorridorLen = Math.max(totalSegments, 1) * SEG;

  const distance = totalSegments - step;
  const fogScale = totalSegments / distance;
  const baseStart = 5;
  const baseEnd = 13;
  const fogStart = baseStart * fogScale;
  const fogEnd = baseEnd * fogScale;

  const forward = useCallback(
    () => setStep((s) => Math.min(maxStep, s + 1)),
    [maxStep],
  );
  const back = useCallback(() => setStep((s) => Math.max(0, s - 1)), []);

  useEffect(() => {
    const onKey = (e) => {
      if (["ArrowUp", "w", "W"].includes(e.key)) forward();
      if (["ArrowDown", "s", "S"].includes(e.key)) back();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [forward, back]);

  return (
    <motion.div
      className='corridor-root'
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}>
      <div className='scene'>
        <motion.div
          className='world'
          animate={{ z: step * SEG }}
          transition={{ type: "spring", stiffness: 58, damping: 17, mass: 1 }}>
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
                setActiveTip={setActiveTip}
              />
              <Panel
                bookcase={seg.right}
                booksByGenre={booksByGenre}
                side='right'
                segIndex={i}
                onOpenSub={onOpenShelf}
                setActiveTip={setActiveTip}
              />
            </Fragment>
          ))}

          {[...Array(DUMMY_COUNT)].map((_, i) => {
            const dummyIndex = segments.length + i;
            return (
              <Fragment key={`dummy-${i}`}>
                <DummyPanel side='left' segIndex={dummyIndex} />
                <DummyPanel side='right' segIndex={dummyIndex} />
              </Fragment>
            );
          })}
        </motion.div>

        {error && (
          <div className='scene-msg'>
            json-server가 실행되어 있지 않아요.
            <br />
            <code>npm run server</code> 실행 후 새로고침하세요.
          </div>
        )}
        {!ready && !error && <div className='scene-msg'>불러오는 중…</div>}
      </div>

      {activeTip && (
        <span
          className='bc-tip'
          style={{ left: activeTip.x, top: activeTip.y }}>
          {activeTip.label}
        </span>
      )}

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
    </motion.div>
  );
}
