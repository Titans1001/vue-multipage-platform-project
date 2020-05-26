# vue-multipage-platform-project（vue-cli-ww）

> A Vue.js project

## Build Setup

``` bash
# install dependencies 安装依赖
cnpm i

# serve with hot reload at localhost:8080 运行，开发模式暂不可指定运行模块，可配置rojectConfig/index来指定
npm run dev //开发模式启动

# build for production with minification //项目构建
npm run build // 打包全部模块到一个资源包下面，每个模块的入口是module.html文件，静态资源都在static目录中，这种方式可以复用重复的资源
npm run build moduleName1,moduleName2,... // 打包指定模块到一个资源包下面,每个模块的入口是module.html文件，静态资源都在static目录中，这种方式可以复用重复的资源

npm run build moduleName1,moduleName2,... total// total代表整体打包（静态资源在同一个目录下，可以复用重复的文件），separate代表分开打包（静态资源按模块名称分别独立打包，不能复用重复的文件）separate模式下一次只能打某一个包，例如npm run build a separate

npm run build-all // 打包所有模块，然后每个模块彼此独立，有几个模块，就产生几个静态资源包，这种方式不会复用重复的资源

npm run build-all moduleName1,moduleName2,...// 打包制定模块，参数逗号隔开，然后每个模块彼此独立，有几个模块，就产生几个静态资源包，这种方式不会复用重复的资源

# build for production and view the bundle analyzer report //构建并查看包分析报告
npm run build --report

# run unit tests
npm run unit

# run e2e tests
npm run e2e

# run all tests
npm test
```
For a detailed explanation on how things work, check out the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).

projectConfig/index为项目配置，若要更改默认的src下modules子文件夹名称或src下framePage文件夹名称，必须配置此js文件
当isbuildassignmodules为真时，项目打包或启动只会构建此配置buildmodules指定的包,命令行所传参数无效,当前状态下只可使用npm run build或npm run build-all 打包或npm run dev启动项目，系统默认启动打开页面为没有框架页为buildmodules[0]或有框架页则为框架页面

npm run build //总体打包时访问参数传递为framePage.html?manulist=a,b&type=totle 两个参数
npm run build-all //访问参数参数为framePage.html?manulist=a,b  单个参数

每次build时候会自动删除dist/static以及dist/*.html  打包构建前若不想保留以前的独立打包文件时请手动删除dist文件夹