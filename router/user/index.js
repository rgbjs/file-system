import Router from "koa-router"
import xss from 'xss'
import { encryp } from '../../lib/encryp.js'
import {
    queryUserList,
    queryUserById,
    queryUserByAccount,
    queryCount,
    createUser,
    updateUser,
    deleteUser
} from '../../model/user.js'
import {
    checkQueryId,
    checkQueryAccount,
    checkQueryList,
    checkCreateUser,
    checkUpdateUser
} from './checking.js'

const router = new Router()

/** 获取用户列表 */
router.get('/user', async (ctx) => {
    let { keyword = '', page = '1', limit = '10' } = ctx.query
    const check = checkQueryList({ keyword, page, limit })
    if (check.code !== 0) {
        ctx.body = check
        return
    }

    keyword = xss(keyword) // 过滤替换
    const userList = await queryUserList({ keyword, page, limit })
    const count = await queryCount(keyword)
    ctx.body = {
        code: 0,
        msg: '获取用户列表成功',
        count,
        data: userList
    }
})

/** 根据id获取指定用户 */
router.get('/user/:id', async (ctx) => {
    const { id } = ctx.params
    const check = checkQueryId(id)
    if (check.code !== 0) {
        ctx.body = check
        return
    }

    const user = await queryUserById(id)
    if (!user) {
        ctx.body = {
            code: 1,
            msg: '用户不存在',
        }
        return
    }

    delete user.password
    ctx.body = {
        code: 0,
        msg: '获取用户成功',
        data: user
    }
})

/** 根据account(账号)获取指定用户 */
router.get('/user/account/:account', async (ctx) => {
    const { account } = ctx.params
    const check = checkQueryAccount(account)
    if (check.code !== 0) {
        ctx.body = check
        return
    }

    const user = await queryUserByAccount(account)
    if (!user) {
        ctx.body = {
            code: 1,
            msg: '用户不存在',
        }
        return
    }

    delete user.password
    ctx.body = {
        code: 0,
        msg: '获取用户成功',
        data: user
    }
})

/** 新建一个用户 */
router.post('/user', async (ctx) => {
    const { name, account, password, headerImg = '', remark = '' } = ctx.request.body
    const check = checkCreateUser({ name, account, password, headerImg, remark })
    if (check.code !== 0) {
        ctx.body = check
        return
    }

    const user = await queryUserByAccount(account)
    if (user) {
        ctx.body = {
            code: 1,
            msg: '账号已存在, 请换个账号'
        }
        return
    }

    const encrypPassword = await encryp(password)
    await createUser({
        name,
        account,
        password: encrypPassword,
        headerImg,
        remark: xss(remark),
        createTime: String(Date.now())
    })

    ctx.body = {
        code: 0,
        msg: '用户创建成功'
    }
})

/** 修改一个用户 */
router.put('/user', async (ctx) => {
    const check = checkUpdateUser(ctx.request.body)
    if (check.code !== 0) {
        ctx.body = check
        return
    }

    const { id } = ctx.request.body
    const userInfo = await queryUserById(id)
    if (!userInfo) {
        ctx.body = {
            code: 1,
            msg: '用户不存在'
        }
        return
    }
    const {
        name = userInfo.name,
        password = userInfo.password,
        headerImg = userInfo.headerImg,
        remark = userInfo.remark
    } = ctx.request.body

    await updateUser({ id, name, password, headerImg, remark })

    ctx.body = {
        code: 0,
        msg: '修改成功'
    }
})

/** 删除一个用户 */
router.delete('/user/:id', async (ctx) => {
    const { id } = ctx.params
    const check = checkQueryId(id)
    if (check.code !== 0) {
        ctx.body = check
        return
    }

    const userInfo = await queryUserById(id)
    if (!userInfo) {
        ctx.body = {
            code: 1,
            msg: '用户不存在'
        }
        return
    }

    await deleteUser({ id, deleteTime: String(Date.now()) })

    ctx.body = {
        code: 0,
        msg: '删除用户成功',
    }
})

export default router