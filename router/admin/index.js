import Router from "koa-router"
import xss from 'xss'
import { queryAdminList, queryAdminById, queryAdminByAccount, queryCount } from '../../model/admin.js'
import { checkId, checkAccount, checkQueryList } from './checking.js'
const router = new Router()

/** 获取管理员列表 */
router.get('/admin', async (ctx) => {
    let { keyword = '', page = '1', limit = '10' } = ctx.query
    const check = checkQueryList({ keyword, page, limit })
    if (check.code !== 0) {
        ctx.body = check
        return
    }

    keyword = xss(keyword) // 过滤替换
    const adminList = await queryAdminList({ keyword, page, limit })
    const count = await queryCount(keyword)
    ctx.body = {
        code: 0,
        msg: '获取管理员列表成功',
        count,
        data: adminList
    }
})

/** 根据id获取指定管理员 */
router.get('/admin/id/:id', async (ctx) => {
    const { id } = ctx.params
    const check = checkId(id)
    if (check.code !== 0) {
        ctx.body = check
        return
    }

    const admin = await queryAdminById(id)
    if (!admin) {
        ctx.body = {
            code: 1,
            msg: '管理员不存在',
        }
        return
    }

    ctx.body = {
        code: 0,
        msg: '获取管理员成功',
        data: admin
    }
})

/** 根据account(账号)获取指定管理员 */
router.get('/admin/account/:account', async (ctx) => {
    const { account } = ctx.params
    const check = checkAccount(account)
    if (check.code !== 0) {
        ctx.body = check
        return
    }

    const admin = await queryAdminByAccount(account)
    if (!admin) {
        ctx.body = {
            code: 1,
            msg: '管理员不存在',
        }
        return
    }

    ctx.body = {
        code: 0,
        msg: '获取管理员成功',
        data: admin
    }
})

export default router