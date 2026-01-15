type LogRecord = Record<string, unknown>;

class LogStore {
	private logs: Record<string, LogRecord> = {};

	public assignLog(requestId: string, data: LogRecord) {
		if (!requestId) {
			return;
		}

		if (this.logs[requestId]) {
			Object.assign(this.logs[requestId], data);
		} else {
			this.logs[requestId] = { ...data };
		}
	}

	public addLog(requestId: string, logKey: string, data: LogRecord) {
		if (!requestId) {
			return;
		}

		const existing = this.logs[requestId] ?? {};
		const current = (existing[logKey] as LogRecord | undefined) ?? {};
		this.logs[requestId] = {
			...existing,
			[logKey]: { ...current, ...data }
		};
	}

	public pushLog(requestId: string, logKey: string, data: unknown) {
		if (!requestId) {
			return;
		}

		const existing = this.logs[requestId] ?? {};
		const list = (existing[logKey] as unknown[]) ?? [];
		this.logs[requestId] = {
			...existing,
			[logKey]: [...list, data]
		};
	}

	public printLog(requestId: string) {
		const log = this.logs[requestId];

		if (!log) {
			return;
		}

		try {
			if (log.isError) {
				console.error(log);
			} else {
				console.log(log);
			}
		} finally {
			delete this.logs[requestId];
		}
	}
}

const Log = new LogStore();

export default Log;
