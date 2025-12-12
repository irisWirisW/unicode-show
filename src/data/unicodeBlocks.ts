/**
 * Unicode 区块定义
 */
export interface UnicodeBlock {
  name: string;
  nameEn: string;
  start: number;
  end: number;
  category: string;
}

/**
 * Unicode 区块分类
 */
export const BLOCK_CATEGORIES = {
  BASIC_LATIN: "基本拉丁",
  LATIN_EXTENDED: "拉丁扩展",
  IPA_PHONETIC: "音标符号",
  DIACRITICAL: "变音符号",
  GREEK_COPTIC: "希腊与科普特",
  CYRILLIC: "西里尔",
  ARMENIAN_GEORGIAN: "亚美尼亚与格鲁吉亚",
  HEBREW_ARABIC: "希伯来与阿拉伯",
  INDIC: "印度文字",
  SOUTHEAST_ASIAN: "东南亚文字",
  TIBETAN: "藏文",
  CJK: "中日韩",
  HANGUL: "韩文",
  SYMBOLS: "符号",
  PUNCTUATION: "标点",
  MATH: "数学符号",
  CURRENCY: "货币符号",
  ARROWS: "箭头",
  GEOMETRIC: "几何图形",
  EMOJI: "表情符号",
  OTHER: "其他",
} as const;

/**
 * 常用 Unicode 区块列表
 */
