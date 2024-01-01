import './clearConsole.js'
import './config.js'
import { routeErrorLog, defaultLog } from './logger.js'
import ip from 'ip'
import path from 'path'
import fs from 'fs/promises'
import color from './color.js'

const { root, project, file, mysql } = globalThis.config

/** 是否开启日志记录 */
const logger = () => import('./logger.js')
if (project.isLog) {
    await logger()
}

/** 是否启用 mysql 数据库 */
const mysql2 = () => import('../model/db.js')
if (mysql.start) {
    await mysql2()
}

/** 监听端口失败 */
export const error = err => {
    console.log('')
    console.log(color.danger(project.fail?.replaceAll('{{port}}', project.port)))
    console.log('')
    throw err
}

/** 监听端口成功 */
export const listen = () => {
    console.log('')
    console.log(color.success(project.success))
    if (process.env.NODE_ENV === 'develop') {
        console.log('')
        console.log(color.success(`✨ http://127.0.0.1:${project.port}`))
        console.log('')
        console.log(color.success(`✨ http://${ip.address()}:${project.port}`))
        console.log('')
        console.log(color.success(`✨ 当前为开发模式, ${project.port} 端口监听中...`))
        console.log('')
    } else {
        console.log('')
        console.log(color.success(`✨ 当前为生产模式, ${project.port} 端口监听中...`))
        console.log('')
    }
}

/** 前端静态资源处理 */
export const webStaticResource = {
    path: path.join(root, project.dist)
}
try {
    await fs.mkdir(webStaticResource.path, { recursive: true })
} catch (error) {
    if (error.code !== 'EEXIST') {
        console.error(`创建目录时发生错误: ${error.message}`);
    }
}

/** 文件储存位置 */
export const fileStore = {
    public: path.join(root, file.public),
    private: path.join(root, file.private)
}
try {
    await fs.mkdir(fileStore.public, { recursive: true })
    await fs.mkdir(fileStore.private, { recursive: true })
} catch (error) {
    if (error.code !== 'EEXIST') {
        console.error(`创建目录时发生错误: ${error.message}`);
    }
}


/** 路由错误 */
export const routeError = (err) => {
    if (project.isLog) {
        const text = `\n    错误类型: ${err.name}\n`
            + `    错误信息: ${err.message}\n`
            + `    错误堆栈: ${err.stack}`
        defaultLog.error('路由错误', err, '\n')
        routeErrorLog.error(text)
        return
    }
    console.log(err, '\n')
}