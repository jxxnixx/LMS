import { useState, useEffect, useCallback, useMemo, Fragment } from "react";
import { motion } from "framer-motion";
import { getGenres } from "../api/genres";
import { getBooks } from "../api/books";
import { themeOf } from "../theme";

// ── 3D 복도 상수 ──
const SEG = 620; // 한 구간 깊이
const HALF_W = 500; // 복도 반폭 (중앙 ~ 벽)
const PANEL_H = 500; // 책장 높이
const FRAME = 16; // 책장 나무 프레임 두께
const ROWS = 4; // 책장 한 칸당 단(소분류) 수
const ROW_H = (PANEL_H - FRAME * 2) / ROWS;
const PLANK = 14;
const BOOK_AREA = ROW_H - PLANK;
const SIGN_W = 188;
const SIGN_H = 64;

const GAP = 3; // 책 사이 간격
const ROW_FILL = SEG - FRAME * 2 - 24; // 한 단에서 책이 차지할 수 있는 최대 가로 폭

// 실제 책 데이터로 책등 크기 결정 (결정론적·정돈된 변주)
function spineSize(book) {
  const titleLen = [...book.title].length;
  const w = Math.min(76, Math.max(46, Math.round(40 + titleLen * 2.4)));
  const hFrac = 0.8 + ((book.id * 7) % 19) / 100;
  return { w, h: Math.round(BOOK_AREA * hFrac) };
}

// 책이 한 단을 다 못 채우면 반복 배치해 채우되, 칸(프레임)을 넘지 않게
function fillRow(books) {
  if (!books.length) return [];
  const sized = books.map((b) => {
    const { w, h } = spineSize(b);
    return { book: b, w, h };
  });
  const out = [];
  let used = 0;
  let i = 0;
  let misses = 0;
  while (out.length < 240) {
    const s = sized[i % sized.length];
    const gap = out.length ? GAP : 0;
    if (used + gap + s.w > ROW_FILL) {
      // 이 책은 안 들어감 — 다음 책으로 시도, 한 바퀴 다 안 맞으면 종료
      if (++misses >= sized.length) break;
      i++;
      continue;
    }
    misses = 0;
    out.push({ ...s, key: `${s.book.id}#${out.length}` });
    used += gap + s.w;
    i++;
  }
  return out;
}

// ── 한 단(소분류) — 줄 단위로 개별 hover/클릭 ──
function ShelfRow({ sub, books, palette, onOpen }) {
  const [hover, setHover] = useState(false);
  const active = !!sub;
  const spines = active ? fillRow(books) : [];

  return (
    <div className='bc-row'>
      <div
        className={`bc-space ${hover ? "on" : ""} ${active ? "" : "is-empty"}`}
        onMouseEnter={() => active && setHover(true)}
        onMouseLeave={() => setHover(false)}
        onClick={() => active && onOpen(sub)}>
        {active && <span className='bc-rowtag'>{sub.label}</span>}
        <div className='bc-books'>
          {spines.map((s, i) => (
            <div
              key={s.key}
              className='bc-spine'
              style={{
                width: s.w,
                height: s.h,
                background: palette[i % palette.length],
              }}>
              <span className='bc-spine-title'>{s.book.title}</span>
            </div>
          ))}
        </div>
      </div>
      <div className='bc-plank' />
    </div>
  );
}

// ── 3D 책장 (대분류 1칸) ──
function Bookcase({ bookcase, booksByGenre, onOpenSub }) {
  const t = themeOf(bookcase.top.code);
  const rows = [];
  for (let r = 0; r < ROWS; r++) rows.push(bookcase.subs[r] || null);

  return (
    <div className='bookcase'>
      <div className='bc-back' />
      <div className='bc-side bc-side-l' />
      <div className='bc-side bc-side-r' />
      <div className='bc-side bc-side-t' />
      <div className='bc-side bc-side-b' />
      <div className='bc-shelves'>
        {rows.map((sub, r) => (
          <ShelfRow
            key={r}
            sub={sub}
            books={sub ? booksByGenre[sub.code] || [] : []}
            palette={t.spines}
            onOpen={onOpenSub}
          />
        ))}
      </div>
      <div className='bc-frame' />
    </div>
  );
}

