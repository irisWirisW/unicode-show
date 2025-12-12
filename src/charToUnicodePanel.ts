import * as vscode from "vscode";
import { BaseWebviewPanel } from "./baseWebviewPanel";
import { MESSAGE_COMMANDS, WEBVIEW_PANELS } from "./constants";
import { findBlockByCodePoint } from "./data/unicodeBlocks";
import { UnicodeInfoService } from "./services/unicodeInfoService";
import type { AnyWebviewMessage } from "./types";
import { isWebviewMessage } from "./types";
import { HtmlTemplates } from "./utils/htmlTemplates";

/**
 * 反向转换消息类型
 */
interface ConvertCharMessage {
  command: "convertChar";
  char: string;
}

interface CopyTextMessage {
  command: "copyText";
  text: string;
}

type ReverseConverterMessage = AnyWebviewMessage | ConvertCharMessage | CopyTextMessage;

function isConvertCharMessage(value: unknown): value is ConvertCharMessage {
  return isWebviewMessage(value) && value.command === "convertChar" && "char" in value;
}

function isCopyTextMessage(value: unknown): value is CopyTextMessage {
  return isWebviewMessage(value) && value.command === "copyText" && "text" in value;
}

/**
 * 反向转换结果
 */
interface CharacterConversionResult {
  char: string;
  codePoint: number;
  unicodeHex: string;
  utf8Bytes: string;
  utf16Bytes: string;
  htmlEntity: string;
  htmlHexEntity: string;
  jsEscape: string;
  jsEscapeExtended?: string;
  pythonEscape: string;
  cssEscape: string;
  block?: string;
}

export class CharToUnicodePanel extends BaseWebviewPanel {
  public static currentPanel: CharToUnicodePanel | undefined;

  private constructor(panel: vscode.WebviewPanel) {
    super(panel);
  }

  public static createOrShow(_extensionUri: vscode.Uri): void {
    if (CharToUnicodePanel.currentPanel) {
      CharToUnicodePanel.currentPanel._panel.reveal(vscode.ViewColumn.One);
      return;
    }

    const panel = vscode.window.createWebviewPanel(WEBVIEW_PANELS.UNICODE_VIEWER, "字符转 Unicode", vscode.ViewColumn.One, {
      enableScripts: true,
      retainContextWhenHidden: true,
    });

    CharToUnicodePanel.currentPanel = new CharToUnicodePanel(panel);
  }

  protected handleMessage(message: ReverseConverterMessage): void {
    if (isConvertCharMessage(message)) {
      this.convertCharacter(message.char);
    } else if (isCopyTextMessage(message)) {
      vscode.env.clipboard.writeText(message.text);
      vscode.window.showInformationMessage(`已复制: ${message.text}`);
    }
  }

  private convertCharacter(input: string): void {
    if (!input || input.length === 0) {
      this.postMessage({
        command: MESSAGE_COMMANDS.SHOW_ERROR,
        message: "请输入字符",
      } as AnyWebviewMessage);
      return;
    }

    // 获取所有字符的信息
    const results: CharacterConversionResult[] = [];
    const chars = [...input]; // 使用扩展运算符正确处理代理对

    for (const char of chars) {
      const codePoint = char.codePointAt(0);
      if (codePoint === undefined) continue;

      const unicodeHex = codePoint.toString(16).toUpperCase().padStart(4, "0");
      const info = UnicodeInfoService.getCharacterInfo(char, codePoint, unicodeHex);
      const block = findBlockByCodePoint(codePoint);

      const result: CharacterConversionResult = {
        char,
        codePoint,
        unicodeHex,
        utf8Bytes: info.utf8Bytes,
        utf16Bytes: info.utf16Bytes,
        htmlEntity: info.htmlEntity,
        htmlHexEntity: info.htmlHexEntity,
        jsEscape: codePoint > 0xffff ? `\\u{${unicodeHex}}` : `\\u${unicodeHex.padStart(4, "0")}`,
        pythonEscape: codePoint > 0xffff ? `\\U${unicodeHex.padStart(8, "0")}` : `\\u${unicodeHex.padStart(4, "0")}`,
        cssEscape: `\\${unicodeHex}`,
        block: block?.name,
      };

      if (codePoint > 0xffff) {
        result.jsEscapeExtended = `\\u{${unicodeHex}}`;
      }

      results.push(result);
    }

    this.postMessage({
      command: MESSAGE_COMMANDS.SHOW_RESULT,
      char: "",
      codePoint: 0,
      unicodeHex: "",
      format: "charResults",
      input: JSON.stringify(results),
    } as AnyWebviewMessage);
  }

