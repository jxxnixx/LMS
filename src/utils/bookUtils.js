import { BOOK_AREA, GAP, ROW_FILL } from "@/constants/corridor";

// 'YYYY-MM-DDT…' → 'YYYY.MM.DD'. 값이 없으면 fallback.
export const fmtDate = (s, fallback = "") =>
  s ? s.slice(0, 10).replace(/-/g, ".") : fallback;

// filter: brightness() 대신 사용 — GPU 컴포지팅 레이어 생성 방지
export function applyShade(hex, shade) {
  const n = parseInt(hex.slice(1), 16);
  const r = Math.min(255, Math.round(((n >> 16) & 0xff) * shade));
  const g = Math.min(255, Math.round(((n >> 8) & 0xff) * shade));
  const b = Math.min(255, Math.round((n & 0xff) * shade));
  return `rgb(${r},${g},${b})`;
}

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
