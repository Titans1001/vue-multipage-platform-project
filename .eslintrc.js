/**
 * 参考文档
 * 【eslint英文文档】https://eslint.org/docs/user-guide/configuring
 * 【eslint中文文档】http://eslint.cn/docs/rules/
 */

/**
 * eslint有三种使用方式
 * 【1】js代码中通过注释的方式使用
 * 【2】通过webpack的eslintConfig字段设置，eslint会自动搜索项目的package.json文件中的配置
 * 【3】通过配置文件的方式使用，配置文件有多种文件方式，如JavaScript、JSON 或者 YAML等
 */

/**
 * 文件忽略
 * 【】让eslint跳过特定文件的检测
 * 【】通过当前工作目录下 「.eslintignore」 文件进行设置
 *  其使用的是Glob路径书写方式，与「.gitignore」的使用方法相同
 * 【】也可以在 package.json 文件中，通过 eslintIgnore 参数进行设置
 */

/**
 * 文件内局部设置
 * 【】eslint可以具体文件中设置特定代码的规则，常用于跳过某条语句的检测。
 * 【】注销全部规则，在代码前新建一行，添加注销 /* eslint-disable *\/  。如果没有恢复设置的语句，则下列全部代码都会跳过检测。
 * 【】恢复eslint，在代码前新建一行，添加注销 /* eslint-enable *\/
 * 【】指定忽略的规则，/* eslint-disable no-alert, no-console *\/
 * 【】在特定行禁用，// eslint-disable-line
 * 【】在下一行禁用，// eslint-disable-next-line
 */

