import * as vscode from 'vscode';
import { showFromUnicodeText } from './showSymbolFromUnicodetext';
import { RandomUnicodePanel } from './randomUnicodePanel';
import { UnicodeViewerPanel } from './unicodeViewerPanel';
import { UnicodeTreeProvider } from './unicodeTreeProvider';
import { UnicodeConverter } from './unicodeConverter';

// 尝试导入 unicode-properties，如果失败则使用备用方案
let unicode: any;
try {
	unicode = require('unicode-properties');
} catch (error) {
	console.warn('unicode-properties not available, using fallback');
	unicode = null;
}

/**
 * 获取字符的UTF-8字节表示
 */
function getUTF8Bytes(char: string): string {
	const encoder = new TextEncoder();
	const bytes = encoder.encode(char);
	return Array.from(bytes)
		.map(b => '0x' + b.toString(16).toUpperCase().padStart(2, '0'))
		.join(' ');
}

/**
 * 获取字符的UTF-16字节表示
 */
function getUTF16Bytes(char: string): string {
	const bytes: number[] = [];
	for (let i = 0; i < char.length; i++) {
		const code = char.charCodeAt(i);
		bytes.push((code >> 8) & 0xFF, code & 0xFF);
	}
	return bytes
		.map(b => '0x' + b.toString(16).toUpperCase().padStart(2, '0'))
		.join(' ');
}

/**
 * 获取Unicode分类的中文描述
 */
function getCategoryDescription(category: string): string {
	const descriptions: { [key: string]: string } = {
		'Lu': '大写字母',
		'Ll': '小写字母',
		'Lt': '词首大写字母',
		'Lm': '修饰字母',
		'Lo': '其他字母',
		'Mn': '非空格标记',
		'Mc': '间距组合标记',
		'Me': '封闭标记',
		'Nd': '十进制数字',
		'Nl': '字母数字',
		'No': '其他数字',
		'Pc': '连接标点',
		'Pd': '破折号标点',
		'Ps': '开始标点',
		'Pe': '结束标点',
		'Pi': '初始引号标点',
		'Pf': '最终引号标点',
		'Po': '其他标点',
		'Sm': '数学符号',
		'Sc': '货币符号',
		'Sk': '修饰符号',
		'So': '其他符号',
		'Zs': '空格分隔符',
		'Zl': '行分隔符',
		'Zp': '段落分隔符',
		'Cc': '控制字符',
		'Cf': '格式字符',
		'Cs': '代理字符',
		'Co': '私用字符',
		'Cn': '未分配字符'
	};
	return descriptions[category] || category;
}

/**
 * 备用方案：基于码点范围获取Unicode信息
 */
function getUnicodeInfoFallback(codePoint: number): { name: string; category: string; script: string } {
	let name = 'Unicode Character';
	let category = 'Unknown';
	let script = 'Unknown';

	// 基本拉丁字母
	if (codePoint >= 0x0041 && codePoint <= 0x005A) {
		name = `LATIN CAPITAL LETTER ${String.fromCodePoint(codePoint)}`;
		category = 'Lu';
		script = 'Latin';
	} else if (codePoint >= 0x0061 && codePoint <= 0x007A) {
		name = `LATIN SMALL LETTER ${String.fromCodePoint(codePoint)}`;
		category = 'Ll';
		script = 'Latin';
	} else if (codePoint >= 0x0030 && codePoint <= 0x0039) {
		name = `DIGIT ${String.fromCodePoint(codePoint)}`;
		category = 'Nd';
		script = 'Common';
	}
	// 中日韩统一表意文字
	else if (codePoint >= 0x4E00 && codePoint <= 0x9FFF) {
		name = 'CJK Unified Ideograph';
		category = 'Lo';
		script = 'Han';
	}
	// 表情符号
	else if (codePoint >= 0x1F600 && codePoint <= 0x1F64F) {
		name = 'Emoji';
		category = 'So';
		script = 'Common';
	} else if (codePoint >= 0x1F300 && codePoint <= 0x1F9FF) {
		name = 'Emoji Symbol';
		category = 'So';
		script = 'Common';
	}
	// 希腊字母
	else if (codePoint >= 0x0370 && codePoint <= 0x03FF) {
		name = 'Greek Letter';
		category = 'L';
		script = 'Greek';
	}
	// 西里尔字母
	else if (codePoint >= 0x0400 && codePoint <= 0x04FF) {
		name = 'Cyrillic Letter';
		category = 'L';
		script = 'Cyrillic';
	}
	// 标点符号
	else if ((codePoint >= 0x0021 && codePoint <= 0x002F) ||
			 (codePoint >= 0x003A && codePoint <= 0x0040) ||
			 (codePoint >= 0x005B && codePoint <= 0x0060) ||
			 (codePoint >= 0x007B && codePoint <= 0x007E)) {
		name = 'Punctuation';
		category = 'P';
		script = 'Common';
	}

	return { name, category, script };
}

