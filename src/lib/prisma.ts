import { PrismaLibSql } from "@prisma/adapter-libsql";
import { PrismaClient } from "@prisma/client";
import { createClient } from "@libsql/client";

const databaseProvider = process.env.DATABASE_PROVIDER ?? "turso";

function createTursoClient() {
	const tursoUrl = process.env.TURSO_DATABASE_URL;

	if (!tursoUrl) {
		throw new Error("Missing TURSO_DATABASE_URL env var");
	}

	return new PrismaClient({
		adapter: new PrismaLibSql(
			createClient({
				url: tursoUrl,
				authToken: process.env.TURSO_AUTH_TOKEN
			})
		)
	});
}

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma =
	globalForPrisma.prisma ??
	(databaseProvider === "turso"
		? createTursoClient()
		: new PrismaClient());

if (process.env.NODE_ENV !== "production") {
	globalForPrisma.prisma = prisma;
}
