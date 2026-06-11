import { useGenres } from '@/context/GenreContext'

// 대분류 → 세부장르 연동 셀렉트. variant: 'pill'(툴바) | 'field'(폼)
export default function GenreSelect({
  topCode,
  subCode,
  onChange,
  variant = 'field',
}) {
  const { genres, subsOf } = useGenres()
  const tops = genres.filter((g) => !g.parentCode)
  const subs = subsOf(topCode)
  const cls = `gs-select ${variant === 'pill' ? 'gs-pill' : 'gs-field'}`

  return (
    <div className="genre-select">
      <select
        className={cls}
        value={topCode}
        onChange={(e) => onChange(e.target.value, '')}
      >
        <option value="">{variant === 'pill' ? '전체 장르' : '대분류 선택'}</option>
        {tops.map((g) => (
          <option key={g.code} value={g.code}>{g.label}</option>
        ))}
      </select>
      <select
        className={cls}
        value={subCode}
        onChange={(e) => onChange(topCode, e.target.value)}
        disabled={!topCode}
      >
        <option value="">{variant === 'pill' ? '세부 장르' : '세부 장르 선택'}</option>
        {subs.map((g) => (
          <option key={g.code} value={g.code}>{g.label}</option>
        ))}
      </select>
    </div>
  )
}
