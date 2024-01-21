import { isString, isId, isPositiveInt } from 'assist-tools'
import { checkName, checkRemark, isStrNum } from '#root/src/lib/rules/index.js'

export const checkCreate = ({ filename, remark }) => {
    if (!isString(filename, remark)) {
        return {
            code: 1,
            msg: '类型有误'
        }
    }

    const resultArr = [
        checkName(filename),
        checkRemark(remark)
    ]

    const err = resultArr.find(item => item.code !== 0)
    if (err) {
        return err
    }

    return { code: 0 }
}

export const checkId = (id) => {
    if (!(isStrNum(id) && isId(+id))) {
        return {
            code: 1,
            msg: '参数有误'
        }
    }
    return { code: 0 }
}

export const checkQueryList = ({ keyword, page, limit, starteCreateTime, endCreateTime }) => {
    const result = [page, limit].every(item => isStrNum(item))
    if (!(typeof keyword === 'string' && result)) {
        return {
            code: 1,
            msg: '搜索参数有误'
        }
    }

    if (starteCreateTime !== undefined && endCreateTime !== undefined) {
        const result = [starteCreateTime, endCreateTime].every(item => isStrNum(item))
        if (!result) {
            return {
                code: 1,
                msg: '搜索参数有误'
            }
        }
    }

    if (!(isPositiveInt(+page, +limit))) {
        return {
            code: 1,
            msg: '查询条件有误'
        }
    }

    return {
        code: 0
    }
}

export const checkUpdateFileinfo = ({
    filename,
    private: privateState,
    remark,
    state
}) => {
    const resultArr = [
        checkName(filename),
        checkRemark(remark),
    ]

    const err = resultArr.find(item => item.code !== 0)
    if (err) {
        return err
    }


    if (!(privateState === 0 || privateState === 1)) {
        return {
            code: 1,
            msg: '参数有误'
        }
    }

    if (!(state === '0' || state === '1')) {
        return {
            code: 1,
            msg: '参数有误'
        }
    }

    return { code: 0 }
}