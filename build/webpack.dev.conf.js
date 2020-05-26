'use strict'
const utils = require('./utils')
const webpack = require('webpack')
const config = require('../config')
const merge = require('webpack-merge')
const path = require('path')
const baseWebpackConfig = require('./webpack.base.conf')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')
const portfinder = require('portfinder')

const HOST = process.env.HOST
const PORT = process.env.PORT && Number(process.env.PORT)
var moduleList = require('./module-conf').moduleList || []

const moduleIframe = require('./module-conf').moduleIframe
const { framePage, isbuildassignmodules, buildmodules, modulesconfig } = require('../projectConfig')
// process.env.MODULE_ENV = process.argv[2]

//console.log(process.argv[6])
// process.env.MODULE_ENV?moduleList=process.argv[2].split(","):moduleList=moduleList
// 组装多个（有几个module就有几个htmlWebpackPlugin）htmlWebpackPlugin，然后追加到配置中
var htmlWebpackPlugins = []


for (let module of moduleList) {
  if (moduleIframe == module) {
    htmlWebpackPlugins.push(new HtmlWebpackPlugin({
      filename: `${moduleIframe}/index.html`,
      template: `./src/${moduleIframe}/index.html`,
      inject: true,
      chunks: [moduleIframe]
    }))
  } else {
    htmlWebpackPlugins.push(new HtmlWebpackPlugin({
      filename: `${module}/index.html`,
      template: `./src/modules/${module}/index.html`,
      inject: true,
      chunks: [module]
    }))
  }
}

const devWebpackConfig = merge(baseWebpackConfig, {
  module: {
    rules: utils.styleLoaders({ sourceMap: config.dev.cssSourceMap, usePostCSS: true })
  },
  // cheap-module-eval-source-map is faster for development
  devtool: config.dev.devtool,

  // these devServer options should be customized in /config/index.js
  devServer: {
    clientLogLevel: 'warning',
    proxy: config.dev.proxy,
    historyApiFallback: {
      rewrites: [
        { from: /^\/$/, to: '/views/landing.html' },
        { from: /^\/subpage/, to: '/views/subpage.html' },
        { from: /./, to: '/views/404.html' },
        { from: /.*/, to: path.posix.join(config.dev.assetsPublicPath, 'index.html') },
      ],
    },
    hot: true,
    contentBase: false, // since we use CopyWebpackPlugin.
    compress: true,
    host: HOST || config.dev.host,
    port: PORT || config.dev.port,
    open: config.dev.autoOpenBrowser,
    overlay: config.dev.errorOverlay ? { warnings: false, errors: true } : false,
    publicPath: config.dev.assetsPublicPath,

    quiet: true, // necessary for FriendlyErrorsPlugin
    watchOptions: {
      poll: config.dev.poll,
    },
    before(app) {

      // // 访问根路径时重定向到moduleList
      // app.get('/moduleList', (req, res, next) => {
      //   res.send(html)
      // })
      let moduleListapp = JSON.parse(JSON.stringify(moduleList))
      //console.log(moduleList)
      if (moduleListapp.indexOf(moduleIframe) >= 0) {
        //路由重定向为框架页
        app.get('/', (req, res, next) => {
          //res.redirect('/moduleListapp')
          if (moduleListapp.indexOf(moduleIframe) >= 0) {
            moduleListapp.splice(moduleListapp.indexOf(moduleIframe), 1)
          }
          res.redirect(`/${moduleIframe}/index.html` + "?menulist=" + moduleListapp.join())
        })
      } else {
        app.get('/', (req, res, next) => {
          //res.redirect('/moduleListapp')
          res.redirect(`/${moduleListapp[0]}/index.html`)
        })
      }
    }
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': require('../config/dev.env')
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(), // HMR shows correct file names in console on update.
    new webpack.NoEmitOnErrorsPlugin(),
    // copy custom static assets
    new CopyWebpackPlugin([{
      from: path.resolve(__dirname, '../static'),
      to: config.dev.assetsSubDirectory,
      ignore: ['.*']
    }]),
    // https://github.com/ampedandwired/html-webpack-plugin
    // new HtmlWebpackPlugin({
    //   filename: 'a/index.html',
    //   template: './src/modules/a/index.html',
    //   inject: true,
    //   chunks: ['a']
    // }),
  ].concat(htmlWebpackPlugins)
})

module.exports = new Promise((resolve, reject) => {
  portfinder.basePort = process.env.PORT || config.dev.port
  portfinder.getPort((err, port) => {
    if (err) {
      reject(err)
    } else {
      // publish the new Port, necessary for e2e tests
      process.env.PORT = port
      // add port to devServer config
      devWebpackConfig.devServer.port = port

      // Add FriendlyErrorsPlugin
      devWebpackConfig.plugins.push(new FriendlyErrorsPlugin({
        compilationSuccessInfo: {
          messages: [`Your application is running here: http://${devWebpackConfig.devServer.host}:${port}`],
        },
        onErrors: config.dev.notifyOnErrors ?
          utils.createNotifierCallback() : undefined
      }))

      resolve(devWebpackConfig)
    }
  })
})
