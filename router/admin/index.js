import Router from "koa-router"
const router = new Router()

router.get('/admin', async (ctx) => {
    ctx.body = {
        code: 0,
        msg: 'admin',
    }
})

router.post('/admin', async (ctx) => {
    ctx.body = {
        code: 0,
        msg: 'admin',
    }
})

export default router