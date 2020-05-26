'use strict'
const path = require('path')
const utils = require('./utils')
const webpack = require('webpack')
const config = require('../config')
const merge = require('webpack-merge')
const baseWebpackConfig = require('./webpack.base.conf')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')

var glob = require('glob')
var chalk = require('chalk')
var globdist = glob.sync('./dist/*')

const env = process.env.NODE_ENV === 'testing' ?
  require('../config/test.env') :
  require('../config/prod.env')
// 获取所有模块列表
const moduleToBuild = require('./module-conf').getModuleToBuild() || []

//是否有框架页
const moduleIframe = require('./module-conf').moduleIframe

const buildType = process.argv[1].split("/")[process.argv[1].split("/").length - 1].split(".")[0]

// 组装多个（有几个module就有几个htmlWebpackPlugin）htmlWebpackPlugin，然后追加到配置中
const htmlWebpackPlugins = []


// 判断一下是否为分开打包模式
if (process.env.MODE_ENV === 'separate') {
  process.env.MODULE_ENVS = process.env.MODULE_ENV
  // 分开打包时是通过重复运行指定模块打包命令实现的，所以每次都是单个html文件，只要配置一个htmlPlugin

  htmlWebpackPlugins.push(new HtmlWebpackPlugin({
    filename: process.env.NODE_ENV === 'testing' ?
      'index.html' : config.build.index,
    // template: 'index.html',
    template: config.build.htmlTemplate,
    inject: true,
    minify: {
      removeComments: true,
      collapseWhitespace: true,
      removeAttributeQuotes: true
      // more options:
      // https://github.com/kangax/html-minifier#options-quick-reference
    },
    chunks: ['manifest','vendor', process.env.MODULE_ENVS],
    // necessary to consistently work with multiple chunks via CommonsChunkPlugin
    chunksSortMode: 'dependency'
  }))


} else {
  console.log(chalk.red("打包某一个或整体打包，名为分别为：" + moduleToBuild.join(",")))
  // 一起打包时是通过多入口实现的，所以要配置多个htmlPlugin
  //console.log(chalk.red(moduleToBuild))
  for (let module of moduleToBuild) {
    if (module == moduleIframe) {
      htmlWebpackPlugins.push(new HtmlWebpackPlugin({
        filename: `${module}.html`,
        template: `./src/${module}/index.html`,
        inject: true,
        // 这里要指定把哪些chunks追加到html中，默认会把所有入口的chunks追加到html中，这样是不行的
        chunks: ['vendor', 'manifest', module],
        // filename: process.env.NODE_ENV === 'testing'
        //   ? 'index.html'
        //   : config.build.index,
        // template: 'index.html',
        minify: {
          removeComments: true,
          collapseWhitespace: true,
          removeAttributeQuotes: true
          // more options:
          // https://github.com/kangax/html-minifier#options-quick-reference
        },
        // necessary to consistently work with multiple chunks via CommonsChunkPlugin
        chunksSortMode: 'dependency'
      }))
    } else {
      htmlWebpackPlugins.push(new HtmlWebpackPlugin({
        filename: `${module}.html`,
        template: `./src/modules/${module}/index.html`,
        inject: true,
        // 这里要指定把哪些chunks追加到html中，默认会把所有入口的chunks追加到html中，这样是不行的
        chunks: ['vendor', 'manifest', module],
        // filename: process.env.NODE_ENV === 'testing'
        //   ? 'index.html'
        //   : config.build.index,
        // template: 'index.html',
        minify: {
          removeComments: true,
          collapseWhitespace: true,
          removeAttributeQuotes: true
          // more options:
          // https://github.com/kangax/html-minifier#options-quick-reference
        },
        // necessary to consistently work with multiple chunks via CommonsChunkPlugin
        chunksSortMode: 'dependency'
      }))
    }
  }
}

var getcleanOnceBeforeBuildPatterns = function() {
  //let cleanArr=[path.join(__dirname, '../dist/*'), path.join(__dirname, '../dist/*.html'), '!static-files*']
  let cleanArr = [path.resolve(__dirname, '../dist/static'), path.resolve(__dirname, '../dist/*.html')]
  // globdist.forEach((v, i) => {
  //   console.log("ddddddd", globdist[i].split("/")[2].split(".")[0])
  for (let module of moduleToBuild) {
    // if (globdist[i].split("/")[2].split(".")[0] != val) {
    //cleanArr.push('!' + module)
    //cleanArr.push("!"+path.resolve(__dirname, '../module/*'))
    // }
  };
  // });
  return cleanArr;
}

