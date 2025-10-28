import "server-only";
import { print, type DocumentNode } from "graphql";

export async function gqlFetch<TData, TVars>(
  query: string | DocumentNode,
  variables?: TVars,
  opts?: { revalidate?: number | false; withCredentials?: boolean; token?: string }
): Promise<TData> {
  const queryString = typeof query === "string" ? query : print(query);
  const headers: Record<string, string> = { "content-type": "application/json" };

  if (opts?.token) headers.Authorization = `Bearer ${opts.token}`;

  const res = await fetch(process.env.NEXT_PUBLIC_PAYLOAD_URL + "/api/graphql", {
    method: "POST",
    headers,
    body: JSON.stringify({ query: queryString, variables }),
    credentials: opts?.withCredentials ? "include" : "same-origin",
    cache: opts?.revalidate ? "force-cache" : "no-store",
    next: opts?.revalidate ? { revalidate: opts.revalidate } : undefined,
  });

  if (!res.ok) throw new Error(`GraphQL HTTP ${res.status}`);
  const json = await res.json();
  if (json.errors?.length) throw new Error(json.errors.map((e: any) => e.message).join("; "));
  return json.data as TData;
}