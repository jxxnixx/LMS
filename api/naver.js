export default async function handler(req, res) {
  const { naverPath, ...queryParams } = req.query
  const params = new URLSearchParams(queryParams)
  const targetUrl = `https://openapi.naver.com/${naverPath}?${params.toString()}`

  try {
    const response = await fetch(targetUrl, {
      headers: {
        'X-Naver-Client-Id': process.env.VITE_NAVER_CLIENT_ID ?? '',
        'X-Naver-Client-Secret': process.env.VITE_NAVER_CLIENT_SECRET ?? '',
      },
    })

    const text = await response.text()

    try {
      res.status(response.status).json(JSON.parse(text))
    } catch {
      res.status(502).json({ error: 'Naver API non-JSON', status: response.status, preview: text.slice(0, 300) })
    }
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
}
