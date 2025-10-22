import type * as vscode from "vscode";

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
 * Webview 消息基础类型
 */
export interface WebviewMessage {
	command: string;
}

/**
 * 生成随机Unicode的消息
 */
export interface GenerateRandomMessage extends WebviewMessage {
	command: "generateRandom";
}

/**
 * 转换Unicode的消息
 */
export interface ConvertUnicodeMessage extends WebviewMessage {
	command: "convertUnicode";
	text: string;
}

/**
 * 显示Unicode结果的消息
 */
export interface ShowUnicodeMessage extends WebviewMessage {
	command: "showUnicode" | "showResult";
	char: string;
	codePoint: number;
	unicodeHex: string;
	format: string;
	input?: string;
}

/**
 * 显示错误的消息
 */
export interface ShowErrorMessage extends WebviewMessage {
	command: "showError";
	message: string;
}

/**
 * 所有可能的Webview消息类型
 */
export type AnyWebviewMessage = GenerateRandomMessage | ConvertUnicodeMessage | ShowUnicodeMessage | ShowErrorMessage;

/**
 * Unicode 显示信息
 */
export interface UnicodeDisplayInfo {
	char: string;
	codePoint: number;
	unicodeHex: string;
	format: string;
}

/**
 * Webview Panel 接口
 */
export interface IWebviewPanel {
	readonly panel: vscode.WebviewPanel;
	dispose(): void;
}
