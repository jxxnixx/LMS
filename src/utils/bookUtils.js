import { BOOK_AREA, GAP, ROW_FILL, DUMMY_COLORS } from "../constants/corridor";

// ── ✨ 실제 책 크기 & 명암 결정 (들쭉날쭉하게!) ──
export function spineSize(book, index) {
  const titleLen = [...book.title].length;

  const seed = Math.abs(Math.sin(book.id * 1.23 + index * 4.56)) * 10000;
  const randomFrac = seed - Math.floor(seed);

  const w = Math.min(
    60,
    Math.max(38, Math.round(34 + titleLen * 2.8 + randomFrac * 20)),
  );

  const hFrac = 0.7 + randomFrac * 0.4;
  const shade = 0.7 + randomFrac * 0.5;

  return { w, h: Math.round(BOOK_AREA * hFrac), shade };
}

// ── 책장 채우기 로직 ──
export function fillRow(books) {
  if (!books.length) return [];
  const out = [];
  let used = 0;
  let i = 0;
  let misses = 0;

  while (out.length < 240) {
    const book = books[i % books.length];
    const { w, h, shade } = spineSize(book, out.length);
    const gap = out.length ? GAP : 0;

    if (used + gap + w > ROW_FILL) {
      if (++misses >= books.length) break;
      i++;
      continue;
    }

    misses = 0;
    out.push({ book, w, h, shade, key: `${book.id}#${out.length}` });
    used += gap + w;
    i++;
  }
  return out;
}

// ── 가짜 책장용 책등 더미 데이터 ──
export const DUMMY_SPINES = [];
let _dummyUsed = 0;
let _dummyI = 0;

while (_dummyUsed < ROW_FILL) {
  const w = 42 + ((_dummyI * 17) % 30);
  const hFrac = 0.7 + ((_dummyI * 11) % 30) / 100;
  const h = Math.round(BOOK_AREA * hFrac);
  if (_dummyUsed + GAP + w > ROW_FILL) break;
  DUMMY_SPINES.push({
    key: `dummy-spine-${_dummyI}`,
    w,
    h,
    bg: DUMMY_COLORS[_dummyI % DUMMY_COLORS.length],
  });
  _dummyUsed += w + GAP;
  _dummyI++;
}
