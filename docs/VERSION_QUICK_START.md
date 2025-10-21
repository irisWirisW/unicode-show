# ⚡ 版本管理快速入门

## 🎯 核心理念

**一个命令，更新所有！**

`package.json` 是唯一的版本数据源，其他所有地方自动同步。

---

## 🚀 快速使用

### 更新版本（最常用）

```bash
# Bug 修复 (0.1.0 → 0.1.1)
npm version patch

# 新功能 (0.1.0 → 0.2.0)
npm version minor

# 重大更新 (0.1.0 → 1.0.0)
npm version major
```

**就这么简单！** 自动完成：
- ✅ 更新 `package.json`
- ✅ 同步所有文档中的版本
- ✅ 创建 Git commit
- ✅ 创建 Git tag
- ✅ 推送到远程仓库

---

## 🔧 手动同步版本

如果手动修改了 `package.json` 中的版本：

```bash
npm run sync-version
```

---

## 💻 在代码中使用版本

```typescript
// 导入版本信息
import { VERSION_INFO, getVersion, getExtensionId } from './constants/version';

// 使用
console.log(getVersion());        // "0.1.0"
console.log(getExtensionId());    // "1risW.unicode-show"
console.log(VERSION_INFO.major);  // 0
console.log(VERSION_INFO.minor);  // 1
console.log(VERSION_INFO.patch);  // 0
```

---

## ✅ 发布前检查清单

```bash
# 1. 测试通过
npm test

# 2. 编译成功
npm run compile

# 3. 同步版本
npm run sync-version

# 4. 更新版本号
npm version patch  # 或 minor/major

# 5. 打包发布
vsce package
vsce publish
```

---

## 📚 完整文档

详细说明请查看：[VERSION_MANAGEMENT.md](./docs/VERSION_MANAGEMENT.md)

---

**记住**: 永远不要手动在多个文件中修改版本号！使用 `npm version` 或 `npm run sync-version`。
