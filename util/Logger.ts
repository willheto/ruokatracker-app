class Logger {
	// ANSI escape codes for colors
	private static readonly ANSI_RESET = '\x1B[0m';
	private static readonly ANSI_MAGENTA = '\x1B[35m';
	private static readonly ANSI_CYAN = '\x1B[36m';
	private static readonly ANSI_GREEN = '\x1B[32m';
	private static readonly ANSI_RED = '\x1B[31m';
	private static readonly ANSI_YELLOW = '\x1B[33m';

	private static getCurrentTimestamp(): string {
		const date = new Date();
		const year = date.getFullYear();
		const month = String(date.getMonth() + 1).padStart(2, '0');
		const day = String(date.getDate()).padStart(2, '0');
		const hours = String(date.getHours()).padStart(2, '0');
		const minutes = String(date.getMinutes()).padStart(2, '0');
		const seconds = String(date.getSeconds()).padStart(2, '0');
		return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
	}

	// Helper function to format messages
	private static formatMessage(message: string | object): string {
		if (typeof message === 'object') {
			try {
				return JSON.stringify(message, null, 2); // Beautify the JSON output
			} catch {
				return 'Error converting object to JSON';
			}
		}
		return message;
	}

	public static printDebug(message: string | object): void {
		console.log(
			`${this.ANSI_MAGENTA}${this.getCurrentTimestamp()}\t${
				this.ANSI_CYAN
			}DEBUG\t${this.ANSI_RESET}${this.formatMessage(message)}`,
		);
	}

	public static printInfo(message: string | object): void {
		console.log(
			`${this.ANSI_MAGENTA}${this.getCurrentTimestamp()}\t${
				this.ANSI_GREEN
			}INFO\t${this.ANSI_RESET}${this.formatMessage(message)}`,
		);
	}

	public static printError(message: string | object): void {
		console.error(
			`${this.ANSI_MAGENTA}${this.getCurrentTimestamp()}\t${
				this.ANSI_RED
			}ERROR\t${this.ANSI_RESET}${this.formatMessage(message)}`,
		);
	}

	public static printFatalError(message: string | object): void {
		console.error(
			`${this.ANSI_MAGENTA}${this.getCurrentTimestamp()}\t${
				this.ANSI_RED
			}FATAL ERROR\t${this.ANSI_RESET}${this.formatMessage(message)}`,
		);
		process.exit(1);
	}

	public static printWarning(message: string | object): void {
		console.log(
			`${this.ANSI_MAGENTA}${this.getCurrentTimestamp()}\t${
				this.ANSI_YELLOW
			}WARN\t${this.ANSI_RESET}${this.formatMessage(message)}`,
		);
	}
}

export default Logger;
