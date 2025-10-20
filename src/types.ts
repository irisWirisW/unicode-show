/**
 * Unicode 转换结果类型
 */
export interface UnicodeConversionResult {
    success: boolean;
    char?: string;
    codePoint?: number;
    unicodeHex?: string;
    format?: string;
    error?: string;
}

/**
 * Unicode 范围定义
 */
export interface UnicodeRange {
    name: string;
    start: number;
    end: number;
}

/**
 * Webview 消息类型
 */
export interface WebviewMessage {
    command: string;
    [key: string]: any;
}

/**
 * Unicode 显示信息
 */
export interface UnicodeDisplayInfo {
    char: string;
    codePoint: number;
    unicodeHex: string;
    format: string;
}
