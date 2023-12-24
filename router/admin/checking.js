import { isId, isString, isEffectiveValue, isPositiveInt } from 'assist-tools'

export const checkQueryList = ({ keyword, page, limit }) => {
    if (!isString(keyword, page, limit)) {
        return {
            code: 1,
            msg: '类型有误'
        }
    }

    if (!(isEffectiveValue(page, limit) && isPositiveInt(+page, +limit))) {
        return {
            code: 1,
            msg: '查询条件有误'
        }
    }

    return {
        code: 0
    }
}

export const checkId = (id) => {
    if (typeof id !== 'string') {
        return {
            code: 1,
            msg: '类型有误'
        }
    }

    if (!isId(+id)) {
        return {
            code: 1,
            msg: '传递的值不是一个有效的ID'
        }
    }

    return {
        code: 0
    }
}

export const checkAccount = (account) => {
    if (typeof account !== 'string') {
        return {
            code: 1,
            msg: '类型有误'
        }
    }

    return {
        code: 0
    }
}