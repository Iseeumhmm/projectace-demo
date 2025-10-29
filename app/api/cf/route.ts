// app/api/cf/route.ts
export const runtime = 'edge'

export async function GET(req: Request) {
  // 1️⃣ Grab all headers
  const headers = Object.fromEntries(req.headers.entries())

  // 2️⃣ Grab Cloudflare's structured object (Workers only)
  const cf = (req as any).cf ?? {}

  // 3️⃣ Return everything
  return new Response(JSON.stringify({ headers, cf }, null, 2), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  })
}
