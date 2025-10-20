import { UnicodeConversionResult, UnicodeRange } from './types';

/**
 * Unicode 转换工具类
 * 负责处理各种 Unicode 格式的转换
 */
export class UnicodeConverter {
    /**
     * 常用的 Unicode 范围
     */
    private static readonly COMMON_RANGES: UnicodeRange[] = [
        { name: '基本拉丁字母', start: 0x0020, end: 0x007E },
        { name: '拉丁补充-1', start: 0x00A0, end: 0x00FF },
        { name: '希腊字母', start: 0x0370, end: 0x03FF },
        { name: '西里尔字母', start: 0x0400, end: 0x04FF },
        { name: '中日韩统一表意文字', start: 0x4E00, end: 0x9FFF },
        { name: '表情符号和图形符号', start: 0x1F300, end: 0x1F9FF },
        { name: '杂项符号', start: 0x2600, end: 0x26FF },
        { name: '装饰符号', start: 0x2700, end: 0x27BF },
        { name: '表情符号', start: 0x1F600, end: 0x1F64F },
    ];

    /**
     * 将 Unicode 码点文本转换为字符
     * @param text - 输入的 Unicode 码点文本
     * @returns 转换结果
     */
    static convert(text: string): UnicodeConversionResult {
        console.log('[UnicodeConverter.convert]: text:', text);

        // 验证输入
        if (!text || !text.trim()) {
            return {
                success: false,
                error: '没有输入'
            };
        }

        // 清理输入
        text = text.replace(/['"]/g, '').trim();

        // 尝试解析码点
        const codePoint = this.parseCodePoint(text);
        if (codePoint === null) {
            return {
                success: false,
                error: '不是标准的 Unicode 码点'
            };
        }

        // 验证码点范围
        if (!this.isValidCodePoint(codePoint)) {
            return {
                success: false,
                error: `无效的 Unicode 码点: ${codePoint}`
            };
        }

        // 转换为字符
        try {
            const char = String.fromCodePoint(codePoint);
            const unicodeHex = codePoint.toString(16).toUpperCase().padStart(4, '0');

            return {
                success: true,
                char,
                codePoint,
                unicodeHex,
                format: `U+${unicodeHex}`
            };
        } catch (error) {
            return {
                success: false,
                error: `无法转换码点: ${codePoint}`
            };
        }
    }

    /**
     * 生成随机 Unicode 字符
     * @returns 随机字符的转换结果
     */
    static generateRandom(): UnicodeConversionResult {
        const range = this.COMMON_RANGES[
            Math.floor(Math.random() * this.COMMON_RANGES.length)
        ];

        const codePoint = Math.floor(
            Math.random() * (range.end - range.start + 1)
        ) + range.start;

        try {
            const char = String.fromCodePoint(codePoint);
            const unicodeHex = codePoint.toString(16).toUpperCase().padStart(4, '0');

            return {
                success: true,
                char,
                codePoint,
                unicodeHex,
                format: `U+${unicodeHex}`
            };
        } catch (error) {
            return {
                success: false,
                error: `生成 Unicode 失败: ${error}`
            };
        }
    }

    /**
     * 获取所有常用的 Unicode 范围
     */
    static getCommonRanges(): UnicodeRange[] {
        return [...this.COMMON_RANGES];
    }

    /**
     * 解析 Unicode 码点
     * 支持多种格式：U+XXXX, \uXXXX, \UXXXXXXXX, \xXX, &#XXX;, &#xXXXX;, 纯十六进制
     * @param text - 输入文本
     * @returns 码点值或 null
     */
    private static parseCodePoint(text: string): number | null {
        let match: RegExpMatchArray | null;
        let codePoint: number;

        // U+XXXX 格式 (十六进制)
        if ((match = text.match(/^U\+([0-9A-F]+)$/i))) {
            codePoint = parseInt(match[1], 16);
        }
        // \uXXXX 格式 (十六进制)
        else if ((match = text.match(/^\\u([0-9A-F]{4})$/i))) {
            codePoint = parseInt(match[1], 16);
        }
        // \UXXXXXXXX 格式 (十六进制)
        else if ((match = text.match(/^\\U([0-9A-F]{8})$/i))) {
            codePoint = parseInt(match[1], 16);
        }
        // \xXX 格式 (十六进制)
        else if ((match = text.match(/^\\x([0-9A-F]{2})$/i))) {
            codePoint = parseInt(match[1], 16);
        }
        // &#XXX; 格式 (十进制)
        else if ((match = text.match(/^&#([0-9]+);?$/))) {
            codePoint = parseInt(match[1], 10);
        }
        // &#xXXXX; 格式 (十六进制)
        else if ((match = text.match(/^&#x([0-9A-F]+);?$/i))) {
            codePoint = parseInt(match[1], 16);
        }
        // 纯十六进制数字
        else if ((match = text.match(/^([0-9A-F]{4,})$/i))) {
            codePoint = parseInt(match[1], 16);
        }
        else {
            return null;
        }

        return codePoint;
    }

    /**
     * 验证码点是否在有效范围内
     * @param codePoint - 码点值
     * @returns 是否有效
     */
    private static isValidCodePoint(codePoint: number): boolean {
        return codePoint >= 0 && codePoint <= 0x10FFFF;
    }
}
