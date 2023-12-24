import { execute } from './db.js'

const queryAdminListSql = `select 
id, name, account, headerImg, remark, createTime 
from admin 
where (name like concat('%', ?, '%') or account like concat('%', ?, '%')) and deleteTime is null order by id desc limit ?, ?`

/**
 * 获取管理员列表
 * - 列表中不包含 `password` 字段
 * @param {object} options 配置选项
 * @param {string} options.keyword 关键字, 对 name 和 account 进行模糊查找
 * @param {string|number} options.page 页码, 大于 0 的正整数
 * @param {string|number} options.limit 需要多少条数据
 * @returns {object[]} 返回一个管理员列表
 */
export const queryAdminList = async ({ keyword, page, limit }) => {
    page = (page - 1) * limit
    const result = await execute(queryAdminListSql, [keyword, keyword, page, limit])
    return result[0]
}

const queryCountSql = `select count(id) as count
from admin
where (name like concat('%', ?, '%') or account like concat('%', ?, '%')) and deleteTime is null`

/**
 * 获取管理员列表的长度
 * @param {string} keyword 关键字, 对 name 和 account 进行模糊查找
 * @returns {number} 根据条件过滤后统计的总条数
 */
export const queryCount = async (keyword) => {
    const result = await execute(queryCountSql, [keyword, keyword])
    return result[0][0].count
}

const queryAdminByIdSql = `select
id, name, account, headerImg, remark, createTime
from admin
where id = ?`

/**
 * 根据 id 查询一个管理员
 * @param {number|string} id 管理员的id
 * @returns {object} 返回一个指定管理员, 如果不存在则返回 undefined
 */
export const queryAdminById = async (id) => {
    const result = await execute(queryAdminByIdSql, [id])
    return result[0][0]
}

const queryAdminByAccountSql = `select
id, name, account, headerImg, remark, createTime
from admin
where account = ?`

/**
 * 根据 account 查询一个管理员
 * @param {string} account 管理员的account
 * @returns {object} 返回一个指定管理员, 如果不存在则返回 undefined
 */
export const queryAdminByAccount = async (account) => {
    const result = await execute(queryAdminByAccountSql, [account])
    return result[0][0]
}
