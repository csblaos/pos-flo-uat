import type { IpInfo } from "@/lib/request-logger";

export {};

declare global {
	interface Request {
		ipInfo?: IpInfo;
	}
}
