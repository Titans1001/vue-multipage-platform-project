'use strict'
// Template version: 1.3.1
// see http://vuejs-templates.github.io/webpack for documentation.

const path = require('path')

//buiid类型
const MODULE = process.env.MODULE_ENV || 'undefined'
// 入口模板路径

//定义build模版
var htmlTemplate = `./src/modules/${MODULE}/index.html`

//是否有框架页面
const moduleIframe = require('../build/module-conf').moduleIframe
const { framePage, isbuildassignmodules, buildmodules, modulesconfig, proxy,productionSourceMap,autoOpenBrowser, useEslint,showEslintErrorsInOverlay,productionGzip } = require('../projectConfig')
//获取框架页模版
if (MODULE == moduleIframe) { htmlTemplate = `./src/${MODULE}/index.html` }


//开发模式配置
module.exports = {
  dev: {
    // Paths
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',
    proxy: proxy||{//配置代理
      '/api': {
        target: 'http://www.abc.com', //目标接口域名
        changeOrigin: true, //是否跨域
        pathRewrite: {
          '^/api': '/api' //重写接口
        }
      }
    },
    // Various Dev Server settings
    host: 'localhost', // can be overwritten by process.env.HOST
    port: 8086, // can be overwritten by process.env.PORT, if port is in use, a free one will be determined

    errorOverlay: true,
    notifyOnErrors: true,
    poll: false, // https://webpack.js.org/configuration/dev-server/#devserver-watchoptions-

    // Use Eslint Loader?
    // If true, your code will be linted during bundling and
    // linting errors and warnings will be shown in the console.
    autoOpenBrowser: autoOpenBrowser || true,
    useEslint: useEslint || false,
    // If true, eslint errors and warnings will also be shown in the error overlay
    // in the browser.
    showEslintErrorsInOverlay: showEslintErrorsInOverlay||false,

    /**
     * Source Maps
     */

    // https://webpack.js.org/configuration/devtool/#development
    devtool: 'cheap-module-eval-source-map',

    // If you have problems debugging vue-files in devtools,
    // set this to false - it *may* help
    // https://vue-loader.vuejs.org/en/options.html#cachebusting
    cacheBusting: true,

    cssSourceMap: true
  },

  build: {
    // Template for index.html
    index: path.resolve(__dirname, '../dist', MODULE, 'index.html'),
    // 加入html入口
    htmlTemplate: htmlTemplate,
    // Paths
    // assetsRoot: path.resolve(__dirname, '../dist', MODULE),
    // 这里判断一下打包的模式，如果是分开打包，要把成果物放到以模块命名的文件夹中
    assetsRoot: process.env.MODE_ENV === 'separate' ? path.resolve(__dirname, '../dist', MODULE) : path.resolve(__dirname, '../dist'),
    assetsSubDirectory: 'static',
    // 这里的路径改成相对路径，原来是assetsPublicPath: '/',
    // assetsPublicPath: '/',
    assetsPublicPath: './',

    /**
     * Source Maps
     */

    productionSourceMap: productionSourceMap||false,
    // https://webpack.js.org/configuration/devtool/#production
    devtool: '#source-map',
    // Gzip off by default as many popular static hosts such as
    // Surge or Netlify already gzip all static assets for you.
    // Before setting to `true`, make sure to:
    // npm install --save-dev compression-webpack-plugin
    productionGzip: productionGzip||false,
    productionGzipExtensions: ['js', 'css'],

    // Run the build command with an extra argument to
    // View the bundle analyzer report after build finishes:
    // `npm run build --report`
    // Set to `true` or `false` to always turn it on or off
    bundleAnalyzerReport: process.env.npm_config_report
  }
}
