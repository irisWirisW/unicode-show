# 项目架构文档

## 📐 架构概览

Unicode Show 扩展采用分层架构设计，将关注点清晰分离，提高代码的可维护性和可扩展性。

## 🏗️ 架构层次

```
┌─────────────────────────────────────────────────────┐
│                  VSCode Extension                    │
│                    (extension.ts)                    │
└────────────────┬────────────────────────────────────┘
                 │
        ┌────────┴────────┐
        │                 │
┌───────▼───────┐  ┌─────▼──────┐
│   Commands    │  │   Views    │
│   Layer       │  │   Layer    │
└───────┬───────┘  └─────┬──────┘
        │                │
        └────────┬────────┘
                 │
     ┌───────────▼───────────┐
     │   Presentation Layer  │
     │  (Webview Panels)     │
     └───────────┬───────────┘
                 │
     ┌───────────▼───────────┐
     │   Business Logic      │
     │   (Services)          │
     └───────────┬───────────┘
                 │
     ┌───────────▼───────────┐
     │   Data/Utils Layer    │
     │   (Converters, etc)   │
     └───────────────────────┘
```

## 📦 模块详解

### 1. 入口层 (Entry Point)

**文件**: `extension.ts`

**职责**:
- 扩展激活和停用
- 注册 VSCode 命令
- 注册视图提供者
- 注册悬浮提示提供者
- 协调各模块的初始化

**依赖**:
```typescript
extension.ts
├── services/unicodeInfoService.ts
├── randomUnicodePanel.ts
├── unicodeViewerPanel.ts
├── unicodeTreeProvider.ts
├── unicodeConverter.ts
├── constants/index.ts
└── utils/logger.ts
```

### 2. 表现层 (Presentation Layer)

#### 2.1 Webview 基类

**文件**: `baseWebviewPanel.ts`

**职责**:
- 提供 Webview 面板的通用功能
- 消息通信机制
- 生命周期管理
- 错误处理

**设计模式**: 模板方法模式

```typescript
abstract class BaseWebviewPanel {
    // 模板方法
    setupPanel()

    // 抽象方法（子类实现）
    abstract handleMessage()
    abstract getWebviewContent()
}
```

#### 2.2 具体面板实现

**文件**:
- `randomUnicodePanel.ts` - 随机 Unicode 生成器
- `unicodeViewerPanel.ts` - Unicode 查看器

**职责**:
- 实现具体的 UI 逻辑
- 处理用户交互
- 调用业务逻辑服务

**通信流程**:
```
User Action → Webview → Message → Panel → Service → Response → Webview → UI Update
```

### 3. 业务逻辑层 (Business Logic Layer)

#### 3.1 Unicode 信息服务

**文件**: `services/unicodeInfoService.ts`

**职责**:
- 获取 Unicode 字符详细信息
- UTF-8/UTF-16 编码计算
- Unicode 分类描述
- 字符属性查询

**核心方法**:
```typescript
UnicodeInfoService
├── getCharacterInfo()      // 获取完整字符信息
├── getUTF8Bytes()         // UTF-8 编码
├── getUTF16Bytes()        // UTF-16 编码
├── getCategoryDescription() // 分类描述
└── getUnicodeInfoFallback() // 备用方案
```

#### 3.2 Unicode 转换器

**文件**: `unicodeConverter.ts`

**职责**:
- 解析多种 Unicode 格式
- 验证码点有效性
- 生成随机 Unicode 字符

**支持格式**:
- `U+XXXX` - 标准 Unicode
- `\uXXXX` - JavaScript 转义
- `\UXXXXXXXX` - Python 格式
- `\xXX` - 十六进制转义
- `&#XXX;` - HTML 十进制实体
- `&#xXXXX;` - HTML 十六进制实体

### 4. 视图层 (View Layer)

**文件**: `unicodeTreeProvider.ts`

**职责**:
- 提供侧边栏树视图
- 管理工具入口
- 响应用户点击

### 5. 工具层 (Utility Layer)

#### 5.1 HTML 模板管理器

**文件**: `utils/htmlTemplates.ts`

**职责**:
- 生成标准化的 HTML 结构
- 提供公共样式
- 提供公共脚本

**核心功能**:
```typescript
HtmlTemplates
├── getCommonStyles()       // 公共 CSS
├── getCopyButtonScript()   // 公共 JS
├── createBaseHtml()        // 基础 HTML 框架
├── createResultContainer() // 结果容器
└── createTipsBox()         // 提示框
```

#### 5.2 日志工具

**文件**: `utils/logger.ts`

**职责**:
- 统一的日志管理
- 日志级别控制
- 格式化输出

**日志级别**:
- DEBUG - 调试信息
- INFO - 一般信息
- WARN - 警告
- ERROR - 错误

### 6. 配置层 (Configuration Layer)

#### 6.1 常量定义

**文件**: `constants/index.ts`

**包含**:
- `SUPPORTED_LANGUAGES` - 支持的编程语言
- `COMMANDS` - 命令 ID
- `VIEWS` - 视图 ID
- `WEBVIEW_PANELS` - Webview 面板 ID
- `MESSAGE_COMMANDS` - 消息命令类型

#### 6.2 类型定义

**文件**: `types.ts`

**包含**:
- 数据传输对象 (DTO)
- 接口定义
- 类型别名

## 🔄 数据流

### 1. 悬浮提示流程

```
1. 用户选择文本
   ↓
2. VSCode 触发 Hover Provider
   ↓
3. extension.ts → createHover()
   ↓
4. UnicodeConverter.convert() - 解析文本
   ↓
5. UnicodeInfoService.getCharacterInfo() - 获取详细信息
   ↓
6. buildHoverMarkdown() - 构建 Markdown
   ↓
7. 显示悬浮提示
```

