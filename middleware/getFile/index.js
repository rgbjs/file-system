import path from 'path'
import koaStatic from 'koa-static'

const { file } = globalThis.config
const usePublic = koaStatic(file.$public)
const usePrivate = koaStatic(file.$private)

/**
 * 获取文件中间件
 */
export default () => {
    return async (ctx, next) => {
        const { method, url } = ctx
        if (!['GET', 'POST'].includes(method)) {
            await next()
            return
        }

        // 文件到达浏览器处置方式: inline 内嵌 , attachment 作为附件下载
        const { disposition = 'inline', filename } = ctx.query
        if (filename) {
            const extname = path.extname(ctx.URL.pathname)
            ctx.set('Content-Disposition', `${disposition}; filename=${encodeURIComponent(filename)}${extname}`)
        } else {
            ctx.set('Content-Disposition', disposition)
        }

        if (url.startsWith(file.public)) {
            // 公共文件
            ctx.method = 'GET'
            ctx.url = ctx.url.replace(file.public, '')
            await usePublic(ctx, next)
            return
        }

        if (url.startsWith(file.private)) {
            // 私密文件
            ctx.method = 'GET'
            ctx.url = ctx.url.replace(file.private, '')
            await usePrivate(ctx, next)
            return
        }

        await next()
    }
}