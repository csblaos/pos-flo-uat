export type ApiErrorType = {
	code: number | string;
	message: string;
};

export default class ErrorConfig {
	public static readonly responseFormat = {
		badRequest: {
			httpStatusCode: 400,
			code: 95001,
			message: "Bad request"
		},
		notFound: {
			httpStatusCode: 404,
			code: 95002,
			message: "Not found"
		},
		internalServerError: {
			httpStatusCode: 500,
			code: 95003,
			message: "Internal server error"
		},
		routerNotFound: {
			httpStatusCode: 404,
			code: 95006,
			message: "Route not found"
		},
		unauthorized: {
			httpStatusCode: 401,
			code: 95007,
			message: "Un authorized"
		},
		forbidden: {
			httpStatusCode: 403,
			code: 95008,
			message: "Forbidden"
		},
		forbiddenIpWhiteList: {
			httpStatusCode: 403,
			code: 95009,
			message: "Forbidden ip whitelist"
		}
	};

	public static readonly userActivity = {
		notFound: { code: 3444, message: "User activity not found" }
	};
}
