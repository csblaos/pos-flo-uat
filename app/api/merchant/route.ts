import {
	createMerchantHandler,
	deleteMerchantHandler,
	getMerchants,
	updateMerchantHandler
} from "@/controllers/merchant-controller";
import { handleError } from "@/lib/errors";
import { withRequestLogging } from "@/lib/request-logger";

export const runtime = "nodejs";

export const GET = withRequestLogging(async (req: Request) => {
	try {
		const result = await getMerchants(req);
		return Response.json(result);
	} catch (error) {
		return handleError(error, req.requestId);
	}
});

export const POST = withRequestLogging(async (req: Request) => {
	try {
		const merchant = await createMerchantHandler(req);
		return Response.json(merchant, { status: 201 });
	} catch (error) {
		return handleError(error, req.requestId);
	}
});

export const PUT = withRequestLogging(async (req: Request) => {
	try {
		const merchant = await updateMerchantHandler(req);
		return Response.json(merchant);
	} catch (error) {
		return handleError(error, req.requestId);
	}
});

export const DELETE = withRequestLogging(async (req: Request) => {
	try {
		const result = await deleteMerchantHandler(req);
		return Response.json(result);
	} catch (error) {
		return handleError(error, req.requestId);
	}
});
