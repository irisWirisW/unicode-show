// import * as vscode from 'vscode';
// export function showFromUnicodeText() {
//   // 获取当前选中的文本
//   const editor = vscode.window.activeTextEditor;
//   if (!editor) return;

//   const selection = editor.selection;
//   const text = editor.document.getText(selection);
//   vscode.languages.registerHoverProvider

//   // 判断是否为 Unicode 码点
//   const match = text.match(/^U\+([0-9A-F]{4,6})$/i)
//     || text.match(/^\\u([0-9A-F]{4})$/i)
//     || text.match(/^\\U([0-9A-F]{8})$/i)
//     || text.match(/^\\x([0-9A-F]{2})$/i)
//     || text.match(/^&#([0-9]+);?$/i)
//     || text.match(/^&#x([0-9A-F]+);?$/i);
//   if (!match) return;

//   const codePoint = parseInt(match[1], 16);
//   const char = String.fromCodePoint(codePoint);

//   // 显示悬浮窗
//   vscode.window.showInformationMessage(char);
// }
export function showFromUnicodeText(text: string): string {
  console.log('[showFromUnicodeText]: text:', text);
  // 判断text是否合法，是否为空
  if (!text) return "没有输入";
  // 去掉选中文本当中的双引号或者单引号
  text = text.replace(/['"]/g, '');
  // 判断是否为 Unicode 码点\
  // match() 方法可在字符串内检索指定的值，或找到一个或多个正则表达式的匹配。
  const match = text.match(/^U\+([0-9A-F]+)$/i)
    || text.match(/^\\u([0-9A-F]+)$/i)
    || text.match(/^\\U([0-9A-F]+)$/i)
    || text.match(/^\\x([0-9A-F]+)$/i)
    || text.match(/^&#([0-9]+);?$/i)
    || text.match(/^&#x([0-9A-F]+);?$/i)
    || text.match(/^([0-9A-F]+)$/i);

  if (!match) return "不是标准的 Unicode 码点";

  const codePoint = parseInt(match[1], 16);
  const char = String.fromCodePoint(codePoint);

  return char;
}