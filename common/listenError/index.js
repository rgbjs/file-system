const { project, colorFn } = globalThis.config

/** 监听端口失败 */
export default (err) => {
    console.log('')
    console.log(colorFn.danger(project.fail?.replaceAll('{{port}}', project.port)))
    console.log('')
    throw err
}