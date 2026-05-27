import { memo, useMemo } from "react";
import { useGenres } from "../context/GenreContext";
import { ROWS } from "../constants/corridor";
import { fillRow, applyShade } from "../utils/bookUtils";

const ShelfRow = memo(function ShelfRow({ sub, books, palette, side, onOpen }) {
  const active = !!sub;
  const spines = useMemo(() => (active ? fillRow(books) : []), [active, books]);

  return (
    <div className='bc-row'>
      <div
        className={`bc-space ${active ? "" : "is-empty"}`}
        onClick={() => active && onOpen(sub)}>
        {active && (
          <div className={`row-sign row-sign--${side}`}>{sub.label}</div>
        )}
        <div className='bc-books'>
          {spines.map((s, i) => (
            <div
              key={s.key}
              className='bc-spine'
              style={{
                width: s.w,
                height: s.h,
                background: applyShade(palette[i % palette.length], s.shade),
              }}>
              <span className='bc-spine-title'>{s.book.title}</span>
            </div>
          ))}
        </div>
      </div>
      <div className='bc-plank' />
    </div>
  );
});

const Bookcase = memo(function Bookcase({
  bookcase,
  booksByGenre,
  side,
  onOpenSub,
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
            side={side}
            books={sub ? booksByGenre[sub.code] || [] : []}
            palette={t.spines}
            onOpen={onOpenSub}
          />
        ))}
      </div>
      <div className='bc-frame' />
    </div>
  );
});

export default Bookcase;
