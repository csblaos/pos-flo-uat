import ErrorConfig, { type ApiErrorType } from "@/lib/error-config";

type ApiErrorInput = ApiErrorType | string | undefined;

function normalizeApiError(input: ApiErrorInput, fallback: ApiErrorType) {
	if (typeof input === "string") {
		return { code: fallback.code, message: input };
	}

	if (!input || (typeof input.code !== "number" && typeof input.code !== "string")) {
		return fallback;
	}

	return input;
}

export default abstract class ApiError extends Error {
	public readonly httpStatusCode: number;
	public readonly apiError: ApiErrorType;

	constructor(httpStatusCode: number, apiError: ApiErrorType) {
		super(apiError.message);
		this.name = "ApiError";
		this.httpStatusCode = httpStatusCode;
		this.apiError = apiError;
	}

	public static InternalError = class extends ApiError {
		constructor(input?: ApiErrorInput) {
			const fallback = ErrorConfig.responseFormat.internalServerError;
			super(fallback.httpStatusCode, normalizeApiError(input, fallback));
		}
	};

	public static BadRequestError = class extends ApiError {
		constructor(input?: ApiErrorInput) {
			const fallback = ErrorConfig.responseFormat.badRequest;
			super(fallback.httpStatusCode, normalizeApiError(input, fallback));
		}
	};

	public static NotFoundError = class extends ApiError {
		constructor(input?: ApiErrorInput) {
			const fallback = ErrorConfig.responseFormat.notFound;
			super(fallback.httpStatusCode, normalizeApiError(input, fallback));
		}
	};

	public static RouteNotFoundError = class extends ApiError {
		constructor(input?: ApiErrorInput) {
			const fallback = ErrorConfig.responseFormat.routerNotFound;
			super(fallback.httpStatusCode, normalizeApiError(input, fallback));
		}
	};

	public static ForbiddenError = class extends ApiError {
		constructor(input?: ApiErrorInput) {
			const fallback = ErrorConfig.responseFormat.forbidden;
			super(fallback.httpStatusCode, normalizeApiError(input, fallback));
		}
	};

	public static ForbiddenIpWhitelistError = class extends ApiError {
		constructor(input?: ApiErrorInput) {
			const fallback = ErrorConfig.responseFormat.forbiddenIpWhiteList;
			super(fallback.httpStatusCode, normalizeApiError(input, fallback));
		}
	};

	public static UnauthorizedError = class extends ApiError {
		constructor(input?: ApiErrorInput) {
			const fallback = ErrorConfig.responseFormat.unauthorized;
			super(fallback.httpStatusCode, normalizeApiError(input, fallback));
		}
	};

	public static CustomError = class extends ApiError {
		constructor(httpStatusCode: number, input?: ApiErrorInput) {
			const fallback = ErrorConfig.responseFormat.internalServerError;
			super(httpStatusCode, normalizeApiError(input, fallback));
		}
	};
}
