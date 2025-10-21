/**
 * HTML 模板工具类
 * 提供统一的 HTML 模板管理
 */

export class HtmlTemplates {
    /**
     * 获取公共样式
     */
    static getCommonStyles(): string {
        return `
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

            input {
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

            .button-container {
                text-align: center;
                margin: 30px 0;
            }

            .button-group {
                text-align: center;
            }
        `;
    }

    /**
     * 获取公共脚本（复制按钮功能）
     */
    static getCopyButtonScript(): string {
        return `
            document.getElementById('copyBtn')?.addEventListener('click', () => {
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
        `;
    }

    /**
     * 生成基础的HTML文档框架
     */
    static createBaseHtml(title: string, content: string, extraStyles: string = '', extraScripts: string = ''): string {
        return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <style>
        ${this.getCommonStyles()}
        ${extraStyles}
    </style>
</head>
<body>
    ${content}
    <script>
        const vscode = acquireVsCodeApi();
        ${this.getCopyButtonScript()}
        ${extraScripts}
    </script>
</body>
</html>`;
    }

    /**
     * 生成结果展示容器的HTML
     */
    static createResultContainer(showInput: boolean = false): string {
        const inputRow = showInput ? `
            <div class="info-row">
                <span class="info-label">输入格式:</span>
                <span class="info-value" id="inputFormat"></span>
            </div>
        ` : '';

        return `
            <div id="resultContainer" class="result-container">
                <div class="unicode-display" id="unicodeChar"></div>
                <div class="unicode-info">
                    ${inputRow}
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
        `;
    }

    /**
     * 创建提示框HTML
     */
    static createTipsBox(title: string, tips: string[]): string {
        const tipsHtml = tips.map(tip => `<p>• ${tip}</p>`).join('\n');
        return `
            <div class="tips">
                <h3>${title}</h3>
                ${tipsHtml}
            </div>
        `;
    }
}
