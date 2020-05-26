//局部模式
var shell = require('shelljs');
//全局模式下，就不需要用shell开头了。
//require('shelljs/global');

// if (shell.exec('npm run build').code !== 0) {//执行npm run build 命令
//   shell.echo('Error: Git commit failed');
//   shell.exit(1);
// }

// //由于我的用另外一个仓库存放dist目录，所以这里要将文件增量复制到目标目录。并切换到对应目录。
// shell.cp ('-r', './dist/*', '../../Rychou');
// shell.cd('../../Rychou');

// shell.exec('git add .');
// shell.exec("git commit -m 'autocommit'")
// shell.exec('git push')

// //引入shelljs
// var shell = require('shelljs')

// //检查控制台是否以运行`git `开头的命令
// if (!shell.which('git')) {
//   //在控制台输出内容
//   shell.echo('Sorry, this script requires git');
//   shell.exit(1);
// }

// shell.rm('-rf','out/Release');//强制递归删除`out/Release目录`
// shell.cp('-R','stuff/','out/Release');//将`stuff/`中所有内容拷贝至`out/Release`目录

// shell.cd('lib');//进入`lib`目录
// //找出所有的扩展名为js的文件，并遍历进行操作
// shell.ls('*.js').forEach(function (file) {
//   /* 这是第一个难点：sed流编辑器,建议专题学习，-i表示直接作用源文件 */
//   //将build_version字段替换为'v0.1.2'
//   shell.sed('-i', 'BUILD_VERSION', 'v0.1.2', file);
//   //将包含`REMOVE_THIS_LINE`字符串的行删除
//   shell.sed('-i', /^.*REMOVE_THIS_LINE.*$/, '', file);
//   //将包含`REPLACE_LINE_WITH_MACRO`字符串的行替换为`macro.js`中的内容
//   shell.sed('-i', /.*REPLACE_LINE_WITH_MACRO.*\n/, shell.cat('macro.js'), file);
// });

// //返回上一级目录
// shell.cd('..');

// //run external tool synchronously
// //即同步运行外部工具
// if (shell.exec('git commit -am "Auto-commit"').code !== 0){
//     shell.echo('Error: Git commit failed');
//     shell.exit(1);
// }





// 官方示例中涉及的命令解释：
// shell.which(command)
// 在环境变量PATH中寻找指定命令的地址，判断该命令是否可执行，返回该命令的绝对地址。

// echo
// 在控制台输出指定内容

// exit(code)
// 以退出码为code退出当前进程

// rm
// 删除一个目录中一个或多个文件或目录，一旦删除，无法恢复。 常用参数：
// -f:强制删除文件;
// -i:删除之前先询问用户;
// -r:递归处理目录;
// -v:显示处理过程;

// cp([options,] source_array, dest)
// 用来将一个或多个源文件或目录复制到指定的文件或目录。 常用参数:
// -f:强制删除文件;
// -i:删除之前先询问用户;
// -r:递归处理目录;

// cd
// 切换工作目录至指定的相对路径或绝对路径。cd..为返回上一级，cd-回到前一目录。

// ls
// 用来显示目标列表。 常用参数:
// -a:显示所有文件;
// -C:多列显示查询结果;
// -l:单列长格式显示查询结果(与-C相反);
// -R:递归处理目录;

// sed([options,] search_regex, replacement, file_array
// 将file_array中符合search_regex的内容替换为replacement，支持正则的捕获组自引用。一次处理一行内容，处理完成后把缓冲区内容送往屏幕，然后处理下一行，循环直至结束。功能丰富且用法较复杂，建议自行百度进行专题学习。
// -i:直接作用源文件

// cat
// 将一个或多个文件内容读入，指定一个文件时读入该文件，指定多个文件时将内容连接在一起读入。

// exec(command,[, options][, callback])
// 执行所传入的命令

// async:是否异步执行,默认false，传入callback时自动开启
// slient:不输出信息到console,默认false
// encoding:默认utf8

// 四.文档中其他API概览
// chmo
// 设置文件调用权限
// 基本语法 ：chmod [-cfvR] [—help] [—version] mode file…
// -c：若文件权限确实被更改，才显示更改动作
// -f: 权限无法被更改时不显示错误信息
// -v: 显示权限变更的详细资料
// -R: 递归，对其目录下所有文件和子文件执行相同操作
// mode字段格式 : [ugoa…][[+-=][rwxX]…][,…]
// u表示该文件拥有者，g表示同一群体者，o表示其他，a表示所有
// +表示增加权限，-表示取消权限，=表示唯一设定权限
// r表示可读，w表示可写，x表示可执行，X表示当该文件是个子目录？

// find(path[,path…])
// 寻找路径

// grep([options,] regex_filter,file)
// 从指定文件中抓取符合正则的行

// -v:翻转正则匹配
// -l:仅打印符合条件的文件名

// head([{'-n':<num>,}] file)
// 显示指定文件中的前N行
// -n<num>:显示前&lt;num&gt;行

// mv
// 移动文件

// pwd
// 返回当前目录

// rm
// 见上文

// set
// 设置全局变量的值

// sort
// 将文件的内容逐行排序

// -r:反转结果
// -n:依据数值对比

// tail
// 读取指定文件的末尾n行，对比head命令进行理解

// test（）
// 评估一个表达式是否为真(以下仅为最常见的参数用例)

// -d,path:如果path是一个路径则返回true
// -e,path:如果path存在则返回true

// ShellString()
// 构造器，将一个字符串转化为Shell字符串,转化后的字符串支持链式调用特殊的shell命令

// ShellString.Prototype.to()
// 将shellString输出至指定文件,相当于脚本语言中的&gt;

// ShellString.Prototype.toEnd()
// 将shellString追加至指定文件,相当于脚本语言中的&gt;&gt;

// touch([options,]file)
// 生成文件
// -m：仅修改编辑时间
// -c：不创建任何文件
// -d DATE:指定时间
// -r FILE:用FILE的时间替代新文件时间
// env['VAR_NAME']

// 指向process.env
// Pipes链式调用支持
// sed,grep,cat,exec,to,toEnd均支持链式调用。