import * as vscode from "vscode";
import { BaseWebviewPanel } from "./baseWebviewPanel";
import { MESSAGE_COMMANDS, WEBVIEW_PANELS } from "./constants";
import { getBlocksByCategory, getCategories, UNICODE_BLOCKS, type UnicodeBlock } from "./data/unicodeBlocks";
import type { AnyWebviewMessage } from "./types";
import { isWebviewMessage } from "./types";
import { HtmlTemplates } from "./utils/htmlTemplates";

/**
 * 区块浏览器特有的消息类型
 */
interface LoadBlockMessage {
  command: "loadBlock";
  blockIndex: number;
}

interface LoadCategoryMessage {
  command: "loadCategory";
  category: string;
}

interface CopyCharMessage {
  command: "copyChar";
  char: string;
}

type BlockBrowserMessage = AnyWebviewMessage | LoadBlockMessage | LoadCategoryMessage | CopyCharMessage;

function isLoadBlockMessage(value: unknown): value is LoadBlockMessage {
  return isWebviewMessage(value) && value.command === "loadBlock" && "blockIndex" in value;
}

function isLoadCategoryMessage(value: unknown): value is LoadCategoryMessage {
  return isWebviewMessage(value) && value.command === "loadCategory" && "category" in value;
}

function isCopyCharMessage(value: unknown): value is CopyCharMessage {
  return isWebviewMessage(value) && value.command === "copyChar" && "char" in value;
}

export class UnicodeBlockBrowserPanel extends BaseWebviewPanel {
  public static currentPanel: UnicodeBlockBrowserPanel | undefined;

  private constructor(panel: vscode.WebviewPanel) {
    super(panel);
  }

  public static createOrShow(_extensionUri: vscode.Uri): void {
    if (UnicodeBlockBrowserPanel.currentPanel) {
      UnicodeBlockBrowserPanel.currentPanel._panel.reveal(vscode.ViewColumn.One);
      return;
    }

    const panel = vscode.window.createWebviewPanel(WEBVIEW_PANELS.UNICODE_VIEWER, "Unicode 区块浏览器", vscode.ViewColumn.One, {
      enableScripts: true,
      retainContextWhenHidden: true,
    });

    UnicodeBlockBrowserPanel.currentPanel = new UnicodeBlockBrowserPanel(panel);
  }

  protected handleMessage(message: BlockBrowserMessage): void {
    if (isLoadBlockMessage(message)) {
      this.loadBlock(message.blockIndex);
    } else if (isLoadCategoryMessage(message)) {
      this.loadCategory(message.category);
    } else if (isCopyCharMessage(message)) {
      vscode.env.clipboard.writeText(message.char);
      vscode.window.showInformationMessage(`已复制: ${message.char}`);
    }
  }

  private loadBlock(blockIndex: number): void {
    const block = UNICODE_BLOCKS[blockIndex];
    if (!block) return;

    const chars = this.generateBlockChars(block);
    this.postMessage({
      command: MESSAGE_COMMANDS.SHOW_RESULT,
      char: "",
      codePoint: 0,
      unicodeHex: "",
      format: "blockData",
      input: JSON.stringify({ block, chars }),
    } as AnyWebviewMessage);
  }

  private loadCategory(category: string): void {
    const blocks = getBlocksByCategory(category);
    this.postMessage({
      command: MESSAGE_COMMANDS.SHOW_RESULT,
      char: "",
      codePoint: 0,
      unicodeHex: "",
      format: "categoryData",
      input: JSON.stringify(blocks),
    } as AnyWebviewMessage);
  }

  private generateBlockChars(block: UnicodeBlock): Array<{ char: string; codePoint: number; hex: string }> {
    const chars: Array<{ char: string; codePoint: number; hex: string }> = [];
    // 限制最多显示 256 个字符，避免大区块导致性能问题
    const maxChars = 256;
    const step = Math.max(1, Math.ceil((block.end - block.start + 1) / maxChars));

    for (let cp = block.start; cp <= block.end && chars.length < maxChars; cp += step) {
      try {
        const char = String.fromCodePoint(cp);
        // 跳过控制字符和未分配字符
        if (this.isPrintable(cp)) {
          chars.push({
            char,
            codePoint: cp,
            hex: cp.toString(16).toUpperCase().padStart(4, "0"),
          });
        }
      } catch {
        // 忽略无效码点
      }
    }
    return chars;
  }

