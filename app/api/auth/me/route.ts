export async function GET() {
  const res = await fetch(
    process.env.NEXT_PUBLIC_BACKEND_API_URL + '/api/users/me',
    {
      credentials: 'include',
    },
  )
  return new Response(res.body, { status: res.status })
}

// app/api/auth/refresh/route.ts
export async function POST() {
  const res = await fetch(
    process.env.NEXT_PUBLIC_BACKEND_API_URL + '/api/users/refresh-token',
    {
      method: 'POST',
      credentials: 'include',
    },
  )
  // forward refreshed cookie
  const headers = new Headers()
  const setCookie = res.headers.get('set-cookie')
  if (setCookie) headers.append('set-cookie', setCookie)
  return new Response(res.body, { status: res.status, headers })
}
