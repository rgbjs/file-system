import jwt from 'jsonwebtoken'
import randomKey from './randomKey/index.js'

let { token: key, effectiveTime, verifyTime } = globalThis.config.project
if (key === '') key = randomKey(32)

/**
 * 生成一个 Token
 * @param {object} params - 需要保存在 Token 里的数据
 * @param {object} options - 生成 Token 的配置选项
 * @returns {string} 一个符合JWT规范的字符串
 */
export const createToken = (params = {}, options = { expiresIn: effectiveTime }) => {
    return jwt.sign({
        data: params
    }, key, options);

}

/**
 * 验证一个 Token
 * @param {string} token - 需要验证的 token
 * @param {object} options - 验证的配置选项
 * @returns {object|false} 成功则正常返回 token 解密后的信息, 失败则返回 false
 */
export const verifyToken = (token, options = { ignoreExpiration: !verifyTime }) => {
    try {
        return jwt.verify(token, key, options)
    } catch (err) {
        return false
    }
}