  private isPrintable(cp: number): boolean {
    // 跳过控制字符 (0x00-0x1F, 0x7F-0x9F)
    if (cp <= 0x1f || (cp >= 0x7f && cp <= 0x9f)) return false;
    // 跳过代理对范围 (0xD800-0xDFFF)
    if (cp >= 0xd800 && cp <= 0xdfff) return false;
    // 跳过私用区的大部分（只显示开头部分）
    if (cp >= 0xe100 && cp <= 0xf8ff) return false;
    return true;
  }

  protected getWebviewContent(): string {
    const categories = getCategories();
    const categoryOptions = categories.map(cat => `<option value="${cat}">${cat}</option>`).join("");

    const blockOptions = UNICODE_BLOCKS.map((block, index) => `<option value="${index}" data-category="${block.category}">${block.name} (${block.nameEn}) [U+${block.start.toString(16).toUpperCase().padStart(4, "0")}]</option>`).join("");

    const content = `
            <div class="container">
                <h1>Unicode 区块浏览器</h1>

                <div class="selector-section">
                    <div class="selector-group">
                        <label for="categorySelect">分类:</label>
                        <select id="categorySelect">
                            <option value="">-- 全部分类 --</option>
                            ${categoryOptions}
                        </select>
                    </div>
                    <div class="selector-group">
                        <label for="blockSelect">区块:</label>
                        <select id="blockSelect">
                            <option value="">-- 选择区块 --</option>
                            ${blockOptions}
                        </select>
                    </div>
                </div>

                <div id="blockInfo" class="block-info"></div>

                <div id="charGrid" class="char-grid"></div>

                <div id="charDetail" class="char-detail"></div>

                <div class="tips-box">
                    <h3>使用提示</h3>
                    <p>• 选择分类可筛选区块列表</p>
                    <p>• 点击字符可查看详情并复制</p>
                    <p>• 大型区块会显示部分代表字符</p>
                </div>
            </div>
        `;

    const extraStyles = `
            .selector-section {
                display: flex;
                gap: 20px;
                margin: 20px 0;
                flex-wrap: wrap;
            }

            .selector-group {
                display: flex;
                align-items: center;
                gap: 10px;
            }

            .selector-group label {
                font-weight: bold;
                white-space: nowrap;
            }

            select {
                padding: 8px 12px;
                font-size: 14px;
                border: 1px solid var(--vscode-input-border);
                background-color: var(--vscode-input-background);
                color: var(--vscode-input-foreground);
                border-radius: 4px;
                min-width: 250px;
            }

            .block-info {
                padding: 15px;
                background-color: var(--vscode-textBlockQuote-background);
                border-radius: 4px;
                margin-bottom: 20px;
                display: none;
            }

            .block-info.show {
                display: block;
            }

            .block-info h2 {
                margin: 0 0 10px 0;
                font-size: 18px;
            }

            .block-info p {
                margin: 5px 0;
                color: var(--vscode-descriptionForeground);
            }

            .char-grid {
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(50px, 1fr));
                gap: 5px;
                margin: 20px 0;
                max-height: 400px;
                overflow-y: auto;
                padding: 10px;
                background-color: var(--vscode-editor-background);
                border: 1px solid var(--vscode-panel-border);
                border-radius: 4px;
            }

            .char-cell {
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                padding: 8px 4px;
                background-color: var(--vscode-input-background);
                border: 1px solid var(--vscode-input-border);
                border-radius: 4px;
                cursor: pointer;
                transition: all 0.2s;
                min-height: 60px;
            }

            .char-cell:hover {
                background-color: var(--vscode-list-hoverBackground);
                border-color: var(--vscode-focusBorder);
                transform: scale(1.05);
            }

            .char-cell .char {
                font-size: 24px;
                line-height: 1.2;
            }

            .char-cell .code {
                font-size: 10px;
                color: var(--vscode-descriptionForeground);
                margin-top: 4px;
                font-family: monospace;
            }

            .char-detail {
                padding: 20px;
                background-color: var(--vscode-textBlockQuote-background);
                border-left: 4px solid var(--vscode-textLink-foreground);
                border-radius: 4px;
                margin: 20px 0;
                display: none;
            }

            .char-detail.show {
                display: block;
            }

            .char-detail .big-char {
                font-size: 64px;
                text-align: center;
                margin-bottom: 15px;
            }

            .char-detail .info-row {
                display: flex;
                justify-content: space-between;
                padding: 8px 0;
                border-bottom: 1px solid var(--vscode-panel-border);
            }

            .char-detail .info-label {
                font-weight: bold;
            }

            .char-detail .copy-btn {
                margin-top: 15px;
                width: 100%;
            }

            .tips-box {
                margin-top: 30px;
                padding: 15px;
                background-color: var(--vscode-textBlockQuote-background);
                border-radius: 4px;
            }

            .tips-box h3 {
                margin-top: 0;
            }

            .tips-box p {
                margin: 5px 0;
                color: var(--vscode-descriptionForeground);
            }
        `;

    const extraScripts = `
            const categorySelect = document.getElementById('categorySelect');
            const blockSelect = document.getElementById('blockSelect');
            const blockInfo = document.getElementById('blockInfo');
            const charGrid = document.getElementById('charGrid');
            const charDetail = document.getElementById('charDetail');

            // 分类筛选
            categorySelect.addEventListener('change', () => {
                const category = categorySelect.value;
                const options = blockSelect.querySelectorAll('option[data-category]');

                options.forEach(opt => {
                    if (!category || opt.dataset.category === category) {
                        opt.style.display = '';
                    } else {
                        opt.style.display = 'none';
                    }
                });

                blockSelect.value = '';
                blockInfo.classList.remove('show');
                charGrid.innerHTML = '';
                charDetail.classList.remove('show');
            });

            // 区块选择
            blockSelect.addEventListener('change', () => {
                const blockIndex = blockSelect.value;
                if (blockIndex !== '') {
                    vscode.postMessage({ command: 'loadBlock', blockIndex: parseInt(blockIndex) });
                }
            });

            // 接收消息
            window.addEventListener('message', event => {
                const message = event.data;
                if (message.command === '${MESSAGE_COMMANDS.SHOW_RESULT}') {
                    if (message.format === 'blockData') {
                        const data = JSON.parse(message.input);
                        renderBlock(data.block, data.chars);
                    }
                }
            });

            function renderBlock(block, chars) {
                // 显示区块信息
                blockInfo.innerHTML = \`
                    <h2>\${block.name}</h2>
                    <p><strong>英文名:</strong> \${block.nameEn}</p>
                    <p><strong>范围:</strong> U+\${block.start.toString(16).toUpperCase().padStart(4, '0')} - U+\${block.end.toString(16).toUpperCase().padStart(4, '0')}</p>
                    <p><strong>分类:</strong> \${block.category}</p>
                    <p><strong>字符数:</strong> \${block.end - block.start + 1}</p>
                \`;
                blockInfo.classList.add('show');

                // 渲染字符网格
                charGrid.innerHTML = chars.map(c => \`
                    <div class="char-cell" data-char="\${escapeHtml(c.char)}" data-cp="\${c.codePoint}" data-hex="\${c.hex}">
                        <span class="char">\${escapeHtml(c.char)}</span>
                        <span class="code">\${c.hex}</span>
                    </div>
                \`).join('');

                // 绑定点击事件
                charGrid.querySelectorAll('.char-cell').forEach(cell => {
                    cell.addEventListener('click', () => {
                        const char = cell.dataset.char;
                        const cp = parseInt(cell.dataset.cp);
                        const hex = cell.dataset.hex;
                        showCharDetail(char, cp, hex);
                    });
                });

                charDetail.classList.remove('show');
            }

            function showCharDetail(char, codePoint, hex) {
                charDetail.innerHTML = \`
                    <div class="big-char">\${escapeHtml(char)}</div>
                    <div class="info-row">
                        <span class="info-label">Unicode:</span>
                        <span>U+\${hex}</span>
                    </div>
                    <div class="info-row">
                        <span class="info-label">十进制:</span>
                        <span>\${codePoint}</span>
                    </div>
                    <div class="info-row">
                        <span class="info-label">HTML 实体:</span>
                        <span>&amp;#\${codePoint}; / &amp;#x\${hex};</span>
                    </div>
                    <div class="info-row">
                        <span class="info-label">JavaScript:</span>
                        <span>\\\\u\${hex.length <= 4 ? hex.padStart(4, '0') : '{' + hex + '}'}</span>
                    </div>
                    <button class="copy-btn" onclick="copyChar('\${escapeJs(char)}')">复制字符</button>
                \`;
                charDetail.classList.add('show');
            }

            function copyChar(char) {
                vscode.postMessage({ command: 'copyChar', char: char });
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

    return HtmlTemplates.createBaseHtml("Unicode 区块浏览器", content, extraStyles, extraScripts);
  }

  public dispose(): void {
    UnicodeBlockBrowserPanel.currentPanel = undefined;
    super.dispose();
  }
}
