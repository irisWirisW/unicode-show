# 🎯 版本管理实现示例

## 实际应用场景

以下是如何在项目中使用新的版本管理系统的实际示例。

---

## 📝 场景 1: 在扩展激活时显示版本

### extension.ts

```typescript
import * as vscode from 'vscode';
import { VERSION_INFO, getVersion, isDevelopmentVersion } from './constants/version';
import { logger } from './utils/logger';

export function activate(context: vscode.ExtensionContext): void {
    // 显示激活消息（包含版本号）
    const versionTag = isDevelopmentVersion() ? ' (Dev)' : '';
    logger.info(`🚀 ${VERSION_INFO.displayName} v${getVersion()}${versionTag} activated.`);

    // 检查是否为新版本
    const lastVersion = context.globalState.get<string>('lastVersion');
    if (lastVersion !== VERSION_INFO.version) {
        showWhatsNew(context, VERSION_INFO.version);
        context.globalState.update('lastVersion', VERSION_INFO.version);
    }

    // 注册命令等...
}

function showWhatsNew(context: vscode.ExtensionContext, version: string): void {
    vscode.window.showInformationMessage(
        `Unicode Show has been updated to v${version}! 🎉`,
        'View Changes',
        'Dismiss'
    ).then(selection => {
        if (selection === 'View Changes') {
            vscode.env.openExternal(
                vscode.Uri.parse('https://github.com/irisWirisW/unicode-show/releases')
            );
        }
    });
}
```

---

## 🎨 场景 2: 在 Webview 中显示版本信息

### unicodeViewerPanel.ts

```typescript
import { VERSION_INFO } from './constants/version';
import { HtmlTemplates } from './utils/htmlTemplates';

class UnicodeViewerPanel {
    protected getWebviewContent(): string {
        const content = `
            <div class="container">
                <h1>Unicode Viewer</h1>
                <div class="input-section">
                    <!-- Your content here -->
                </div>
            </div>

            <!-- Footer with version -->
            <footer class="footer">
                <p>
                    ${VERSION_INFO.displayName} v${VERSION_INFO.version}
                    <span class="separator">|</span>
                    <a href="https://github.com/irisWirisW/unicode-show">GitHub</a>
                </p>
            </footer>
        `;

        const styles = `
            ${HtmlTemplates.getCommonStyles()}

            .footer {
                position: fixed;
                bottom: 0;
                left: 0;
                right: 0;
                padding: 10px;
                text-align: center;
                font-size: 12px;
                color: var(--vscode-descriptionForeground);
                background: var(--vscode-editor-background);
                border-top: 1px solid var(--vscode-panel-border);
            }

            .footer .separator {
                margin: 0 8px;
                color: var(--vscode-panel-border);
            }

            .footer a {
                color: var(--vscode-textLink-foreground);
                text-decoration: none;
            }

            .footer a:hover {
                text-decoration: underline;
            }
        `;

        return HtmlTemplates.createBaseHtml(
            VERSION_INFO.displayName,
            content,
            styles,
            ''
        );
    }
}
```

---

## 📊 场景 3: 版本兼容性检查

### extension.ts

```typescript
import { VERSION_INFO, compareVersions } from './constants/version';

export function activate(context: vscode.ExtensionContext): void {
    // 检查存储的数据版本兼容性
    const storedDataVersion = context.globalState.get<string>('dataVersion', '0.0.0');

    // 如果主版本号不同，需要迁移数据
    if (compareVersions(VERSION_INFO.version, storedDataVersion) > 0) {
        const currentMajor = VERSION_INFO.major;
        const storedMajor = parseInt(storedDataVersion.split('.')[0]);

        if (currentMajor > storedMajor) {
            logger.warn(`Major version upgrade detected: ${storedDataVersion} -> ${VERSION_INFO.version}`);
            migrateUserData(context, storedDataVersion, VERSION_INFO.version);
        }
    }

    // 更新数据版本
    context.globalState.update('dataVersion', VERSION_INFO.version);
}

function migrateUserData(
    context: vscode.ExtensionContext,
    fromVersion: string,
    toVersion: string
): void {
    logger.info(`Migrating user data from ${fromVersion} to ${toVersion}`);

    // 执行数据迁移逻辑
    // ...

    vscode.window.showInformationMessage(
        `Unicode Show has been upgraded to v${toVersion}. Your settings have been migrated.`
    );
}
```

