export default async function handler(req, res) {
  const targetUrl = `https://openapi.naver.com${req.url.replace(/^\/api\/naver/, '')}`

  const response = await fetch(targetUrl, {
    headers: {
      'X-Naver-Client-Id': process.env.VITE_NAVER_CLIENT_ID,
      'X-Naver-Client-Secret': process.env.VITE_NAVER_CLIENT_SECRET,
    },
  })

  const data = await response.json()
  res.status(response.status).json(data)
}
