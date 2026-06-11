import { createContext, useContext, useMemo } from 'react'
import { useFetchGenresQuery } from '@/api/lms/genres/useGenresQueries'
import { EMPTY_GENRE_INDEX, buildGenreIndex } from '@/theme'

const GenreContext = createContext(null)

export function GenreProvider({ children }) {
  // 장르는 거의 정적이라 길게 캐시. 실패 시 빈 배열로 떨어뜨려 앱은 계속 뜨게 한다.
  const { data, isError } = useFetchGenresQuery({})
  const genres = data ?? (isError ? [] : undefined)

  const index = useMemo(
    () => (genres ? buildGenreIndex(genres) : EMPTY_GENRE_INDEX),
    [genres],
  )

  const value = useMemo(
    () => ({
      genres: genres ?? [],
      ready: genres != null,
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