---

## 🔍 场景 4: 调试和日志

### utils/logger.ts

```typescript
import { VERSION_INFO, isDevelopmentVersion } from '../constants/version';

class Logger {
    private outputChannel: vscode.OutputChannel;

    constructor() {
        this.outputChannel = vscode.window.createOutputChannel(
            `${VERSION_INFO.displayName} (v${VERSION_INFO.version})`
        );
    }

    debug(message: string, ...args: any[]): void {
        // 仅在开发版本中显示调试信息
        if (isDevelopmentVersion()) {
            const timestamp = new Date().toISOString();
            this.outputChannel.appendLine(
                `[${timestamp}] [DEBUG] ${message} ${JSON.stringify(args)}`
            );
        }
    }

    info(message: string): void {
        const timestamp = new Date().toISOString();
        this.outputChannel.appendLine(
            `[${timestamp}] [INFO] ${message}`
        );
    }

    // 显示输出面板（用于诊断）
    show(): void {
        this.outputChannel.show();
    }
}

export const logger = new Logger();
```

---

## 📦 场景 5: 发布和打包

### package.json

```json
{
  "name": "unicode-show",
  "version": "0.1.0",
  "scripts": {
    "vscode:prepublish": "npm run compile",
    "compile": "tsc -p ./",
    "package": "vsce package",
    "publish": "vsce publish",

    "sync-version": "node scripts/sync-version.js",
    "version": "npm run sync-version && git add -A",
    "postversion": "git push && git push --tags",

    "release:patch": "npm version patch",
    "release:minor": "npm version minor",
    "release:major": "npm version major"
  }
}
```

**使用示例**:

```bash
# 发布补丁版本
npm run release:patch

# 发布次版本
npm run release:minor

# 打包扩展
npm run package

# 发布到市场
npm run publish
```

---

## 🧪 场景 6: 测试中使用版本

### test/extension.test.ts

```typescript
import * as assert from 'assert';
import { VERSION_INFO, compareVersions, getVersion } from '../src/constants/version';

suite('Version Management Test Suite', () => {
    test('Should read version from package.json', () => {
        assert.strictEqual(typeof VERSION_INFO.version, 'string');
        assert.match(VERSION_INFO.version, /^\d+\.\d+\.\d+$/);
    });

    test('Should parse version correctly', () => {
        assert.strictEqual(typeof VERSION_INFO.major, 'number');
        assert.strictEqual(typeof VERSION_INFO.minor, 'number');
        assert.strictEqual(typeof VERSION_INFO.patch, 'number');
    });

    test('Should compare versions correctly', () => {
        assert.strictEqual(compareVersions('1.0.0', '0.9.9'), 1);
        assert.strictEqual(compareVersions('0.9.9', '1.0.0'), -1);
        assert.strictEqual(compareVersions('1.0.0', '1.0.0'), 0);
    });

    test('getVersion should return version string', () => {
        const version = getVersion();
        assert.strictEqual(version, VERSION_INFO.version);
    });
});
```

---

## 📱 场景 7: 状态栏显示版本（可选）

### extension.ts

