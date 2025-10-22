/**
 * Unicode 信息服务
 * 负责获取和处理 Unicode 字符的详细信息
 */

// 尝试导入 unicode-properties，如果失败则使用备用方案
let unicode: any;
try {
	unicode = require("unicode-properties");
} catch (_error) {
	console.warn("unicode-properties not available, using fallback");
	unicode = null;
}

export interface UnicodeCharacterInfo {
	char: string;
	codePoint: number;
	unicodeHex: string;
	name: string;
	category: string;
	categoryDescription: string;
	script: string;
	utf8Bytes: string;
	utf16Bytes: string;
	binary: string;
	htmlEntity: string;
	htmlHexEntity: string;
	jsEscape: string;
	jsEscapeExtended?: string;
}

/**
 * Unicode 信息服务类
 */
export class UnicodeInfoService {
	/**
	 * Unicode 分类的中文描述映射
	 */
	private static readonly CATEGORY_DESCRIPTIONS: { [key: string]: string } = {
		Lu: "大写字母",
		Ll: "小写字母",
		Lt: "词首大写字母",
		Lm: "修饰字母",
		Lo: "其他字母",
		Mn: "非空格标记",
		Mc: "间距组合标记",
		Me: "封闭标记",
		Nd: "十进制数字",
		Nl: "字母数字",
		No: "其他数字",
		Pc: "连接标点",
		Pd: "破折号标点",
		Ps: "开始标点",
		Pe: "结束标点",
		Pi: "初始引号标点",
		Pf: "最终引号标点",
		Po: "其他标点",
		Sm: "数学符号",
		Sc: "货币符号",
		Sk: "修饰符号",
		So: "其他符号",
		Zs: "空格分隔符",
		Zl: "行分隔符",
		Zp: "段落分隔符",
		Cc: "控制字符",
		Cf: "格式字符",
		Cs: "代理字符",
		Co: "私用字符",
		Cn: "未分配字符",
	};

	/**
	 * 获取字符的完整信息
	 * @param char - 字符
	 * @param codePoint - 码点
	 * @param unicodeHex - 十六进制表示
	 * @returns 完整的字符信息
	 */
	static getCharacterInfo(char: string, codePoint: number, unicodeHex: string): UnicodeCharacterInfo {
		const name = UnicodeInfoService.getUnicodeName(codePoint);
		const category = UnicodeInfoService.getUnicodeCategory(codePoint);
		const script = UnicodeInfoService.getUnicodeScript(codePoint);

		const info: UnicodeCharacterInfo = {
			char,
			codePoint,
			unicodeHex,
			name,
			category,
			categoryDescription: UnicodeInfoService.getCategoryDescription(category),
			script,
			utf8Bytes: UnicodeInfoService.getUTF8Bytes(char),
			utf16Bytes: UnicodeInfoService.getUTF16Bytes(char),
			binary: codePoint.toString(2).padStart(16, "0"),
			htmlEntity: `&#${codePoint};`,
			htmlHexEntity: `&#x${unicodeHex};`,
			jsEscape: `\\u${unicodeHex}`,
		};

		if (codePoint > 0xffff) {
			info.jsEscapeExtended = `\\u{${unicodeHex}}`;
		}

		return info;
	}

	/**
	 * 获取字符的UTF-8字节表示
	 */
	private static getUTF8Bytes(char: string): string {
		const encoder = new TextEncoder();
		const bytes = encoder.encode(char);
		return Array.from(bytes)
			.map(b => `0x${b.toString(16).toUpperCase().padStart(2, "0")}`)
			.join(" ");
	}

	/**
	 * 获取字符的UTF-16字节表示
	 */
	private static getUTF16Bytes(char: string): string {
		const bytes: number[] = [];
		for (let i = 0; i < char.length; i++) {
			const code = char.charCodeAt(i);
			bytes.push((code >> 8) & 0xff, code & 0xff);
		}
		return bytes.map(b => `0x${b.toString(16).toUpperCase().padStart(2, "0")}`).join(" ");
	}

