import * as vscode from 'vscode';
import { AnyWebviewMessage, IWebviewPanel } from './types';
import { logger } from './utils/logger';

/**
 * Webview 面板基类
 * 提供公共的 Webview 面板功能
 */
export abstract class BaseWebviewPanel implements IWebviewPanel {
    protected readonly _panel: vscode.WebviewPanel;
    protected _disposables: vscode.Disposable[] = [];

    constructor(panel: vscode.WebviewPanel) {
        this._panel = panel;
        this.setupPanel();
    }

    /**
     * 获取面板实例
     */
    get panel(): vscode.WebviewPanel {
        return this._panel;
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
            (message: AnyWebviewMessage) => {
                try {
                    this.handleMessage(message);
                } catch (error) {
                    logger.error('Error handling webview message:', error);
                }
            },
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
    protected abstract handleMessage(message: AnyWebviewMessage): void;

    /**
     * 获取 Webview 内容
     */
    protected abstract getWebviewContent(): string;

    /**
     * 向 Webview 发送消息
     * @param message - 消息对象
     */
    protected postMessage(message: AnyWebviewMessage): void {
        this._panel.webview.postMessage(message);
    }

    /**
     * 清理资源
     */
    public dispose(): void {
        this._disposables.forEach(d => d.dispose());
        this._disposables = [];
    }
}
