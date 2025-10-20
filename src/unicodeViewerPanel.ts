import * as vscode from 'vscode';
import { BaseWebviewPanel } from './baseWebviewPanel';
import { UnicodeConverter } from './unicodeConverter';

export class UnicodeViewerPanel extends BaseWebviewPanel {
    public static currentPanel: UnicodeViewerPanel | undefined;

    private constructor(panel: vscode.WebviewPanel, extensionUri: vscode.Uri) {
        super(panel);
    }

    public static createOrShow(extensionUri: vscode.Uri) {
        // 如果已经存在面板，则显示它
        if (UnicodeViewerPanel.currentPanel) {
            UnicodeViewerPanel.currentPanel._panel.reveal(vscode.ViewColumn.One);
            return;
        }

        // 创建新的面板
        const panel = vscode.window.createWebviewPanel(
            'unicodeViewer',
            '📖 Unicode 查看器',
            vscode.ViewColumn.One,
            {
                enableScripts: true,
                retainContextWhenHidden: true
            }
        );

        UnicodeViewerPanel.currentPanel = new UnicodeViewerPanel(panel, extensionUri);
    }

    protected handleMessage(message: any): void {
        switch (message.command) {
            case 'convertUnicode':
                this._convertUnicode(message.text);
                break;
        }
    }

    private _convertUnicode(text: string) {
        if (!text || text.trim() === '') {
            this.postMessage({
                command: 'showError',
                message: '请输入 Unicode 码点'
            });
            return;
        }

        const result = UnicodeConverter.convert(text.trim());

        if (result.success) {
            this.postMessage({
                command: 'showResult',
                char: result.char,
                codePoint: result.codePoint,
                unicodeHex: result.unicodeHex,
                format: result.format,
                input: text.trim()
            });
        } else {
            this.postMessage({
                command: 'showError',
                message: result.error
            });
        }
    }

    protected getWebviewContent(): string {
        return this._getWebviewContent();
    }

    private _getWebviewContent(): string {
        return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Unicode 查看器</title>
    <style>
        body {
            padding: 20px;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            background-color: var(--vscode-editor-background);
            color: var(--vscode-editor-foreground);
        }

        .container {
            max-width: 700px;
            margin: 0 auto;
        }

        h1 {
            text-align: center;
            color: var(--vscode-editor-foreground);
            margin-bottom: 30px;
            font-size: 24px;
        }

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
            padding: 10px;
            font-size: 16px;
            background-color: var(--vscode-input-background);
            color: var(--vscode-input-foreground);
            border: 1px solid var(--vscode-input-border);
            border-radius: 4px;
            font-family: 'Courier New', monospace;
        }

        input:focus {
            outline: none;
            border-color: var(--vscode-focusBorder);
        }

        button {
            background-color: var(--vscode-button-background);
            color: var(--vscode-button-foreground);
            border: none;
            padding: 10px 25px;
            font-size: 16px;
            cursor: pointer;
            border-radius: 4px;
            transition: background-color 0.2s;
        }

        button:hover {
            background-color: var(--vscode-button-hoverBackground);
        }

        button:active {
            transform: scale(0.98);
        }

        .result-container {
            margin-top: 40px;
            padding: 30px;
            background-color: var(--vscode-editor-inactiveSelectionBackground);
            border-radius: 8px;
            border: 1px solid var(--vscode-panel-border);
            display: none;
        }

        .result-container.show {
            display: block;
            animation: fadeIn 0.3s;
        }

        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(-10px); }
            to { opacity: 1; transform: translateY(0); }
        }

        .unicode-display {
            text-align: center;
            font-size: 120px;
            margin: 20px 0;
            line-height: 1.2;
        }

        .unicode-info {
            margin-top: 20px;
        }

        .info-row {
            display: flex;
            justify-content: space-between;
            padding: 10px 0;
            border-bottom: 1px solid var(--vscode-panel-border);
        }

        .info-row:last-child {
            border-bottom: none;
        }

        .info-label {
            font-weight: bold;
            color: var(--vscode-textLink-foreground);
        }

        .info-value {
            font-family: 'Courier New', monospace;
            color: var(--vscode-editor-foreground);
        }

        .error-message {
            margin-top: 20px;
            padding: 15px;
            background-color: var(--vscode-inputValidation-errorBackground);
            border: 1px solid var(--vscode-inputValidation-errorBorder);
            border-radius: 4px;
            color: var(--vscode-inputValidation-errorForeground);
            display: none;
        }

        .error-message.show {
            display: block;
            animation: shake 0.5s;
        }

        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-10px); }
            75% { transform: translateX(10px); }
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

        .copy-button {
            padding: 8px 20px;
            font-size: 14px;
            margin-top: 20px;
            background-color: var(--vscode-button-secondaryBackground);
            color: var(--vscode-button-secondaryForeground);
        }

        .copy-button:hover {
            background-color: var(--vscode-button-secondaryHoverBackground);
        }

        .button-group {
            text-align: center;
        }
    </style>
</head>
<body>
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

        <div id="resultContainer" class="result-container">
            <div class="unicode-display" id="unicodeChar"></div>
            <div class="unicode-info">
                <div class="info-row">
                    <span class="info-label">输入格式:</span>
                    <span class="info-value" id="inputFormat"></span>
                </div>
                <div class="info-row">
                    <span class="info-label">Unicode 格式:</span>
                    <span class="info-value" id="unicodeFormat"></span>
                </div>
                <div class="info-row">
                    <span class="info-label">十六进制:</span>
                    <span class="info-value" id="unicodeHex"></span>
                </div>
                <div class="info-row">
                    <span class="info-label">十进制:</span>
                    <span class="info-value" id="unicodeDecimal"></span>
                </div>
            </div>
            <div class="button-group">
                <button class="copy-button" id="copyBtn">复制字符</button>
            </div>
        </div>

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

    <script>
        const vscode = acquireVsCodeApi();

        const input = document.getElementById('unicodeInput');
        const convertBtn = document.getElementById('convertBtn');
        const errorMessage = document.getElementById('errorMessage');
        const resultContainer = document.getElementById('resultContainer');

        // 转换按钮点击事件
        convertBtn.addEventListener('click', () => {
            const text = input.value;
            hideMessages();
            vscode.postMessage({ command: 'convertUnicode', text: text });
        });

        // 回车键提交
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                convertBtn.click();
            }
        });

        // 复制按钮
        document.getElementById('copyBtn').addEventListener('click', () => {
            const char = document.getElementById('unicodeChar').textContent;
            navigator.clipboard.writeText(char).then(() => {
                const btn = document.getElementById('copyBtn');
                const originalText = btn.textContent;
                btn.textContent = '✓ 已复制!';
                setTimeout(() => {
                    btn.textContent = originalText;
                }, 2000);
            });
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
                case 'showResult':
                    hideMessages();
                    document.getElementById('unicodeChar').textContent = message.char;
                    document.getElementById('inputFormat').textContent = message.input;
                    document.getElementById('unicodeFormat').textContent = message.format;
                    document.getElementById('unicodeHex').textContent = '0x' + message.unicodeHex;
                    document.getElementById('unicodeDecimal').textContent = message.codePoint;
                    resultContainer.classList.add('show');
                    break;
                case 'showError':
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
    </script>
</body>
</html>`;
    }

    public dispose() {
        UnicodeViewerPanel.currentPanel = undefined;
        super.dispose();
        this._panel.dispose();
    }
}
