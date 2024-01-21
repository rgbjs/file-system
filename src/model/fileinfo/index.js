import { execute } from '../db/index.js'

const createFileinfoSql = `insert into 
file_info(filename, realFilename, size, suffix, MIME, private, remark, state, uploadTime)
values(?, ?, ?, ?, ?, ?, ?, ?, from_unixtime(?));`
/**
 * 创建一条文件记录
 * @param {object} params 参数对象
 * @param {string} params.filename 文件名
 * @param {string} params.realFilename 真实文件名
 * @param {number} params.size 文件大写(字节)
 * @param {string} params.suffix 文件后缀(带点)
 * @param {string} params.MIME 文件MIME
 * @param {string} params.private 文件是否为私密存储 1 true, 0 false
 * @param {string} params.remark 备注
 * @param {string} params.state 状态, 1 正常, 0 封禁
 * @param {number} params.uploadTime 文件上传时间(unix时间戳)
 * @returns {Promise<void>}
 */
export const createFileinfo = async ({
    filename,
    realFilename,
    size,
    suffix,
    MIME,
    private: privateState,
    remark,
    state,
    uploadTime
}) => {
    await execute
        (createFileinfoSql,
            [
                filename,
                realFilename,
                size,
                suffix,
                MIME,
                privateState,
                remark,
                state,
                String(uploadTime)
            ]
        )
}


const deleteFileinfoSql = `update file_info
set deleteTime = from_unixtime(?) where id = ? and deleteTime is null;`

/**
 * 删除一条文件记录
 * @param {object} params 参数对象
 * @param {number} params.id 文件记录的id
 * @param {number} params.deleteTime 删除的时间(unix时间戳)
 * @returns {Promise<void>}
 */
export const deleteFileinfo = async ({ deleteTime, id }) => {
    await execute(deleteFileinfoSql, [String(deleteTime), String(id)])
}


const updateFileinfoSql = `update file_info
set filename = ?, private = ?, remark = ?, state = ? where id = ? and deleteTime is null;`
/**
 * 修改一条文件记录
 * @param {object} params 参数对象
 * @param {number} params.id 文件记录的id
 * @param {string} params.filename 文件名
 * @param {string} params.private 文件是否为私密存储 1 true, 0 false
 * @param {string} params.remark 备注
 * @param {string} params.state 状态, 1 正常, 0 封禁
 * @returns {Promise<void>}
 */
export const updateFileinfo = async ({ filename, private: privateState, remark, state, id }) => {
    await execute(updateFileinfoSql, [filename, privateState, remark, state, String(id)])
}

// 无时间搜索
const queryFileinfoListSql = `select 
id, filename, realFilename, size, suffix, MIME, private, remark, state, uploadTime
from file_info 
where (filename like concat('%', ? ,'%') and deleteTime is null) limit ?, ?;`


// 有时间搜索
const queryFileinfoListSql2 = `select 
id, filename, realFilename, size, suffix, MIME, private, remark, state, uploadTime
from file_info 
where (
filename like concat('%', ? ,'%') and deleteTime is null and (
    uploadTime >= from_unixtime(?) and uploadTime <= from_unixtime(?) 
)) limit ?, ?;`

/**
 * 获取文件记录列表
 * @param {object} params 参数对象
 * @param {number} params.page 页码
 * @param {number} params.limit 需要的数据量
 * @param {string} params.keyword 关键字, 模糊搜索文件名
 * @param {number} [params.starteCreateTime] 创建时间, 起始时间(unix时间戳) [可选]
 * @param {number} [params.endCreateTime] 创建时间, 结束时间(unix时间戳) [可选]
 * @returns {Promise<any[]>}
 */
export const queryFileinfoList = async ({ page, limit, keyword, starteCreateTime, endCreateTime }) => {
    let sql
    if (starteCreateTime && endCreateTime) {
        sql = queryFileinfoListSql2
        const result = await execute(sql, [keyword, String(page), String(limit), String(starteCreateTime), String(endCreateTime)])
        return result[0]
    }
    sql = queryFileinfoListSql
    const result = await execute(sql, [keyword, String(page), String(limit)])
    return result[0]
}

// 无时间搜索
const queryFileinfoListCountSql = `select count(id) as count 
from file_info 
where filename like concat('%', ? ,'%') and deleteTime is null;`

// 有时间搜索
const queryFileinfoListCountSql2 = `select count(id) as count 
from file_info 
where (filename like concat('%', ? ,'%') and deleteTime is null 
and (
uploadTime >= from_unixtime(?) and uploadTime <= from_unixtime(?)
));`
/**
 * 获取文件记录列表长度
 * @param {object} params 参数对象
 * @param {string} params.keyword 关键字, 模糊搜索文件名
 * @param {number} [params.starteCreateTime] 创建时间, 起始时间(unix时间戳) [可选]
 * @param {number} [params.endCreateTime] 创建时间, 结束时间(unix时间戳) [可选]
 * @returns {Promise<number>}
 */
export const queryFileinfoCount = async ({ keyword, starteCreateTime, endCreateTime }) => {
    let sql
    if (starteCreateTime && endCreateTime) {
        sql = queryFileinfoListCountSql2
        const result = await execute(sql, [keyword, String(starteCreateTime), String(endCreateTime)])
        return result[0][0].count
    }
    sql = queryFileinfoListCountSql
    const result = await execute(sql, [keyword])
    return result[0][0].count
}

const queryFileinfoByIdSql = `select
id, filename, realFilename, size, suffix, MIME, private, remark, state, uploadTime
from file_info
where id = ? and deleteTime is null;`
/**
 * 通过id获取文件信息
 * @param {number} id 文件信息的id
 * @returns {Promese<object>}
 */
export const queryFileinfoById = async (id) => {
    const result = await execute(queryFileinfoByIdSql, [String(id)])
    return result[0][0]
}