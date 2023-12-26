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
 * @param {number} options.min 字符串最小长度, 必须大于等于 min
 * @param {number} options.max 字符串最大长度, 必须小于等于 max
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
 * 验证账号
 * @param {string} account 需要验证的账号
 * - 最短3位, 最长12位, 只允许出现 a-zA-Z0-9
 */
export const checkAccount = (account) => {
    const { code } = check(account, {
        rules: [
            /^[a-zA-Z0-9]{3,12}$/
        ]
    })

    if (code !== 0) return '账号不符合要求'
}

/**
 * 验证密码
 * @param {string} password 需要验证的密码
 * - 最短5位, 最长32位, 只允许出现 a-zA-Z0-9._+-*\/=
 */
export const checkPassword = (password) => {
    const { code } = check(password, {
        rules: [
            /^[a-zA-Z0-9._+\-*\/=]{5,32}$/
        ]
    })

    if (code !== 0) return '密码不符合要求'
}

/**
 * 验证名字
 * @param {string} name 需要验证的名字
 * - 最短1位, 最长12位, 任意字符
 */
export const checkName = (name) => {
    const { code } = check(name, { min: 1, max: 12 })
    if (code !== 0) return '名字不符合要求'
}

/**
 * 验证头像地址
 * @param {string} headerImg 需要验证的头像地址
 * - 最长300位, 任意字符
 */
export const checkHeaderImg = (headerImg) => {
    const { code } = check(headerImg, { max: 300 })
    if (code !== 0) return '头像地址不符合要求'
}

/**
 * 验证备注
 * @param {string} remark 需要验证的备注
 * - 最长500位, 任意字符
 */
export const checkRemark = (remark) => {
    const { code } = check(remark, { max: 500 })
    if (code !== 0) return '备注不符合要求'
}
