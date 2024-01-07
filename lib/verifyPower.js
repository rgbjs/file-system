// 权限判断
import { verifyToken } from './authorization.js'
import CheckAuthority from '../utils/checkAuthority.js'

const checkAuthority = new CheckAuthority({
    baseURL: '/api',
    route: {
        admin: [
            {
                url: '/admin',
                method: '*',
                match: 'startWith'
            },
            {
                url: '/user',
                method: '*',
                match: 'startWith'
            }
        ],
        user: [
            {
                url: '/user',
                method: 'put',
            }
        ]
    },
    whiteList: [
        {
            url: '/login',
            method: '*',
            match: 'startWith'
        },
        {
            url: '/file',
            method: '*',
            match: 'startWith'
        }
    ],
})

/**
 * 权限判断中间件
 */
export default () => {
    return async (ctx, next) => {
        const { url, method } = ctx

        const isWhiteList = checkAuthority.checkWhiteList({ url, method })
        if (isWhiteList) {
            await next()
            return
        }

        let authorization = ctx.headers.authorization || ''
        authorization = authorization.split(' ')[1] || authorization

        const tokenInfo = verifyToken(authorization)
        if (!tokenInfo) {
            ctx.body = {
                code: -1,
                msg: '登录过期'
            }
            return
        }

        ctx.state.tokenInfo = tokenInfo
        const isPower = checkAuthority.checkRoute({ url, method, ruleName: tokenInfo.data.identity })
        if (isPower) {
            await next()
            return
        }

        ctx.body = {
            code: 401,
            msg: '没有权限'
        }
    }
}