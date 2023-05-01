import * as vscode from 'vscode';


export function activate(context: vscode.ExtensionContext) {
	// 注册命令
	let disposable = vscode.commands.registerCommand('unicode-show.showUnicode', () => {
		// 获取当前选中的文本
		const editor = vscode.window.activeTextEditor;
		if (!editor) return;

		const selection = editor.selection;
		const text = editor.document.getText(selection);

		// 判断是否为 Unicode 码点
		const match = text.match(/^U\+([0-9A-F]{4,6})$/i)
			|| text.match(/^\\u([0-9A-F]{4})$/i)
			|| text.match(/^\\U([0-9A-F]{8})$/i)
			|| text.match(/^\\x([0-9A-F]{2})$/i)
			|| text.match(/^&#([0-9]+);?$/i)
			|| text.match(/^&#x([0-9A-F]+);?$/i);
		if (!match) return;

		const codePoint = parseInt(match[1], 16);
		const char = String.fromCodePoint(codePoint);

		// 显示悬浮窗
		vscode.window.showInformationMessage(char);
	});

	context.subscriptions.push(disposable);
}
export function deactivate() { }