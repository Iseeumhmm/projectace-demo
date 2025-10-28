import { NextRequest } from 'next/server'

export async function POST(req: NextRequest) {
  const res = await fetch(
    process.env.NEXT_PUBLIC_PAYLOAD_URL + '/api/users/login',
    {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        email: process.env.BACKEND_API_USER,
        password: process.env.BACKEND_API_PASS,
      }),
      credentials: 'include',
    },
  )

  // proxy cookies from Payload through to the browser
  const headers = new Headers()
  const setCookie = res.headers.get('set-cookie')
  if (setCookie) headers.append('set-cookie', setCookie)

  const data = await res.json()
  return new Response(JSON.stringify(data), { status: res.status, headers })
}
