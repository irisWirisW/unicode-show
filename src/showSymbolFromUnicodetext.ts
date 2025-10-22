import { UnicodeConverter } from "./unicodeConverter";

/**
 * 从 Unicode 文本显示字符
 * @param text - Unicode 码点文本
 * @returns 转换后的字符或错误信息
 */
export function showFromUnicodeText(text: string): string {
	const result = UnicodeConverter.convert(text);

	if (result.success && result.char) {
		return result.char;
	}

	return result.error || "转换失败";
}
