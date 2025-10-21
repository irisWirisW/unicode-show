#!/usr/bin/env node

/**
 * 版本同步脚本
 * 将 package.json 中的版本号同步到所有相关文件
 *
 * 使用方法:
 *   node scripts/sync-version.js
 *   npm run sync-version
 */

const fs = require('fs');
const path = require('path');

// ANSI 颜色代码
const colors = {
    reset: '\x1b[0m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    red: '\x1b[31m'
};

function log(message, color = 'reset') {
    console.log(`${colors[color]}${message}${colors.reset}`);
}

/**
 * 读取 package.json 获取当前版本
 */
function getCurrentVersion() {
    const packageJsonPath = path.join(__dirname, '..', 'package.json');
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
    return packageJson.version;
}

/**
 * 更新文件中的版本号
 */
function updateVersionInFile(filePath, pattern, replacement) {
    try {
        const fullPath = path.join(__dirname, '..', filePath);

        if (!fs.existsSync(fullPath)) {
            log(`⚠️  文件不存在: ${filePath}`, 'yellow');
            return false;
        }

        let content = fs.readFileSync(fullPath, 'utf-8');
        const originalContent = content;

        // 使用正则表达式替换
        if (typeof pattern === 'string') {
            content = content.replace(new RegExp(pattern, 'g'), replacement);
        } else {
            content = content.replace(pattern, replacement);
        }

        // 如果内容有变化，写入文件
        if (content !== originalContent) {
            fs.writeFileSync(fullPath, content, 'utf-8');
            log(`✅ 更新成功: ${filePath}`, 'green');
            return true;
        } else {
            log(`ℹ️  无需更新: ${filePath}`, 'blue');
            return false;
        }
    } catch (error) {
        log(`❌ 更新失败: ${filePath}`, 'red');
        console.error(error);
        return false;
    }
}

/**
 * 主函数
 */
function main() {
    log('\n🚀 开始同步版本号...\n', 'blue');

    const version = getCurrentVersion();
    log(`📌 当前版本: ${version}\n`, 'green');

    let updatedCount = 0;
    const files = [
        {
            path: 'readme.md',
            pattern: /version-\d+\.\d+\.\d+-green/g,
            replacement: `version-${version}-green`,
            description: 'README.md 版本徽章'
        },
        {
            path: 'docs/readme_zh.md',
            pattern: /version-\d+\.\d+\.\d+-green/g,
            replacement: `version-${version}-green`,
            description: '中文 README 版本徽章'
        },
        {
            path: 'docs/REFACTORING_COMPLETE.md',
            pattern: /\*\*版本\*\*:\s*[\d.]+/g,
            replacement: `**版本**: ${version}`,
            description: '重构完成报告版本'
        }
    ];

    // 更新每个文件
    files.forEach(({ path: filePath, pattern, replacement, description }) => {
        log(`📝 更新: ${description}`);
        if (updateVersionInFile(filePath, pattern, replacement)) {
            updatedCount++;
        }
        console.log('');
    });

    // 总结
    log('─'.repeat(50), 'blue');
    log(`\n✨ 版本同步完成！`, 'green');
    log(`📊 更新了 ${updatedCount} 个文件`, 'green');
    log(`🎯 所有文件版本号已同步为: ${version}\n`, 'green');
}

// 执行主函数
main();
