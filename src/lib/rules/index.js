import { isNum, isEffectiveValue } from 'assist-tools'

/**
 * @define {object} CheckResult
 * @property {number} code 只有 0 才为通过, 1 类型有误, 2 长度小于 min, 3 长度大于 max, 4 正则校验未通过
 * @property {string} msg 验证结果描述
 * @property {object} options 配置对象
 */

/**
 * 验证的字符串
 * @param {string} str 需要验证的字符串
 * @param {object} options 配置对象 [可选]
 * @param {number} [options.min] 字符串最小长度, 必须大于等于 min [可选]
 * @param {number} [options.max] 字符串最大长度, 必须小于等于 max [可选]
 * @param {RegExp[]|string} options.rules 需要进行验证的正则规则
 * @returns {CheckResult} 验证结果
 */
export const check = (str, options = {}) => {
    const params = {
        min: null,
        max: null,
        rules: null,
        ...options,
    }

    if (typeof str !== 'string') {
        return {
            code: 1,
            msg: '类型有误',
            options: params
        }
    }

    if (params.min !== null) {
        if (str.length < params.min) {
            return {
                code: 2,
                msg: `长度小于${params.min}位`,
                options: params
            }
        }
    }

    if (params.max !== null) {
        if (str.length > params.max) {
            return {
                code: 3,
                msg: `长度大于${params.max}位`,
                options: params
            }
        }
    }

    if (params.rules !== null) {
        if (!Array.isArray(params.rules)) {
            params.rules = [params.rules]
        }

        // 只要有一个不通过
        const result = params.rules.find(rule => {
            return !(rule.test(str))
        })

        if (result) {
            return {
                code: 4,
                msg: '正则校验未通过',
                options: params
            }
        }
    }

    return {
        code: 0,
        msg: '验证通过',
        options: params
    }
}

/**
 * 判断传入的数据是否为有效的数字或数字字符串
 * - 示例: 123 和 '123'
 * - BigInt 类型被视为 false
 * - '' 和 NaN 和 Infinity 和 -Infinity 被视为无效数字
 * @param {any} str 任意类型
 * @param {boolean} strict 更加严格的判断 默认为 true [可选]
 * - 不允许首尾存在空白字符(空格, 制表, 换行 等) 
 * - 不允许省略的形式的数字字符串, 例如: '.1' 和 '1.' 不被允许, 数字类型忽略该条规则, 因为数字在拼接字符串时会自动补全 0
 * - 不允许以无效的多个 0 开头, 例如: 000001 , 数字类型无视该条规则, 因为数字在和字符串进行算数运算时(除开字符串拼接)会自动舍弃无效的 0 
 * @returns {boolean} 
 */
export const isStrNum = (str, strict = true) => {
    const type = typeof str
    if (!(type === 'number' || type === 'string')) return false
    if (type === 'number') {
        if (isEffectiveValue(str)) {
            return true
        } else {
            return false
        }
    }

    if (str === '') return false
    if (strict) {
        const reg1 = /\s/g
        if (reg1.test(str)) return false
        if (str.includes('.')) {
            const start = str.substr(0, 2)
            if (start === '00') return false
            const reg2 = /[0-9]\.[0-9]/
            if (!reg2.test(str)) return false
        } else {
            if (str.length > 1) {
                const start = str[0]
                if (start === '0') return false
            }
        }
    }

    if (isNum(Number(str))) return true
    return false
}

/**
 * 验证账号
 * @param {string} account 需要验证的账号
 * - 最短3位, 最长12位, 只允许出现 a-zA-Z0-9
 */
export const checkAccount = (account) => {
    let { code, msg } = check(account, {
        rules: [
            /^[a-zA-Z0-9]{3,12}$/
        ]
    })

    if (code !== 0) msg = '账号不符合要求'
    return { code, msg }
}

/**
 * 验证密码
 * @param {string} password 需要验证的密码
 * - 最短5位, 最长32位, 只允许出现 a-zA-Z0-9._+-*\/=
 */
export const checkPassword = (password) => {
    let { code, msg } = check(password, {
        rules: [
            /^[a-zA-Z0-9._+\-*\/=]{5,32}$/
        ]
    })

    if (code !== 0) msg = '密码不符合要求'
    return { code, msg }
}

/**
 * 验证名字
 * @param {string} name 需要验证的名字
 * - 最短1位, 最长12位, 任意字符
 */
export const checkName = (name) => {
    let { code, msg } = check(name, { min: 1, max: 12 })

    if (code !== 0) msg = '名字不符合要求'
    return { code, msg }
}

/**
 * 验证头像地址
 * @param {string} headerImg 需要验证的头像地址
 * - 最长300位, 任意字符
 */
export const checkHeaderImg = (headerImg) => {
    let { code, msg } = check(headerImg, { max: 300 })

    if (code !== 0) msg = '头像地址不符合要求'
    return { code, msg }
}

/**
 * 验证备注
 * @param {string} remark 需要验证的备注
 * - 最长500位, 任意字符
 */
export const checkRemark = (remark) => {
    let { code, msg } = check(remark, { max: 500 })

    if (code !== 0) msg = '备注不符合要求'
    return { code, msg }
}
