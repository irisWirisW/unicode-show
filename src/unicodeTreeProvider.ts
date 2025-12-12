import * as vscode from "vscode";

export class UnicodeTreeItem extends vscode.TreeItem {
	constructor(
		public readonly label: string,
		public readonly collapsibleState: vscode.TreeItemCollapsibleState,
		public readonly command?: vscode.Command,
		public readonly iconPath?: vscode.ThemeIcon,
	) {
		super(label, collapsibleState);
		this.tooltip = this.label;
	}
}

export class UnicodeTreeProvider implements vscode.TreeDataProvider<UnicodeTreeItem> {
	private _onDidChangeTreeData: vscode.EventEmitter<UnicodeTreeItem | undefined | null> = new vscode.EventEmitter<UnicodeTreeItem | undefined | null>();
	readonly onDidChangeTreeData: vscode.Event<UnicodeTreeItem | undefined | null> = this._onDidChangeTreeData.event;

	refresh(): void {
		this._onDidChangeTreeData.fire(undefined);
	}

	getTreeItem(element: UnicodeTreeItem): vscode.TreeItem {
		return element;
	}

	getChildren(element?: UnicodeTreeItem): Thenable<UnicodeTreeItem[]> {
		if (!element) {
			// 根级别的项目
			return Promise.resolve([
				new UnicodeTreeItem(
					"🎲 随机 Unicode 生成器",
					vscode.TreeItemCollapsibleState.None,
					{
						command: "unicode-show.openRandomUnicode",
						title: "打开随机 Unicode 生成器",
						arguments: [],
					},
					new vscode.ThemeIcon("symbol-misc"),
				),
				new UnicodeTreeItem(
					"📖 Unicode 查看器",
					vscode.TreeItemCollapsibleState.None,
					{
						command: "unicode-show.openUnicodeViewer",
						title: "打开 Unicode 查看器",
						arguments: [],
					},
					new vscode.ThemeIcon("book"),
				),
				new UnicodeTreeItem(
					"📚 Unicode 区块浏览器",
					vscode.TreeItemCollapsibleState.None,
					{
						command: "unicode-show.openBlockBrowser",
						title: "打开 Unicode 区块浏览器",
						arguments: [],
					},
					new vscode.ThemeIcon("library"),
				),
				new UnicodeTreeItem(
					"🔄 字符转 Unicode",
					vscode.TreeItemCollapsibleState.None,
					{
						command: "unicode-show.openCharToUnicode",
						title: "打开字符转 Unicode",
						arguments: [],
					},
					new vscode.ThemeIcon("arrow-swap"),
				),
			]);
		}
		return Promise.resolve([]);
	}
}
