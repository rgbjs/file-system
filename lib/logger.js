import path from 'path'
import log4js from 'log4js'
const { root } = globalThis.config
log4js.configure({
    appenders: {
        console: {
            type: 'console'
        },
        requestLog: {
            type: 'dateFile',
            filename: path.join(root, '/logs/requestLog/request.log'),
            pattern: 'yyyy-MM-dd',
            keepFileExt: true, // 保留文件后缀
            maxLogSize: 1024 * 1024, // 每个文件最大1MB
            fileNameSep: '_',
            numBackups: 500,
            layout: {
                type: "pattern",
                pattern: '级别: %p%n'
                    + '主机: %h%n'
                    + '记录时间: %d{yyyy-MM-dd hh:mm:ss}%n'
                    + '文件路径: %f%n'
                    + '调用定位: %f:%l:%o%n'
                    + '调用堆栈: %n%s%n'
                    + '记录数据: %m%n',
            }
        },
        sqlLog: {
            type: 'dateFile',
            filename: path.join(root, '/logs/sqlLog/sql.log'),
            pattern: 'yyyy-MM-dd',
            keepFileExt: true, // 保留文件后缀
            maxLogSize: 1024 * 1024, // 每个文件最大1MB
            fileNameSep: '_',
            numBackups: 500,
            layout: {
                type: "pattern",
                pattern: '级别: %p%n'
                    + '主机: %h%n'
                    + '记录时间: %d{yyyy-MM-dd hh:mm:ss}%n'
                    + '文件路径: %f%n'
                    + '调用定位: %f:%l:%o%n'
                    + '调用堆栈: %n%s%n'
                    + '记录数据: %m%n',
            }
        },
        routeErrorLog: {
            type: 'dateFile',
            filename: path.join(root, '/logs/routeErrorLog/route.log'),
            pattern: 'yyyy-MM-dd',
            keepFileExt: true, // 保留文件后缀
            maxLogSize: 1024 * 1024, // 每个文件最大1MB
            fileNameSep: '_',
            numBackups: 500,
            layout: {
                type: "pattern",
                pattern: '级别: %p%n'
                    + '主机: %h%n'
                    + '记录时间: %d{yyyy-MM-dd hh:mm:ss}%n'
                    + '文件路径: %f%n'
                    + '调用定位: %f:%l:%o%n'
                    + '调用堆栈: %n%s%n'
                    + '记录数据: %m%n',
            }
        },
        stopErrorLog: {
            type: 'dateFile',
            filename: path.join(root, '/logs/stopErrorLog/stop.log'),
            pattern: 'yyyy-MM-dd',
            keepFileExt: true, // 保留文件后缀
            maxLogSize: 1024 * 1024, // 每个文件最大1MB
            fileNameSep: '_',
            numBackups: 500,
            layout: {
                type: "pattern",
                pattern: '级别: %p%n'
                    + '主机: %h%n'
                    + '记录时间: %d{yyyy-MM-dd hh:mm:ss}%n'
                    + '文件路径: %f%n'
                    + '调用定位: %f:%l:%o%n'
                    + '调用堆栈: %n%s%n'
                    + '记录数据: %m%n',
            }
        },
    },
    categories: {
        default: {
            enableCallStack: true,
            level: 'all',
            appenders: ['console'],
            pm2: true
        },
        // req请求日志
        requestLog: {
            enableCallStack: true,
            level: 'all',
            appenders: ['requestLog'],
            pm2: true
        },
        // sql操作日志
        sqlLog: {
            enableCallStack: true,
            level: 'all',
            appenders: ['sqlLog'],
            pm2: true
        },
        // 路由错误日志
        routeErrorLog: {
            enableCallStack: true,
            level: 'all',
            appenders: ['routeErrorLog'],
            pm2: true
        },
        // 中断日志
        stopErrorLog: {
            enableCallStack: true,
            level: 'all',
            appenders: ['stopErrorLog'],
            pm2: true
        },
    },
})

export default log4js
export const defaultLog = log4js.getLogger()
export const requestLog = log4js.getLogger('requestLog')
export const sqlLog = log4js.getLogger('sqlLog')
export const routeErrorLog = log4js.getLogger('routeErrorLog')
export const stopErrorLog = log4js.getLogger('stopErrorLog')

// 未正常退出时将没记录完的日志继续记录完
process.on('exit', () => {
    log4js.shutdown()
})

// 中断异常记录
process.on('uncaughtException', (err, origin) => {
    defaultLog.error('进程中断错误', err, '\n')
    stopErrorLog.error(
        `\n    异常源: ${origin} => ${origin === 'uncaughtException' ? '同步错误' : 'Promise 被拒绝错误'}\n`
        + `    错误类型: ${err?.name}\n`
        + `    错误信息: ${err?.message}\n`
        + `    错误堆栈: ${err?.stack}`
    )

    log4js.shutdown(() => {
        process.exit(1)
    })
})
