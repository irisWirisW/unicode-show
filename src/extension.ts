import * as vscode from 'vscode';
import { showFromUnicodeText } from './showSymbolFromUnicodetext';
export function activate(context: vscode.ExtensionContext) {
	console.log('Unicode Tools activated.')
	const register = vscode.commands.registerTextEditorCommand;
	// const tokens = [
	// 	register('unicode-show.showUnicode', insertCommandFactory(codesToText, null, false)),
	// ]

	// 注册命令
	let disposable = [
		vscode.commands.registerCommand(
			'unicode-show.showUnicode', showFromUnicodeText)];


	const hoverDisposable = vscode.languages.registerHoverProvider(
		["python", "typescript", "javascript", "vue"],
		{
			async provideHover(document, position, token) {
				const range = document.getWordRangeAtPosition(position);
				const word = document.getText(range);
				// get the select text
				const editor = vscode.window.activeTextEditor;
				if (!editor) return;
				const selection = editor.selection;
				const text = editor.document.getText(selection);
				const symbol = showFromUnicodeText(text);
				return new vscode.Hover(symbol, range);
			},
		}
	);
	context.subscriptions.push(...disposable, hoverDisposable);
}

export function deactivate() { }