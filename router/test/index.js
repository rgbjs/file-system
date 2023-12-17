import Router from "koa-router"
import { createToken } from '../../lib/authorization.js'
const router = new Router()

router.get('/test', async (ctx) => {
    ctx.body = {
        code: 0,
        msg: '测试通过',
        body: createToken({
            id: 1,
            name: '小明',
            account: 'admin'
        })
    }
})

router.post('/test', async (ctx) => {
    ctx.body = {
        code: 0,
        msg: '测试通过',
        body: createToken({
            id: 1,
            name: '小明',
            account: 'admin'
        })
    }
})

export default router