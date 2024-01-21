import Router from "koa-router"
import formidable from 'formidable'
import path from 'path'
import fs from 'fs/promises'
import {
    checkCreate,
    checkId,
    checkQueryList,
    checkUpdateFileinfo
} from './check.js'
import { fileinfo } from '#model'
const {
    createFileinfo,
    deleteFileinfo,
    updateFileinfo,
    queryFileinfoList,
    queryFileinfoCount,
    queryFileinfoById
} = fileinfo

const { project, file: fileConfig, ip } = globalThis.config
const publicStore = fileConfig.$public
const privateStore = fileConfig.$private
const recycleBinStore = fileConfig.$recycleBin
const tempStore = fileConfig.$temp
const router = new Router()

let domain
if (process.env.NODE_ENV === 'develop') {
    domain = `http://${ip}:${project.port}`
} else {
    domain = fileConfig.domain
}

const baseURL = {
    public: new URL(path.join(domain, fileConfig.public)).href,
    private: new URL(path.join(domain, fileConfig.private)).href
}

router.post('/file', async (ctx) => {
    const fileParse = formidable({
        uploadDir: tempStore, // 文件存储位置
        keepExtensions: true, // 保留文件后缀
        hashAlgorithm: 'md5', // 使用hash验证
    })

    const [fields, files] = await fileParse.parse(ctx.req)
    const fileInfo = files.file?.[0]

    if (!fileInfo) {
        ctx.body = {
            code: 1,
            msg: '数据有误'
        }
        return
    }
    const { filename: filenameArr, remark: remarkArr, private: privateStateArr } = fields
    const filename = filenameArr?.[0] || '未命名'
    const remark = remarkArr?.[0] || ''
    const privateState = privateStateArr?.[0]
    const { newFilename: realFilename, mimetype: MIME, size } = fileInfo
    const suffix = path.extname(realFilename)
    const params = { filename, remark, realFilename, MIME, size, suffix, state: '1', uploadTime: String(Date.now() / 1000) }

    const check = checkCreate(params)
    if (check.code !== 0) {
        ctx.body = check
        return
    }

    let url
    if (privateState === '1' || privateState === 'true') {
        params.private = '1'
        url = new URL(path.join(domain, fileConfig.private, realFilename))
        // 私密存储
        await fs.rename(fileInfo.filepath, path.join(privateStore, realFilename))
    }
    else {
        params.private = '0'
        url = new URL(path.join(domain, fileConfig.public, realFilename))
        // 公共存储
        await fs.rename(fileInfo.filepath, path.join(publicStore, realFilename))
    }

    await createFileinfo(params) // 写入数据库
    ctx.body = {
        code: 0,
        msg: '上传成功',
        data: {
            domain: url.origin,
            baseURL,
            url: url.href,
            realFilename
        }
    }
})

router.delete('/file/:id', async ctx => {
    const { id } = ctx.params
    const check = checkId(id)
    if (check.code !== 0) {
        ctx.body = check
        return
    }

    const info = await queryFileinfoById(id)
    if (!info) {
        ctx.body = {
            code: 1,
            msg: '文件不存在'
        }
        return
    }

    const { realFilename, private: privateState } = info
    let filePath
    if (privateState === 1) {
        filePath = path.join(privateStore, realFilename)
    } else {
        filePath = path.join(publicStore, realFilename)
    }

    await fs.rename(filePath, path.join(recycleBinStore, realFilename))
    await deleteFileinfo({ id: String(id), deleteTime: String(Date.now() / 1000) })

    ctx.body = {
        code: 0,
        msg: '删除成功'
    }
})

router.put('/file', async ctx => {
    const { id } = ctx.request.body
    let check = checkId(id)
    if (check.code !== 0) {
        ctx.body = check
        return
    }

    const info = await queryFileinfoById(id)
    if (!info) {
        ctx.body = {
            code: 1,
            msg: '文件不存在'
        }
        return
    }

    const {
        filename = info.filename,
        private: privateState = info.private,
        remark = info.remark,
        state = info.state
    } = ctx.request.body

    const params = {
        id,
        filename,
        private: privateState,
        remark,
        state
    }

    check = checkUpdateFileinfo(params)
    if (check.code !== 0) {
        ctx.body = check
        return
    }

    await updateFileinfo(params)
    ctx.body = {
        code: 0,
        msg: '修改成功',
    }
})

router.get('/file', async ctx => {
    const { page = '1', limit = '10', keyword = '', starteCreateTime, endCreateTime } = ctx.query
    const check = checkQueryList({ page, limit, keyword, starteCreateTime, endCreateTime })
    if (check.code !== 0) {
        ctx.body = check
        return
    }

    const params = {
        page: page,
        limit: limit,
        keyword,
        starteCreateTime: starteCreateTime / 1000,
        endCreateTime: endCreateTime / 1000
    }
    const data = await queryFileinfoList(params)
    const count = await queryFileinfoCount(params)

    ctx.body = {
        code: 0,
        msg: '获取成功',
        count,
        data
    }
})

export default router
