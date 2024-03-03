# Unicode Shower

[English](./readme.md)|中文

## 描述

提供多种在 vscode 中查看 unicode 编码对应字符的方式。

## 效果

![](./images/Resources/悬浮提示显示字符.png)

## 支持的格式

- U+XXXXXX
- \uXXXX
- \UXXXXXXXX
- \xXX
- &#XXX
- &#xXXXX

## 支持的编码（不一定）

- UTF-8
- Unicode

## 使用

<!-- Select the unicode code, then press the shortcut key `ctrl+alt+u`, use `cmd+alt+u` on mac.
 -->

选择 unicode 编码的字符串，然后按快捷键 `ctrl+alt+u`（mac 上使用 `cmd+alt+u`）。
或者指针悬停在 unicode 编码的字符串上，会在小窗上面显示。

## TODO

- [x] Add a suspended window display
- [ ] Display in the status bar below
