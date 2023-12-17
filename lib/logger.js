import path from 'path'
import log4js from 'log4js'
const { root } = globalThis.config
log4js.configure({
    appenders: {
        console: {
            type: 'console'
        },
        req: {
            type: 'dateFile',
            filename: path.join(root, '/logs/req/req.log'),
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
                    + '调用堆栈: %s%n'
                    + '记录数据: %m%n',
            }
        },
        sql: {
            type: 'dateFile',
            filename: path.join(root, '/logs/sql/sql.log'),
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
                    + '调用堆栈: %s%n'
                    + '记录数据: %m%n',
            }
        },
        stop: {
            type: 'dateFile',
            filename: path.join(root, '/logs/stop/stop.log'),
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
                    + '调用堆栈: %s%n'
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
        req: {
            enableCallStack: true,
            level: 'all',
            appenders: ['req', 'console'],
            pm2: true
        },
        // sql操作日志
        sql: {
            enableCallStack: true,
            level: 'all',
            appenders: ['sql', 'console'],
            pm2: true
        },
        // 中断日志
        stop: {
            enableCallStack: true,
            level: 'all',
            appenders: ['stop', 'console'],
            pm2: true
        },
    },
})

export default log4js
export const log = log4js.getLogger()
export const reqLog = log4js.getLogger('req')
export const sqlLog = log4js.getLogger('sql')
export const stopLog = log4js.getLogger('stop')

// 未正常退出时将没记录完的日志继续记录完
// process.on('exit', () => {
//     log4js.shutdown()
// })

// 中断异常记录
process.on('uncaughtException', (err, origin) => {
    stopLog.error(
        `异常源: ${origin} => ${origin === 'uncaughtException' ? '同步错误' : 'Promise 被拒绝错误'}\n`
        + `错误类型: ${err?.name}\n`
        + `错误信息: ${err?.message}\n`
        + `错误堆栈: ${err?.stack}`
    )
    log4js.shutdown((err) => {
        if (err) console.log(err)
        process.exit(1)
    })
})
