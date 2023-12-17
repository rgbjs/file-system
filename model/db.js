import mysql2 from 'mysql2/promise'
import initTable from './initTable.js'
const { host, user, port, password, database } = globalThis.config.mysql

// 创建连接池，设置连接池的参数
export const pool = mysql2.createPool({
    host,
    port,
    user,
    password,
    charset: 'utf8mb4',
    multipleStatements: true,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 0
})

export const query = pool.query.bind(pool)
export const execute = pool.execute.bind(pool)

// 创建数据库
await execute(`create database if not exists ${database} default character set utf8mb4 default collate utf8mb4_bin`)
await query(`use ${database}`)
await initTable({ execute, query, pool })
