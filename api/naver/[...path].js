export default async function handler(req, res) {
  const { path, ...queryParams } = req.query
  const pathStr = Array.isArray(path) ? path.join('/') : (path || '')
  const params = new URLSearchParams(queryParams)
  const targetUrl = `https://openapi.naver.com/${pathStr}?${params.toString()}`

  console.log('[naver-proxy] targetUrl:', targetUrl)
  console.log('[naver-proxy] clientId:', process.env.VITE_NAVER_CLIENT_ID ? '있음' : '없음')
  console.log('[naver-proxy] clientSecret:', process.env.VITE_NAVER_CLIENT_SECRET ? '있음' : '없음')

  try {
    const response = await fetch(targetUrl, {
      headers: {
        'X-Naver-Client-Id': process.env.VITE_NAVER_CLIENT_ID ?? '',
        'X-Naver-Client-Secret': process.env.VITE_NAVER_CLIENT_SECRET ?? '',
      },
    })

    console.log('[naver-proxy] status:', response.status)
    const text = await response.text()
    console.log('[naver-proxy] response preview:', text.slice(0, 200))

    try {
      const data = JSON.parse(text)
      res.status(response.status).json(data)
    } catch {
      res.status(502).json({ error: 'Naver API non-JSON response', status: response.status, preview: text.slice(0, 300) })
    }
  } catch (e) {
    console.log('[naver-proxy] fetch error:', e.message)
    res.status(500).json({ error: e.message })
  }
}
