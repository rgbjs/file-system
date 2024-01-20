// 解析 yaml 配置
import fs from 'fs'
import path from 'path'
import yaml from 'js-yaml'
import ip from 'ip'
import chalk from 'chalk'

const root = process.cwd()
/**
 * 配置对象
 * @param {string} root 项目根路径
 * @param {object} project 项目配置文件
 * @param {object} colorFn 全局色值配置文件
 */
const config = yaml.load(fs.readFileSync(path.join(root, 'config/app/config.yaml'), 'utf-8'))
config.root = root
config.ip = ip.address()
if (process.env.NODE_ENV) {
    config.NODE_ENV = process.env.NODE_ENV
} else {
    config.NODE_ENV = 'production'
    process.env.NODE_ENV = 'production'
}
config.colorFn = {
    danger: chalk.hex(config.color.danger),
    warning: chalk.hex(config.color.warning),
    normal: chalk.hex(config.color.normal),
    success: chalk.hex(config.color.success)
}

globalThis.config = config // 挂载配置对象
export default config