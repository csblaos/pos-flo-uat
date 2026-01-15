import ApiError from "@/lib/api-error";
import {
	fetchMerchantById,
	fetchMerchants,
	insertMerchant,
	softDeleteMerchantById,
	updateMerchantById
} from "@/interfaces/merchant-interface";
import { prisma } from "@/lib/prisma";
import { genUUID } from "@/lib/utils";
import {
	MerchantCreateSchema,
	MerchantIdSchema,
	MerchantUpdateSchema
} from "@/validators/merchant-validator";

export async function getMerchants(req: Request) {
	const { searchParams } = new URL(req.url);
	const merchantId = MerchantIdSchema.optional().parse(searchParams.get("merchant_id") ?? undefined);

	if (!merchantId) {
		return fetchMerchants();
	}

	const merchant = await fetchMerchantById(merchantId);

	if (!merchant) {
		throw new ApiError.NotFoundError({
			code: "MERCHANT_NOT_FOUND",
			message: "merchant not found"
		});
	}

	return merchant;
}

export async function createMerchantHandler(req: Request) {
	const body = await req.json();
	const { name } = MerchantCreateSchema.parse(body);

	const merchantId = genUUID();

	return prisma.$transaction((tx) => insertMerchant(merchantId, name, tx));
}

export async function updateMerchantHandler(req: Request) {
	const body = await req.json();
	const { id, name } = MerchantUpdateSchema.parse(body);

	return prisma.$transaction(async (tx) => {
		const merchant = await fetchMerchantById(id, tx);

		if (!merchant) {
			throw new ApiError.NotFoundError({
				code: "MERCHANT_NOT_FOUND",
				message: "merchant not found"
			});
		}

		return updateMerchantById(id, name, tx);
	});
}

export async function deleteMerchantHandler(req: Request) {
	const body = await req.json().catch(() => ({}));
	const { searchParams } = new URL(req.url);
	const merchantId =
		MerchantIdSchema.optional().parse(searchParams.get("merchant_id") ?? undefined) ??
		MerchantIdSchema.optional().parse(body?.id);

	if (!merchantId) {
		throw new ApiError.BadRequestError("merchant_id is required");
	}

	await prisma.$transaction(async (tx) => {
		const merchant = await fetchMerchantById(merchantId, tx);

		if (!merchant) {
			throw new ApiError.NotFoundError({
				code: "MERCHANT_NOT_FOUND",
				message: "merchant not found"
			});
		}

		await softDeleteMerchantById(merchantId, tx);
	});

	return { ok: true };
}
