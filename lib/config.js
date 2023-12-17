// 解析 yaml 配置
import fs from 'fs'
import path from 'path'
import yaml from 'js-yaml'

const root = process.cwd()
export const config = yaml.load(fs.readFileSync(path.join(root, 'config/index.yaml'), 'utf-8'))
config.root = root

/**
 * 配置对象
 * @param root 项目根路径
 * @param project 项目配置文件
 * @param color 全局色值配置文件
 */
globalThis.config = config // 挂载配置对象
export default config