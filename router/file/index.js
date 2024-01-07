import Router from "koa-router"
import formidable from 'formidable'
import path from 'path'
import fs from 'fs/promises'

const { root, file: fileConfig } = globalThis.config
const publicStore = path.join(root, fileConfig.public)
const privateStore = path.join(root, fileConfig.private)
const tempStore = path.join(root, fileConfig.temp)
const router = new Router()


router.post('/file', async (ctx) => {
    const fileParse = formidable({
        uploadDir: tempStore, // 文件存储位置
        keepExtensions: true, // 保留文件后缀
        hashAlgorithm: 'md5', // 使用hash验证
    })

    const [fields, files] = await fileParse.parse(ctx.req)
    const privateState = String(fields.private)
    const fileInfo = files.file?.[0]

    if (!fileInfo) {
        ctx.body = {
            code: 1,
            msg: '数据有误'
        }
        return
    }

    if (privateState === '1' || privateState === 'true') {
        // 私密存储
        await fs.rename(fileInfo.filepath, path.join(privateStore, fileInfo.newFilename))
    }
    else {
        // 公共存储
        await fs.rename(fileInfo.filepath, path.join(publicStore, fileInfo.newFilename))
    }

    ctx.body = {
        code: 0,
        msg: '上传成功'
    }
})

export default router
