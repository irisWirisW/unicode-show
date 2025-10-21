/**
 * 版本信息模块
 * 从 package.json 中读取版本信息，确保单一数据源
 */

import * as fs from 'fs';
import * as path from 'path';

/**
 * 版本信息接口
 */
export interface VersionInfo {
    /** 完整版本号 */
    version: string;
    /** 主版本号 */
    major: number;
    /** 次版本号 */
    minor: number;
    /** 修订版本号 */
    patch: number;
    /** 扩展名称 */
    name: string;
    /** 扩展显示名称 */
    displayName: string;
    /** 发布者 */
    publisher: string;
}

/**
 * 解析版本号
 */
function parseVersion(version: string): { major: number; minor: number; patch: number } {
    const parts = version.split('.').map(Number);
    return {
        major: parts[0] || 0,
        minor: parts[1] || 0,
        patch: parts[2] || 0
    };
}

/**
 * 获取版本信息
 * 从 package.json 读取，确保版本信息的唯一真实来源
 */
function getVersionInfo(): VersionInfo {
    try {
        // 读取 package.json
        const packageJsonPath = path.join(__dirname, '..', '..', 'package.json');
        const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));

        const { major, minor, patch } = parseVersion(packageJson.version);

        return {
            version: packageJson.version,
            major,
            minor,
            patch,
            name: packageJson.name,
            displayName: packageJson.displayName || packageJson.name,
            publisher: packageJson.publisher
        };
    } catch (error) {
        console.error('Failed to read version info from package.json:', error);
        // 返回默认值
        return {
            version: '0.0.0',
            major: 0,
            minor: 0,
            patch: 0,
            name: 'unicode-show',
            displayName: 'unicode-show',
            publisher: 'unknown'
        };
    }
}

/**
 * 导出版本信息（单例）
 */
export const VERSION_INFO: VersionInfo = getVersionInfo();

/**
 * 获取版本号字符串
 */
export function getVersion(): string {
    return VERSION_INFO.version;
}

/**
 * 获取完整的扩展标识符
 */
export function getExtensionId(): string {
    return `${VERSION_INFO.publisher}.${VERSION_INFO.name}`;
}

/**
 * 比较版本号
 * @returns 1 if version1 > version2, -1 if version1 < version2, 0 if equal
 */
export function compareVersions(version1: string, version2: string): number {
    const v1 = parseVersion(version1);
    const v2 = parseVersion(version2);

    if (v1.major !== v2.major) {
        return v1.major > v2.major ? 1 : -1;
    }
    if (v1.minor !== v2.minor) {
        return v1.minor > v2.minor ? 1 : -1;
    }
    if (v1.patch !== v2.patch) {
        return v1.patch > v2.patch ? 1 : -1;
    }
    return 0;
}

/**
 * 检查是否为开发版本
 */
export function isDevelopmentVersion(): boolean {
    return VERSION_INFO.major === 0;
}
