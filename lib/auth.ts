import { cookies } from 'next/headers'
import 'server-only'

import { cache } from 'react'

/**
 * Decodes JWT payload to read expiry (no verification)
 */
function isTokenExpired(token: string): boolean {
  try {
    const payload = token.split('.')[1]
    const decoded = JSON.parse(Buffer.from(payload, 'base64').toString())
    const now = Math.floor(Date.now() / 1000)
    return !decoded.exp || decoded.exp <= now + 60
  } catch {
    return true
  }
}

/**
 * Logs in and returns fresh token
 */
async function loginAndGetToken(): Promise<string> {
  const loginRes = await fetch(
    process.env.NEXT_PUBLIC_PAYLOAD_URL + '/api/users/login',
    {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        email: process.env.BACKEND_API_USER,
        password: process.env.BACKEND_API_PASS,
      }),
    },
  )

  if (!loginRes.ok) {
    throw new Error(`Auth failed: ${loginRes.status}`)
  }

  const data = await loginRes.json()

  if (!data.token) {
    throw new Error('No token in login response')
  }

  return data.token
}

/**
 * Gets auth token - cached per request via React cache()
 */
export const getAuthToken = cache(async (): Promise<string> => {
  const cookieStore = await cookies()
  const token = cookieStore.get('payload-token')?.value

  // If we have a valid token, return it
  if (token && !isTokenExpired(token)) {
    return token
  }

  // Token missing or expired - login to get fresh one
  return await loginAndGetToken()
})

/**
 * Refreshes token (for future use)
 */
export async function refreshAuthToken(): Promise<string> {
  const refreshRes = await fetch(
    process.env.NEXT_PUBLIC_PAYLOAD_URL + '/api/users/refresh-token',
    {
      method: 'POST',
      credentials: 'include',
    },
  )

  if (refreshRes.ok) {
    const data = await refreshRes.json()
    if (data.token) return data.token
  }

  // Refresh failed, do full login
  return await loginAndGetToken()
}
