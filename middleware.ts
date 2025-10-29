// middleware.ts
import { NextResponse } from 'next/server'

export const config = {
  matcher: ['/((?!_next|static|favicon.ico).*)'],
}

export function middleware(request: Request) {
  const res = NextResponse.next()

  // --- Cloudflare's structured metadata (Workers runtime only) ---
  // Provides same info as headers even if Transform is disabled
  // @ts-ignore
  const cf = (request as any).cf || {}

  // --- New Cloudflare geo headers (as of 2024+) ---
  const h = request.headers

  const cfHeaderMap: Record<string, string | null> = {
    city: h.get('cf-ipcity'),
    country: h.get('cf-ipcountry'),
    continent: h.get('cf-ipcontinent'),
    longitude: h.get('cf-iplongitude'),
    latitude: h.get('cf-iplatitude'),
    region: h.get('cf-region'),
    regionCode: h.get('cf-region-code'),
    metroCode: h.get('cf-metro-code'),
    postalCode: h.get('cf-postal-code'),
    timezone: h.get('cf-timezone'),
    clientIp: h.get('cf-connecting-ip'),
  }

  // --- Merge with CF object fallback if headers missing ---
  const cfFallbackMap: Record<string, any> = {
    city: cf.city,
    country: cf.country,
    continent: cf.continent,
    longitude: cf.longitude,
    latitude: cf.latitude,
    region: cf.region,
    regionCode: cf.regionCode,
    metroCode: cf.metroCode,
    postalCode: cf.postalCode,
    timezone: cf.timezone,
  }

  // --- Apply headers (for server components) ---
  for (const key of Object.keys(cfHeaderMap)) {
    const value = cfHeaderMap[key] ?? cfFallbackMap[key]
    if (value) res.headers.set(`x-cf-${key}`, String(value))
  }

  // --- Also set them as cookies (for client visibility) ---
  // Avoid sensitive IPs; latitude/longitude optional depending on your use case
  const cookieOpts = [
    'Path=/',
    'SameSite=Lax',
    'Secure',
    'Max-Age=300', // 5 minutes
  ]

  for (const key of Object.keys(cfHeaderMap)) {
    const value = cfHeaderMap[key] ?? cfFallbackMap[key]
    if (!value) continue

    // Skip highly sensitive fields if needed
    if (key === 'clientIp') continue

    const cookieName = `geo_${key}`
    const cookieVal = encodeURIComponent(String(value))

    res.headers.append(
      'Set-Cookie',
      `${cookieName}=${cookieVal}; ${cookieOpts.join('; ')}`,
    )
  }

  return res
}