```typescript
import * as vscode from 'vscode';
import { VERSION_INFO, isDevelopmentVersion } from './constants/version';

export function activate(context: vscode.ExtensionContext): void {
    // 创建状态栏项（仅开发版本显示）
    if (isDevelopmentVersion()) {
        const statusBarItem = vscode.window.createStatusBarItem(
            vscode.StatusBarAlignment.Right,
            100
        );

        statusBarItem.text = `$(symbol-misc) Unicode Show v${VERSION_INFO.version}`;
        statusBarItem.tooltip = `${VERSION_INFO.displayName} - Development Version`;
        statusBarItem.command = 'unicode-show.showVersion';
        statusBarItem.show();

        context.subscriptions.push(statusBarItem);

        // 注册显示版本信息的命令
        const showVersionCommand = vscode.commands.registerCommand(
            'unicode-show.showVersion',
            () => {
                vscode.window.showInformationMessage(
                    `${VERSION_INFO.displayName}\n` +
                    `Version: ${VERSION_INFO.version}\n` +
                    `Publisher: ${VERSION_INFO.publisher}\n` +
                    `Development: ${isDevelopmentVersion()}`
                );
            }
        );

        context.subscriptions.push(showVersionCommand);
    }
}
```

---

## 🔄 场景 8: 版本更新工作流

### 完整的发布流程

```bash
# Step 1: 完成开发并测试
npm test
npm run lint

# Step 2: 编译项目
npm run compile

# Step 3: 更新版本号（自动同步所有文件）
npm version patch
# 或者
npm version minor
# 或者
npm version major

# Step 4: 验证版本同步
npm run sync-version

# Step 5: 推送到 Git（如果没有自动推送）
git push && git push --tags

# Step 6: 打包扩展
vsce package

# Step 7: 发布到市场
vsce publish

# 或者一步完成打包和发布
vsce publish patch  # 或 minor 或 major
```

---

## 💡 高级技巧

### 1. 条件功能开关

```typescript
import { VERSION_INFO } from './constants/version';

// 根据版本启用/禁用功能
export function isFeatureEnabled(featureName: string): boolean {
    const features = {
        'advanced-search': VERSION_INFO.minor >= 1,
        'batch-convert': VERSION_INFO.minor >= 2,
        'cloud-sync': VERSION_INFO.major >= 1
    };

    return features[featureName] || false;
}

// 使用
if (isFeatureEnabled('advanced-search')) {
    // 启用高级搜索功能
}
```

### 2. 版本特定的配置

```typescript
import { VERSION_INFO } from './constants/version';

export function getDefaultConfig() {
    const baseConfig = {
        showTooltip: true,
        maxHistory: 10
    };

    // v0.1.0+ 的新配置
    if (VERSION_INFO.minor >= 1) {
        return {
            ...baseConfig,
            enableCache: true,
            cacheSize: 100
        };
    }

    return baseConfig;
}
```

### 3. 版本诊断命令

```typescript
vscode.commands.registerCommand('unicode-show.diagnostics', () => {
    const info = [
        `Extension: ${VERSION_INFO.displayName}`,
        `Version: ${VERSION_INFO.version}`,
        `ID: ${getExtensionId()}`,
        `Major: ${VERSION_INFO.major}`,
        `Minor: ${VERSION_INFO.minor}`,
        `Patch: ${VERSION_INFO.patch}`,
        `Development: ${isDevelopmentVersion()}`,
        `VS Code: ${vscode.version}`,
        `Platform: ${process.platform}`,
        `Node: ${process.version}`
    ].join('\n');

    vscode.window.showInformationMessage(info, { modal: true });
});
```

---

## 📋 总结

通过这些实际示例，你可以看到版本管理系统如何在项目的各个方面发挥作用：

- ✅ **用户体验**: 显示版本信息、更新通知
- ✅ **数据迁移**: 版本兼容性检查
- ✅ **调试支持**: 版本相关的日志和诊断
- ✅ **功能控制**: 基于版本的功能开关
- ✅ **发布流程**: 自动化的版本管理

**关键点**: 所有这些都基于 `package.json` 中的单一版本源，通过导入 `version.ts` 模块实现。

---

**创建日期**: 2025-10-21
**适用版本**: 0.1.0+
