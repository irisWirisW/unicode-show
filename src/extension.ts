import * as vscode from 'vscode';
import { showFromUnicodeText } from './showSymbolFromUnicodetext';
import { RandomUnicodePanel } from './randomUnicodePanel';
import { UnicodeViewerPanel } from './unicodeViewerPanel';
import { UnicodeTreeProvider } from './unicodeTreeProvider';

export function activate(context: vscode.ExtensionContext) {
	console.log('Unicode Tools activated.');

	// 注册树视图提供者
	const treeDataProvider = new UnicodeTreeProvider();
	const treeView = vscode.window.createTreeView('unicodeExplorer', {
		treeDataProvider: treeDataProvider
	});
	context.subscriptions.push(treeView);

	// 注册命令
	const commandDisposable = vscode.commands.registerCommand(
		'unicode-show.showUnicode',
		showFromUnicodeText
	);

	// 注册随机 Unicode 生成器命令
	const randomUnicodeDisposable = vscode.commands.registerCommand(
		'unicode-show.openRandomUnicode',
		() => {
			RandomUnicodePanel.createOrShow(context.extensionUri);
		}
	);

	// 注册 Unicode 查看器命令
	const unicodeViewerDisposable = vscode.commands.registerCommand(
		'unicode-show.openUnicodeViewer',
		() => {
			UnicodeViewerPanel.createOrShow(context.extensionUri);
		}
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

	context.subscriptions.push(commandDisposable, randomUnicodeDisposable, unicodeViewerDisposable, hoverDisposable);
}

export function deactivate() {
	console.log('Unicode Tools deactivated.');
}