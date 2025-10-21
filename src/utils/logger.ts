/**
 * 日志工具
 */

export enum LogLevel {
    DEBUG = 0,
    INFO = 1,
    WARN = 2,
    ERROR = 3
}

export class Logger {
    private static instance: Logger;
    private logLevel: LogLevel = LogLevel.INFO;
    private prefix: string;

    private constructor(prefix: string = 'Unicode-Show') {
        this.prefix = prefix;
    }

    static getInstance(prefix?: string): Logger {
        if (!Logger.instance) {
            Logger.instance = new Logger(prefix);
        }
        return Logger.instance;
    }

    setLogLevel(level: LogLevel): void {
        this.logLevel = level;
    }

    debug(message: string, ...args: any[]): void {
        if (this.logLevel <= LogLevel.DEBUG) {
            console.log(`[${this.prefix}][DEBUG]`, message, ...args);
        }
    }

    info(message: string, ...args: any[]): void {
        if (this.logLevel <= LogLevel.INFO) {
            console.log(`[${this.prefix}][INFO]`, message, ...args);
        }
    }

    warn(message: string, ...args: any[]): void {
        if (this.logLevel <= LogLevel.WARN) {
            console.warn(`[${this.prefix}][WARN]`, message, ...args);
        }
    }

    error(message: string, error?: any): void {
        if (this.logLevel <= LogLevel.ERROR) {
            console.error(`[${this.prefix}][ERROR]`, message, error);
        }
    }
}

// 导出默认实例
export const logger = Logger.getInstance();
