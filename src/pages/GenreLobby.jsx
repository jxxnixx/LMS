import { motion } from 'framer-motion'
import { useGenres } from '../context/GenreContext'

const GENRE_EMOJI = {
  NV: '📖', LT: '✍️', HU: '🏛️', SS: '💼', SC: '🔬',
  ED: '📝', EX: '🎯', SD: '💡', AR: '🎨', KD: '🧒', HE: '🌿',
}

export default function GenreLobby({ onSelect }) {
  const { genres, themeFor } = useGenres()
  const topGenres = genres.filter(g => !g.parentCode)

  return (
    <motion.div
      className='lobby-root'
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.3 }}>
      <div className='lobby-head'>
        <h1>도서관</h1>
        <p>장르를 선택해 복도로 입장하세요</p>
      </div>
      <div className='lobby-grid'>
        {topGenres.map(g => {
          const t = themeFor(g.code)
          return (
            <button
              key={g.code}
              className='lobby-card'
              style={{ '--gc': t.color }}
              onClick={() => onSelect(g)}>
              <span className='lobby-emoji'>{GENRE_EMOJI[g.code] ?? '📚'}</span>
              <span className='lobby-label'>{g.label}</span>
            </button>
          )
        })}
      </div>
    </motion.div>
  )
}
