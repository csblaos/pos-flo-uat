import ApiError from "@/lib/api-error";
import Log from "@/lib/log";

export function handleError(error: unknown, requestId?: string) {
	const status =
		error instanceof ApiError
			? error.httpStatusCode
			: 500;
	const errorMessage = error instanceof Error ? error.message : "unknown";
	const errorStack = error instanceof Error ? error.stack : undefined;

	if (requestId) {
		Log.assignLog(requestId, {
			error: true,
			errorMessage,
			errorStack
		});
	}

	const responseBody =
		error instanceof ApiError
			? {
					requestId,
					code: error.apiError.code,
					message: error.message
				}
			: {
					requestId,
					error: "Internal Server Error"
				};

	return Response.json(responseBody, { status });
}
