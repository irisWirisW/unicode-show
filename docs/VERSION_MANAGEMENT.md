# 版本管理指南

## 📋 概述

本项目采用**集中化版本管理**策略，以 `package.json` 作为唯一真实来源（Single Source of Truth），确保所有文件中的版本信息保持一致。

---

## 🎯 设计原则

### 1. 单一数据源
- ✅ `package.json` 中的 `version` 字段是唯一的版本定义
- ✅ 所有其他位置的版本信息都从 `package.json` 派生或同步

### 2. 自动化同步
- ✅ 使用脚本自动同步版本号到所有相关文件
- ✅ 避免手动维护导致的不一致

### 3. 代码中动态读取
- ✅ TypeScript/JavaScript 代码中从 `package.json` 动态读取版本
- ✅ 不在代码中硬编码版本号

---

## 📂 版本信息位置

### 主版本源
```json
// package.json
{
  "version": "0.0.4"
}
```

### 自动同步的文件
1. **`readme.md`** - 版本徽章
   ```markdown
   [![Version](https://img.shields.io/badge/version-0.0.4-green.svg)](package.json)
   ```

2. **`docs/readme_zh.md`** - 版本徽章（中文）
   ```markdown
   [![Version](https://img.shields.io/badge/version-0.0.4-green.svg)](../package.json)
   ```

3. **`docs/REFACTORING_COMPLETE.md`** - 重构报告版本
   ```markdown
   **版本**: 0.0.4
   ```

4. **`package-lock.json`** - npm 自动同步

---

## 🛠️ 版本管理工具

### 1. 版本信息模块

**文件**: `src/constants/version.ts`

从 `package.json` 动态读取版本信息，在代码中使用：

```typescript
import { VERSION_INFO, getVersion, getExtensionId } from './constants/version';

// 获取完整版本信息
console.log(VERSION_INFO);
// { version: "0.0.4", major: 0, minor: 0, patch: 4, ... }

// 获取版本号
console.log(getVersion()); // "0.0.4"

// 获取扩展 ID
console.log(getExtensionId()); // "1risW.unicode-show"
```

**功能：**
- ✅ 动态读取 `package.json`
- ✅ 解析版本号（major, minor, patch）
- ✅ 提供版本比较功能
- ✅ 检查是否为开发版本

### 2. 版本同步脚本

**文件**: `scripts/sync-version.js`

自动将 `package.json` 中的版本同步到所有相关文件。

**使用方法：**
```bash
# 方法 1: 直接运行脚本
node scripts/sync-version.js

# 方法 2: 使用 npm 命令
npm run sync-version
```

**输出示例：**
```
🚀 开始同步版本号...

📌 当前版本: 0.0.4

📝 更新: README.md 版本徽章
✅ 更新成功: readme.md

📝 更新: 中文 README 版本徽章
✅ 更新成功: docs/readme_zh.md

📝 更新: 重构完成报告版本
ℹ️  无需更新: docs/REFACTORING_COMPLETE.md

──────────────────────────────────────────────────

✨ 版本同步完成！
📊 更新了 2 个文件
🎯 所有文件版本号已同步为: 0.0.4
```

---

## 📝 版本更新流程

### 方法 1: 使用 npm version（推荐）

这是最标准和自动化的方式：

```bash
# 补丁版本更新 (0.0.4 -> 0.0.5)
npm version patch

# 次版本更新 (0.0.4 -> 0.1.0)
npm version minor

# 主版本更新 (0.0.4 -> 1.0.0)
npm version major
```

**自动化流程：**
1. 更新 `package.json` 中的版本号
2. 运行 `npm run sync-version` 同步到所有文件
3. 创建 git commit
4. 创建 git tag
5. 推送到远程仓库（包括 tags）

### 方法 2: 手动更新

如果需要手动控制：

```bash
# 1. 手动编辑 package.json 中的 version 字段
vim package.json

# 2. 运行同步脚本
npm run sync-version

# 3. 提交更改
git add -A
git commit -m "chore: bump version to x.x.x"
git tag vx.x.x
git push && git push --tags
```

---

## 🔍 版本验证

### 检查所有版本是否一致

运行同步脚本会自动检查并更新不一致的版本：

```bash
npm run sync-version
```

### 在代码中验证

```typescript
import { VERSION_INFO } from './constants/version';

console.log(`Current version: ${VERSION_INFO.version}`);
console.log(`Extension: ${VERSION_INFO.displayName}`);
console.log(`Publisher: ${VERSION_INFO.publisher}`);
```

---

## 📊 版本号规范

