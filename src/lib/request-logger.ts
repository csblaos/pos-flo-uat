import Log from "@/lib/log";
import { genUUID } from "@/lib/utils";

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
	"accept-language",
	"accept",
	"accept-encoding",
	"connection",
	"forwarded",
	"host",
	"priority",
	"postman-token",
	"referer",
	"sec-ch-ua",
	"sec-ch-ua-mobile",
	"sec-ch-ua-platform",
	"sec-fetch-dest",
	"sec-fetch-mode",
	"sec-fetch-site",
	"user-agent",
	"x-matched-path",
	"x-forwarded-for",
	"x-forwarded-host",
	"x-forwarded-port",
	"x-forwarded-proto",
	"authorization",
	"cookie",
	"set-cookie",
	"x-real-ip",
	"x-vercel-deployment-url",
	"x-vercel-forwarded-for",
	"x-vercel-id",
	"x-vercel-internal-bot-check",
	"x-vercel-internal-ingress-bucket",
	"x-vercel-internal-ingress-port",
	"x-vercel-ip-as-number",
	"x-vercel-ip-city",
	"x-vercel-ip-continent",
	"x-vercel-ip-country",
	"x-vercel-ip-country-region",
	"x-vercel-ip-latitude",
	"x-vercel-ip-longitude",
	"x-vercel-ip-postal-code",
	"x-vercel-ip-timezone",
	"x-vercel-ja4-digest",
	"x-vercel-oidc-token"
]);

type Handler = (req: Request) => Promise<Response> | Response;

const loggedOncePaths = new Set<string>();

export type IpInfo = {
	ip: string | null;
	platform?: string | null;
	userAgent?: string | null;
	browser?: string | null;
	geo?: {
		countryCode: string | null;
		countryName: string | null;
		regionCode: string | null;
		regionName: string | null;
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
	const geo = getVercelGeo(req.headers);
	const hints = getClientHints(req.headers);
	const ipInfo: IpInfo = {
		ip: bindReqIp(req),
		platform: hints.platform,
		userAgent: hints.userAgent,
		browser: hints.browser,
		geo: geo
			? {
				...geo,
				countryName: getCountryName(geo.countryCode),
				regionName: getRegionName(geo.countryCode, geo.regionCode)
			}
			: undefined
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
	const region = headers.get("x-vercel-ip-country-region");
	const city = headers.get("x-vercel-ip-city");
	const latitude = headers.get("x-vercel-ip-latitude");
	const longitude = headers.get("x-vercel-ip-longitude");

	if (!country && !region && !city && !latitude && !longitude) {
		return undefined;
	}

	return {
		countryCode: country,
		regionCode: region,
		city,
		latitude,
		longitude
	};
}

function getCountryName(countryCode: string | null) {
	if (!countryCode) {
		return null;
	}

	const display = new Intl.DisplayNames(["en"], { type: "region" });

	return display.of(countryCode) ?? countryCode;
}

function getRegionName(countryCode: string | null, regionCode: string | null) {
	if (!regionCode) {
		return null;
	}

	const display = new Intl.DisplayNames(["en"], { type: "region" });
	const regionKey = countryCode ? `${countryCode}-${regionCode}` : regionCode;

	return display.of(regionKey) ?? regionCode;
}

function getClientHints(headers: Headers) {
	const platform = headers.get("sec-ch-ua-platform");
	const userAgent = headers.get("sec-ch-ua");
	const browser = userAgent
		?.split(",")
		.map((entry) => entry.trim())
		.filter(Boolean)
		.join(", ");

	return {
		platform,
		userAgent,
		browser
	};
}

function redactValue(key: string, value: unknown) {
	if (SECRET_KEYS.has(key)) {
		return "******";
	}

	return value;
}

function serializeError(error: unknown) {
	if (error instanceof Error) {
		return {
			name: error.name,
			message: error.message,
			stack: error.stack
		};
	}

	return { name: "UnknownError", message: "unknown" };
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
			genUUID().slice(24, 36);
		const start = Date.now();
		const url = new URL(req.url);
		(req as Request & { requestId?: string }).requestId = requestId;

		const requestLog: Record<string, unknown> = {
			requestId,
			requestTime: new Date().toISOString(),
			method: req.method,
			path: url.pathname,
			ipInfo: attachReqIpInfo(req),
			query: redactObject(Object.fromEntries(url.searchParams.entries())),
			headers: sanitizeHeaders(req.headers)
		};

		Log.assignLog(requestId, requestLog);

		const requestBody = await parseJsonBody(req.clone());
		if (requestBody !== undefined) {
			Log.assignLog(requestId, { body: redactObject(requestBody) });
		}

		try {
			const response = await handler(req);
			const responseClone = response.clone();
			const responseBody = await parseJsonResponse(responseClone);

			Log.assignLog(requestId, {
				responseStatus: response.status,
				response: redactObject(responseBody),
				responseTime: new Date().toISOString(),
				responseDuration: (Date.now() - start) / 1000
			});

			response.headers.set("request-id", requestId);


			if (response.status >= 400) {
				Log.assignLog(requestId, {
					message: "request failed",
					isError: true,
					errorMessage:
						(responseBody &&
							typeof responseBody === "object" &&
							("error" in responseBody || "message" in responseBody) &&
							((responseBody as { error?: unknown }).error ??
								(responseBody as { message?: unknown }).message)) ??
						"unknown",
					// errorStack: undefined
				});
			} else {
				Log.assignLog(requestId, {
					message: "request completed",
					isError: false
				});
			}
			Log.printLog(requestId);
			loggedOncePaths.add(url.pathname);


			return response;
		} catch (error) {
			Log.assignLog(requestId, {
				message: "request failed",
				isError: true,
				responseStatus: 500,
				error: serializeError(error),
				errorMessage: error instanceof Error ? error.message : "unknown",
				errorStack: error instanceof Error ? error.stack : undefined,
				responseTime: new Date().toISOString(),
				responseDuration: (Date.now() - start) / 1000
			});


			Log.printLog(requestId);
			loggedOncePaths.add(url.pathname);


			throw error;
		}
	};
}
