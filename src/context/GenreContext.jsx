import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { getGenres } from '../api/genres'
import { EMPTY_GENRE_INDEX, buildGenreIndex } from '../theme'

const GenreContext = createContext(null)

export function GenreProvider({ children }) {
  const [genres, setGenres] = useState(null)

  useEffect(() => {
    getGenres()
      .then(setGenres)
      .catch(() => setGenres([]))
  }, [])

  const index = useMemo(
    () => (genres ? buildGenreIndex(genres) : EMPTY_GENRE_INDEX),
    [genres],
  )

  const value = useMemo(
    () => ({
      genres: genres ?? [],
      ready: genres !== null,
      get: (code) => index.byCode.get(code),
      subsOf: (topCode) => index.subsByTop.get(topCode) ?? [],
      themeFor: index.themeFor,
      labelFor: index.labelFor,
    }),
    [genres, index],
  )

  return (
    <GenreContext.Provider value={value}>{children}</GenreContext.Provider>
  )
}

export function useGenres() {
  const ctx = useContext(GenreContext)
  if (!ctx) throw new Error('useGenres must be used within GenreProvider')
  return ctx
}
