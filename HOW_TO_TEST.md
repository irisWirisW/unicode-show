# 如何测试 Unicode Show 扩展

## 📋 准备工作

### 1. 确保项目已编译
```bash
npm run compile
```

## 🧪 测试方法

### 方法一：在开发模式下测试（推荐）

#### 步骤：
1. **在VSCode中打开本项目**
   ```bash
   code /Users/iris/Documents/Project/JS/unicode-show
   ```

2. **按 F5 启动调试**
   - 或点击菜单：运行 → 启动调试
   - 或点击左侧调试图标，然后选择调试配置：
     - **"Run Extension"** - 打开当前项目文件夹
     - **"Run Extension (Open Test File)"** - 直接打开测试文件

3. **将打开一个新的VSCode窗口（Extension Development Host）**
   - 这是一个带有你的扩展的测试环境
   - 窗口标题会显示 `[Extension Development Host]`
   - 窗口会自动打开当前项目文件夹，可以直接看到所有文件

4. **在新窗口中打开测试文件**
   - 已经自动加载了项目文件夹，直接打开 `test-unicode.txt` 文件
   - 或创建任何新文件（支持的语言：Python, JavaScript, TypeScript, Markdown, PlainText）

5. **开始测试**

#### 测试方式A：悬浮提示测试
- 选中任意Unicode代码（例如：`U+1F600`）
- 鼠标悬浮在选中的文本上
- 应该会显示对应的字符：😀

#### 测试方式B：快捷键测试
- 选中任意Unicode代码
- 按快捷键：
  - **Mac**: `Cmd + Alt + U`
  - **Windows/Linux**: `Ctrl + Alt + U`
- 会弹出信息框或执行相应操作

#### 测试方式C：右键菜单测试
- 选中任意Unicode代码
- 右键点击
- 选择 "Show Unicode Character"

### 方法二：打包安装测试

#### 步骤：
1. **打包扩展**
   ```bash
   npm install -g @vscode/vsce
   vsce package
   ```

2. **安装生成的 .vsix 文件**
   - 在VSCode中：扩展 → 右上角"..." → 从VSIX安装
   - 选择生成的 `unicode-show-0.0.3.vsix`

3. **重启VSCode后测试**

## ✅ 关键测试用例

### 🔥 重点测试：十进制格式（验证bug修复）

**修复前的问题：** `&#128512;` 被错误解析导致显示错误字符

**现在应该正确显示：**
| 输入 | 预期结果 |
|------|---------|
| `&#128512;` | 😀 (笑脸emoji) |
| `&#20013;` | 中 (汉字) |
| `&#65;` | A (字母) |

### 📝 完整测试清单

在 `test-unicode.txt` 中包含了所有测试用例，请逐一测试：

1. ✅ U+1F600 → 😀
2. ✅ \u4E2D → 中
3. ✅ \U0001F600 → 😀
4. ✅ \x41 → A
5. ✅ &#128512; → 😀 **（重要：验证十进制修复）**
6. ✅ &#x1F600; → 😀
7. ✅ 1F600 → 😀
8. ✅ "U+1F600" → 😀 (带引号)
9. ✅ 错误输入应显示错误信息

## 🐛 调试技巧

### 查看控制台日志
1. 在Extension Development Host窗口中
2. 按 `Cmd + Shift + P` (Mac) 或 `Ctrl + Shift + P` (Windows/Linux)
3. 输入并选择：`Developer: Toggle Developer Tools`
4. 切换到 Console 标签
5. 选择Unicode代码时会看到 `[showFromUnicodeText]: text: ...` 日志

### 修改代码后重新加载
- 修改代码后，不需要关闭测试窗口
- 在测试窗口中按 `Cmd + R` (Mac) 或 `Ctrl + R` (Windows/Linux) 重新加载扩展
- 或点击调试工具栏的重启按钮（圆形箭头）

## 📊 测试检查表

- [ ] 所有6种Unicode格式都能正确解析
- [ ] 十进制格式 `&#XXX;` 显示正确（验证bug修复）
- [ ] 悬浮提示功能正常工作
- [ ] 快捷键 Cmd/Ctrl+Alt+U 正常工作
- [ ] 右键菜单选项可用
- [ ] 带引号的输入自动去除引号
- [ ] 错误输入显示友好的错误信息
- [ ] 超出范围的Unicode码点显示错误
- [ ] 在不同文件类型中都能工作（Python, JS, TS, Markdown, PlainText）

## 🎯 性能测试

### 测试大量选择
1. 选中包含多个Unicode代码的文本
2. 验证只解析第一个匹配的代码
3. 确保没有性能问题

### 测试无效输入
1. 选中普通文本
2. 应该显示 "不是标准的 Unicode 码点"
3. 不应该崩溃或卡顿

## 📝 测试记录

建议记录测试结果：

```
测试日期：____
测试人：____

| 功能 | 状态 | 备注 |
|------|------|------|
| U+格式 | ✅/❌ | |
| \u格式 | ✅/❌ | |
| &#十进制 | ✅/❌ | 重点验证 |
| &#x十六进制 | ✅/❌ | |
| 悬浮提示 | ✅/❌ | |
| 快捷键 | ✅/❌ | |
| 错误处理 | ✅/❌ | |
```

## 🚀 快速测试命令

```bash
# 编译
npm run compile

# 监听模式（自动编译）
npm run watch

# 运行linter
npm run lint
```

## ❓ 常见问题

### Q: 按F5没有反应？
A: 确保已经安装了编译任务，运行 `npm install` 然后 `npm run compile`

### Q: 扩展在测试窗口中不生效？
A:
1. 检查文件类型是否支持（Python, JS, TS, Markdown, PlainText）
2. 尝试重新加载窗口 (Cmd+R / Ctrl+R)
3. 查看开发者工具的Console是否有错误

### Q: 悬浮提示不显示？
A:
1. 确保文本已被选中
2. 鼠标需要悬浮在选中的文本上
3. 检查是否有其他扩展冲突

## 📚 相关文档

- [VSCode Extension Testing](https://code.visualstudio.com/api/working-with-extensions/testing-extension)
- [VSCode Extension API](https://code.visualstudio.com/api)
