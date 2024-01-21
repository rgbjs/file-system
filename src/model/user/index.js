import { execute } from '../db/index.js'

const queryUserListSql = `select 
id, name, account, headerImg, remark, createTime 
from user 
where (name like concat('%', ?, '%') or account like concat('%', ?, '%')) and deleteTime is null order by id desc limit ?, ?`

/**
 * 获取用户列表
 * - 列表中不包含 `password` 字段
 * @param {object} options 配置选项
 * @param {string} options.keyword 关键字, 对 name 和 account 进行模糊查找
 * @param {number} options.page 页码, 大于 0 的正整数
 * @param {number} options.limit 需要多少条数据
 * @returns {Promese<object[]>} 返回一个用户列表
 */
export const queryUserList = async ({ keyword, page, limit }) => {
    page = (page - 1) * limit
    const result = await execute(queryUserListSql, [keyword, keyword, String(page), String(limit)])
    return result[0]
}


const queryCountSql = `select count(id) as count
from user
where (name like concat('%', ?, '%') or account like concat('%', ?, '%')) and deleteTime is null;`

/**
 * 获取用户列表的长度
 * @param {string} keyword 关键字, 对 name 和 account 进行模糊查找
 * @returns {Promese<number>} 根据条件过滤后统计的总条数
 */
export const queryCount = async (keyword) => {
    const result = await execute(queryCountSql, [keyword, keyword])
    return result[0][0].count
}


const queryUserByIdSql = `select
id, name, account, password, headerImg, remark, createTime
from user
where id = ? and deleteTime is null;`

/**
 * 根据 id 查询一个用户
 * @param {number} id 用户的id
 * @returns {Promese<object>} 返回一个指定用户, 如果不存在则返回 undefined
 */
export const queryUserById = async (id) => {
    const result = await execute(queryUserByIdSql, [String(id)])
    return result[0][0]
}


const queryUserByAccountSql = `select
id, name, account, password, headerImg, remark, createTime
from user
where account = ? and deleteTime is null;`

/**
 * 根据 account 查询一个用户
 * @param {string} account 用户的account
 * @returns {Promese<object>} 返回一个指定用户, 如果不存在则返回 undefined
 */
export const queryUserByAccount = async (account) => {
    const result = await execute(queryUserByAccountSql, [account])
    return result[0][0]
}


const createUserSql = `insert into 
user(name, account, password, headerImg, createTime, remark)
values(?, ?, ?, ?, from_unixtime(?), ?);`

/**
 * 创建一个用户
 * @param {object} options 参数对象
 * @param {string} options.name 用户名字
 * @param {string} options.account 用户账号
 * @param {string} options.password 用户密码
 * @param {string} options.headerImg 用户头像地址
 * @param {number} options.createTime 用户创建时间(unix时间戳)
 * @param {string} options.remark 备注
 * @returns {Promese<void>} 
 */
export const createUser = async ({ name, account, password, headerImg, createTime, remark }) => {
    await execute(createUserSql, [name, account, password, headerImg, String(createTime), remark])
}


const updateUserSql = `update user 
set name = ?, password = ?, headerImg = ?, remark = ? 
where id = ? and deleteTime is null;`
/**
 * 修改一个用户
 * @param {object} options 参数对象
 * @param {number} options.id 用户ID
 * @param {string} options.name 用户名字
 * @param {string} options.password 用户密码
 * @param {string} options.headerImg 用户头像地址
 * @param {string} options.remark 备注
 * @returns {Promese<void>} 
 */
export const updateUser = async ({ name, password, headerImg, remark, id }) => {
    await execute(updateUserSql, [name, password, headerImg, remark, String(id)])
}


const deleteUserSql = `update user set deleteTime = from_unixtime(?) where id = ? and deleteTime is null;`
/**
 * 删除一个用户
 * @param {object} options 参数对象
 * @param {number} options.id 用户ID
 * @param {number} options.deleteTime 删除时间(unix时间戳)
 * @returns {Promese<void>} 
 */
export const deleteUser = async ({ deleteTime, id }) => {
    await execute(deleteUserSql, [String(deleteTime), String(id)])
}
