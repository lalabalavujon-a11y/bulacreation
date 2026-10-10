// Server-only. These tables deny direct browser access through RLS.
export function backendConfig() {
  const url = process.env["SUPABASE_URL"];
  const key = process.env["SUPABASE_SERVICE_ROLE_KEY"];
  const publicKey = process.env["SUPABASE_ANON_KEY"];
  if (!url || !key || !publicKey)
    throw new Error("Secure accounts are not configured yet. Please contact support.");
  const parsed = new URL(url);
  if (
    parsed.protocol !== "https:" &&
    !(parsed.hostname === "127.0.0.1" && process.env["NODE_ENV"] !== "production")
  )
    throw new Error("Invalid authentication service URL");
  return { url: parsed.origin, key, publicKey };
}

export async function db<T>(path: string, init: RequestInit = {}): Promise<T> {
  const { url, key } = backendConfig();
  const response = await fetch(`${url}/rest/v1/${path}`, {
    ...init,
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
      ...init.headers,
    },
    signal: AbortSignal.timeout(10000),
  });
  if (!response.ok)
    throw new Error("Account storage is temporarily unavailable. Please try again.");
  const text = await response.text();
  return text ? (JSON.parse(text) as T) : (undefined as T);
}

export async function authRequest(path: string, body: unknown) {
  const { url, publicKey } = backendConfig();
  return fetch(`${url}/auth/v1/${path}`, {
    method: "POST",
    headers: { apikey: publicKey, "Content-Type": "application/json" },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(10000),
  });
}
