import * as vscode from "vscode";
import { BaseWebviewPanel } from "./baseWebviewPanel";
import { MESSAGE_COMMANDS, WEBVIEW_PANELS } from "./constants";
import type { AnyWebviewMessage, ConvertUnicodeMessage, ShowErrorMessage, ShowUnicodeMessage } from "./types";
import { UnicodeConverter } from "./unicodeConverter";
import { HtmlTemplates } from "./utils/htmlTemplates";
import { logger } from "./utils/logger";

export class UnicodeViewerPanel extends BaseWebviewPanel {
	public static currentPanel: UnicodeViewerPanel | undefined;

	private constructor(panel: vscode.WebviewPanel) {
		super(panel);
	}

	public static createOrShow(_extensionUri: vscode.Uri): void {
		// 如果已经存在面板，则显示它
		if (UnicodeViewerPanel.currentPanel) {
			UnicodeViewerPanel.currentPanel._panel.reveal(vscode.ViewColumn.One);
			return;
		}

		// 创建新的面板
		const panel = vscode.window.createWebviewPanel(WEBVIEW_PANELS.UNICODE_VIEWER, "📖 Unicode 查看器", vscode.ViewColumn.One, {
			enableScripts: true,
			retainContextWhenHidden: true,
		});

		UnicodeViewerPanel.currentPanel = new UnicodeViewerPanel(panel);
	}

	protected handleMessage(message: AnyWebviewMessage): void {
		if (message.command === MESSAGE_COMMANDS.CONVERT_UNICODE) {
			const convertMessage = message as ConvertUnicodeMessage;
			this.convertUnicode(convertMessage.text);
		}
	}

	private convertUnicode(text: string): void {
		if (!text || text.trim() === "") {
			const errorMessage: ShowErrorMessage = {
				command: MESSAGE_COMMANDS.SHOW_ERROR,
				message: "请输入 Unicode 码点",
			};
			this.postMessage(errorMessage);
			return;
		}

		const result = UnicodeConverter.convert(text.trim());

		if (result.success && result.char && result.codePoint !== undefined && result.unicodeHex && result.format) {
			const message: ShowUnicodeMessage = {
				command: MESSAGE_COMMANDS.SHOW_RESULT,
				char: result.char,
				codePoint: result.codePoint,
				unicodeHex: result.unicodeHex,
				format: result.format,
				input: text.trim(),
			};
			this.postMessage(message);
		} else {
			const errorMessage: ShowErrorMessage = {
				command: MESSAGE_COMMANDS.SHOW_ERROR,
				message: result.error || "转换失败",
			};
			this.postMessage(errorMessage);
			logger.warn("Unicode conversion failed:", result.error);
		}
	}

	protected getWebviewContent(): string {
		const content = `
            <div class="container">
                <h1>📖 Unicode 查看器</h1>

                <div class="input-section">
                    <div class="input-group">
                        <input
                            type="text"
                            id="unicodeInput"
                            placeholder="输入 Unicode 码点，例如：U+1F600 或 \\u4E2D"
                            autofocus
                        />
                        <button id="convertBtn">查看字符</button>
                    </div>
                </div>

                <div id="errorMessage" class="error-message"></div>

                ${HtmlTemplates.createResultContainer(true)}

                <div class="examples">
                    <h3>💡 支持的格式示例（点击快速填入）</h3>
                    <div class="example-list">
                        <div class="example-item" data-code="U+1F600">U+1F600 (笑脸 😀)</div>
                        <div class="example-item" data-code="\\u4E2D">\\u4E2D (汉字 中)</div>
                        <div class="example-item" data-code="\\U00000041">\\U00000041 (字母 A)</div>
                        <div class="example-item" data-code="\\x41">\\x41 (字母 A)</div>
                        <div class="example-item" data-code="&#9733;">&#9733; (星星 ★)</div>
                        <div class="example-item" data-code="&#x2764;">&#x2764; (心形 ❤)</div>
                        <div class="example-item" data-code="U+2600">U+2600 (太阳 ☀)</div>
                        <div class="example-item" data-code="1F4A1">1F4A1 (灯泡 💡)</div>
                    </div>
                </div>
            </div>
        `;

		const extraStyles = `
            .input-section {
                margin: 30px 0;
            }

            .input-group {
                display: flex;
                gap: 10px;
                margin-bottom: 15px;
            }

            input {
                flex: 1;
            }

            .examples {
                margin-top: 30px;
                padding: 20px;
                background-color: var(--vscode-textBlockQuote-background);
                border-left: 4px solid var(--vscode-textLink-foreground);
                border-radius: 4px;
            }

            .examples h3 {
                margin-top: 0;
                font-size: 16px;
                margin-bottom: 15px;
            }

            .example-list {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                gap: 10px;
                font-size: 14px;
                line-height: 1.8;
            }

            .example-item {
                font-family: 'Courier New', monospace;
                cursor: pointer;
                padding: 5px 10px;
                border-radius: 3px;
                transition: background-color 0.2s;
            }

            .example-item:hover {
                background-color: var(--vscode-list-hoverBackground);
            }
        `;

		const extraScripts = `
            const input = document.getElementById('unicodeInput');
            const convertBtn = document.getElementById('convertBtn');
            const errorMessage = document.getElementById('errorMessage');
            const resultContainer = document.getElementById('resultContainer');

            // 转换按钮点击事件
            convertBtn.addEventListener('click', () => {
                const text = input.value;
                hideMessages();
                vscode.postMessage({ command: '${MESSAGE_COMMANDS.CONVERT_UNICODE}', text: text });
            });

            // 回车键提交
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    convertBtn.click();
                }
            });

            // 示例点击事件
            document.querySelectorAll('.example-item').forEach(item => {
                item.addEventListener('click', () => {
                    const code = item.getAttribute('data-code');
                    input.value = code;
                    input.focus();
                });
            });

            // 接收消息
            window.addEventListener('message', event => {
                const message = event.data;
                switch (message.command) {
                    case '${MESSAGE_COMMANDS.SHOW_RESULT}':
                        hideMessages();
                        document.getElementById('unicodeChar').textContent = message.char;
                        document.getElementById('inputFormat').textContent = message.input;
                        document.getElementById('unicodeFormat').textContent = message.format;
                        document.getElementById('unicodeHex').textContent = '0x' + message.unicodeHex;
                        document.getElementById('unicodeDecimal').textContent = message.codePoint;
                        resultContainer.classList.add('show');
                        break;
                    case '${MESSAGE_COMMANDS.SHOW_ERROR}':
                        hideMessages();
                        errorMessage.textContent = message.message;
                        errorMessage.classList.add('show');
                        break;
                }
            });

            function hideMessages() {
                errorMessage.classList.remove('show');
                resultContainer.classList.remove('show');
            }
        `;

		return HtmlTemplates.createBaseHtml("Unicode 查看器", content, extraStyles, extraScripts);
	}

	public dispose(): void {
		UnicodeViewerPanel.currentPanel = undefined;
		super.dispose();
	}
}
