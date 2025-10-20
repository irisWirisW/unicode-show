/**
 * Webview 面板基类
 * 提供公共的 Webview 面板功能
 */
export abstract class BaseWebviewPanel {
    protected readonly _panel: any;
    protected _disposables: any[] = [];

    constructor(panel: any) {
        this._panel = panel;
        this.setupPanel();
    }

    /**
     * 设置面板
     */
    protected setupPanel(): void {
        this._panel.webview.html = this.getWebviewContent();
        this.setupMessageListener();
        this.setupDisposeListener();
    }

    /**
     * 设置消息监听器
     */
    protected setupMessageListener(): void {
        this._panel.webview.onDidReceiveMessage(
            (message: any) => this.handleMessage(message),
            null,
            this._disposables
        );
    }

    /**
     * 设置面板关闭监听器
     */
    protected setupDisposeListener(): void {
        this._panel.onDidDispose(() => this.dispose(), null, this._disposables);
    }

    /**
     * 处理来自 Webview 的消息
     * @param message - 消息对象
     */
    protected abstract handleMessage(message: any): void;

    /**
     * 获取 Webview 内容
     */
    protected abstract getWebviewContent(): string;

    /**
     * 向 Webview 发送消息
     * @param message - 消息对象
     */
    protected postMessage(message: any): void {
        this._panel.webview.postMessage(message);
    }

    /**
     * 清理资源
     */
    public dispose(): void {
        this._disposables.forEach(d => d.dispose());
    }

    /**
     * 获取 VSCode 主题 CSS 变量
     */
    protected getThemeStyles(): string {
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
        `;
    }
}
