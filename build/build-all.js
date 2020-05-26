const path = require('path')
const execFileSync = require('child_process').execFileSync; //node子进程调用
var moduleList = require('./module-conf').moduleList || [] //获取 buildlist
const buildFile = path.join(__dirname, 'build.js') //获取build/build.js
// process.argv.forEach((val, index) => {
//   console.log(`${index}: ${val}`);
// });
//process.env.NODE_ENV = process.argv[2]  //获取build-all 模块参数
//process.env.NODE_TYPE = process.argv[1].split("/")[process.argv[1].split("/").length-1].split(".")[0] //获取打包类型 build-all

for (const module of moduleList) {
  console.log('正在编译:', module)
  // 异步执行构建文件，并传入两个参数，module：当前打包模块，separate：当前打包模式（分开打包）
  //执行脚本 node build/build.js modulename(module：当前打包模块) separate  相当于 npm run build modulename(module：当前打包模块) separate
  execFileSync('node', [buildFile, module, 'separate'], {})
}
