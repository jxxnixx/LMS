// 대분류 코드별 디자인 토큰 — label + 브랜드 컬러 하나만 의도적으로 지정한다.
// 책등 팔레트(spines)는 이 베이스 컬러에서 HSL 톤 변주로 자동 생성한다.
const GENRE_TOKENS = {
  NV: { label: '소설', color: '#6d4c8f' },
  PO: { label: '시', color: '#b14d72' },
  ES: { label: '에세이', color: '#c07f3a' },
  DI: { label: '일기', color: '#3f8a82' },
  HU: { label: '인문/교양', color: '#4a5a99' },
  SH: { label: '자기계발', color: '#4f8a5a' },
  EC: { label: '경제/경영', color: '#4b5b66' },
  HB: { label: '취미/실용', color: '#b06a4e' },
  CM: { label: '만화/웹툰', color: '#c0584e' },
}

const FALLBACK = { label: '', color: '#8a8a8a' }
const SPINE_COUNT = 5

const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v))

function hexToHsl(hex) {
  const m = hex.replace('#', '')
  const r = parseInt(m.slice(0, 2), 16) / 255
  const g = parseInt(m.slice(2, 4), 16) / 255
  const b = parseInt(m.slice(4, 6), 16) / 255
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  const d = max - min
  let h = 0
  if (d) {
    if (max === r) h = ((g - b) / d) % 6
    else if (max === g) h = (b - r) / d + 2
    else h = (r - g) / d + 4
    h = (h * 60 + 360) % 360
  }
  const l = (max + min) / 2
  const s = d ? d / (1 - Math.abs(2 * l - 1)) : 0
  return { h, s: s * 100, l: l * 100 }
}

function hslToHex(h, s, l) {
  h = ((h % 360) + 360) % 360
  s = clamp(s, 0, 100) / 100
  l = clamp(l, 0, 100) / 100
  const c = (1 - Math.abs(2 * l - 1)) * s
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1))
  const m = l - c / 2
  let r
  let g
  let b
  if (h < 60) [r, g, b] = [c, x, 0]
  else if (h < 120) [r, g, b] = [x, c, 0]
  else if (h < 180) [r, g, b] = [0, c, x]
  else if (h < 240) [r, g, b] = [0, x, c]
  else if (h < 300) [r, g, b] = [x, 0, c]
  else [r, g, b] = [c, 0, x]
  const hex = (v) =>
    Math.round((v + m) * 255)
      .toString(16)
      .padStart(2, '0')
  return `#${hex(r)}${hex(g)}${hex(b)}`
}

// 베이스 색에서 책등 톤 변주 n개 생성 (명도 중심, 채도·색상 미세 변주)
function makeSpines(hex, n = SPINE_COUNT) {
  const { h, s, l } = hexToHsl(hex)
  return Array.from({ length: n }, (_, i) => {
    const t = n === 1 ? 0 : i / (n - 1) - 0.5 // -0.5 .. 0.5
    return hslToHex(h + t * 10, s + t * 8, l + t * 26)
  })
}

// 장르당 1회 계산해 캐시
const themeCache = {}

export function themeOf(code) {
  const top = (code || '').split('-')[0]
  if (!themeCache[top]) {
    const token = GENRE_TOKENS[top] || FALLBACK
    themeCache[top] = {
      label: token.label,
      color: token.color,
      spines: makeSpines(token.color),
    }
  }
  return themeCache[top]
}

// 장르 코드 → "대분류 · 세부장르" 표시 텍스트
export function genreLabel(genres, code) {
  if (!genres || genres.length === 0) return code || ''
  const sub = genres.find((g) => g.code === code)
  if (!sub) return code || ''
  if (!sub.parentCode) return sub.label
  const top = genres.find((g) => g.code === sub.parentCode)
  return top ? `${top.label} · ${sub.label}` : sub.label
}