	/**
	 * 获取Unicode分类的中文描述
	 */
	private static getCategoryDescription(category: string): string {
		return UnicodeInfoService.CATEGORY_DESCRIPTIONS[category] || category;
	}

	/**
	 * 备用方案：基于码点范围获取Unicode信息
	 */
	private static getUnicodeInfoFallback(codePoint: number): {
		name: string;
		category: string;
		script: string;
	} {
		let name = "Unicode Character";
		let category = "Unknown";
		let script = "Unknown";

		// 基本拉丁字母
		if (codePoint >= 0x0041 && codePoint <= 0x005a) {
			name = `LATIN CAPITAL LETTER ${String.fromCodePoint(codePoint)}`;
			category = "Lu";
			script = "Latin";
		} else if (codePoint >= 0x0061 && codePoint <= 0x007a) {
			name = `LATIN SMALL LETTER ${String.fromCodePoint(codePoint)}`;
			category = "Ll";
			script = "Latin";
		} else if (codePoint >= 0x0030 && codePoint <= 0x0039) {
			name = `DIGIT ${String.fromCodePoint(codePoint)}`;
			category = "Nd";
			script = "Common";
		}
		// 中日韩统一表意文字
		else if (codePoint >= 0x4e00 && codePoint <= 0x9fff) {
			name = "CJK Unified Ideograph";
			category = "Lo";
			script = "Han";
		}
		// 表情符号
		else if (codePoint >= 0x1f600 && codePoint <= 0x1f64f) {
			name = "Emoji";
			category = "So";
			script = "Common";
		} else if (codePoint >= 0x1f300 && codePoint <= 0x1f9ff) {
			name = "Emoji Symbol";
			category = "So";
			script = "Common";
		}
		// 希腊字母
		else if (codePoint >= 0x0370 && codePoint <= 0x03ff) {
			name = "Greek Letter";
			category = "L";
			script = "Greek";
		}
		// 西里尔字母
		else if (codePoint >= 0x0400 && codePoint <= 0x04ff) {
			name = "Cyrillic Letter";
			category = "L";
			script = "Cyrillic";
		}
		// 标点符号
		else if ((codePoint >= 0x0021 && codePoint <= 0x002f) || (codePoint >= 0x003a && codePoint <= 0x0040) || (codePoint >= 0x005b && codePoint <= 0x0060) || (codePoint >= 0x007b && codePoint <= 0x007e)) {
			name = "Punctuation";
			category = "P";
			script = "Common";
		}

		return { name, category, script };
	}

	/**
	 * 安全地获取Unicode名称
	 */
	private static getUnicodeName(codePoint: number): string {
		try {
			if (unicode?.getName) {
				return unicode.getName(codePoint) || UnicodeInfoService.getUnicodeInfoFallback(codePoint).name;
			}
		} catch (e) {
			console.warn("Error getting Unicode name:", e);
		}
		return UnicodeInfoService.getUnicodeInfoFallback(codePoint).name;
	}

	/**
	 * 安全地获取Unicode分类
	 */
	private static getUnicodeCategory(codePoint: number): string {
		try {
			if (unicode?.getCategory) {
				return unicode.getCategory(codePoint) || UnicodeInfoService.getUnicodeInfoFallback(codePoint).category;
			}
		} catch (e) {
			console.warn("Error getting Unicode category:", e);
		}
		return UnicodeInfoService.getUnicodeInfoFallback(codePoint).category;
	}

	/**
	 * 安全地获取Unicode脚本
	 */
	private static getUnicodeScript(codePoint: number): string {
		try {
			if (unicode?.getScript) {
				return unicode.getScript(codePoint) || UnicodeInfoService.getUnicodeInfoFallback(codePoint).script;
			}
		} catch (e) {
			console.warn("Error getting Unicode script:", e);
		}
		return UnicodeInfoService.getUnicodeInfoFallback(codePoint).script;
	}
}
