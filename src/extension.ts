import * as vscode from "vscode";
import { COMMANDS, SUPPORTED_LANGUAGES } from "./constants";
import { RandomUnicodePanel } from "./randomUnicodePanel";
import type { UnicodeCharacterInfo } from "./services/unicodeInfoService";
import { UnicodeInfoService } from "./services/unicodeInfoService";
import { showFromUnicodeText } from "./showSymbolFromUnicodetext";
import { UnicodeConverter } from "./unicodeConverter";
import { UnicodeTreeProvider } from "./unicodeTreeProvider";
import { UnicodeViewerPanel } from "./unicodeViewerPanel";
import { logger } from "./utils/logger";

/**
 * 激活扩展
 */
export function activate(context: vscode.ExtensionContext): void {
	logger.info("Unicode Tools activated.");

	// 注册树视图提供者
	registerTreeView(context);

	// 注册命令
	registerCommands(context);

	// 注册悬浮提示提供者
	registerHoverProvider(context);
}

/**
 * 注册树视图
 */
function registerTreeView(context: vscode.ExtensionContext): void {
	const treeDataProvider = new UnicodeTreeProvider();
	const treeView = vscode.window.createTreeView("unicodeExplorer", {
		treeDataProvider: treeDataProvider,
	});
	context.subscriptions.push(treeView);
}

/**
 * 注册所有命令
 */
function registerCommands(context: vscode.ExtensionContext): void {
	// 注册 showUnicode 命令
	const showUnicodeDisposable = vscode.commands.registerCommand(COMMANDS.SHOW_UNICODE, showFromUnicodeText);

	// 注册随机 Unicode 生成器命令
	const randomUnicodeDisposable = vscode.commands.registerCommand(COMMANDS.OPEN_RANDOM_UNICODE, () => {
		RandomUnicodePanel.createOrShow(context.extensionUri);
	});

	// 注册 Unicode 查看器命令
	const unicodeViewerDisposable = vscode.commands.registerCommand(COMMANDS.OPEN_UNICODE_VIEWER, () => {
		UnicodeViewerPanel.createOrShow(context.extensionUri);
	});

	context.subscriptions.push(showUnicodeDisposable, randomUnicodeDisposable, unicodeViewerDisposable);
}

/**
 * 注册悬浮提示提供者
 */
function registerHoverProvider(context: vscode.ExtensionContext): void {
	const hoverDisposable = vscode.languages.registerHoverProvider(SUPPORTED_LANGUAGES, {
		async provideHover(_document, _position, _token) {
			return createHover();
		},
	});

	context.subscriptions.push(hoverDisposable);
}

/**
 * 创建悬浮提示内容
 */
function createHover(): vscode.Hover | undefined {
	const editor = vscode.window.activeTextEditor;
	if (!editor) {
		return undefined;
	}

	const selection = editor.selection;
	const text = editor.document.getText(selection);

	if (!text) {
		return undefined;
	}

	const result = UnicodeConverter.convert(text);

	if (!result.success || !result.char || result.codePoint === undefined || !result.unicodeHex) {
		return undefined;
	}

	try {
		// 获取字符的完整信息
		const info = UnicodeInfoService.getCharacterInfo(result.char, result.codePoint, result.unicodeHex);

		// 构建悬浮提示内容
		const markdown = buildHoverMarkdown(info);

		return new vscode.Hover(markdown, editor.selection);
	} catch (error) {
		logger.error("Error creating hover:", error);
		return undefined;
	}
}

/**
 * 转义 Markdown 特殊字符
 */
function escapeMarkdown(text: string): string {
	return text.replace(/[\\`*_{}[\]()#+\-.!|]/g, "\\$&");
}

/**
 * 构建悬浮提示的 Markdown 内容
 */
function buildHoverMarkdown(info: UnicodeCharacterInfo): vscode.MarkdownString {
	const markdown = new vscode.MarkdownString();
	markdown.supportHtml = false;
	markdown.isTrusted = false;

	// 显示字符 (字符本身使用代码块包裹以避免解析)
	markdown.appendMarkdown(`# 字符: \`${escapeMarkdown(info.char)}\`\n\n`);

	// 基本信息
	markdown.appendMarkdown(`### 基本信息\n`);
	markdown.appendMarkdown(`- **字符名称:** ${escapeMarkdown(info.name)}\n`);
	markdown.appendMarkdown(`- **Unicode分类:** ${escapeMarkdown(info.category)} (${escapeMarkdown(info.categoryDescription)})\n`);
	markdown.appendMarkdown(`- **脚本:** ${escapeMarkdown(info.script)}\n\n`);

	// 码点信息
	markdown.appendMarkdown(`### 码点信息\n`);
	markdown.appendMarkdown(`- **十进制:** ${info.codePoint}\n`);
	markdown.appendMarkdown(`- **十六进制:** U+${escapeMarkdown(info.unicodeHex)}\n`);
	markdown.appendMarkdown(`- **二进制:** ${escapeMarkdown(info.binary)}\n\n`);

	// 编码信息
	markdown.appendMarkdown(`### 编码格式\n`);
	markdown.appendMarkdown(`- **UTF-8:** ${escapeMarkdown(info.utf8Bytes)}\n`);
	markdown.appendMarkdown(`- **UTF-16:** ${escapeMarkdown(info.utf16Bytes)}\n`);
	markdown.appendMarkdown(`- **JavaScript转义:** ${escapeMarkdown(info.jsEscape)}\n`);
	if (info.jsEscapeExtended) {
		markdown.appendMarkdown(`- **JavaScript转义 (扩展):** ${escapeMarkdown(info.jsEscapeExtended)}\n`);
	}
	markdown.appendMarkdown(`\n`);

	// HTML实体
	markdown.appendMarkdown(`### HTML实体\n`);
	markdown.appendMarkdown(`- **十进制:** \`${escapeMarkdown(info.htmlEntity)}\`\n`);
	markdown.appendMarkdown(`- **十六进制:** \`${escapeMarkdown(info.htmlHexEntity)}\`\n`);

	return markdown;
}

/**
 * 停用扩展
 */
export function deactivate(): void {
	logger.info("Unicode Tools deactivated.");
}
