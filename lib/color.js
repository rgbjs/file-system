/** 输出颜色方法 */

import chalk from 'chalk'
const { color } = globalThis.config

export const danger = chalk.hex(color.danger)
export const warning = chalk.hex(color.warning)
export const normal = chalk.hex(color.normal)
export const success = chalk.hex(color.success)

export default {
    danger,
    warning,
    normal,
    success
}