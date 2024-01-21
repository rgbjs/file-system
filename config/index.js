// 解析 yaml 配置
import fs from 'fs'
import path from 'path'
import yaml from 'js-yaml'
import ip from 'ip'
import chalk from 'chalk'
import { clone } from 'assist-tools'

const root = process.cwd()
const _config = yaml.load(fs.readFileSync(path.join(root, 'config/app/config.yaml'), 'utf-8'))

const config = clone(_config)
config._config = _config
config.root = root

const project = config.project
project.fail = project.fail?.replaceAll('{{port}}', project.port)
project.dist = path.join(root, project.dist)

config.ip = ip.address()

if (process.env.NODE_ENV) {
    config.NODE_ENV = process.env.NODE_ENV
} else {
    config.NODE_ENV = 'production'
    process.env.NODE_ENV = 'production'
}

config.color = {
    danger: chalk.hex(config.color.danger),
    warning: chalk.hex(config.color.warning),
    normal: chalk.hex(config.color.normal),
    success: chalk.hex(config.color.success)
}

const file = config.file
file.$public = path.join(root, file.public)
file.$private = path.join(root, file.private)
file.$recycleBin = path.join(root, file.recycleBin)
file.$temp = path.join(root, file.temp)

globalThis.config = config // 挂载配置对象
export default config
