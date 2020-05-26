const projectconfig = {
  framePage: "framePage", //defalt:framePage 框架页文件夹名称，这里需要指定，
  //原项目默认为src/framePage文件夹，此文件夹可根据自己需要自主更名，当更名后这里必须进行配置，值为当前文件夹名
  buildmodules: ["framePage","blogmodule",],
  isbuildassignmodules: false,//defalt:false,会执行命令行参数指定的几个单页面模块，命令行不传参数，默认构建项目中的所有包
  //当参数为真时，buildmodules值必须为数组，每个值为包名,打包只会构建buildmodules指定的包
  modulesconfig: { //key为单页面模块文件夹名称
    a: {
      plugin: [{
        name: "axios",
        version: "^0.19.0"
      },{
        name: "vuex",
        version: "^3.1.1"
      },
      {
        name: "vue-router",
        version: "^3.1.2"
      }]
    },
    b: {
      plugin: [{
        name: "iview",
        version: ""
      }]
    }
  },
  proxy:{//配置代理
    '/api': {
        target: 'http://www.abc.com', //目标接口域名
        changeOrigin: true, //是否跨域
        pathRewrite: {
          '^/api': '/api' //重写接口
        }
      }
  },
  autoOpenBrowser: true,//是否自动打开浏览器 defalt:false
  useEslint:false, // 是否启用Eslint语法检查 defalt:false
  showEslintErrorsInOverlay:false,
  productionSourceMap:false,//  打包时是否建立映射 defalt:false
  productionGzip:false,//is gzip all static  defalt:false

}
exports.framePage = projectconfig.framePage
exports.modulesconfig = projectconfig.modulesconfig
exports.buildmodules = projectconfig.buildmodules
exports.isbuildassignmodules = projectconfig.isbuildassignmodules
exports.proxy = projectconfig.proxy
exports.autoOpenBrowser = projectconfig.autoOpenBrowser
exports.useEslint = projectconfig.useEslint
exports.showEslintErrorsInOverlay = projectconfig.showEslintErrorsInOverlay
exports.productionSourceMap = projectconfig.productionSourceMap
exports.productionGzip = projectconfig.productionGzip


//项目默认已经安装dependencies，使用时只需要引入即可
//     "axios": "^0.19.0",
//     "echarts": "^4.2.1",
//     "iview": "^3.5.0-rc.1",
//     "v-viewer": "^1.4.2",
//     "vue": "^2.6.10",
//     "vue-croppa": "^1.3.8",
//     "vue-i18n": "^8.14.0",
//     "vue-router": "^3.1.2",
//     "vue-scroll-behavior": "^0.2.0",
//     "vue-video-player": "^5.0.2",
//     "vuex": "^3.1.1"





