import { createClient } from "@libsql/client";

const tursoUrl = process.env.TURSO_DATABASE_URL;

if (!tursoUrl) {
	throw new Error("Missing TURSO_DATABASE_URL env var");
}

export const turso = createClient({
	url: tursoUrl,
	authToken: process.env.TURSO_AUTH_TOKEN
});

console.log("[turso] client initialized");

export function getTursoClient() {
	return turso;
}
