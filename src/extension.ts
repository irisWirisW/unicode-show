import * as vscode from 'vscode';
import { showFromUnicodeText } from './showSymbolFromUnicodetext';

export function activate(context: vscode.ExtensionContext) {
	console.log('Unicode Tools activated.');

	// 注册命令
	const commandDisposable = vscode.commands.registerCommand(
		'unicode-show.showUnicode',
		showFromUnicodeText
	);

	// 注册悬浮提示提供者
	const hoverDisposable = vscode.languages.registerHoverProvider(
		['python', 'javascript', 'typescript', 'markdown', 'plaintext'],
		{
			async provideHover(document, position, token) {
				const editor = vscode.window.activeTextEditor;
				if (!editor) {
					return;
				}

				const selection = editor.selection;
				const text = editor.document.getText(selection);

				if (!text) {
					return;
				}

				const symbol = showFromUnicodeText(text);
				const range = document.getWordRangeAtPosition(position);

				return new vscode.Hover(symbol, range);
			},
		}
	);

	context.subscriptions.push(commandDisposable, hoverDisposable);
}

export function deactivate() {
	console.log('Unicode Tools deactivated.');
}