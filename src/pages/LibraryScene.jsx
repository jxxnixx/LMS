import { useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import CorridorView from './CorridorView'
import ShelfView from './ShelfView'

// 1인칭 3D 복도 도서관 — 복도 ⇄ 책장 전환
export default function LibraryScene() {
  const [activeGenre, setActiveGenre] = useState(null)

  return (
    <AnimatePresence mode="wait">
      {activeGenre ? (
        <ShelfView
          key={activeGenre.code}
          genre={activeGenre}
          onBack={() => setActiveGenre(null)}
        />
      ) : (
        <CorridorView key="corridor" onOpenShelf={setActiveGenre} />
      )}
    </AnimatePresence>
  )
}
