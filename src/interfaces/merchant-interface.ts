import type { Prisma } from "@prisma/client";

import { prisma } from "@/lib/prisma";
import { formatToTimeZone } from "@/lib/utils";

function formatSqliteDate(date: Date) {
	return date.toISOString().replace("T", " ").replace("Z", "").split(".")[0] ?? "";
}

type DbClient = Prisma.TransactionClient;

function getClient(client?: DbClient) {
	return client ?? prisma;
}

export async function fetchMerchants(client?: DbClient) {
	const merchants = await getClient(client).merchant.findMany({
		where: { deleted_at: null },
		select: {
			id: true,
			name: true,
			created_at: true,
			updated_at: true
		}
	});

	return merchants.map((merchant) => ({
		...merchant,
		created_at: formatToTimeZone(merchant.created_at),
		updated_at: formatToTimeZone(merchant.updated_at)
	}));
}

export async function fetchMerchantById(id: string, client?: DbClient) {
	const merchant = await getClient(client).merchant.findFirst({
		where: { id, deleted_at: null },
		select: {
			id: true,
			name: true,
			created_at: true,
			updated_at: true
		}
	});

	if (!merchant) {
		return null;
	}

	return {
		...merchant,
		created_at: formatToTimeZone(merchant.created_at),
		updated_at: formatToTimeZone(merchant.updated_at)
	};
}

export async function insertMerchant(id: string, name: string, client?: DbClient) {
	return getClient(client).merchant.create({
		data: {
			id,
			name
		}
	});
}

export async function updateMerchantById(id: string, name: string, client?: DbClient) {
	return getClient(client).merchant.update({
		where: { id },
		data: {
			name,
			updated_at: formatSqliteDate(new Date())
		}
	});
}

export async function softDeleteMerchantById(id: string, client?: DbClient) {
	return getClient(client).merchant.update({
		where: { id },
		data: {
			deleted_at: formatSqliteDate(new Date()),
			updated_at: formatSqliteDate(new Date())
		}
	});
}
