import { withRequestLogging } from "@/lib/request-logger";

export const GET = async () => {
	return Response.json({ ok: true, time: new Date().toISOString() });
};
