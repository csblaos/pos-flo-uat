import { createClient, type Client } from "@libsql/client";

let cached: Client | null = null;

export function getTursoClient() {
  if (cached) return cached;
  const url = process.env.TURSO_DATABASE_URL;
  const authToken = process.env.TURSO_AUTH_TOKEN;

  if (!url) {
    throw new Error("Missing TURSO_DATABASE_URL env var");
  }

  cached = createClient({
    url,
    authToken
  });

  return cached;
}