### 2. 随机生成流程

```
1. 用户点击"生成随机 Unicode"
   ↓
2. Webview 发送消息 → Panel
   ↓
3. Panel.handleMessage()
   ↓
4. UnicodeConverter.generateRandom()
   ↓
5. Panel 发送结果消息 → Webview
   ↓
6. Webview 更新 UI
```

### 3. Unicode 查看流程

```
1. 用户输入 Unicode 码点
   ↓
2. Webview 发送消息 → Panel
   ↓
3. Panel.handleMessage()
   ↓
4. UnicodeConverter.convert()
   ↓
5. 成功 → 发送结果消息
   失败 → 发送错误消息
   ↓
6. Webview 更新 UI
```

## 🎨 设计模式应用

### 1. 模板方法模式 (Template Method)

**应用**: `BaseWebviewPanel`

```typescript
class BaseWebviewPanel {
    // 模板方法定义算法骨架
    setupPanel() {
        this.getWebviewContent();     // 子类实现
        this.setupMessageListener();  // 固定流程
        this.setupDisposeListener();  // 固定流程
    }
}
```

### 2. 单例模式 (Singleton)

**应用**: `Logger`

```typescript
class Logger {
    private static instance: Logger;

    static getInstance() {
        if (!Logger.instance) {
            Logger.instance = new Logger();
        }
        return Logger.instance;
    }
}
```

### 3. 工厂模式 (Factory)

**应用**: `HtmlTemplates`

```typescript
class HtmlTemplates {
    static createBaseHtml(title, content, styles, scripts) {
        // 根据参数创建不同的 HTML
    }
}
```

### 4. 策略模式 (Strategy)

**应用**: `UnicodeConverter.parseCodePoint()`

```typescript
// 根据不同的格式采用不同的解析策略
if (text.match(/^U\+/)) {
    // 策略 1: 标准 Unicode 格式
} else if (text.match(/^\\u/)) {
    // 策略 2: JavaScript 转义格式
}
// ... 其他策略
```

## 🔐 错误处理策略

### 1. 分层错误处理

```
UI Layer          → 显示友好错误消息
↓
Business Layer    → 捕获并记录错误
↓
Data Layer        → 抛出具体错误
```

### 2. 错误类型

- **验证错误**: 输入格式不正确
- **业务错误**: Unicode 码点无效
- **系统错误**: 依赖库不可用

### 3. 错误恢复

- 使用备用方案 (Fallback)
- 降级处理
- 用户友好的错误提示

## 📊 性能优化

### 1. 懒加载

- Webview 内容按需生成
- 扩展激活时才加载必要模块

### 2. 资源管理

- 正确的 Dispose 机制
- 避免内存泄漏
- 及时清理订阅

### 3. 缓存策略 (待实现)

```typescript
// 建议：缓存 Unicode 信息查询结果
const cache = new Map<number, UnicodeCharacterInfo>();
```

## 🧪 测试策略

### 1. 单元测试

**可测试模块**:
- `UnicodeConverter` - 纯函数，易于测试
- `UnicodeInfoService` - 独立服务
- `HtmlTemplates` - 静态方法

### 2. 集成测试

**测试场景**:
- 命令注册和执行
- Webview 创建和消息通信
- 悬浮提示显示

### 3. E2E 测试

**测试流程**:
- 完整的用户交互流程
- 跨模块功能

## 📈 可扩展性

### 1. 添加新的 Unicode 格式支持

```typescript
// 在 UnicodeConverter.parseCodePoint() 中添加
else if ((match = text.match(/^新格式的正则$/))) {
    codePoint = // 解析逻辑
}
```

### 2. 添加新的 Webview 面板

```typescript
// 1. 继承 BaseWebviewPanel
// 2. 实现 handleMessage() 和 getWebviewContent()
// 3. 在 extension.ts 中注册命令
```

### 3. 添加新的服务

```typescript
// 在 services/ 目录下创建新的服务类
// 遵循单一职责原则
```

## 🔧 配置管理

### 当前配置

```json
{
  "unicode-show.showUnicode": {
    "type": "boolean",
    "default": true
  }
}
```

### 扩展建议

- 主题自定义
- 快捷键自定义
- 显示格式偏好

## 📚 依赖关系

```
extension.ts (主入口)
│
├── Commands
│   ├── showFromUnicodetext
│   ├── RandomUnicodePanel
│   └── UnicodeViewerPanel
│
├── Providers
│   ├── HoverProvider
│   └── UnicodeTreeProvider
│
├── Services
│   ├── UnicodeInfoService
│   └── UnicodeConverter
│
├── Utils
│   ├── Logger
│   └── HtmlTemplates
│
└── Constants & Types
    ├── constants/index
    └── types
```

## 🎯 SOLID 原则应用

1. **单一职责 (SRP)**: 每个类只有一个变化的理由
2. **开闭原则 (OCP)**: 对扩展开放，对修改关闭
3. **里氏替换 (LSP)**: 子类可以替换父类
4. **接口隔离 (ISP)**: 接口精简，职责单一
5. **依赖倒置 (DIP)**: 依赖抽象而非具体实现

## 🔮 未来架构演进

### 短期计划

1. 添加缓存层
2. 完善测试覆盖
3. 性能监控

### 长期计划

1. 插件化架构
2. 多语言支持
3. 云端同步配置

---

**文档版本**: 1.0
**最后更新**: 2025-10-21
**维护者**: Unicode Show Team
