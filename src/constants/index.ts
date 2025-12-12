/**
 * 常量定义
 */

/**
 * 支持的语言列表
 */
export const SUPPORTED_LANGUAGES = ["python", "javascript", "typescript", "markdown", "plaintext", "json", "html", "css", "java", "cpp", "c", "csharp", "go", "rust", "php", "ruby", "swift"] as const;

/**
 * 命令ID
 */
export const COMMANDS = {
	SHOW_UNICODE: "unicode-show.showUnicode",
	OPEN_RANDOM_UNICODE: "unicode-show.openRandomUnicode",
	OPEN_UNICODE_VIEWER: "unicode-show.openUnicodeViewer",
	OPEN_BLOCK_BROWSER: "unicode-show.openBlockBrowser",
	OPEN_CHAR_TO_UNICODE: "unicode-show.openCharToUnicode",
} as const;

/**
 * 视图ID
 */
export const VIEWS = {
	UNICODE_EXPLORER: "unicodeExplorer",
} as const;

/**
 * Webview面板ID
 */
export const WEBVIEW_PANELS = {
	RANDOM_UNICODE: "randomUnicode",
	UNICODE_VIEWER: "unicodeViewer",
	BLOCK_BROWSER: "blockBrowser",
	CHAR_TO_UNICODE: "charToUnicode",
} as const;

/**
 * 状态栏配置
 */
export const STATUS_BAR = {
	PRIORITY: 100,
	ALIGNMENT: "right",
} as const;

/**
 * 消息命令类型
 */
export const MESSAGE_COMMANDS = {
	GENERATE_RANDOM: "generateRandom",
	CONVERT_UNICODE: "convertUnicode",
	SHOW_UNICODE: "showUnicode",
	SHOW_RESULT: "showResult",
	SHOW_ERROR: "showError",
} as const;
