/**
 * 入口模块第一行正式程序执行前
 */

import '#config' // 注入配置
import fs from 'fs/promises'
import path from 'path'

const { root, project, file } = globalThis.config

/** 前端静态资源处理 */
try {
    await fs.mkdir(project.dist, { recursive: true })
} catch (error) {
    if (error.code !== 'EEXIST') {
        console.error(`创建目录时发生错误: ${error.message}`);
    }
}

/** 文件储存位置 */
try {
    await fs.mkdir(file.$public, { recursive: true })
    await fs.mkdir(file.$private, { recursive: true })
    await fs.mkdir(file.$recycleBin, { recursive: true })
    await fs.mkdir(file.$temp, { recursive: true })
} catch (error) {
    if (error.code !== 'EEXIST') {
        console.error(`创建目录时发生错误: ${error.message}`);
    }
}
