const FALLBACK_COLOR = '#8a8a8a'
const SPINE_COUNT = 5

const PALETTE = [
  '#6d4c8f',
  '#b14d72',
  '#c07f3a',
  '#3f8a82',
  '#4a5a99',
  '#4f8a5a',
  '#4b5b66',
  '#b06a4e',
  '#c0584e',
  '#2d7d9a',
  '#5c6b2f',
  '#7a4f3d',
  '#8b6eb5',
  '#d46a8f',
  '#dba256',
  '#5aab9e',
  '#6a7eb8',
  '#72a87a',
  '#6a7a82',
  '#d08a6e',
  '#d8786e',
  '#4a9bb8',
  '#7a8f4a',
  '#9a6f5d',
]

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

function makeSpines(hex, n = SPINE_COUNT) {
  const { h, s, l } = hexToHsl(hex)
  return Array.from({ length: n }, (_, i) => {
    const t = n === 1 ? 0 : i / (n - 1) - 0.5
    return hslToHex(h + t * 10, s + t * 8, l + t * 26)
  })
}

function topCodeOf(code) {
  return (code || '').split('-')[0]
}

function emptyTheme(topCode = '') {
  return { label: '', color: FALLBACK_COLOR, spines: makeSpines(FALLBACK_COLOR) }
}

/** genres 로드 시 1회 — Map 조회 + theme/label 캐시 */
export function buildGenreIndex(genres) {
  const list = genres ?? []
  const byCode = new Map(list.map((g) => [g.code, g]))
  const subsByTop = new Map()
  const colorByTop = new Map()
  const themeCache = new Map()
  const tops = []

  for (const g of list) {
    if (g.parentCode) {
      if (!subsByTop.has(g.parentCode)) subsByTop.set(g.parentCode, [])
      subsByTop.get(g.parentCode).push(g)
    } else if (!colorByTop.has(g.code)) {
      tops.push(g.code)
      colorByTop.set(g.code, PALETTE[(tops.length - 1) % PALETTE.length])
    }
  }

  function themeFor(code) {
    const topCode = topCodeOf(code)
    if (!topCode) return emptyTheme()
    if (themeCache.has(topCode)) return themeCache.get(topCode)
    const color = colorByTop.get(topCode) ?? FALLBACK_COLOR
    const top = byCode.get(topCode)
    const theme = {
      label: top?.label ?? '',
      color,
      spines: makeSpines(color),
    }
    themeCache.set(topCode, theme)
    return theme
  }

  function labelFor(code) {
    if (!code) return ''
    const sub = byCode.get(code)
    if (!sub) return code
    if (!sub.parentCode) return sub.label
    const top = byCode.get(sub.parentCode)
    return top ? `${top.label} · ${sub.label}` : sub.label
  }

  return { byCode, subsByTop, colorByTop, tops, themeFor, labelFor }
}

export const EMPTY_GENRE_INDEX = buildGenreIndex([])