/**
 * 安全地获取Unicode属性
 */
function getUnicodeName(codePoint: number): string {
	try {
		if (unicode && unicode.getName) {
			return unicode.getName(codePoint) || getUnicodeInfoFallback(codePoint).name;
		}
	} catch (e) {
		console.warn('Error getting Unicode name:', e);
	}
	return getUnicodeInfoFallback(codePoint).name;
}

function getUnicodeCategory(codePoint: number): string {
	try {
		if (unicode && unicode.getCategory) {
			return unicode.getCategory(codePoint) || getUnicodeInfoFallback(codePoint).category;
		}
	} catch (e) {
		console.warn('Error getting Unicode category:', e);
	}
	return getUnicodeInfoFallback(codePoint).category;
}

function getUnicodeScript(codePoint: number): string {
	try {
		if (unicode && unicode.getScript) {
			return unicode.getScript(codePoint) || getUnicodeInfoFallback(codePoint).script;
		}
	} catch (e) {
		console.warn('Error getting Unicode script:', e);
	}
	return getUnicodeInfoFallback(codePoint).script;
}

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
		['python', 'javascript', 'typescript', 'markdown', 'plaintext', 'json', 'html', 'css', 'java', 'cpp', 'c', 'csharp', 'go', 'rust', 'php', 'ruby', 'swift'],
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

				const result = UnicodeConverter.convert(text);

				if (result.success && result.char) {
					const char = result.char;
					const codePoint = result.codePoint!;

					// 获取字符的Unicode属性（使用安全的包装函数）
					const charName = getUnicodeName(codePoint);
					const category = getUnicodeCategory(codePoint);
					const script = getUnicodeScript(codePoint);

					// 计算各种编码
					const utf8Bytes = getUTF8Bytes(char);
					const utf16Bytes = getUTF16Bytes(char);
					const htmlEntity = `&#${codePoint};`;
					const htmlHexEntity = `&#x${result.unicodeHex};`;
					const binary = codePoint.toString(2).padStart(16, '0');

					// 构建悬浮提示内容
					const markdown = new vscode.MarkdownString();
					markdown.supportHtml = true;
					markdown.isTrusted = true;

					// 显示字符
					markdown.appendMarkdown(`# 字符: \`${char}\`\n\n`);

					// 基本信息
					markdown.appendMarkdown(`### 📝 基本信息\n`);
					markdown.appendMarkdown(`- **字符名称:** ${charName}\n`);
					markdown.appendMarkdown(`- **Unicode分类:** ${category} (${getCategoryDescription(category)})\n`);
					markdown.appendMarkdown(`- **脚本:** ${script}\n\n`);

					// 码点信息
					markdown.appendMarkdown(`### 🔢 码点信息\n`);
					markdown.appendMarkdown(`- **十进制:** ${codePoint}\n`);
					markdown.appendMarkdown(`- **十六进制:** U+${result.unicodeHex}\n`);
					markdown.appendMarkdown(`- **二进制:** ${binary}\n\n`);

					// 编码信息
					markdown.appendMarkdown(`### 💾 编码格式\n`);
					markdown.appendMarkdown(`- **UTF-8:** ${utf8Bytes}\n`);
					markdown.appendMarkdown(`- **UTF-16:** ${utf16Bytes}\n`);
					markdown.appendMarkdown(`- **JavaScript转义:** \\u${result.unicodeHex}\n`);
					if (codePoint > 0xFFFF) {
						markdown.appendMarkdown(`- **JavaScript转义 (扩展):** \\u{${result.unicodeHex}}\n`);
					}
					markdown.appendMarkdown(`\n`);

					// HTML实体
					markdown.appendMarkdown(`### 🌐 HTML实体\n`);
					markdown.appendMarkdown(`- **十进制:** \`${htmlEntity}\`\n`);
					markdown.appendMarkdown(`- **十六进制:** \`${htmlHexEntity}\`\n`);

					return new vscode.Hover(markdown, editor.selection);
				}
			},
		}
	);

	context.subscriptions.push(commandDisposable, randomUnicodeDisposable, unicodeViewerDisposable, hoverDisposable);
}

export function deactivate() {
	console.log('Unicode Tools deactivated.');
}