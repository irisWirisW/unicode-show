import * as vscode from "vscode";
import { BaseWebviewPanel } from "./baseWebviewPanel";
import { MESSAGE_COMMANDS, WEBVIEW_PANELS } from "./constants";
import type { AnyWebviewMessage, ShowUnicodeMessage } from "./types";
import { UnicodeConverter } from "./unicodeConverter";
import { HtmlTemplates } from "./utils/htmlTemplates";
import { logger } from "./utils/logger";

export class RandomUnicodePanel extends BaseWebviewPanel {
	public static currentPanel: RandomUnicodePanel | undefined;

	private constructor(panel: vscode.WebviewPanel) {
		super(panel);
	}

	public static createOrShow(_extensionUri: vscode.Uri): void {
		// 如果已经存在面板，则显示它
		if (RandomUnicodePanel.currentPanel) {
			RandomUnicodePanel.currentPanel._panel.reveal(vscode.ViewColumn.One);
			return;
		}

		// 创建新的面板
		const panel = vscode.window.createWebviewPanel(WEBVIEW_PANELS.RANDOM_UNICODE, "🎲 随机 Unicode", vscode.ViewColumn.One, {
			enableScripts: true,
			retainContextWhenHidden: true,
		});

		RandomUnicodePanel.currentPanel = new RandomUnicodePanel(panel);
	}

	protected handleMessage(message: AnyWebviewMessage): void {
		if (message.command === MESSAGE_COMMANDS.GENERATE_RANDOM) {
			this.generateRandomUnicode();
		}
	}

	private generateRandomUnicode(): void {
		const result = UnicodeConverter.generateRandom();

		if (result.success && result.char && result.codePoint !== undefined && result.unicodeHex && result.format) {
			const message: ShowUnicodeMessage = {
				command: MESSAGE_COMMANDS.SHOW_UNICODE,
				char: result.char,
				codePoint: result.codePoint,
				unicodeHex: result.unicodeHex,
				format: result.format,
			};
			this.postMessage(message);
		} else {
			vscode.window.showErrorMessage(result.error || "生成 Unicode 失败");
			logger.error("Failed to generate random unicode:", result.error);
		}
	}

	protected getWebviewContent(): string {
		const content = `
            <div class="container">
                <h1>🎲 随机 Unicode 字符生成器</h1>

                <div class="button-container">
                    <button id="generateBtn">生成随机 Unicode</button>
                </div>

                ${HtmlTemplates.createResultContainer(false)}

                ${HtmlTemplates.createTipsBox("💡 使用提示", ["点击上方按钮生成随机 Unicode 字符", "生成的字符来自多个 Unicode 区域，包括基本字符、符号、表情等", '点击"复制字符"按钮可以将字符复制到剪贴板', "你可以使用本插件的悬停功能查看任何 Unicode 码点对应的字符"])}
            </div>
        `;

		const extraStyles = `
            .tips {
                margin-top: 30px;
                padding: 15px;
                background-color: var(--vscode-textBlockQuote-background);
                border-left: 4px solid var(--vscode-textLink-foreground);
                border-radius: 4px;
                font-size: 14px;
                line-height: 1.6;
            }

            .tips h3 {
                margin-top: 0;
                font-size: 16px;
            }
        `;

		const extraScripts = `
            document.getElementById('generateBtn').addEventListener('click', () => {
                vscode.postMessage({ command: '${MESSAGE_COMMANDS.GENERATE_RANDOM}' });
            });

            window.addEventListener('message', event => {
                const message = event.data;
                if (message.command === '${MESSAGE_COMMANDS.SHOW_UNICODE}') {
                    document.getElementById('unicodeChar').textContent = message.char;
                    document.getElementById('unicodeFormat').textContent = message.format;
                    document.getElementById('unicodeHex').textContent = '0x' + message.unicodeHex;
                    document.getElementById('unicodeDecimal').textContent = message.codePoint;
                    document.getElementById('resultContainer').classList.add('show');
                }
            });
        `;

		return HtmlTemplates.createBaseHtml("随机 Unicode 生成器", content, extraStyles, extraScripts);
	}

	public dispose(): void {
		RandomUnicodePanel.currentPanel = undefined;
		super.dispose();
	}
}