// 获取当前打包的目录名称
const webpackConfig = merge(baseWebpackConfig, {
  module: {
    rules: utils.styleLoaders({
      sourceMap: config.build.productionSourceMap,
      extract: true,
      usePostCSS: true
    })
  },
  devtool: config.build.productionSourceMap ? config.build.devtool : false,
  output: {
    path: config.build.assetsRoot,
    filename: utils.assetsPath('js/[name].[chunkhash].js'),
    chunkFilename: utils.assetsPath('js/[id].[chunkhash].js')
  },
  // before(app) {
  //   // app.get('/moduleList', (req, res, next) => {
  //   //   res.send(html)
  //   // })
  //   if (moduleToBuild.indexOf(moduleIframe)>=0) {
  //     //路由重定向为框架页
  //     app.get('/', (req, res, next) => {
  //       //res.redirect('/moduleList')
  //       res.redirect(`/${moduleIframe}/index.html` + "?manulist=" + moduleList.slice(1))
  //     })
  //   }
  //   else{
  //     app.get('/', (req, res, next) => {
  //       //res.redirect('/moduleList')
  //       res.redirect(`/${moduleToBuild[0]}/index.html`)
  //     })
  //   }
  // },
  plugins: [
    // http://vuejs.github.io/vue-loader/en/workflow/production.html

    new webpack.DefinePlugin({
      'process.env': env
    }),
    new UglifyJsPlugin({
      uglifyOptions: {
        compress: {
          warnings: false
        }
      },
      sourceMap: config.build.productionSourceMap,
      parallel: true
    }),
    // extract css into its own file
    new ExtractTextPlugin({
      filename: utils.assetsPath('css/[name].[contenthash].css'),
      // Setting the following option to `false` will not extract CSS from codesplit chunks.
      // Their CSS will instead be inserted dynamically with style-loader when the codesplit chunk has been loaded by webpack.
      // It's currently set to `true` because we are seeing that sourcemaps are included in the codesplit bundle as well when it's `false`,
      // increasing file size: https://github.com/vuejs-templates/webpack/issues/1110
      allChunks: true,
    }),
    // Compress extracted CSS. We are using this plugin so that possible
    // duplicated CSS from different components can be deduped.
    new OptimizeCSSPlugin({
      cssProcessorOptions: config.build.productionSourceMap ? { safe: true, map: { inline: false } } : { safe: true }
    }),
    // generate dist index.html with correct asset hash for caching.
    // you can customize output by editing /index.html
    // see https://github.com/ampedandwired/html-webpack-plugin
    /*
     new HtmlWebpackPlugin({
     filename: process.env.NODE_ENV === 'testing'
     ? 'index.html'
     : config.build.index,
     // template: 'index.html',
     template: config.build.htmlTemplate,
     inject: true,
     minify: {
     removeComments: true,
     collapseWhitespace: true,
     removeAttributeQuotes: true
     // more options:
     // https://github.com/kangax/html-minifier#options-quick-reference
     },
     // necessary to consistently work with multiple chunks via CommonsChunkPlugin
     chunksSortMode: 'dependency'
     }),
     */
    // keep module.id stable when vendor modules does not change
    new webpack.HashedModuleIdsPlugin(),
    // enable scope hoisting
    new webpack.optimize.ModuleConcatenationPlugin(),
    // split vendor js into its own file
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      minChunks(module) {
        // any required modules inside node_modules are extracted to vendor
        return (
          module.resource &&
          /\.js$/.test(module.resource) &&
          module.resource.indexOf(
            path.join(__dirname, '../node_modules')
          ) === 0
        )
      }
    }),
    // extract webpack runtime and module manifest to its own file in order to
    // prevent vendor hash from being updated whenever app bundle is updated
    new webpack.optimize.CommonsChunkPlugin({
      name: 'manifest',
      minChunks: Infinity
    }),
    // This instance extracts shared chunks from code splitted chunks and bundles them
    // in a separate chunk, similar to the vendor chunk
    // see: https://webpack.js.org/plugins/commons-chunk-plugin/#extra-async-commons-chunk
    new webpack.optimize.CommonsChunkPlugin({
      name: 'app',
      async: 'vendor-async',
      children: true,
      minChunks: 3
    }),

    // copy custom static assets
    new CopyWebpackPlugin([{
      from: path.resolve(__dirname, '../static'),
      to: config.build.assetsSubDirectory,
      ignore: ['.*']
    }]),
    new CleanWebpackPlugin({
        // Simulate the removal of files
        // default: false
        dry: false,
        // Write Logs to Console
        // (Always enabled when dry is true)
        // default: false
        verbose: false,
        // Automatically remove all unused webpack assets on rebuild
        // default: true
        cleanStaleWebpackAssets: true, //配置false，默认是：true，这个是在重建时自动删除所有未使用的webpack资产
        protectWebpackAssets: true, //配置false，默认是：true，不允许删除当前的webpack资产
        // **WARNING**
        // Use !negative patterns to exclude files
        //在Webpack编译之前删除一次文件，不包括重建中，配置是个数组，默认：['**/*']，如果是个空数组，则表示禁用
        cleanOnceBeforeBuildPatterns: getcleanOnceBeforeBuildPatterns(),

        //在每个与此模式匹配的构建（包括监视模式）后删除文件，用于不是由Webpack直接创建的文件，默认是个空数组禁用
        cleanAfterEveryBuildPatterns: ['static*.*', '!static1.js'],
        // Allow clean patterns outside of process.cwd()
        // requires dry option to be explicitly set
        // default: false
        dangerouslyAllowCleanPatternsOutsideProject: false,
      }

    )
  ].concat(htmlWebpackPlugins)
})

if (config.build.productionGzip) {
  const CompressionWebpackPlugin = require('compression-webpack-plugin')

  webpackConfig.plugins.push(
    new CompressionWebpackPlugin({
      filename: '[path].gz[query]',
      algorithm: 'gzip',
      test: new RegExp(
        '\\.(' + config.build.productionGzipExtensions.join('|') + ')$'
      ),
      threshold: 10240,
      minRatio: 0.8
    })
  )
}

if (config.build.bundleAnalyzerReport) {
  const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
  webpackConfig.plugins.push(new BundleAnalyzerPlugin())
}

module.exports = webpackConfig
