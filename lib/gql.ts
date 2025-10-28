import { type DocumentNode, print } from 'graphql'
import 'server-only'

export async function gqlFetch<TData, TVars>(
  query: string | DocumentNode,
  variables?: TVars,
  opts?: { revalidate?: number | false; token?: string },
): Promise<TData> {
  const queryString = typeof query === 'string' ? query : print(query)

  const res = await fetchGraphQL(queryString, variables, opts?.token, opts)

  if (!res.ok) throw new Error(`GraphQL HTTP ${res.status}`)
  const json = await res.json()
  if (json.errors?.length)
    throw new Error(json.errors.map((e: any) => e.message).join('; '))
  return json.data as TData
}

async function fetchGraphQL(
  query: string,
  variables: any,
  token?: string,
  opts?: { revalidate?: number | false },
) {
  const headers: Record<string, string> = { 'content-type': 'application/json' }
  if (token) headers.Authorization = `Bearer ${token}`

  return await fetch(process.env.NEXT_PUBLIC_PAYLOAD_URL + '/api/graphql', {
    method: 'POST',
    headers,
    body: JSON.stringify({ query, variables }),
    cache: opts?.revalidate ? 'force-cache' : 'no-store',
    next: opts?.revalidate ? { revalidate: opts.revalidate } : undefined,
  })
}
