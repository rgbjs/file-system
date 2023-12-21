import { error, listen, webStaticResource, routeError } from './lib/init.js'
import http from 'http'
import Koa from 'koa'
import router from './router/index/index.js'
import koaStatic from 'koa-static'
import cors from './lib/cors.js'
import path from 'path'

const { project } = globalThis.config
const app = new Koa()

app.on('error', routeError)
app.use(cors({ origin: project.cors }))
app.use(koaStatic(webStaticResource.path)) // 前端静态资源
app.use(router.routes(path.join())) // 路由

const server = http.createServer(app.callback())
server.on('error', error)
server.listen(project.port, listen)