export const UNICODE_BLOCKS: UnicodeBlock[] = [
  // 基本拉丁
  { name: "基本拉丁字母", nameEn: "Basic Latin", start: 0x0020, end: 0x007f, category: BLOCK_CATEGORIES.BASIC_LATIN },
  { name: "拉丁字母补充-1", nameEn: "Latin-1 Supplement", start: 0x0080, end: 0x00ff, category: BLOCK_CATEGORIES.BASIC_LATIN },

  // 拉丁扩展
  { name: "拉丁字母扩展-A", nameEn: "Latin Extended-A", start: 0x0100, end: 0x017f, category: BLOCK_CATEGORIES.LATIN_EXTENDED },
  { name: "拉丁字母扩展-B", nameEn: "Latin Extended-B", start: 0x0180, end: 0x024f, category: BLOCK_CATEGORIES.LATIN_EXTENDED },

  // 音标
  { name: "国际音标扩展", nameEn: "IPA Extensions", start: 0x0250, end: 0x02af, category: BLOCK_CATEGORIES.IPA_PHONETIC },

  // 变音符号
  { name: "组合变音符号", nameEn: "Combining Diacritical Marks", start: 0x0300, end: 0x036f, category: BLOCK_CATEGORIES.DIACRITICAL },

  // 希腊
  { name: "希腊字母及科普特字母", nameEn: "Greek and Coptic", start: 0x0370, end: 0x03ff, category: BLOCK_CATEGORIES.GREEK_COPTIC },

  // 西里尔
  { name: "西里尔字母", nameEn: "Cyrillic", start: 0x0400, end: 0x04ff, category: BLOCK_CATEGORIES.CYRILLIC },
  { name: "西里尔字母补充", nameEn: "Cyrillic Supplement", start: 0x0500, end: 0x052f, category: BLOCK_CATEGORIES.CYRILLIC },

  // 亚美尼亚与格鲁吉亚
  { name: "亚美尼亚字母", nameEn: "Armenian", start: 0x0530, end: 0x058f, category: BLOCK_CATEGORIES.ARMENIAN_GEORGIAN },
  { name: "格鲁吉亚字母", nameEn: "Georgian", start: 0x10a0, end: 0x10ff, category: BLOCK_CATEGORIES.ARMENIAN_GEORGIAN },

  // 希伯来与阿拉伯
  { name: "希伯来字母", nameEn: "Hebrew", start: 0x0590, end: 0x05ff, category: BLOCK_CATEGORIES.HEBREW_ARABIC },
  { name: "阿拉伯字母", nameEn: "Arabic", start: 0x0600, end: 0x06ff, category: BLOCK_CATEGORIES.HEBREW_ARABIC },

  // 泰文
  { name: "泰文", nameEn: "Thai", start: 0x0e00, end: 0x0e7f, category: BLOCK_CATEGORIES.SOUTHEAST_ASIAN },

  // 藏文
  { name: "藏文", nameEn: "Tibetan", start: 0x0f00, end: 0x0fff, category: BLOCK_CATEGORIES.TIBETAN },

  // 标点符号
  { name: "通用标点", nameEn: "General Punctuation", start: 0x2000, end: 0x206f, category: BLOCK_CATEGORIES.PUNCTUATION },

  // 上标下标
  { name: "上标和下标", nameEn: "Superscripts and Subscripts", start: 0x2070, end: 0x209f, category: BLOCK_CATEGORIES.SYMBOLS },

  // 货币符号
  { name: "货币符号", nameEn: "Currency Symbols", start: 0x20a0, end: 0x20cf, category: BLOCK_CATEGORIES.CURRENCY },

  // 字母符号
  { name: "字母符号", nameEn: "Letterlike Symbols", start: 0x2100, end: 0x214f, category: BLOCK_CATEGORIES.SYMBOLS },

  // 数字形式
  { name: "数字形式", nameEn: "Number Forms", start: 0x2150, end: 0x218f, category: BLOCK_CATEGORIES.SYMBOLS },

  // 箭头
  { name: "箭头", nameEn: "Arrows", start: 0x2190, end: 0x21ff, category: BLOCK_CATEGORIES.ARROWS },

  // 数学运算符
  { name: "数学运算符", nameEn: "Mathematical Operators", start: 0x2200, end: 0x22ff, category: BLOCK_CATEGORIES.MATH },
  { name: "其他数学符号-A", nameEn: "Misc Mathematical Symbols-A", start: 0x27c0, end: 0x27ef, category: BLOCK_CATEGORIES.MATH },
  { name: "其他数学符号-B", nameEn: "Misc Mathematical Symbols-B", start: 0x2980, end: 0x29ff, category: BLOCK_CATEGORIES.MATH },

  // 杂项技术符号
  { name: "杂项技术符号", nameEn: "Miscellaneous Technical", start: 0x2300, end: 0x23ff, category: BLOCK_CATEGORIES.SYMBOLS },

  // 控制图像
  { name: "控制图像", nameEn: "Control Pictures", start: 0x2400, end: 0x243f, category: BLOCK_CATEGORIES.SYMBOLS },

  // 方框绘制
  { name: "方框绘制", nameEn: "Box Drawing", start: 0x2500, end: 0x257f, category: BLOCK_CATEGORIES.GEOMETRIC },

  // 方块元素
  { name: "方块元素", nameEn: "Block Elements", start: 0x2580, end: 0x259f, category: BLOCK_CATEGORIES.GEOMETRIC },

  // 几何图形
  { name: "几何图形", nameEn: "Geometric Shapes", start: 0x25a0, end: 0x25ff, category: BLOCK_CATEGORIES.GEOMETRIC },

  // 杂项符号
  { name: "杂项符号", nameEn: "Miscellaneous Symbols", start: 0x2600, end: 0x26ff, category: BLOCK_CATEGORIES.SYMBOLS },

  // 装饰符号
  { name: "装饰符号", nameEn: "Dingbats", start: 0x2700, end: 0x27bf, category: BLOCK_CATEGORIES.SYMBOLS },

  // 盲文
  { name: "盲文图案", nameEn: "Braille Patterns", start: 0x2800, end: 0x28ff, category: BLOCK_CATEGORIES.SYMBOLS },

  // CJK
  { name: "CJK 部首补充", nameEn: "CJK Radicals Supplement", start: 0x2e80, end: 0x2eff, category: BLOCK_CATEGORIES.CJK },
  { name: "康熙部首", nameEn: "Kangxi Radicals", start: 0x2f00, end: 0x2fdf, category: BLOCK_CATEGORIES.CJK },
  { name: "CJK 符号和标点", nameEn: "CJK Symbols and Punctuation", start: 0x3000, end: 0x303f, category: BLOCK_CATEGORIES.CJK },
  { name: "日文平假名", nameEn: "Hiragana", start: 0x3040, end: 0x309f, category: BLOCK_CATEGORIES.CJK },
  { name: "日文片假名", nameEn: "Katakana", start: 0x30a0, end: 0x30ff, category: BLOCK_CATEGORIES.CJK },
  { name: "注音符号", nameEn: "Bopomofo", start: 0x3100, end: 0x312f, category: BLOCK_CATEGORIES.CJK },
  { name: "韩文兼容字母", nameEn: "Hangul Compatibility Jamo", start: 0x3130, end: 0x318f, category: BLOCK_CATEGORIES.HANGUL },
  { name: "CJK 笔画", nameEn: "CJK Strokes", start: 0x31c0, end: 0x31ef, category: BLOCK_CATEGORIES.CJK },
  { name: "片假名音标扩展", nameEn: "Katakana Phonetic Extensions", start: 0x31f0, end: 0x31ff, category: BLOCK_CATEGORIES.CJK },
  { name: "CJK 统一表意文字扩展 A", nameEn: "CJK Unified Ideographs Extension A", start: 0x3400, end: 0x4dbf, category: BLOCK_CATEGORIES.CJK },
  { name: "CJK 统一表意文字", nameEn: "CJK Unified Ideographs", start: 0x4e00, end: 0x9fff, category: BLOCK_CATEGORIES.CJK },

  // 韩文
  { name: "韩文音节", nameEn: "Hangul Syllables", start: 0xac00, end: 0xd7af, category: BLOCK_CATEGORIES.HANGUL },

  // 私用区
  { name: "私用区", nameEn: "Private Use Area", start: 0xe000, end: 0xf8ff, category: BLOCK_CATEGORIES.OTHER },

  // 全角半角
  { name: "半角及全角字符", nameEn: "Halfwidth and Fullwidth Forms", start: 0xff00, end: 0xffef, category: BLOCK_CATEGORIES.CJK },

  // Emoji 相关 (SMP 平面)
  { name: "表情符号", nameEn: "Emoticons", start: 0x1f600, end: 0x1f64f, category: BLOCK_CATEGORIES.EMOJI },
  { name: "杂项符号和象形文字", nameEn: "Misc Symbols and Pictographs", start: 0x1f300, end: 0x1f5ff, category: BLOCK_CATEGORIES.EMOJI },
  { name: "交通和地图符号", nameEn: "Transport and Map Symbols", start: 0x1f680, end: 0x1f6ff, category: BLOCK_CATEGORIES.EMOJI },
  { name: "补充符号和象形文字", nameEn: "Supplemental Symbols and Pictographs", start: 0x1f900, end: 0x1f9ff, category: BLOCK_CATEGORIES.EMOJI },

  // 音乐符号
  { name: "音乐符号", nameEn: "Musical Symbols", start: 0x1d100, end: 0x1d1ff, category: BLOCK_CATEGORIES.SYMBOLS },

  // 数学字母数字符号
  { name: "数学字母数字符号", nameEn: "Mathematical Alphanumeric Symbols", start: 0x1d400, end: 0x1d7ff, category: BLOCK_CATEGORIES.MATH },

  // 扑克牌
  { name: "扑克牌", nameEn: "Playing Cards", start: 0x1f0a0, end: 0x1f0ff, category: BLOCK_CATEGORIES.SYMBOLS },

  // 麻将
  { name: "麻将牌", nameEn: "Mahjong Tiles", start: 0x1f000, end: 0x1f02f, category: BLOCK_CATEGORIES.SYMBOLS },

  // 多米诺骨牌
  { name: "多米诺骨牌", nameEn: "Domino Tiles", start: 0x1f030, end: 0x1f09f, category: BLOCK_CATEGORIES.SYMBOLS },
];

/**
 * 获取所有分类
 */
export function getCategories(): string[] {
  const categories = new Set<string>();
  for (const block of UNICODE_BLOCKS) {
    categories.add(block.category);
  }
  return Array.from(categories);
}

/**
 * 按分类获取区块
 */
export function getBlocksByCategory(category: string): UnicodeBlock[] {
  return UNICODE_BLOCKS.filter(block => block.category === category);
}

/**
 * 根据码点查找所属区块
 */
export function findBlockByCodePoint(codePoint: number): UnicodeBlock | undefined {
  return UNICODE_BLOCKS.find(block => codePoint >= block.start && codePoint <= block.end);
}
