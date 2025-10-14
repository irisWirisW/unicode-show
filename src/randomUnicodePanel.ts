import * as vscode from 'vscode';

export class RandomUnicodePanel {
    public static currentPanel: RandomUnicodePanel | undefined;
    private readonly _panel: vscode.WebviewPanel;
    private _disposables: vscode.Disposable[] = [];

    private constructor(panel: vscode.WebviewPanel, extensionUri: vscode.Uri) {
        this._panel = panel;

        // 设置 webview 内容
        this._panel.webview.html = this._getWebviewContent();

        // 监听 webview 的消息
        this._panel.webview.onDidReceiveMessage(
            message => {
                switch (message.command) {
                    case 'generateRandom':
                        this._generateRandomUnicode();
                        break;
                }
            },
            null,
            this._disposables
        );

        // 当 panel 被关闭时清理
        this._panel.onDidDispose(() => this.dispose(), null, this._disposables);
    }

    public static createOrShow(extensionUri: vscode.Uri) {
        // 如果已经存在面板，则显示它
        if (RandomUnicodePanel.currentPanel) {
            RandomUnicodePanel.currentPanel._panel.reveal(vscode.ViewColumn.One);
            return;
        }

        // 创建新的面板
        const panel = vscode.window.createWebviewPanel(
            'randomUnicode',
            '🎲 随机 Unicode',
            vscode.ViewColumn.One,
            {
                enableScripts: true,
                retainContextWhenHidden: true
            }
        );

        RandomUnicodePanel.currentPanel = new RandomUnicodePanel(panel, extensionUri);
    }

    private _generateRandomUnicode() {
        // 生成随机 Unicode 码点
        // Unicode 范围：0x0000 到 0x10FFFF
        // 为了生成更有意义的字符，我们选择几个常用区域
        const ranges = [
            { start: 0x0020, end: 0x007E },   // 基本拉丁字母
            { start: 0x00A0, end: 0x00FF },   // 拉丁补充-1
            { start: 0x0370, end: 0x03FF },   // 希腊字母
            { start: 0x0400, end: 0x04FF },   // 西里尔字母
            { start: 0x4E00, end: 0x9FFF },   // 中日韩统一表意文字
            { start: 0x1F300, end: 0x1F9FF }, // 表情符号和图形符号
            { start: 0x2600, end: 0x26FF },   // 杂项符号
            { start: 0x2700, end: 0x27BF },   // 装饰符号
            { start: 0x1F600, end: 0x1F64F }, // 表情符号
        ];

        // 随机选择一个范围
        const range = ranges[Math.floor(Math.random() * ranges.length)];
        const codePoint = Math.floor(Math.random() * (range.end - range.start + 1)) + range.start;

        try {
            const char = String.fromCodePoint(codePoint);
            const unicodeHex = codePoint.toString(16).toUpperCase().padStart(4, '0');

            // 发送结果回 webview
            this._panel.webview.postMessage({
                command: 'showUnicode',
                char: char,
                codePoint: codePoint,
                unicodeHex: unicodeHex,
                format: `U+${unicodeHex}`
            });
        } catch (error) {
            vscode.window.showErrorMessage(`生成 Unicode 失败: ${error}`);
        }
    }

    private _getWebviewContent(): string {
        return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>随机 Unicode 生成器</title>
    <style>
        body {
            padding: 20px;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            background-color: var(--vscode-editor-background);
            color: var(--vscode-editor-foreground);
        }

        .container {
            max-width: 600px;
            margin: 0 auto;
        }

        h1 {
            text-align: center;
            color: var(--vscode-editor-foreground);
            margin-bottom: 30px;
            font-size: 24px;
        }

        .button-container {
            text-align: center;
            margin: 30px 0;
        }

        button {
            background-color: var(--vscode-button-background);
            color: var(--vscode-button-foreground);
            border: none;
            padding: 12px 30px;
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
            min-height: 200px;
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
    </style>
</head>
<body>
    <div class="container">
        <h1>🎲 随机 Unicode 字符生成器</h1>

        <div class="button-container">
            <button id="generateBtn">生成随机 Unicode</button>
        </div>

        <div id="resultContainer" class="result-container">
            <div class="unicode-display" id="unicodeChar"></div>
            <div class="unicode-info">
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
            <div class="button-container">
                <button class="copy-button" id="copyBtn">复制字符</button>
            </div>
        </div>

        <div class="tips">
            <h3>💡 使用提示</h3>
            <p>• 点击上方按钮生成随机 Unicode 字符</p>
            <p>• 生成的字符来自多个 Unicode 区域，包括基本字符、符号、表情等</p>
            <p>• 点击"复制字符"按钮可以将字符复制到剪贴板</p>
            <p>• 你可以使用本插件的悬停功能查看任何 Unicode 码点对应的字符</p>
        </div>
    </div>

    <script>
        const vscode = acquireVsCodeApi();

        document.getElementById('generateBtn').addEventListener('click', () => {
            vscode.postMessage({ command: 'generateRandom' });
        });

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

        window.addEventListener('message', event => {
            const message = event.data;
            switch (message.command) {
                case 'showUnicode':
                    document.getElementById('unicodeChar').textContent = message.char;
                    document.getElementById('unicodeFormat').textContent = message.format;
                    document.getElementById('unicodeHex').textContent = '0x' + message.unicodeHex;
                    document.getElementById('unicodeDecimal').textContent = message.codePoint;
                    document.getElementById('resultContainer').classList.add('show');
                    break;
            }
        });
    </script>
</body>
</html>`;
    }

    public dispose() {
        RandomUnicodePanel.currentPanel = undefined;

        this._panel.dispose();

        while (this._disposables.length) {
            const disposable = this._disposables.pop();
            if (disposable) {
                disposable.dispose();
            }
        }
    }
}
