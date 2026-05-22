const BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'

export async function request(path, options) {
  let res
  try {
    res = await fetch(`${BASE}${path}`, options)
  } catch {
    throw new Error('json-server에 연결할 수 없어요. npm run server 를 실행해 주세요.')
  }
  if (!res.ok) throw new Error(`요청 실패 (${res.status})`)
  if (res.status === 204) return null
  const text = await res.text()
  return text ? JSON.parse(text) : null
}

export const jsonBody = (data) => ({
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(data),
})
