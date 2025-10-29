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
    'x-cf-ipcity': h.get('cf-ipcity'),
    'x-cf-ipcountry': h.get('cf-ipcountry'),
    'x-cf-ipcontinent': h.get('cf-ipcontinent'),
    'x-cf-iplongitude': h.get('cf-iplongitude'),
    'x-cf-iplatitude': h.get('cf-iplatitude'),
    'x-cf-region': h.get('cf-region'),
    'x-cf-region-code': h.get('cf-region-code'),
    'x-cf-metro-code': h.get('cf-metro-code'),
    'x-cf-postal-code': h.get('cf-postal-code'),
    'x-cf-timezone': h.get('cf-timezone'),
    'x-client-ip': h.get('cf-connecting-ip'),
    'x-client-ips': h.get('x-forwarded-for'),
  }

  // --- Merge with CF object fallback if headers missing ---
  const cfFallbackMap: Record<string, any> = {
    'x-cf-ipcity': cf.city,
    'x-cf-ipcountry': cf.country,
    'x-cf-ipcontinent': cf.continent,
    'x-cf-iplongitude': cf.longitude,
    'x-cf-iplatitude': cf.latitude,
    'x-cf-region': cf.region,
    'x-cf-region-code': cf.regionCode,
    'x-cf-metro-code': cf.metroCode,
    'x-cf-postal-code': cf.postalCode,
    'x-cf-timezone': cf.timezone,
  }

  // Apply headers, using fallback when needed
  for (const key of Object.keys(cfHeaderMap)) {
    const value = cfHeaderMap[key] ?? cfFallbackMap[key]
    if (value) res.headers.set(key, String(value))
  }

  return res
}
