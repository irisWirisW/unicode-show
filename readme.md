<div align="center">

# Unicode Shower

**A powerful VSCode extension for viewing Unicode characters from their code points**

English | [中文](./docs/readme_zh.md)

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Version](https://img.shields.io/badge/version-0.1.0-green.svg)](package.json)
[![VSCode Marketplace](https://img.shields.io/badge/VSCode-Marketplace-blue?logo=visual-studio-code)](https://marketplace.visualstudio.com/items?itemName=1risW.unicode-show)

![Demo](./Resources/悬浮提示显示字符.png)

</div>

---

## Table of Contents

- [Unicode Shower](#unicode-shower)
  - [Table of Contents](#table-of-contents)
  - [Features](#features)
  - [Supported Formats](#supported-formats)
  - [Quick Start](#quick-start)
    - [Installation](#installation)
    - [Usage](#usage)
  - [Examples](#examples)
  - [Supported Languages](#supported-languages)
  - [Configuration](#configuration)
  - [Development](#development)
    - [Build from Source](#build-from-source)
    - [Testing](#testing)
  - [Documentation](#documentation)
  - [Roadmap](#roadmap)
  - [Contributing](#contributing)
  - [License](#license)
  - [Acknowledgments](#acknowledgments)
  - [Contact](#contact)

---

## Features

- **Hover to View**: Simply hover over a Unicode code to see the character with detailed information
- **Keyboard Shortcuts**:
  - `Cmd+Alt+U` / `Ctrl+Alt+U` - Show Unicode character
  - `Cmd+Alt+R` / `Ctrl+Alt+R` - Open Random Unicode Generator
- **Right-Click Menu**: Show Unicode character from context menu
- **Activity Bar Panel**: Access Unicode tools from the sidebar
  - **Random Unicode Generator** - Generate random Unicode characters
  - **Unicode Viewer** - Look up any Unicode code point
- **Multiple Formats**: Supports 7 common Unicode notation formats
- **Rich Character Info**: View character name, category, script, UTF-8/UTF-16 encoding, and more
- **Universal Support**: Works with emojis, CJK characters, symbols, and more

## Supported Formats

| Format | Example | Result | Description |
|--------|---------|--------|-------------|
| `U+XXXX` | `U+1F600` | 😀 | Standard Unicode notation |
| `\uXXXX` | `\u4E2D` | 中 | JavaScript/JSON style (4 digits) |
| `\UXXXXXXXX` | `\U0001F600` | 😀 | Python style (8 digits) |
| `\xXX` | `\x41` | A | Hex escape (2 digits) |
| `&#XXX;` | `&#128512;` | 😀 | HTML decimal entity |
| `&#xXXXX;` | `&#x1F600;` | 😀 | HTML hex entity |
| Pure Hex | `1F600` | 😀 | Raw hexadecimal (4+ digits) |

## Quick Start

### Installation

1. Open VSCode
2. Go to Extensions (`Cmd+Shift+X` or `Ctrl+Shift+X`)
3. Search for "Unicode Shower"
4. Click Install

### Usage

**Method 1: Hover (Recommended)**
1. Select or hover over a Unicode code (e.g., `U+1F600`)
2. A tooltip will automatically show the character with detailed info

**Method 2: Keyboard Shortcut**
1. Select a Unicode code
2. Press:
   - **macOS**: `Cmd + Alt + U`
   - **Windows/Linux**: `Ctrl + Alt + U`

**Method 3: Context Menu**
1. Select a Unicode code
2. Right-click → "Show Unicode Character"

**Method 4: Activity Bar (Sidebar)**
1. Click the Unicode Tools icon in the Activity Bar
2. Choose:
   - **Random Unicode** - Generate random characters
   - **Unicode Viewer** - Look up specific code points

## Examples

Try these in any supported file type (Python, JavaScript, TypeScript, Markdown, Plain Text):

```
U+1F600    → 😀  (Grinning Face emoji)
U+4E2D     → 中  (Chinese character)
\u2764     → ❤   (Red heart)
&#128512;  → 😀  (HTML decimal)
&#x1F44D;  → 👍  (Thumbs up)
1F680      → 🚀  (Rocket)
```

## Supported Languages

The extension works with the following file types:

| Category | Languages |
|----------|-----------|
| **Web** | JavaScript, TypeScript, HTML, CSS, JSON |
| **Systems** | C, C++, Rust, Go |
| **General** | Python, Java, C#, PHP, Ruby, Swift |
| **Other** | Markdown, Plain Text |

## Configuration

Currently, the extension works out of the box with no configuration needed.

Future versions may include customizable options.

## Development

### Build from Source

```bash
# Clone the repository
git clone https://github.com/irisWirisW/unicode-show.git
cd unicode-show

# Install dependencies
npm install

# Compile
npm run compile

# Run in development mode
# Press F5 in VSCode to open Extension Development Host
```

### Testing

See [HOW_TO_TEST.md](./docs/HOW_TO_TEST.md) for detailed testing instructions.

## Documentation

- [Debug Guide](./docs/DEBUG_GUIDE.md) - How to debug the extension
- [Test Cases](./docs/TEST_CASES.md) - Complete list of test cases
- [How to Test](./docs/HOW_TO_TEST.md) - Testing procedures

## Roadmap

- [x] Hover tooltip display
- [x] Support multiple Unicode formats
- [x] Keyboard shortcuts
- [x] Context menu integration
- [x] Activity bar panel with tools
- [x] Random Unicode generator
- [x] Unicode viewer/lookup
- [x] Rich character information display
- [ ] Status bar display
- [ ] Custom format configuration
- [ ] Batch conversion

## Contributing

Contributions are welcome! Feel free to:
- Report bugs
- Suggest new features
- Submit pull requests

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

Inspired by the need to quickly view Unicode characters while coding.

## Contact

- **Issues**: [GitHub Issues](https://github.com/irisWirisW/unicode-show/issues)
- **Repository**: [GitHub](https://github.com/irisWirisW/unicode-show)

---

<div align="center">

Made by [1ris_W](https://github.com/irisWirisW)

**If you find this extension helpful, please give it a star on GitHub!**

</div>