  protected getWebviewContent(): string {
    const content = `
            <div class="container">
                <h1>字符转 Unicode</h1>
                <p class="subtitle">输入任意字符，获取其 Unicode 码点和各种编码格式</p>

                <div class="input-section">
                    <div class="input-group">
                        <input
                            type="text"
                            id="charInput"
                            placeholder="输入字符，例如：中 😀 α ★"
                            autofocus
                        />
                        <button id="convertBtn">转换</button>
                    </div>
                </div>

                <div id="errorMessage" class="error-message"></div>

                <div id="resultsContainer" class="results-container"></div>

                <div class="examples">
                    <h3>示例字符（点击快速填入）</h3>
                    <div class="example-list">
                        <span class="example-char" data-char="中">中</span>
                        <span class="example-char" data-char="😀">😀</span>
                        <span class="example-char" data-char="α">α</span>
                        <span class="example-char" data-char="★">★</span>
                        <span class="example-char" data-char="♠">♠</span>
                        <span class="example-char" data-char="→">→</span>
                        <span class="example-char" data-char="∞">∞</span>
                        <span class="example-char" data-char="©">©</span>
                        <span class="example-char" data-char="你好">你好</span>
                        <span class="example-char" data-char="🎉🎊">🎉🎊</span>
                    </div>
                </div>
            </div>
        `;

    const extraStyles = `
            .subtitle {
                color: var(--vscode-descriptionForeground);
                margin-bottom: 20px;
            }

            .input-section {
                margin: 20px 0;
            }

            .input-group {
                display: flex;
                gap: 10px;
            }

            input {
                flex: 1;
                font-size: 18px;
            }

            .results-container {
                margin: 20px 0;
            }

            .char-result {
                background-color: var(--vscode-editor-background);
                border: 1px solid var(--vscode-panel-border);
                border-radius: 8px;
                padding: 20px;
                margin-bottom: 15px;
            }

            .char-header {
                display: flex;
                align-items: center;
                gap: 20px;
                margin-bottom: 15px;
                padding-bottom: 15px;
                border-bottom: 1px solid var(--vscode-panel-border);
            }

            .big-char {
                font-size: 48px;
                min-width: 80px;
                text-align: center;
            }

            .char-info {
                flex: 1;
            }

            .char-info h3 {
                margin: 0 0 5px 0;
                font-size: 18px;
            }

            .char-info p {
                margin: 0;
                color: var(--vscode-descriptionForeground);
            }

            .encoding-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
                gap: 10px;
            }

            .encoding-item {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 10px 12px;
                background-color: var(--vscode-input-background);
                border-radius: 4px;
            }

            .encoding-label {
                font-weight: bold;
                color: var(--vscode-descriptionForeground);
                min-width: 100px;
            }

            .encoding-value {
                font-family: 'Courier New', monospace;
                flex: 1;
                text-align: right;
                margin: 0 10px;
                word-break: break-all;
            }

            .copy-btn {
                padding: 4px 8px;
                font-size: 12px;
                cursor: pointer;
                background-color: var(--vscode-button-secondaryBackground);
                color: var(--vscode-button-secondaryForeground);
                border: none;
                border-radius: 3px;
            }

            .copy-btn:hover {
                background-color: var(--vscode-button-secondaryHoverBackground);
            }

            .examples {
                margin-top: 30px;
                padding: 20px;
                background-color: var(--vscode-textBlockQuote-background);
                border-radius: 4px;
            }

            .examples h3 {
                margin-top: 0;
                margin-bottom: 15px;
            }

            .example-list {
                display: flex;
                flex-wrap: wrap;
                gap: 10px;
            }

            .example-char {
                font-size: 20px;
                padding: 8px 15px;
                background-color: var(--vscode-input-background);
                border-radius: 4px;
                cursor: pointer;
                transition: all 0.2s;
            }

            .example-char:hover {
                background-color: var(--vscode-list-hoverBackground);
                transform: scale(1.1);
            }
        `;

    const extraScripts = `
            const input = document.getElementById('charInput');
            const convertBtn = document.getElementById('convertBtn');
            const errorMessage = document.getElementById('errorMessage');
            const resultsContainer = document.getElementById('resultsContainer');

            convertBtn.addEventListener('click', () => {
                const char = input.value;
                hideMessages();
                vscode.postMessage({ command: 'convertChar', char: char });
            });

            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    convertBtn.click();
                }
            });

            document.querySelectorAll('.example-char').forEach(item => {
                item.addEventListener('click', () => {
                    input.value = item.dataset.char;
                    input.focus();
                    convertBtn.click();
                });
            });

            window.addEventListener('message', event => {
                const message = event.data;
                if (message.command === '${MESSAGE_COMMANDS.SHOW_RESULT}' && message.format === 'charResults') {
                    hideMessages();
                    const results = JSON.parse(message.input);
                    renderResults(results);
                } else if (message.command === '${MESSAGE_COMMANDS.SHOW_ERROR}') {
                    hideMessages();
                    errorMessage.textContent = message.message;
                    errorMessage.classList.add('show');
                }
            });

            function hideMessages() {
                errorMessage.classList.remove('show');
                resultsContainer.innerHTML = '';
            }

            function renderResults(results) {
                resultsContainer.innerHTML = results.map(r => \`
                    <div class="char-result">
                        <div class="char-header">
                            <div class="big-char">\${escapeHtml(r.char)}</div>
                            <div class="char-info">
                                <h3>U+\${r.unicodeHex}</h3>
                                <p>十进制: \${r.codePoint}\${r.block ? ' | 区块: ' + r.block : ''}</p>
                            </div>
                        </div>
                        <div class="encoding-grid">
                            <div class="encoding-item">
                                <span class="encoding-label">Unicode</span>
                                <span class="encoding-value">U+\${r.unicodeHex}</span>
                                <button class="copy-btn" onclick="copyText('U+\${r.unicodeHex}')">复制</button>
                            </div>
                            <div class="encoding-item">
                                <span class="encoding-label">十进制</span>
                                <span class="encoding-value">\${r.codePoint}</span>
                                <button class="copy-btn" onclick="copyText('\${r.codePoint}')">复制</button>
                            </div>
                            <div class="encoding-item">
                                <span class="encoding-label">HTML 实体</span>
                                <span class="encoding-value">\${escapeHtml(r.htmlEntity)}</span>
                                <button class="copy-btn" onclick="copyText('\${r.htmlEntity}')">复制</button>
                            </div>
                            <div class="encoding-item">
                                <span class="encoding-label">HTML 十六进制</span>
                                <span class="encoding-value">\${escapeHtml(r.htmlHexEntity)}</span>
                                <button class="copy-btn" onclick="copyText('\${r.htmlHexEntity}')">复制</button>
                            </div>
                            <div class="encoding-item">
                                <span class="encoding-label">JavaScript</span>
                                <span class="encoding-value">\${r.jsEscape}</span>
                                <button class="copy-btn" onclick="copyText('\${escapeJs(r.jsEscape)}')">复制</button>
                            </div>
                            <div class="encoding-item">
                                <span class="encoding-label">Python</span>
                                <span class="encoding-value">\${r.pythonEscape}</span>
                                <button class="copy-btn" onclick="copyText('\${escapeJs(r.pythonEscape)}')">复制</button>
                            </div>
                            <div class="encoding-item">
                                <span class="encoding-label">CSS</span>
                                <span class="encoding-value">\${r.cssEscape}</span>
                                <button class="copy-btn" onclick="copyText('\${escapeJs(r.cssEscape)}')">复制</button>
                            </div>
                            <div class="encoding-item">
                                <span class="encoding-label">UTF-8</span>
                                <span class="encoding-value">\${r.utf8Bytes}</span>
                                <button class="copy-btn" onclick="copyText('\${r.utf8Bytes}')">复制</button>
                            </div>
                            <div class="encoding-item">
                                <span class="encoding-label">UTF-16</span>
                                <span class="encoding-value">\${r.utf16Bytes}</span>
                                <button class="copy-btn" onclick="copyText('\${r.utf16Bytes}')">复制</button>
                            </div>
                        </div>
                    </div>
                \`).join('');
            }

            function copyText(text) {
                vscode.postMessage({ command: 'copyText', text: text });
            }

            function escapeHtml(str) {
                const div = document.createElement('div');
                div.textContent = str;
                return div.innerHTML;
            }

            function escapeJs(str) {
                return str.replace(/\\\\/g, '\\\\\\\\').replace(/'/g, "\\\\'");
            }
        `;

    return HtmlTemplates.createBaseHtml("字符转 Unicode", content, extraStyles, extraScripts);
  }

  public dispose(): void {
    CharToUnicodePanel.currentPanel = undefined;
    super.dispose();
  }
}