本项目遵循 [语义化版本 2.0.0](https://semver.org/lang/zh-CN/)：

### 格式
```
主版本号.次版本号.修订号
MAJOR.MINOR.PATCH
```

### 规则

1. **主版本号 (MAJOR)**
   - 不兼容的 API 修改
   - 重大功能变更
   - 示例: `0.x.x` -> `1.0.0`

2. **次版本号 (MINOR)**
   - 向下兼容的功能性新增
   - 功能标记为弃用
   - 示例: `0.0.x` -> `0.1.0`

3. **修订号 (PATCH)**
   - 向下兼容的问题修正
   - Bug 修复
   - 示例: `0.0.4` -> `0.0.5`

### 先行版本
```
0.1.0-alpha     # Alpha 版本
0.1.0-beta      # Beta 版本
0.1.0-rc.1      # Release Candidate
```

---

## 🚀 发布流程

### 1. 准备发布

```bash
# 确保所有更改已提交
git status

# 运行测试
npm test

# 编译代码
npm run compile

# 同步版本号
npm run sync-version
```

### 2. 更新版本

```bash
# 根据变更类型选择
npm version patch   # 或 minor 或 major
```

### 3. 发布到 VSCode Marketplace

```bash
# 打包扩展
vsce package

# 发布
vsce publish
```

---

## 🛡️ 最佳实践

### ✅ DO（推荐做法）

1. **始终使用 `npm version` 命令更新版本**
   ```bash
   npm version patch
   ```

2. **更新版本后立即运行同步脚本**
   ```bash
   npm run sync-version
   ```

3. **在代码中使用版本模块**
   ```typescript
   import { getVersion } from './constants/version';
   ```

4. **提交前检查版本一致性**
   ```bash
   npm run sync-version
   git diff
   ```

### ❌ DON'T（避免的做法）

1. **不要手动编辑多个文件中的版本号**
   ```diff
   - 手动修改 readme.md
   - 手动修改 package.json
   + 使用自动化工具
   ```

2. **不要在代码中硬编码版本号**
   ```typescript
   // ❌ 不好
   const VERSION = "0.0.4";

   // ✅ 推荐
   import { getVersion } from './constants/version';
   const VERSION = getVersion();
   ```

3. **不要跳过版本同步步骤**
   ```bash
   # ❌ 不好 - 可能导致版本不一致
   git commit -m "update version"

   # ✅ 推荐
   npm run sync-version
   git add -A
   git commit -m "chore: bump version to x.x.x"
   ```

---

## 🔧 故障排除

### 问题 1: 版本号不一致

**症状**: 不同文件显示不同的版本号

**解决方案**:
```bash
npm run sync-version
```

### 问题 2: 脚本执行失败

**症状**: `sync-version.js` 报错

**解决方案**:
```bash
# 检查 Node.js 版本
node --version  # 应该 >= 16.x

# 检查脚本权限
chmod +x scripts/sync-version.js

# 手动运行
node scripts/sync-version.js
```

### 问题 3: 代码中无法读取版本

**症状**: `VERSION_INFO` 为空或错误

**解决方案**:
```bash
# 重新编译
npm run compile

# 检查 package.json 路径
# 确保 src/constants/version.ts 中的路径正确
```

---

## 📚 相关文档

- [语义化版本 2.0.0](https://semver.org/lang/zh-CN/)
- [npm version 文档](https://docs.npmjs.com/cli/v8/commands/npm-version)
- [VSCode 扩展发布指南](https://code.visualstudio.com/api/working-with-extensions/publishing-extension)

---

## 📋 检查清单

发布前使用此清单确保版本管理正确：

- [ ] `package.json` 版本号已更新
- [ ] 运行 `npm run sync-version` 同步所有文件
- [ ] 所有测试通过 `npm test`
- [ ] 代码编译成功 `npm run compile`
- [ ] README 中的版本徽章显示正确
- [ ] Git tag 已创建
- [ ] CHANGELOG 已更新（如果有）
- [ ] 所有更改已提交并推送

---

## 🎯 总结

通过以下措施确保版本信息的一致性：

1. ✅ **单一数据源**: `package.json` 是唯一的版本定义
2. ✅ **自动化工具**: 使用脚本自动同步版本号
3. ✅ **动态读取**: 代码中从 `package.json` 动态读取
4. ✅ **规范流程**: 使用标准化的版本更新流程
5. ✅ **持续验证**: 定期运行同步脚本检查一致性

**记住**: 永远不要手动在多个地方维护版本号！

---

**文档版本**: 1.0
**最后更新**: 2025-10-21
**维护者**: Unicode Show Team
