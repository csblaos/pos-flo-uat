import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function genUUID() {
	return crypto.randomUUID();
}

export function formatToTimeZone(value: string, timeZone?: string) {
	const targetZone = timeZone ?? process.env.APP_TIMEZONE ?? "UTC";
	const normalized = value.includes("T") ? value : value.replace(" ", "T");
	const date = new Date(`${normalized}Z`);

	if (Number.isNaN(date.getTime())) {
		return value;
	}

	const formatter = new Intl.DateTimeFormat("en-CA", {
		timeZone: targetZone,
		year: "numeric",
		month: "2-digit",
		day: "2-digit",
		hour: "2-digit",
		minute: "2-digit",
		second: "2-digit",
		hour12: false
	});

	const parts = formatter.formatToParts(date);
	const getPart = (type: string) => parts.find((part) => part.type === type)?.value ?? "00";

	return `${getPart("year")}-${getPart("month")}-${getPart("day")} ${getPart("hour")}:${getPart(
		"minute"
	)}:${getPart("second")}`;
}