function Panel({ bookcase, booksByGenre, side, segIndex, step, onOpenSub }) {
  if (!bookcase) return null;
  const z = -(segIndex * SEG + SEG / 2);
  // 카메라 중심을 지나가면 제거
  if (z + step * SEG > SEG * 0.5) return null;

  const x = side === "left" ? -HALF_W : HALF_W;
  const rotY = side === "left" ? 90 : -90;
  const t = themeOf(bookcase.top.code);
  const signLabel =
    bookcase.partCount > 1
      ? `${t.label} ${bookcase.part + 1}/${bookcase.partCount}`
      : t.label;

  return (
    <Fragment>
      {/* 책장 (벽면) */}
      <div
        className='panel'
        style={{
          width: SEG,
          height: PANEL_H,
          marginLeft: -SEG / 2,
          marginTop: -PANEL_H / 2,
          transform: `translateX(${x}px) translateZ(${z}px) rotateY(${rotY}deg)`,
        }}>
        <Bookcase
          bookcase={bookcase}
          booksByGenre={booksByGenre}
          onOpenSub={onOpenSub}
        />
      </div>

      {/* 책장 위 대분류 표지판 — 현재 칸만 표시 (먼 표지판 뭉침 방지) */}
      {segIndex === step && (
        <div
          className='shelf-sign'
          style={{
            width: SIGN_W,
            height: SIGN_H,
            marginLeft: -SIGN_W / 2,
            marginTop: -SIGN_H / 2,
            transform: `translateX(${x}px) translateY(${-(PANEL_H / 2) - SIGN_H / 2 - 12}px) translateZ(${z}px)`,
          }}>
          <span className='sign-code' style={{ color: t.color }}>
            {bookcase.top.code}
          </span>
          <span className='sign-label'>{signLabel}</span>
        </div>
      )}
    </Fragment>
  );
}

export default function CorridorView({ onOpenShelf }) {
  const [genres, setGenres] = useState(null);
  const [books, setBooks] = useState(null);
  const [error, setError] = useState(null);
  const [step, setStep] = useState(0);

  useEffect(() => {
    Promise.all([getGenres(), getBooks()])
      .then(([g, b]) => {
        setGenres(g);
        setBooks(b);
      })
      .catch((e) => setError(e.message));
  }, []);

  // 소분류 코드별 책 묶음
  const booksByGenre = useMemo(() => {
    const m = {};
    for (const b of books || []) (m[b.genreCode] ||= []).push(b);
    for (const k in m) m[k].sort((a, b) => a.id - b.id);
    return m;
  }, [books]);

  // 대분류 1개 = 책장 1칸, 소분류 5개 이상이면 4단씩 나눠 책장 여러 칸
  const bookcases = useMemo(() => {
    if (!genres) return [];
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
  }, [genres]);

  // 같은 대분류의 책장(분할된 칸)은 한쪽 벽에 나란히 — 마주보지 않게
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
  const maxStep = Math.max(0, segments.length - 1);
  // const corridorLen = segments.length * SEG;

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
          {/* <div
            className='corridor-floor'
            style={{
              width: HALF_W * 2,
              height: corridorLen,
              marginLeft: -HALF_W,
            }}
          /> */}
          {/* <div
            className='corridor-ceiling'
            style={{
              width: HALF_W * 2,
              height: corridorLen,
              marginLeft: -HALF_W,
            }}
          /> */}
          {/* <div
            className='corridor-end'
            style={{ transform: `translateZ(${-corridorLen}px)` }}
          /> */}
          {segments.map((seg, i) => (
            <Fragment key={i}>
              <Panel
                bookcase={seg.left}
                booksByGenre={booksByGenre}
                side='left'
                segIndex={i}
                step={step}
                onOpenSub={onOpenShelf}
              />
              <Panel
                bookcase={seg.right}
                booksByGenre={booksByGenre}
                side='right'
                segIndex={i}
                step={step}
                onOpenSub={onOpenShelf}
              />
            </Fragment>
          ))}
        </motion.div>

        {error && (
          <div className='scene-msg'>
            json-server가 실행되어 있지 않아요.
            <br />
            <code>npm run server</code> 실행 후 새로고침하세요.
          </div>
        )}
        {!genres && !error && <div className='scene-msg'>불러오는 중…</div>}
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
    </motion.div>
  );
}
