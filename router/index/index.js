import Router from 'koa-router'
import admin from '../admin/index.js'
import user from '../user/index.js'
import login from '../login/index.js'

const router = new Router()
const { api } = globalThis.config.project

router.use(api, admin.routes(), user.routes(), login.routes())

export default router