export function showFromUnicodeText(text: string): string {
  console.log('[showFromUnicodeText]: text:', text);

  // 判断text是否合法，是否为空
  if (!text) {
    return "没有输入";
  }

  // 去掉选中文本当中的双引号或者单引号
  text = text.replace(/['"]/g, '').trim();

  // 判断是否为 Unicode 码点，并区分不同格式
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
  // &#XXX; 格式 (十进制) - 关键修复：使用10进制解析
  else if ((match = text.match(/^&#([0-9]+);?$/))) {
    codePoint = parseInt(match[1], 10);
  }
  // &#xXXXX; 格式 (十六进制)
  else if ((match = text.match(/^&#x([0-9A-F]+);?$/i))) {
    codePoint = parseInt(match[1], 16);
  }
  // 纯十六进制数字 (需要是有效的Unicode范围)
  else if ((match = text.match(/^([0-9A-F]{4,})$/i))) {
    codePoint = parseInt(match[1], 16);
  }
  else {
    return "不是标准的 Unicode 码点";
  }

  // 验证 codePoint 是否在有效范围内 (0 到 0x10FFFF)
  if (codePoint < 0 || codePoint > 0x10FFFF) {
    return `无效的 Unicode 码点: ${codePoint}`;
  }

  try {
    const char = String.fromCodePoint(codePoint);
    return char;
  } catch (error) {
    return `无法转换码点: ${codePoint}`;
  }
}