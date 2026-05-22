import { request } from './client'

// 전체 장르 (대분류 + 세부)
export const getGenres = () => request('/genres')
