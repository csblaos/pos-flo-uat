const SECRET_KEYS = new Set([
	"password",
	"token",
	"authToken",
	"authorization",
	"secret",
	"apiKey",
	"apikey"
]);

const EXCLUDED_HEADERS = new Set([
	"accept",
	"accept-encoding",
	"connection",
	"host",
	"postman-token",
	"user-agent",
	"x-forwarded-for",
	"x-forwarded-host",
	"x-forwarded-port",
	"x-forwarded-proto",
	"authorization",
	"cookie",
	"set-cookie"
]);

type Handler = (req: Request) => Promise<Response> | Response;

export type IpInfo = {
	ip: string | null;
	geo?: {
		country: string | null;
		region: string | null;
		city: string | null;
		latitude: string | null;
		longitude: string | null;
	};
};

export function bindReqIp(req: Request) {
	const forwardedFor = req.headers.get("x-forwarded-for");
	if (forwardedFor) {
		return forwardedFor.split(",")[0]?.trim() ?? null;
	}

	const realIp =
		req.headers.get("x-real-ip") ??
		req.headers.get("cf-connecting-ip") ??
		req.headers.get("x-client-ip");

	return realIp ?? null;
}

export function attachReqIpInfo(req: Request) {
	const ipInfo: IpInfo = {
		ip: bindReqIp(req),
		geo: getVercelGeo(req.headers)
	};

	(req as Request & { ipInfo?: IpInfo }).ipInfo = ipInfo;

	return ipInfo;
}

function sanitizeHeaders(headers: Headers) {
	const output: Record<string, string> = {};

	headers.forEach((value, key) => {
		if (EXCLUDED_HEADERS.has(key.toLowerCase())) {
			return;
		}

		output[key] = value;
	});

	return output;
}

function getVercelGeo(headers: Headers) {
	const country = headers.get("x-vercel-ip-country");
	const region = headers.get("x-vercel-ip-region");
	const city = headers.get("x-vercel-ip-city");
	const latitude = headers.get("x-vercel-ip-latitude");
	const longitude = headers.get("x-vercel-ip-longitude");

	if (!country && !region && !city && !latitude && !longitude) {
		return undefined;
	}

	return {
		country,
		region,
		city,
		latitude,
		longitude
	};
}

function redactValue(key: string, value: unknown) {
	if (SECRET_KEYS.has(key)) {
		return "******";
	}

	return value;
}

function redactObject(value: unknown): unknown {
	if (Array.isArray(value)) {
		return value.map((item) => redactObject(item));
	}

	if (!value || typeof value !== "object") {
		return value;
	}

	return Object.fromEntries(
		Object.entries(value as Record<string, unknown>).map(([key, val]) => [
			key,
			redactValue(key, redactObject(val))
		])
	);
}

async function parseJsonBody(req: Request) {
	try {
		const contentType = req.headers.get("content-type") ?? "";

		if (!contentType.includes("application/json")) {
			return undefined;
		}

		return await req.json();
	} catch {
		return undefined;
	}
}

async function parseJsonResponse(res: Response) {
	try {
		const contentType = res.headers.get("content-type") ?? "";

		if (!contentType.includes("application/json")) {
			return undefined;
		}

		return await res.json();
	} catch {
		return undefined;
	}
}

export function withRequestLogging(handler: Handler): Handler {
	return async (req: Request) => {
		const requestId =
			req.headers.get("request-id") ??
			req.headers.get("x-request-id") ??
			crypto.randomUUID();
		const start = Date.now();
		const url = new URL(req.url);

		const requestLog: Record<string, unknown> = {
			requestId,
			requestTime: new Date().toISOString(),
			method: req.method,
			path: url.pathname,
			ip: bindReqIp(req),
			geo: getVercelGeo(req.headers),
			query: redactObject(Object.fromEntries(url.searchParams.entries())),
			headers: sanitizeHeaders(req.headers)
		};

		attachReqIpInfo(req);

		const requestBody = await parseJsonBody(req.clone());
		if (requestBody !== undefined) {
			requestLog.body = redactObject(requestBody);
		}

		try {
			const response = await handler(req);
			const responseClone = response.clone();
			const responseBody = await parseJsonResponse(responseClone);

			requestLog.responseStatus = response.status;
			requestLog.response = redactObject(responseBody);
			requestLog.responseTime = new Date().toISOString();
			requestLog.responseDuration = (Date.now() - start) / 1000;

			response.headers.set("request-id", requestId);

			console.log(requestLog);

			return response;
		} catch (error) {
			requestLog.responseStatus = 500;
			requestLog.error = error instanceof Error ? error.message : "unknown";
			requestLog.responseTime = new Date().toISOString();
			requestLog.responseDuration = (Date.now() - start) / 1000;

			console.error(requestLog);

			throw error;
		}
	};
}
