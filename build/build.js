'use strict'
require('./check-versions')()
const chalk = require('chalk')

process.env.NODE_ENV = 'production'
// MODULE_ENV用来记录当前打包的模块名称

const { framePage, isbuildassignmodules, buildmodules, modulesconfig } = require('../projectConfig')
process.env.MODULE_ENV = process.argv[2]&&process.argv[2].replace('，', ',')

// MODE_ENV用来记录当前打包的模式，total代表整体打包（静态资源在同一个目录下，可以复用重复的文件），separate代表分开打包（静态资源按模块名称分别独立打包，不能复用重复的文件）
process.env.MODE_ENV = process.argv[3]

process.env.NODE_TYPE = process.argv[1].split("/")[process.argv[1].split("/").length - 1].split(".")[0]
if (process.env.NODE_TYPE == "build" && process.env.MODULE_ENV.split(",").length > 1 && process.env.MODE_ENV==="separate") {
  console.log(chalk.red('参数错误，允许的参数只能为一个,'), chalk.yellow(`非法参数：`),chalk.red(`${process.env.MODULE_ENV}`))

  return
}
// 如果有传参时，对传入的参数进行检测，如果参数非法，那么停止打包操作
const checkModule = require('./module-conf').checkModule
if (process.env.MODULE_ENV !== 'undefined' && !checkModule()) {
  return
} else if (process.env.NODE_TYPE == "build" && !checkModule()) {
  process.env.MODULE_ENV = isbuildassignmodules ? buildmodules.join() : process.argv[2]
} else {
  process.env.MODULE_ENV = process.argv[2]
}



const path = require('path')
const ora = require('ora')
const rm = require('rimraf')
const webpack = require('webpack')
const config = require('../config')
const webpackConfig = require('./webpack.prod.conf')

const spinner = ora('building for production...')
spinner.start()

rm(path.resolve(config.build.assetsRoot, config.build.assetsSubDirectory), err => {
  if (err) throw err
  webpack(webpackConfig, (err, stats) => {
    spinner.stop()
    if (err) throw err
    process.stdout.write(stats.toString({
      colors: true,
      modules: false,
      children: false, // If you are using ts-loader, setting this to true will make TypeScript errors show up during build.
      chunks: false,
      chunkModules: false
    }) + '\n\n')

    if (stats.hasErrors()) {
      console.log(chalk.red('  Build failed with errors.\n'))
      process.exit(1)
    }

    console.log(chalk.cyan('  Build complete.\n'))
    console.log(chalk.yellow(
      '  Tip: built files are meant to be served over an HTTP server.\n' +
      '  Opening index.html over file:// won\'t work.\n'
    ))
  })
})
