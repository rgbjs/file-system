import Router from 'koa-router'
import test from '../test/index.js'
import admin from '../admin/index.js'
const router = new Router()
const { api } = globalThis.config.project

router.use(api, test.routes(), admin.routes())

export default router