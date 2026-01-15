import { z } from "zod";

import { prisma } from "@/lib/prisma";
import { withRequestLogging } from "@/lib/request-logger";

export const runtime = "nodejs";

export const GET = withRequestLogging(async (req: Request) => {
	const { searchParams } = new URL(req.url);
	const merchantId = z.string().min(1).optional().parse(searchParams.get("merchant_id") ?? undefined);

	if (!merchantId) {
		const merchants = await prisma.merchant.findMany({
			where: { deleted_at: null }
		});

		return Response.json(merchants);
	}

	const merchant = await prisma.merchant.findFirst({
		where: { id: merchantId, deleted_at: null }
	});

	if (!merchant) {
		return Response.json({ error: "merchant not found" }, { status: 404 });
	}

	return Response.json(merchant);
});

export const POST = withRequestLogging(async (req: Request) => {
	const body = await req.json();
	const { id, name } = z
		.object({
			id: z.string().min(1).optional(),
			name: z.string().min(1)
		})
		.parse(body);

	const merchantId = id ?? crypto.randomUUID();

	const merchant = await prisma.merchant.create({
		data: {
			id: merchantId,
			name
		}
	});

	return Response.json(merchant, { status: 201 });
});

export const PUT = withRequestLogging(async (req: Request) => {
	const body = await req.json();
	const { id, name } = z
		.object({
			id: z.string().min(1),
			name: z.string().min(1)
		})
		.parse(body);

	const merchant = await prisma.merchant.findFirst({
		where: { id, deleted_at: null }
	});

	if (!merchant) {
		return Response.json({ error: "merchant not found" }, { status: 404 });
	}

	const updated = await prisma.merchant.update({
		where: { id },
		data: {
			name,
			updated_at: new Date()
		}
	});

	return Response.json(updated);
});

export const DELETE = withRequestLogging(async (req: Request) => {
	const body = await req.json().catch(() => ({}));
	const { searchParams } = new URL(req.url);
	const merchantId =
		z.string().min(1).optional().parse(searchParams.get("merchant_id") ?? undefined) ??
		z.string().min(1).optional().parse(body?.id);

	if (!merchantId) {
		return Response.json({ error: "merchant_id is required" }, { status: 400 });
	}

	const merchant = await prisma.merchant.findFirst({
		where: { id: merchantId, deleted_at: null }
	});

	if (!merchant) {
		return Response.json({ error: "merchant not found" }, { status: 404 });
	}

	await prisma.merchant.update({
		where: { id: merchantId },
		data: {
			deleted_at: new Date(),
			updated_at: new Date()
		}
	});

	return Response.json({ ok: true });
});
