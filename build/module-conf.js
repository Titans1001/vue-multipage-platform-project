
var chalk = require('chalk') //打印不同颜色，用法console.log(chalk.red(*****))
var glob = require('glob') //匹配所有通配符路径的文件以及文件夹，用法glob.sync('./src/modules/*')
const framePage = require('../projectConfig').framePage //用户配置的框架页面文件夹

var moduleList = [] // 获取所有的moduleList 固有的（项目中的所有模块）->命令行中的模块名称（输入的模块名）->用户配置指定的模块名（isbuildassignmodules为真是有效），后者替换前者


// 获取框架模块
var moduleSrcIframe = glob.sync('./src/'+(framePage||'framePage')+'/index.html')
//console.log(chalk.red(moduleSrcIframe[0]))
if(moduleSrcIframe!=0&&moduleList.indexOf(framePage||'framePage')==-1){
  //moduleSrcIframe=moduleSrcIframe[0].split('/')[2].split('.')[0];
  moduleSrcIframe=framePage||'framePage'
  console.log(chalk.blue("enabled(建立了)framePage(框架页):")+chalk.red(moduleSrcIframe))
  moduleList.push(moduleSrcIframe)
}
else{
  moduleSrcIframe=false;
  console.log(chalk.red("disabled(未建立)framePage(框架页)"))
}
// 获取moduls页面
var moduleSrcArray = glob.sync('./src/modules/*')
for(var x in moduleSrcArray){
  moduleList.push(moduleSrcArray[x].split('/')[3])
}


// 获取命令行中的模块名称
if (process.argv[2]&&process.argv[2]!="--inline") {
  moduleList = process.argv[2].replace('，',',').split(",")
}



// 获取用户配置指定的模块名（isbuildassignmodules为真是有效）
const { isbuildassignmodules, buildmodules, modulesconfig } = require('../projectConfig')
moduleList = isbuildassignmodules ? buildmodules : moduleList



// 检测输入的参数是否在允许的list中
var checkModule = function () {
  var module = process.env.MODULE_ENV
  // 检查moduleList是否有重复
  var hash = {}
  var repeatList = []
  for(var l = 0;l < moduleList.length; l++){
    if(hash[moduleList[l]]){
      repeatList.push(moduleList[l])
    }
    hash[moduleList[l]] = true
  }
  // if(repeatList.length > 0){
  //   console.log(chalk.red('moduleList 有重复：'))
  //   console.log(chalk.red(repeatList.toString()))
  //   return false
  // }
  let result = true
  let illegalParam = ''
  for (let moduleToBuild of module.split(',')) {
    if (moduleList.indexOf(moduleToBuild) === -1) {
      result = false
      illegalParam = moduleToBuild
      break
    }
  }
  if(result === false&&module!=='undefined'){
    console.log(module)
    console.log(chalk.red('参数错误，允许的参数为：'),chalk.green(moduleList.toString()))
    console.log(chalk.yellow(`非法参数：${illegalParam}`))
  }
  return result
}

// 获取当前要打包的模块列表
function getModuleToBuild () {
  let moduleToBuild = moduleList
  // if (process.env.NODE_ENV === 'production') {
  //   /* 部署态，构建要打包的模块列表，如果指定了要打包的模块，那么按照指定的模块配置入口
  //    *  这里有个特性，即使参数未传，那么获取到的undefined也是字符串类型的，不是undefined类型
  //    * */
  //   if (process.env.MODULE_ENV !== 'undefined') {
  //     moduleToBuild = process.env.MODULE_ENV.split(',')
  //   } else {
  //     // 如果未指定要打包的模块，那么打包所有模块
  //     moduleToBuild = moduleList
  //   }
  // } else {
  //   // 开发态，获取所有的模块列表
  //   moduleToBuild = moduleList
  // }
  return moduleToBuild
}

//command规范导出语法，可以写成obj
exports.moduleList = moduleList
exports.checkModule = checkModule
exports.getModuleToBuild = getModuleToBuild
exports.moduleIframe = moduleSrcIframe
