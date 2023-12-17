import jwt from 'jsonwebtoken'
import randomKey from '../utils/randomKey.js'

let { token: key } = globalThis.config.project
if (key === '') key = randomKey(32)

/**
 * 生成一个 Token
 * @param {object} params - 需要保存在 Token 里的数据
 * @returns {string} 一个符合JWT规范的字符串
 */
export const createToken = (params = {}) => {
    return jwt.sign({
        data: params
    }, key, { expiresIn: 60 * 60 });

}

/**
 * 验证一个 Token
 * @param {string} token - 需要验证的 token
 * @returns {object|false} 成功则正常返回 token 解密后的信息, 失败则返回 false
 */
export const verifyToken = (token) => {
    try {
        return jwt.verify(token, key)
    } catch (err) {
        return false
    }
}