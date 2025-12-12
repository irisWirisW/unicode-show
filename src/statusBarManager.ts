import * as vscode from "vscode";
import { COMMANDS } from "./constants";
import { logger } from "./utils/logger";

/**
 * 状态栏管理器
 * 在状态栏显示当前光标位置字符的 Unicode 信息
 */
export class StatusBarManager {
	private statusBarItem: vscode.StatusBarItem;
	private disposables: vscode.Disposable[] = [];

	constructor() {
		// 创建状态栏项目，显示在右侧
		this.statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
		this.statusBarItem.command = COMMANDS.SHOW_UNICODE;
		this.statusBarItem.tooltip = "点击查看 Unicode 详细信息";

		// 监听光标位置变化
		this.disposables.push(
			vscode.window.onDidChangeTextEditorSelection(e => {
				this.updateStatusBar(e.textEditor);
			}),
		);

		// 监听活动编辑器变化
		this.disposables.push(
			vscode.window.onDidChangeActiveTextEditor(editor => {
				if (editor) {
					this.updateStatusBar(editor);
				} else {
					this.hide();
				}
			}),
		);

		// 初始化时更新状态栏
		if (vscode.window.activeTextEditor) {
			this.updateStatusBar(vscode.window.activeTextEditor);
		}

		this.statusBarItem.show();
		logger.info("StatusBarManager initialized");
	}

	/**
	 * 更新状态栏显示
	 */
	private updateStatusBar(editor: vscode.TextEditor): void {
		const position = editor.selection.active;
		const document = editor.document;

		// 获取光标位置的字符
		const char = this.getCharAtPosition(document, position);

		if (!char) {
			this.statusBarItem.text = "$(symbol-string) U+----";
			this.statusBarItem.tooltip = "光标位置无字符";
			return;
		}

		// 获取字符的码点
		const codePoint = char.codePointAt(0);
		if (codePoint === undefined) {
			this.statusBarItem.text = "$(symbol-string) U+----";
			return;
		}

		// 格式化 Unicode 码点
		const unicodeHex = codePoint.toString(16).toUpperCase().padStart(4, "0");

		// 更新状态栏
		this.statusBarItem.text = `$(symbol-string) U+${unicodeHex}`;
		this.statusBarItem.tooltip = this.buildTooltip(char, codePoint, unicodeHex);
	}

	/**
	 * 获取指定位置的字符（处理代理对）
	 */
	private getCharAtPosition(document: vscode.TextDocument, position: vscode.Position): string | undefined {
		const line = document.lineAt(position.line);
		const text = line.text;

		if (position.character >= text.length) {
			return undefined;
		}

		// 处理代理对（emoji等需要两个UTF-16码元的字符）
		const charCode = text.charCodeAt(position.character);

		// 检查是否是高代理项
		if (charCode >= 0xd800 && charCode <= 0xdbff) {
			// 获取完整的代理对
			if (position.character + 1 < text.length) {
				return text.slice(position.character, position.character + 2);
			}
		}

		// 检查是否是低代理项（光标在代理对中间）
		if (charCode >= 0xdc00 && charCode <= 0xdfff) {
			// 往前取高代理项
			if (position.character > 0) {
				const prevCharCode = text.charCodeAt(position.character - 1);
				if (prevCharCode >= 0xd800 && prevCharCode <= 0xdbff) {
					return text.slice(position.character - 1, position.character + 1);
				}
			}
		}

		return text[position.character];
	}

	/**
	 * 构建工具提示内容
	 */
	private buildTooltip(char: string, codePoint: number, unicodeHex: string): vscode.MarkdownString {
		const tooltip = new vscode.MarkdownString();
		tooltip.isTrusted = true;

		tooltip.appendMarkdown(`**字符:** \`${this.escapeMarkdown(char)}\`\n\n`);
		tooltip.appendMarkdown(`**Unicode:** U+${unicodeHex}\n\n`);
		tooltip.appendMarkdown(`**十进制:** ${codePoint}\n\n`);
		tooltip.appendMarkdown(`---\n\n`);
		tooltip.appendMarkdown(`*点击查看详细信息*`);

		return tooltip;
	}

	/**
	 * 转义 Markdown 特殊字符
	 */
	private escapeMarkdown(text: string): string {
		return text.replace(/[\\`*_{}[\]()#+\-.!|]/g, "\\$&");
	}

	/**
	 * 隐藏状态栏
	 */
	private hide(): void {
		this.statusBarItem.hide();
	}

	/**
	 * 销毁状态栏管理器
	 */
	dispose(): void {
		this.statusBarItem.dispose();
		for (const disposable of this.disposables) {
			disposable.dispose();
		}
		this.disposables = [];
		logger.info("StatusBarManager disposed");
	}
}
