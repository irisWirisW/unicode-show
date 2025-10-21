/**
 * 常量定义
 */

/**
 * 支持的语言列表
 */
export const SUPPORTED_LANGUAGES = [
    'python',
    'javascript',
    'typescript',
    'markdown',
    'plaintext',
    'json',
    'html',
    'css',
    'java',
    'cpp',
    'c',
    'csharp',
    'go',
    'rust',
    'php',
    'ruby',
    'swift'
] as const;

/**
 * 命令ID
 */
export const COMMANDS = {
    SHOW_UNICODE: 'unicode-show.showUnicode',
    OPEN_RANDOM_UNICODE: 'unicode-show.openRandomUnicode',
    OPEN_UNICODE_VIEWER: 'unicode-show.openUnicodeViewer'
} as const;

/**
 * 视图ID
 */
export const VIEWS = {
    UNICODE_EXPLORER: 'unicodeExplorer'
} as const;

/**
 * Webview面板ID
 */
export const WEBVIEW_PANELS = {
    RANDOM_UNICODE: 'randomUnicode',
    UNICODE_VIEWER: 'unicodeViewer'
} as const;

/**
 * 消息命令类型
 */
export const MESSAGE_COMMANDS = {
    GENERATE_RANDOM: 'generateRandom',
    CONVERT_UNICODE: 'convertUnicode',
    SHOW_UNICODE: 'showUnicode',
    SHOW_RESULT: 'showResult',
    SHOW_ERROR: 'showError'
} as const;