module.exports = {
  /**
   * 根目录标识
   * http://eslint.cn/docs/user-guide/configuring#using-configuration-files
   * http://eslint.cn/docs/user-guide/configuring#configuration-cascading-and-hierarchy
   * 【】标识当前配置文件为最底层的文件，无需往更上一级的文件目录中进行搜索
   * 【】默认eslint的配置文件搜索方式是，从目标文件夹进行搜索，遍历内部每一个文件夹，找到配置文件并层叠使用。再跳出本项目，往祖先文件夹进行遍历
   * 【】注意「~/.eslintrc」的意义，「~」是指linux上的家目录，「~/.eslintrc」是指家目录下的eslint配置文件，用于私人开发者，用于整个电脑全局约束的。这个配置通过本配置项root去设置，设置了root,eslint检测时将不会再往上搜索
   * 【】eslint的生效规则是就近使用，越近的配置项优先级越高，覆盖其他配置项。如一个项目中，可以在不同文件夹中都添加配置文件，这些规则将重叠组合生效
   */
  root: true, // 标识当前配置文件为eslint的根配置文件，让其停止在父级目录中继续寻找。
  /**
   * 运行环境
   * http://eslint.cn/docs/user-guide/configuring#specifying-environments
   * 【】一个环境定义了一组预定义的全局变量
   * 【】获得了特定环境的全局定义，就不会认为是开发定义的，跳过对其的定义检测。否则会被认为改变量未定义
   * 【】常见的运行环境有以下这些，更多的可查看官网
   * browser - 浏览器环境中的全局变量。
   * node - Node.js 全局变量和 Node.js 作用域。
   * es6 - 启用除了 modules 以外的所有 ECMAScript 6 特性（该选项会自动设置 ecmaVersion 解析器选项为 6）。
   * amd - 将 require() 和 define() 定义为像 amd 一样的全局变量。
   * commonjs - CommonJS 全局变量和 CommonJS 作用域 (用于 Browserify/WebPack 打包的只在浏览器中运行的代码)。
   * jquery - jQuery 全局变量。
   * mongo - MongoDB 全局变量。
   * worker - Web Workers 全局变量。
   * serviceworker - Service Worker 全局变量。
   */
  env: {
    browser: true // 浏览器环境
  },
  /**
   * 全局变量
   * http://eslint.cn/docs/user-guide/configuring#specifying-globals
   * 【】定义额外的全局，开发者自定义的全局变量，让其跳过no-undef 规则
   * 【】key值就是额外添加的全局变量
   * 【】value值用于标识该变量能否被重写，类似于const的作用。true为允许变量被重写
   * 【】注意：要启用no-global-assign规则来禁止对只读的全局变量进行修改。
   */
  globals: {},
  /**
   * 规则继承
   * http://eslint.cn/docs/user-guide/configuring#extending-configuration-files
   *【】可继承的方式有以下几种
   *【】eslint内置推荐规则，就只有一个，即「eslint:recommended」
   *【】可共享的配置， 是一个 npm 包，它输出一个配置对象。即通过npm安装到node_module中
   *  可共享的配置可以省略包名的前缀 eslint-config-，即实际设置安装的包名是 eslint-config-airbnb-base
   *【】从插件中获取的规则，书写规则为 「plugin:插件包名/配置名」，其中插件报名也是可以忽略「eslint-plugin-」前缀。如'plugin:vue/essential'
   *【】从配置文件中继承，即继承另外的一个配置文件，如'./node_modules/coding-standard/eslintDefaults.js'
   */
  extends: [
    'plugin:vue/essential', // 额外添加的规则可查看 https://vuejs.github.io/eslint-plugin-vue/rules/
    '@vue/standard' // https://github.com/standard/eslint-config-standard
  ],
  /**
   * 自定义规则
   * http://eslint.cn/docs/user-guide/configuring#configuring-rules
   * 【】基本使用方式
   * "off" 或者0 关闭规则
   * "warn" 或者1 将规则打开为警告（不影响退出代码）
   * "error" 或者2 将规则打开为错误（触发时退出代码为1）
   * 如：'no-restricted-syntax': 0, // 表示关闭该规则
   * 【】如果某项规则，有额外的选项，可以通过数组进行传递，而数组的第一位必须是错误级别。如0,1,2
   * 如 'semi': ['error', 'never'], never就是额外的配置项
   */
  rules: {
    quotes: [1, 'single'], // 引号类型 `` "" ''
    'space-before-function-paren': 0,
    'no-console': 'off',
    'no-debugger': 'off',
    // 禁止条件表达式中出现赋值操作符
    'no-cond-assign': 2,

    //  Vue: Base (Enabling Correct ESLint Parsing)
    // 允许在 <template> 中使用 eslint-disable, eslint-enable, eslint-disable-line, eslint-disable-next-line 等指令
    // 如可以用 `<!-- eslint-disable-next-line vue/max-attributes-per-line -->` 来控制某一行的规则
    // https://eslint.vuejs.org/rules/comment-directive.html
    'vue/comment-directive': 2,
    // 在 jsx 中不允许使用未定义的变量
    'vue/jsx-uses-vars': 2,
    /**
     * Vue: Priority A: Essential (Error Prevention)
     */
    // 不允许在 `computed` 中使用异步方法，如果确实有需求，请使用此插件：https://github.com/foxbenjaminfox/vue-async-computed
    'vue/no-async-in-computed-properties': 2,

    // 在 `props`, `computed`, `methods` 中存在的 key 不允许重复
    'vue/no-dupe-keys': [
      2
      // 除了 Vue 支持的 `computed`, `methods` ...，还在哪些 key 下去搜索重复的 key
      // "groups": []
    ],

    // 避免重复定义属性，如：`<div foo="bar" :foo="baz"></div>`
    'vue/no-duplicate-attributes': [
      2,
      {
        // 允许 class 两种形式共存
        allowCoexistClass: true,
        // 允许 style 两种形式共存
        allowCoexistStyle: true
      }
    ],

    // 忽略解析 <template> 时的语法报错
    'vue/no-parsing-error': [
      2,
      // 配置项非常多，主要与 HTML 相关，默认都是 false，即不忽略报错
      {
        'abrupt-closing-of-empty-comment': false,
        'absence-of-digits-in-numeric-character-reference': false,
        'cdata-in-html-content': false,
        'character-reference-outside-unicode-range': false,
        'control-character-in-input-stream': false,
        'control-character-reference': false,
        'eof-before-tag-name': false,
        'eof-in-cdata': false,
        'eof-in-comment': false,
        'eof-in-tag': false,
        'incorrectly-closed-comment': false,
        'incorrectly-opened-comment': false,
        'invalid-first-character-of-tag-name': false,
        'missing-attribute-value': false,
        'missing-end-tag-name': false,
        'missing-semicolon-after-character-reference': false,
        'missing-whitespace-between-attributes': false,
        'nested-comment': false,
        'noncharacter-character-reference': false,
        'noncharacter-in-input-stream': false,
        'null-character-reference': false,
        'surrogate-character-reference': false,
        'surrogate-in-input-stream': false,
        'unexpected-character-in-attribute-name': false,
        'unexpected-character-in-unquoted-attribute-value': false,
        'unexpected-equals-sign-before-attribute-name': false,
        'unexpected-null-character': false,
        'unexpected-question-mark-instead-of-tag-name': false,
        'unexpected-solidus-in-tag': false,
        'unknown-named-character-reference': false,
        'end-tag-with-attributes': false,
        'duplicate-attribute': false,
        'end-tag-with-trailing-solidus': false,
        'non-void-html-element-start-tag-with-trailing-solidus': false,
        'x-invalid-end-tag': false,
        'x-invalid-namespace': false
      }
    ],

    // 不允许覆盖掉 Vue 内部的方法/属性，比如 `$el`, `$on`, `$nextTick` ...
    'vue/no-reserved-keys': [
      2
      // {
      //   // 除了默认的 Vue 方法/属性外，其他不允许被覆盖的 key
      //   "reserved": [],
      //   // 除了默认的 group 外，其他要检查的 key
      //   "groups": [],
      // },
    ],

    // 不允许可共享的 `data` 字段，即 `data` 字段只能是函数，不能是对象
    'vue/no-shared-component-data': 2,

    // 不允许在 `computed` 中有无意义的修改，如：`this.foo = 'bar'; return baz`
    'vue/no-side-effects-in-computed-properties': 2,

    // 不允许在 `<template>` 标签上加 `key`，如：`<template key="foo">`，其他标签是可以的
    'vue/no-template-key': 2,

    // 不允许在 `<textarea>` 标签间使用 mustache 语法，如 `<textarea>{{ foo }}</textarea>`
    // 因为它会不生效，请使用 `v-model`，如：`<textarea v-model="foo"`></textarea>`
    'vue/no-textarea-mustache': 2,

    // 不允许未使用的 component
    'vue/no-unused-components': [
      2,
      {
        // 是否忽略使用 `<component is>` 形式定义的组件
        ignoreWhenBindingPresent: true
      }
    ],

    // 不允许未被定义的变量，主要是指在 <template> 中定义的项，如 `<div v-for="i in foo">{{ bar }}</div>`
    'vue/no-unused-vars': 2,

    // 不允许 `v-if` 和 `v-for` 在同一个标签上（如果在同一个标签，`v-for` 的优先级会更高一些）
    // 两个混用有两种情况：
    // 1. `<div v-if="item.show" v-for="item in list">`，if 判断基于每一个循环项
    // 2. `<div v-if="foo" v-for="item in list">`，if 判断基于其他变量，此种情况是要避免的，空耗循环
    'vue/no-use-v-if-with-v-for': [
      2,
      {
        // 如果 `v-if` 中使用了 `v-for` 循环后的变量，则允许
        allowUsingIterationVar: true
      }
    ],

    // 在 `<component>` 上要求有 `v-bind:is`
    'vue/require-component-is': 2,

    // 在 `props` 中的类型，应该是构建函数而不是字符串，如 `type: Number` 而不是 `type: 'Number'`
    'vue/require-prop-type-constructor': 2,

    // `render` 方法一定要有返回值
    'vue/require-render-return': 2,

    // 每个 `v-for` 元素都要绑定 key，如 `<div v-for="foo in bar" :key="for"></div>`
    // 不太理解这个细节和 "vue/valid-v-for" 的区别
    'vue/require-v-for-key': 2,

    // 校验 props 中指定的属性类型与默认值，
    // 且如果属性类型为 Array, Object，要求默认值是函数形式，保证数据不会共享，
    // 可参考 "vue/no-shared-component-data"
    'vue/require-valid-default-prop': 2,

    // 在 `computed` 中的每个 getter 都要有明确的返回值
    'vue/return-in-computed-property': [
      2,
      {
        // 不允许有隐式的 undefined 返回，即不能只写 `return;`，`return` 后一定要有值
        treatUndefinedAsUnspecified: true
      }
    ],

    // 如果组件已经绑定了一个包含修饰符的 `v-on`，则要求另一个使用 `exact` 修饰符
    'vue/use-v-on-exact': 2,

    // 检查在 `<template>` 下只有一个根元素
    // 要求：根元素只能是标签，不能为空，不能是纯文本，不能使用 `v-for`，不能是 `<template>` 或 `<slot>`
    // 额外的，支持使用 `v-if` 放多个元素在 `<template>`下，如：
    // ```
    // <template>
    //   <div v-if="foo"></div>
    //   <div v-else></div>
    // </template>
    // ```
    'vue/valid-template-root': 2,

    // 检查 `v-bind` 的正确性
    // 1. 不能有无效的修饰符，如：`<div v-bind.foo="bar"></div>`
    // 2. 值不能为空，如：`<div v-bind></div>`
    'vue/valid-v-bind': 2,

    // 检查 `v-clock` 的正确性
    // 1. 不能有参数，如：`<div v-cloak:foo></div>`
    // 2. 不能有修饰符，如：`<div v-cloak.foo></div>`
    // 3. 不能有值，如：`<div v-cloak="foo"></div>`
    'vue/valid-v-cloak': 2,

    // 检查 `v-else-if` 的正确性
    // 1. 不能有参数，如：`<div v-else-if:foo></div>`
    // 2. 不能有修饰符，如：`<div v-else-if.foo></div>`
    // 3. 值不能为空，如：`<div v-else-if></div>`
    // 4. 前边要有 `v-if` 或 `v-else`
    // 5. 不能和 `v-if` 或 `v-else` 在同一个标签上
    'vue/valid-v-else-if': 2,

    // 检查 `v-else` 的正确性
    // 1. 不能有参数，如：`<div v-else:foo></div>`
    // 2. 不能有修饰符，如：`<div v-else.foo></div>`
    // 3. 值不能为空，如：`<div v-else></div>`
    // 4. 前边要有 `v-if` 或 `v-else-if`
    // 5. 不能和 `v-if` 或 `v-else-if` 在同一个标签上
    'vue/valid-v-else': 2,

    // 检查 `v-for` 的正确性
    // 1. 不能有参数，如：`<div v-for:foo></div>`
    // 2. 不能有修饰符，如：`<div v-for.foo></div>`
    // 3. 值不能为空，如：`<div v-for></div>`
    // 4. 如果是自定义组件要有 `v-bind:key`，且 `v-bind:key` 只能使用在 `v-for` 中定义的变量（保证每个都不相同）
    'vue/valid-v-for': 2,

    // 检查 `v-html` 的正确性
    // 1. 不能有参数，如：`<div v-html:foo></div>`
    // 2. 不能有修饰符，如：`<div v-html.foo></div>`
    // 3. 值不能为空，如：`<div v-html></div>`
    'vue/valid-v-html': 2,

    // 检查 `v-if` 的正确性
    // 1. 不能有参数，如：`<div v-if:foo></div>`
    // 2. 不能有修饰符，如：`<div v-if.foo></div>`
    // 3. 值不能为空，如：`<div v-if></div>`
    // 4. 不能和 `v-else` 或 `v-else` 在同一个标签上
    'vue/valid-v-if': 2,

    // 检查 `v-model` 的正确性
    // 1. 不能有参数，如：`<input v-model:foo="bar">`
    // 2. 不能加无效的修饰符，如：`<input v-model.foo="bar">`
    // 3. 值不能为空，如：`<input v-model>`
    // 4. 值有无效的左表达式（LHS, left-hand side），如：`<input v-model="foo() + bar()">`
    // 5. 只能应用在表单元素上，如：`<div v-model="foo"></div>`
    // 6. 不能绑定在动态 type 的 input 元素上，如：`<input :type="type" v-model="foo">`
    // 7. 不能绑定在 type 为 file 的 input 元素上，如：`<input type="file" v-model="foo">`
    // 8. 值不能为迭代变量，如：`<div v-for="x in list"><input type="file" v-model="x"></div>`
    'vue/valid-v-model': 2,

    // 检查 `v-on` 的正确性
    // 1. 不能没有事件名（参数），如：`<div v-on="foo"></div>`
    // 2. 不能加无效的修饰符，如：`<div v-on:click.foo="bar"></div>`
    // 3. 值不能为空，且无修饰符，如：`<div v-on:click></div>`
    // 注意，是可以像这样使用的：`<div @click.prevent></div>`
    'vue/valid-v-on': [
      2,
      {
        // 允许的修饰符，以字符串形式放在数组中，如 `["foo"]` 则表示可以使用 `@click.foo`
        modifiers: []
      }
    ],

    // 检查 `v-once` 的正确性
    // 1. 不能有参数，如：`<div v-once:foo></div>`
    // 2. 不能有修饰符，如：`<div v-once.foo></div>`
    // 3. 不能有值，如：`<div v-once="foo"></div>`
    'vue/valid-v-once': 2,

    // 检查 `v-pre` 的正确性
    // 1. 不能有参数，如：`<div v-pre:foo></div>`
    // 2. 不能有修饰符，如：`<div v-pre.foo></div>`
    // 3. 不能有值，如：`<div v-pre="foo"></div>`
    'vue/valid-v-pre': 2,

    // 检查 `v-show` 的正确性
    // 1. 不能有参数，如：`<div v-show:foo></div>`
    // 2. 不能有修饰符，如：`<div v-show.foo></div>`
    // 3. 值不能为空，如：`<div v-show></div>`
    'vue/valid-v-show': 2,

    // 检查 `v-text` 的正确性
    // 1. 不能有参数，如：`<div v-text:foo></div>`
    // 2. 不能有修饰符，如：`<div v-text.foo></div>`
    // 3. 值不能为空，如：`<div v-text></div>`
    'vue/valid-v-text': 2,

    /**
     * Vue: Priority B: Strongly Recommended (Improving Readability)
     */

    // 模板属性使用连字符（减号），还是使用小驼峰形式
    'vue/attribute-hyphenation': [
      2,
      // always: 使用连字符，并统一使用小写
      // never: 使用小驼峰形式
      'always',
      {
        // 需要忽略检测的属性
        ignore: []
      }
    ],

    // HTML 标签的闭合尖括号是否要展示在新行
    'vue/html-closing-bracket-newline': [
      2,
      // never: 不要新起一行
      // always: 总是新起一行
      {
        // 单行的 html 标签闭合括号是否要新起一行
        singleline: 'never',
        // 多行的 html 标签闭合括号是否要新起一行
        multiline: 'always'
      }
    ],

    // HTML 标签的尖括号与标签内容之间是否要空格
    'vue/html-closing-bracket-spacing': [
      2,
      // never: 不要加空格
      // always: 要加空格
      {
        // 针对开始标签的规则
        startTag: 'never',
        // 针对结束标签的规则
        endTag: 'never',
        // 针对自闭合标签的规则，在 `/>` 前是否要加空格
        selfClosingTag: 'always'
      }
    ],

    // 校验结束标签：对于自闭合标签不允许使用结束标签，其他标签要求必须有结束标签
    // NOTE: 此规则与 vue/html-self-closing 略有重叠，暂关闭检测
    'vue/html-end-tags': 0,

    // 检查 HTML 元素的缩进
    'vue/html-indent': [
      2,
      // 数字：每个缩进的空格数
      // "tab"：使用 Tab 缩进
      2,
      {
        // 多个属性是否要垂直对齐
        alignAttributesVertically: false,
        // 属性的缩进
        attribute: 1,
        // 基础缩进
        baseIndent: 1,
        // 结束符的缩进
        closeBracket: 0,
        // 要忽略的节点
        ignores: []
      }
    ],

    // 校验 HTML 属性值的引号
    'vue/html-quotes': [
      2,
      // double: 双引号
      // single: 单引号
      'double'
    ],

    // 标签的自闭合
    // 自闭合指的 `<br />`，一定要有后边的 `/` 才算
    'vue/html-self-closing': [
      2,
      // never: 不自闭合
      // always: 总是自闭合
      // any: 都可以
      {
        // HTML 标签
        html: {
          // 标准的 HTML 标签
          normal: 'never',
          // 空白标签（标准的自闭合标签，如 `<br>`）
          void: 'never',
          // 自定义组件
          component: 'any'
        },
        // SVG 标签
        svg: 'always',
        // MathML 标签
        math: 'always'
      }
    ],

    // 一行最多多少个属性
    'vue/max-attributes-per-line': [
      2,
      {
        // 针对单行标签，最多支持多少个属性，再多要换行
        singleline: 5,
        // 针对多行标签
        multiline: {
          // 多行标签最多每行多少个属性
          max: 1,
          // 与属性名同行的标签是否独立算一行
          allowFirstLine: false
        }
      }
    ],

    // 针对多行元素，是否要求子元素折行。可参考 singleline-html-element-content-newline 规则
    // 多行元素，是指标签占据了多行，如某些属性另起一行、内容另起一行、内容包含多行、结束标签另起一行等
    // 因为行内元素可能会有属性换行，但不希望内容换行的情况，所以暂关闭此检测
    'vue/multiline-html-element-content-newline': [
      0,
      {
        // 忽略无子元素的标签
        ignoreWhenEmpty: true,
        // 要忽略的标签
        ignores: ['pre', 'textarea']
      }
    ],

    // 在 mustache 中定义值与括号间是否要空格
    'vue/mustache-interpolation-spacing': [
      2,
      // always: 在大括号内部左右各加一个空格
      // never: 在大括号内部左右不加空格
      'always'
    ],

    // 组件 `name` 值的风格
    'vue/name-property-casing': [
      2,
      // camelCase: 小驼峰
      // PascalCase: 大驼峰
      // kebab-case: 连字符形式
      'PascalCase'
    ],

    // 检查标签中是否有多余的空格
    'vue/no-multi-spaces': [
      2,
      {
        // 是否忽略对象属性中的空格（属性名与冒号之间）
        ignoreProperties: false
      }
    ],

    // 在模板中，属性的等号左右不应有空格
    'vue/no-spaces-around-equal-signs-in-attribute': 2,

    // 不允许在模板嵌套环境中使用同名变量，如： `<div v-for="i in 5"><span v-for="i in 10" /></div>`
    // 同时也会检测在模板中定义了 data/props 上的变量，如： `<template><div v-for="i in 5"></div></template><script>export default { props: ['i'] }</script>`
    'vue/no-template-shadow': 2,

    // Prop 名大小写，这里指的是在 <script> 中的情形
    // 参考：https://vuejs.org/v2/style-guide/#Prop-name-casing-strongly-recommended
    'vue/prop-name-casing': [
      2,
      // 可以使用 `camelCase` 或 `snake_case`
      'camelCase'
    ],

    // 要求每个 props 要有默认值
    'vue/require-default-prop': 2,

    // 要求每个 props 要有类型
    'vue/require-prop-types': 2,

    // 针对单行元素，是否要求子元素折行。可参考 multiline-html-element-content-newline 规则
    // 单行元素，是指标签起始、属性、内容、结束标签都在同一行
    'vue/singleline-html-element-content-newline': [
      0,
      {
        // 忽略无子元素的标签
        ignoreWhenEmpty: true,
        // 忽略无属性的标签
        ignoreWhenNoAttributes: true,
        // 要忽略的标签
        ignores: ['pre', 'textarea']
      }
    ],

    // 针对 `v-bind` 建议使用的方案
    'vue/v-bind-style': [
      2,
      // shorthand: 缩短方案，如：`<div :foo="bar"></div>`
      // longform: 详细方案，如：`<div v-bind:foo="bar"></div>`
      'shorthand'
    ],

    // 针对 `v-on` 建议使用的方案
    'vue/v-on-style': [
      2,
      // shorthand: 缩短方案，如：`<div @foo="bar"></div>`
      // longform: 详细方案，如：`<div v-on:foo="bar"></div>`
      'shorthand'
    ],

    /**
     * Vue: Priority C: Recommended (Minimizing Arbitrary Choices and Cognitive Overhead)
     */

    // HTML 中属性的顺序
    // 参考：https://vuejs.org/v2/style-guide/#Element-attribute-order-recommended
    'vue/attributes-order': [
      2,
      {
        // 定义具体的顺序
        order: [
          // 定义 (提供组件的选项)，如 `is`
          'DEFINITION',
          // 列表渲染 (创建多个变化的相同元素)，如 `v-for`
          'LIST_RENDERING',
          // 条件渲染 (元素是否渲染/显示)，如 `v-if`, `v-else-if`, `v-else`, `v-show`, `v-cloak`
          'CONDITIONALS',
          // 渲染方式 (改变元素的渲染方式)，如 `v-once`, `v-pre`
          'RENDER_MODIFIERS',
          // 全局感知 (跨组件的感知属性)，如 `id`
          'GLOBAL',
          // 唯一特性 (需要唯一值的特性)，如 `ref`, `key`, `slot`, `slot-scope`
          'UNIQUE',
          // 双向绑定 (把绑定和事件结合起来)，如 `v-model`
          'TWO_WAY_BINDING',
          // 其他用户的绑定，如 `v-custom-directive`
          'OTHER_DIRECTIVES',
          // 其它特性 (所有普通的绑定或未绑定的特性)
          'OTHER_ATTR',
          // 事件 (组件事件监听器)，如 `v-on`
          'EVENTS',
          // 内容 (复写元素的内容)，如 `v-html`, `v-text`
          'CONTENT'
        ]
      }
    ],

    // 不允许使用 `v-html`，因为这可能会带来 XSS 漏洞
    'vue/no-v-html': 1,

    // 在组件中针对每个 key （如 data, computed ...）排序
    'vue/order-in-components': [
      0,
      {
        // 每个 key 的排序
        order: [
          // 数组表示这几个 key 的权重是相同的
          ['name', 'delimiters', 'functional', 'model'],
          ['components', 'directives', 'filters'],
          ['parent', 'mixins', 'extends', 'provide', 'inject'],
          'el',
          'template',
          'props',
          'propsData',
          'data',
          'computed',
          'watch',
          'LIFECYCLE_HOOKS',
          'methods',
          'render',
          'renderError'
        ]
      }
    ],

    // 在 <template> 中不允许使用 `this`，默认环境就已经是 this 了
    'vue/this-in-template': [
      2,
      // always: 总是给模板变量加 this 前缀
      // never: 从不在模板变量前加 this
      'never'
    ],

    /**
     * Vue: Uncategorized
     */

    // 检查数组中括号前后是否要加空格
    // 此配置与 ESLint 的 array-bracket-spacing 规则一致，但它会检查 `<template>` 中的代码
    'vue/array-bracket-spacing': [2, 'never'],

    // 箭头函数的箭头前后是否要有空格
    // 此配置与 ESLint 的 array-spacing 规则一致，但它会检查 `<template>` 中的代码
    'vue/arrow-spacing': [
      2,
      {
        before: true,
        after: true
      }
    ],

    // 代码块前后是否要有空格
    // 此配置与 ESLint 的 block-spacing 规则一致，但它会检查 `<template>` 中的代码
    'vue/block-spacing': [2, 'always'],

    // 大括号的风格
    // 此配置与 ESLint 的 brace-style 规则一致，但它会检查 `<template>` 中的代码
    'vue/brace-style': [
      2,
      'stroustrup',
      {
        allowSingleLine: true
      }
    ],

    // 使用驼峰形式表示变量时，一些细节配置
    // 此配置与 ESLint 的 camelcase 规则一致，但它会检查 `<template>` 中的代码
    'vue/camelcase': [
      2,
      {
        properties: 'always',
        ignoreDestructuring: true
      }
    ],

    // 对象和数组最后一个 value 后是否加逗号
    // 此配置与 ESLint 的 comma-dangle 规则一致，但它会检查 `<template>` 中的代码
    'vue/comma-dangle': [2, 'always-multiline'],

    // 自定义组件标签名使用的风格，如 `<my-component />` 还是 `<MyComponent />`
    'vue/component-name-in-template-casing': [
      2,
      // PascalCase: 大驼峰
      // kebab-case: 连字符形式
      'PascalCase',
      {
        // 只检查在 components 中注册的组件
        registeredComponentsOnly: true,
        // 要忽略的标签名
        ignores: []
      }
    ],

    // 使用 `===`
    // 此配置与 ESLint 的 eqeqeq 规则一致，但它会检查 `<template>` 中的代码
    'vue/eqeqeq': [2, 'smart'],

    // 在对象的冒号前后是否要有空格
    // 此配置与 ESLint 的 key-spacing 规则一致，但它会检查 `<template>` 中的代码
    'vue/key-spacing': [
      2,
      {
        // mode 定义空格风格，strict 为仅允许一个空格， minimum 为可因为对齐的原因多加几个空格，但对齐后，不能再多空格
        mode: 'strict',
        // 在冒号前后是否要空格
        beforeColon: false,
        afterColon: true
      }
    ],

    // 检查组件在代码中定义的名称，是否与文件名一致
    // 'vue/match-component-file-name': [
    //   1,
    //   {
    //     // 可忽略的文件扩展名
    //     extensions: ['js', 'vue', 'jsx'],
    //     // 是否要求匹配大小写
    //     shouldMatchCase: false
    //   }
    // ],

    // 对于布尔型的属性，要求默认值必须为 false，因为默认不传时 undefined 为 falsy 值
    'vue/no-boolean-default': [
      2,
      // "no-default": 不允许添加 default
      // "default-false": 可以添加 default 字段，但必须为 false
      'no-default'
    ],

    // 不允许某些特殊语法，可以使用字符串表示限制的表达式，也可以使用对象自定义限制出错信息
    // 此配置与 ESLint 的 no-restricted-syntax 规则一致，但它会检查 `<template>` 中的代码
    'vue/no-restricted-syntax': [
      2,
      'WithStatement',
      // 额外支持 Vue 的 AST，详细见 https://github.com/mysticatea/vue-eslint-parser/blob/master/docs/ast.md
      // 如，不允许在 mustache 中嵌入方法调用：
      'VElement > VExpressionContainer CallExpression'
    ],

    // 当整个对象在一行时，大括号前后是否要加空格
    // 此配置与 ESLint 的 object-curly-spacing 规则一致，但它会检查 `<template>` 中的代码
    'vue/object-curly-spacing': [2, 'always'],

    // 检查 `<script>` 中的组件是直接 export 出去的，而不是多绕一层
    'vue/require-direct-export': 0,

    // 在 .vue 文件中的 `<script>` 标签内的缩进配置，可以参考 stylistic-issues 中的 indent 规则
    'vue/script-indent': [
      2,
      // 此参数可为数字，表示缩进的空格数，或者使用 `tab` 表示使用 tab 来缩进
      2,
      {
        // 在 `<script>` 标签内的内容，初始为几个缩进
        baseIndent: 0,
        // switch 中的 case, default 的缩进，感觉与 stylistic-issues/indent 规则有重合
        switchCase: 1,
        // 要忽略的 AST node selector，同样可参考 stylistic-issues/indent 中的 ignoredNodes 规则
        ignores: []
      }
    ],

    // 在中缀（二元、三元）操作符前后是否要有空格，如 +, -, *, /, >, <, =, ?:
    // 此配置与 ESLint 的 space-infix-ops 规则一致，但它会检查 `<template>` 中的代码
    'vue/space-infix-ops': [
      2,
      {
        int32Hint: true
      }
    ],

    // 一元操作符前后是否允许加空格
    // 此配置与 ESLint 的 space-unary-ops 规则一致，但它会检查 `<template>` 中的代码
    'vue/space-unary-ops': [
      2,
      {
        words: true,
        nonwords: false
      }
    ],
    // 'vue/attribute-hyphenation': 'open',
    // 在 `v-on` 后跟的方法名后，是否要加 `()`（Vue 会自动做调用，当无参数传递时不需要加括号）
    'vue/v-on-function-call': [
      2,
      // always: 总要跟括号
      // never: 除了需要参数，否则不允许放空的 `()`
      'never'
    ]
  },
  /**
   * 插件
   * http://eslint.cn/docs/user-guide/configuring#configuring-plugins
   * 【】插件同样需要在node_module中下载
   * 【】注意插件名忽略了「eslint-plugin-」前缀，所以在package.json中，对应的项目名是「eslint-plugin-vue」
   * 【】插件的作用类似于解析器，用以扩展解析器的功能，用于检测非常规的js代码。也可能会新增一些特定的规则。
   * 【】如 eslint-plugin-vue，是为了帮助我们检测.vue文件中 <template> 和 <script> 中的js代码
   */
  // plugins: ['html'],
  /**
  * 解析器配置项
  * http://eslint.cn/docs/user-guide/configuring#specifying-parser-options
  * 【】这里设置的配置项将会传递到解析器中，被解析器获取到，进行一定的处理。具体被利用到，要看解析器的源码有没有对其进行利用。这里仅仅做了参数定义，做了规定，告诉解析器的开发者可能有这些参数
  * 【】配置项目有：
  * "sourceType": "module",  // 指定JS代码来源的类型，script(script标签引入？) | module（es6的module模块），默认为script。为什么vue的会使用script呢？因为vue是通过babel-loader编译的，而babel编译后的代码就是script方式
  * "ecmaVersion": 6,     // 支持的ES语法版本，默认为5。注意只是语法，不包括ES的全局变量。全局变量需要在env选项中进行定义
  * "ecmaFeatures": {     // Features是特征的意思，这里用于指定要使用其他那些语言对象
    "experimentalObjectRestSpread": true, //启用对对象的扩展
    "jsx": true,              //启用jsx语法
    "globalReturn":true,          //允许return在全局使用
    "impliedStrict":true          //启用严格校验模式
   }
  */
  parserOptions: {
    parser: 'babel-eslint'
  },
  /**
   * 针对特定文件的配置
   * 【】可以通过overrides对特定文件进行特定的eslint检测
   * 【】特定文件的路径书写使用Glob格式，一个类似正则的路径规则，可以匹配不同的文件
   * 【】配置几乎与 ESLint 的其他配置相同。覆盖块可以包含常规配置中的除了 extends、overrides 和 root 之外的其他任何有效配置选项，
   */
  overrides: [{
    files: ['**/__tests__/*.{j,t}s?(x)'],
    env: {
      mocha: true
    }
  },
  {
    files: ['**/public/static/air-map-v1.0/*.{j,t}s'],
    plugins: ['es5'],
    rules: {
      'es5/no-arrow-functions': 'error'
    }
  }
  ]
}
