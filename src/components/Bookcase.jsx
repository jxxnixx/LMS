import { useState } from "react";
import { useGenres } from "../context/GenreContext";
import { ROWS } from "../constants/corridor";
import { fillRow } from "../utils/bookUtils";

// ── 한 단(소분류) ──
function ShelfRow({ sub, books, palette, onOpen, setActiveTip }) {
  const [hover, setHover] = useState(false);
  const active = !!sub;
  const spines = active ? fillRow(books) : [];

  const moveTip = (e) => {
    if (!active) return;
    setActiveTip({ label: sub.label, x: e.clientX, y: e.clientY });
  };

  return (
    <div className='bc-row'>
      <div
        className={`bc-space ${hover ? "on" : ""} ${active ? "" : "is-empty"}`}
        onMouseEnter={(e) => {
          if (!active) return;
          setHover(true);
          moveTip(e);
        }}
        onMouseLeave={() => {
          setHover(false);
          setActiveTip(null);
        }}
        onMouseMove={moveTip}
        onClick={() => active && onOpen(sub)}>
        <div className='bc-books'>
          {spines.map((s, i) => (
            <div
              key={s.key}
              className='bc-spine'
              style={{
                width: s.w,
                height: s.h,
                background: palette[i % palette.length],
                filter: `brightness(${s.shade})`,
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

// ── 3D 책장 (실제 데이터) ──
export default function Bookcase({
  bookcase,
  booksByGenre,
  onOpenSub,
  setActiveTip,
}) {
  const { themeFor } = useGenres();
  const t = themeFor(bookcase.top.code);
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
            setActiveTip={setActiveTip}
          />
        ))}
      </div>
      <div className='bc-frame' />
    </div>
  );
}
