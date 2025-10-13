<div align="center">

# 🔤 Unicode Shower

**一个强大的 VSCode 扩展，用于查看 Unicode 编码对应的字符**

[English](./readme.md) | [中文](#)

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Version](https://img.shields.io/badge/version-0.0.4-green.svg)](package.json)

![效果展示](./images/Resources/悬浮提示显示字符.png)

</div>

---

## ✨ 功能特性

- 🎯 **悬浮查看**：鼠标悬停在 Unicode 编码上即可查看对应字符
- ⌨️ **快捷键支持**：使用 `⌘ Cmd + ⌥ Option + U` (macOS) 或 `Ctrl+Alt+U` (Windows/Linux) 快速查看
- 🖱️ **右键菜单**：通过右键菜单显示 Unicode 字符
- 🔄 **多格式支持**：支持 6+ 种常见的 Unicode 表示格式
- 🌈 **通用兼容**：支持 emoji、CJK 字符、特殊符号等

## 📋 支持的格式

| 格式 | 示例 | 结果 | 说明 |
|------|------|------|------|
| `U+XXXX` | `U+1F600` | 😀 | 标准 Unicode 表示法 |
| `\uXXXX` | `\u4E2D` | 中 | JavaScript/JSON 风格（4位） |
| `\UXXXXXXXX` | `\U0001F600` | 😀 | Python 风格（8位） |
| `\xXX` | `\x41` | A | 十六进制转义（2位） |
| `&#XXX;` | `&#128512;` | 😀 | HTML 十进制实体 |
| `&#xXXXX;` | `&#x1F600;` | 😀 | HTML 十六进制实体 |
| 纯十六进制 | `1F600` | 😀 | 原始十六进制（4位以上） |

## 🚀 快速开始

### 安装

1. 打开 VSCode
2. 进入扩展面板（`Cmd+Shift+X` 或 `Ctrl+Shift+X`）
3. 搜索 "Unicode Shower"
4. 点击安装

### 使用方法

**方法 1：悬浮提示（推荐）**
1. 选中或悬停在 Unicode 编码上（例如：`U+1F600`）
2. 工具提示会自动显示对应字符：😀

**方法 2：快捷键**
1. 选中 Unicode 编码
2. 按下快捷键：
   - **macOS**: `⌘ Cmd + ⌥ Option + U`
   - **Windows/Linux**: `Ctrl + Alt + U`

**方法 3：右键菜单**
1. 选中 Unicode 编码
2. 右键点击 → "Show Unicode Character"

## 📝 使用示例

在任何支持的文件类型中尝试这些示例（Python、JavaScript、TypeScript、Markdown、纯文本）：

```
U+1F600    → 😀  (笑脸 emoji)
U+4E2D     → 中  (汉字)
\u2764     → ❤   (红心)
&#128512;  → 😀  (HTML 十进制)
&#x1F44D;  → 👍  (点赞)
1F680      → 🚀  (火箭)
```

## 🎨 支持的语言

该扩展支持以下文件类型：
- Python (`.py`)
- JavaScript (`.js`)
- TypeScript (`.ts`)
- Markdown (`.md`)
- 纯文本 (`.txt`)

## ⚙️ 配置

目前扩展开箱即用，无需配置。

未来版本可能会包含可自定义选项。

## 🛠️ 开发

### 从源码构建

```bash
# 克隆仓库
git clone https://github.com/Erica-Iris/unicode-show.git
cd unicode-show

# 安装依赖
npm install

# 编译
npm run compile

# 开发模式运行
# 在 VSCode 中按 F5 打开扩展开发主机
```

### 测试

详细的测试说明请查看 [HOW_TO_TEST.md](./HOW_TO_TEST.md)。

## 📖 文档

- [调试指南](./DEBUG_GUIDE.md) - 如何调试扩展
- [测试用例](./TEST_CASES.md) - 完整的测试用例列表
- [如何测试](./HOW_TO_TEST.md) - 测试步骤说明

## 🗺️ 开发路线图

- [x] 悬浮提示显示
- [x] 支持多种 Unicode 格式
- [x] 键盘快捷键
- [x] 右键菜单集成
- [ ] 状态栏显示
- [ ] 自定义格式配置
- [ ] 批量转换功能

## 🤝 贡献

欢迎贡献！您可以：
- 报告 bug
- 提出新功能建议
- 提交 pull request

## 📄 许可证

本项目采用 MIT 许可证 - 详见 [LICENSE](LICENSE) 文件。

## 🙏 致谢

灵感来源于在编程时快速查看 Unicode 字符的需求。

## 📮 联系方式

- **问题反馈**: [GitHub Issues](https://github.com/Erica-Iris/unicode-show/issues)
- **项目仓库**: [GitHub](https://github.com/Erica-Iris/unicode-show)

---

<div align="center">

由 [1ris_W](https://github.com/Erica-Iris) 用 ❤️ 制作

**如果觉得这个扩展有帮助，请在 GitHub 上给个 ⭐！**

</div>
