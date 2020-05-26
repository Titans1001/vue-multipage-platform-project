/*
 * @Date:   2017-05-29 09:54:53
 * Author: Titans
 * @Last Modified time: 2019-06-05 10:28:47
 */
const initUtil = {
  each: function(object, callback) { /*js原生each方法*/
    var type = (function(obj) {
      switch (obj.constructor) {
        case Object:
          return 'Object';
          break;
        case Array:
          return 'Array';
          break;
        case NodeList:
          return 'NodeList';
          break;
        default:
          return 'null';
          break;
      }
    })(object);
    // 为数组或类数组时, 返回: index, value
    if (type === 'Array' || type === 'NodeList') {
      // 由于存在类数组NodeList, 所以不能直接调用every方法
      [].every.call(object, function(v, i) {
        return callback.call(v, i, v) === false ? false : true;
      });
    }
    // 为对象格式时,返回:key, value
    else if (type === 'Object') {
      for (var i in object) {
        if (callback.call(object[i], i, object[i]) === false) {
          break;
        }
      }
    }
  },
  documentforbid() {
    //oncontextmenu事件禁用右键菜单
    window.document.oncontextmenu = function() {
      event.returnValue = false;
    }
    //onselectstart事件禁用网页上选取的内容
    window.document.onselectstart = function() {
      event.returnValue = false;
    }
    //oncopy事件禁用复制
    window.document.oncopy = function() {
      event.returnValue = false;
    }
    //禁止F12
    window.document.onkeydown = function() {
      if (window.event && window.event.keyCode == 123) {
        event.keyCode = 0;
        event.returnValue = false;
        return false;
      }
    }
    // 以上三种事件， 如果只想单纯的禁用鼠标右键， 和复制粘贴， 还可以将它们直接写到HTML中的body上面；
    // <body oncontextmenu = "return false" > < /body>
    // <body onselectstart = "return false" > < /body>
    // <body oncopy = "return false" > < /body>
    // 禁用鼠标事件
    // window.document.onmousedown = function(e) {
    //   if (e.which == 2) { // 鼠标滚轮的按下，滚动不触发
    //     //return false;
    //   }
    //   if (e.which == 3) { // 鼠标右键
    //     return false;
    //   }
    // }

    // 禁用键盘中的ctrl、 alt、 shift

    // window.document.onkeydown = function() {
    //   if (event.ctrlKey) {
    //     return false;
    //   }
    //   if (event.altKey) {
    //     return false;
    //   }
    //   if (event.shiftKey) {
    //     return false;
    //   }
    // }
    // 关键就在
    // oncontextmenu = 'return false'
    // ondragstart = 'return false'
    // onselectstart = 'return false'
    // onselect = 'document.selection.empty()'
    // oncopy = 'document.selection.empty()'
    // onbeforecopy = 'return false'
    // onmouseup = 'document.selection.empty()'

    // 一个更简单的方法就是在 < body > 中加入如下的代码,
    // 这样鼠标的左右键都失效了.

    // topmargin = "0"
    // oncontextmenu = "return false"
    // ondragstart = "return false"
    // onselectstart = "return false"
    // onselect = "document.selection.empty()"
    // oncopy = "document.selection.empty()"
    // onbeforecopy = "return false"
    // onmouseup = "document.selection.empty()"

    // 1． 禁止网页另存为： 在 < body > 后面加入以下代码： 
    // // <noscript ><iframe src="*.htm"></iframe> </noscript> 


    // 2． 禁止网页内容复制． 粘贴： 在 < body > 中加入以下代码： <
    // body
    // onmousemove = /HideMenu()/
    // oncontextmenu = "return false"
    // ondragstart = "return false"
    // onselectstart = "return false"
    // onselect = "document.selection.empty()"
    // oncopy = "document.selection.empty()"
    // onbeforecopy = "return false"
    // onmouseup = "document.selection.empty()" >
  },
  utilFn: { //工具类函数
    deepClone: function(target) { /*deepClone 深度克隆 target [克隆对象] 返回深度克隆后的对象*/
      //返回传递给他的任意对象的类
      function checkedType(target) {
        return Object.prototype.toString.call(target).slice(8, -1); //返回检测的数据类型
      }
      //判断拷贝的数据类型
      //初始化变量result 成为最终克隆的数据
      let result, targetType = checkedType(target);
      if (targetType === 'Object') {
        result = {}
      } else if (targetType === 'Array') {
        result = []
      } else {
        return target;
      }
      //遍历目标数据
      for (let i in target) {
        //获取遍历数据结构的每一项值
        let value = target[i];
        //判断目标结构里的每一项值是否存在对象/数组
        if (checkedType(value) === 'Object' || checkedType(value) === 'Array') {
          //继续遍历获取到的value值
          result[i] = clone(value);
        } else { //获取到的value值是基本的数据类型或者是函数
          result[i] = value;
        }
      }
      return result;
    },
    deepCopy: function(obj) { //深拷贝通用方法
      //var new_arr = JSON.parse(JSON.stringify(arr)) // 不仅可拷贝数组还能拷贝对象（ 但不能拷贝函数）
      // 只拷贝对象
      var me = this;
      if (typeof obj !== 'object') return;
      // 根据obj的类型判断是新建一个数组还是一个对象
      var newObj = obj instanceof Array ? [] : {};
      for (var key in obj) {
        // 遍历obj,并且判断是obj的属性才拷贝
        if (obj.hasOwnProperty(key)) {
          // 判断属性值的类型，如果是对象递归调用深拷贝
          newObj[key] = typeof obj[key] === 'object' ? me.deepCopy(obj[key]) : obj[key];
        }
      }
      return newObj;
    },
    shallowCopy: function(obj) { //浅拷贝通用方法
      var me = this;
      // 只拷贝对象
      if (typeof obj !== 'object') return;
      // 根据obj的类型判断是新建一个数组还是一个对象
      var newObj = obj instanceof Array ? [] : {};
      // 遍历obj,并且判断是obj的属性才拷贝
      for (var key in obj) {
        if (obj.hasOwnProperty(key)) {
          newObj[key] = obj[key];
        }
      }
      return newObj;
    },
    numTostring: function(digit, num) { //num位数不够digit位前面添加0
      var me = this;
      var str = num.toString();
      var len = str.length;
      var arr = str.split('');
      var zeroNum = digit - len;
      for (var i = 0; i < zeroNum; i++) {
        arr.unshift("0");
      }
      return arr.join('')
    },
    checkPwd: function(str) { /*检测密码强度*/
      var Lv = 0;
      if (str.length < 6) {
        return Lv
      }
      if (/[0-9]/.test(str)) {
        Lv++
      }
      if (/[a-z]/.test(str)) {
        Lv++
      }
      if (/[A-Z]/.test(str)) {
        Lv++
      }
      if (/[\.|-|_]/.test(str)) {
        Lv++
      }
      return Lv;
    },
  },
  transformFn: { //转化函数
    formatNum: function(num) { /*格式化数字  1000,343,343*/
      var me = this;
      return num.split('').reverse().join('').replace(/(\d{3})/g, '$1,').replace(/\,$/, '').split('').reverse().join('');
    },
    numberToStr3: function(n) { /*数字转化为PB TB GB GB MB*/
      var me = this;
      var str = "";
      var temp = n;
      var p = 0;
      if (n >= 1024 * 1024 * 1024) {
        p = me.zhengchu(n, 1024 * 1024 * 1024);
        str += p + "PB";
        temp = temp - p * 1024 * 1024 * 1024;
      }
      var t = 0;
      if (n >= 1024 * 1024) {
        t = me.zhengchu(n, 1024 * 1024);
        str += t + "TB";
        temp = temp - t * 1024 * 1024;
      }
      var g = 0;
      if (temp >= 1024) {
        g = me.zhengchu(n, 1024);
        str += g + "GB";
        temp = temp - g * 1024;
      }

      var m = 0;
      if (temp >= 1) {
        m = temp;
        str += m + "MB";
      }
      return str;
    },
    formatterNum: function(num) { /* 处理三位逗号分隔数字 */
      var me = this;
      num = num + "";
      if (num != "undefined" && num != "-") {
        num = num.split('').reverse().join('').replace(/(\d{3})/g, '$1,').replace(/\,$/, '').split('').reverse().join('');
      }
      return num;
    },
    formattedNumber: function(num) { /* 数字三位逗号分隔 */
      var me = this;
      var num = (num || 0).toString();
      var result = '';
      while (num.length > 3) {
        result = ',' + num.slice(-3) + result;
        num = num.slice(0, num.length - 3);
      }
      if (num) { result = num + result; }
      return result;
    },
    wordwrap: function(text, limit) { /*单词或遇见空格换行*/
      var me = this;
      var words = text.split(" ");
      var lines = [""];
      for (var i = 0; i < words.length; i++) {
        var word = words[i];
        lastLine = lines[lines.length - 1];
        if (lastLine.length + word.length > limit) {
          lines.push(word);
        } else {
          lines[lines.length - 1] = lastLine + " " + word;
        }
      }
      return lines.join("\n").trim(); // Trim because the first line will start with a
    },
    unwrap: function(text) { /*换行替换为空格*/
      var me = this;
      return text.replace(/\n/g, " ");
    },
    trimStr: function(nullStr) { /*空转化为‘’*/
      var me = this;
      if (nullStr == null || typeof(nullStr) == "undefined") {
        return "";
      } else {
        return nullStr;
      }
    },
    getByteLength: function(val) { /*返回字符串val的字节长度*/
      var me = this;
      var len = 0;
      for (var i in val) {
        if (val[i].match(/[^\x00-\xff]/ig) != null) //全角
          len += 2;
        else
          len += 1;
      }
      return len;
    },
    ProcessingSeparator: function(val) { /*处理用空格、换行符、逗号、顿号（以上符号数量不限制）隔开的字符串，返回用单个英文逗号隔开的字符*/
      var me = this;
      try {
        val = val.replace(/\n|\r\n| /g, ",");
        val = val.replace(/、/g, ",");
        val = val.replace(/，/g, ",");
      } catch (e) {
        console.info(e);
      }
      val = val.split(",");
      var strstring = ''
      me.each(val, function(i, t) {
        if (t != "") {
          strstring += t + ',';
        }
      })
      return strstring.substr(0, strstring.length - 1);
    },
    digitUppercase: function(n) { /*现金额大写*/
      if (typeof n == "number") {
        n = new String(n);
      };
      n = n.replace(/,/g, "") //替换tomoney()中的“,”
      n = n.replace(/ /g, "") //替换tomoney()中的空格
      n = n.replace(/￥/g, "") //替换掉可能出现的￥字符
      // if (isNaN(n)) { //验证输入的字符是否为数字
      //     //alert("请检查小写金额是否正确");
      //     return "";
      // };
      var fraction = ['角', '分'];
      var digit = [
        '零', '壹', '贰', '叁', '肆',
        '伍', '陆', '柒', '捌', '玖'
      ];
      var unit = [
        ['元', '万', '亿', '万', '亿'],
        ['', '拾', '佰', '仟']
      ];
      var head = n < 0 ? '欠' : '';
      n = Math.abs(n);
      var s = '';
      for (var i = 0; i < fraction.length; i++) {
        s += (digit[Math.floor(n * 10 * Math.pow(10, i)) % 10] + fraction[i]).replace(/零./, '');
      }
      s = s || '整';
      n = Math.floor(n);
      for (var i = 0; i < unit[0].length && n > 0; i++) {
        var p = '';
        for (var j = 0; j < unit[1].length && n > 0; j++) {
          p = digit[n % 10] + unit[1][j] + p;
          n = Math.floor(n / 10);
        }
        s = p.replace(/(零.)*零$/, '').replace(/^$/, '零') + unit[0][i] + s;
      }
      return head + s.replace(/(零.)*零元/, '元')
        .replace(/(零.)+/g, '零')
        .replace(/^整$/, '零元整');
    },
    numberToChinese: function(num, type) { /*将阿拉伯数字翻译成中文的大写数字*/
      if (typeof num == "number") {
        num = new String(num);
      };
      num = num.replace(/,/g, "") //替换tomoney()中的“,”
      num = num.replace(/ /g, "") //替换tomoney()中的空格
      num = num.replace(/￥/g, "") //替换掉可能出现的￥字符
      var rel = num < 0 ? (type == "money" ? '欠' : '负') : '';
      num = num < 0 ? -(num) : num;
      var AA = new Array("零", "一", "二", "三", "四", "五", "六", "七", "八", "九", "十");
      var BB = new Array("", "十", "百", "千", /*"萬", "億",*/ "万", "亿", "点", "");
      var a = ("" + num).replace(/(^0*)/g, "").split("."),
        k = 0,
        re = '';
      for (var i = a[0].length - 1; i >= 0; i--) {
        switch (k) {
          case 0:
            re = BB[7] + re;
            break;
          case 4:
            if (!new RegExp("0{4}//d{" + (a[0].length - i - 1) + "}$")
              .test(a[0]))
              re = BB[4] + re;
            break;
          case 8:
            re = BB[5] + re;
            BB[7] = BB[5];
            k = 0;
            break;
        }
        if (k % 4 == 2 && a[0].charAt(i + 2) != 0 && a[0].charAt(i + 1) == 0)
          re = AA[0] + re;
        if (a[0].charAt(i) != 0)
          re = AA[a[0].charAt(i)] + BB[k % 4] + re;
        k++;
      }

      if (a.length > 1) // 加上小数部分(如果有小数部分)
      {
        re += BB[6];
        for (var i = 0; i < a[1].length; i++)
          re += AA[a[1].charAt(i)];
      }
      if (re == '一十')
        re = "十";
      if (re.match(/^一/) && re.length == 3)
        re = re.replace("一", "");
      return rel + re;
    },
    getfigure: function(digit, type) { //获取对应格式数字
      //Ⅰ、Ⅱ、Ⅲ、Ⅳ（IIII）、Ⅴ、Ⅵ、Ⅶ、Ⅷ、Ⅸ、Ⅹ、Ⅺ、Ⅻ……
      //I-1，V-5，X-10，L-50，C-100，D-500，M-1000。
      var number = [{
        digit: 0,
        rome: "",
        chinese: "〇",
        big: "零"
      }, {
        digit: 1,
        rome: "Ⅰ",
        chinese: "一",
        big: "壹"
      }, {
        digit: 2,
        rome: "Ⅱ",
        chinese: "二",
        big: "贰"
      }, {
        digit: 3,
        rome: "Ⅲ",
        chinese: "三",
        big: "叁"
      }, {
        digit: 4,
        rome: "Ⅳ",
        chinese: "四",
        big: "肆"
      }, {
        digit: 5,
        rome: "Ⅴ",
        chinese: "五",
        big: "伍"
      }, {
        digit: 6,
        rome: "Ⅵ",
        chinese: "六",
        big: "陆"
      }, {
        digit: 7,
        rome: "Ⅶ",
        chinese: "七",
        big: "柒"
      }, {
        digit: 8,
        rome: "Ⅷ",
        chinese: "七",
        big: "柒"
      }, {
        digit: 9,
        rome: "Ⅸ",
        chinese: "九",
        big: "玖"
      }, {
        digit: 10,
        rome: "Ⅹ",
        chinese: "十",
        big: "拾"
      }, {
        digit: 50,
        rome: "L",
        chinese: "五十",
        big: "伍拾"
      }, {
        digit: 100,
        rome: "C",
        chinese: "一百",
        big: "壹佰"
      }, {
        digit: 500,
        rome: "D",
        chinese: "五百",
        big: "伍佰"
      }, {
        digit: 1000,
        rome: "M",
        chinese: "一千",
        big: "壹仟"
      }, {
        digit: 10000,
        rome: "",
        chinese: "万",
        big: "万"
      }, {
        digit: 100000000,
        rome: "",
        chinese: "亿",
        big: "亿"
      }]
    },
    domToStirng: function(htmlDOM) { /*DOM转字符串*/
      var div = document.createElement("div");
      div.appendChild(htmlDOM);
      return div.innerHTML
    },
    stringToDom: function(htmlString) { /*字符串转DOM*/
      var div = document.createElement("div");
      div.innerHTML = htmlString;
      return div.children[0];
    },
  },
  numberFn: { //数字
    strToInt: function(n) { /*字符串数字转化成整数,保留整数部分*/
      var me = this;
      if (n == null || typeof(n) == "undefined" || isNaN(n)) {
        return 0;
      } else {
        var newNumber = parseInt(n);
        if (isNaN(newNumber)) {
          return 0;
        } else {
          return newNumber;
        }
      }
    },
    strToInt45: function(n) { /*字符串数字转化成整数，四舍五入*/
      var me = this;
      if (n == null || typeof(n) == "undefined" || isNaN(n)) {
        return 0;
      } else {
        var newNumber = Math.round(n);
        if (isNaN(newNumber)) {
          return 0;
        } else {
          return newNumber;
        }
      }
    },
    strToFloat: function(n) { /*字符串数字转化成小数*/
      var me = this;
      if (n == null || typeof(n) == "undefined" || isNaN(n)) {
        return 0;
      } else if (typeof(n) == "number") {
        return n;
      } else {
        var newNumber = parseFloat(n);
        if (isNaN(newNumber)) {
          return 0;
        } else {
          return newNumber;
        }
      }
    },
    accurateChuFa: function(arg1, arg2) { /*获取小数相除的精确结果*/
      if (arg2 == 0) {
        return 0.00;
      }
      var t1 = 0,
        t2 = 0,
        r1, r2;
      try { t1 = arg1.toString().split(".")[1].length } catch (e) {}
      try { t2 = arg2.toString().split(".")[1].length } catch (e) {}
      r1 = Number(arg1.toString().replace(".", ""))
      r2 = Number(arg2.toString().replace(".", ""))
      return (r1 / r2) * pow(10, t2 - t1);
    },
    accurateChengFa: function(arg1, arg2) { /*获取小数相乘的精确结果*/
      arg1 = strToFloat(arg1);
      var m = 0,
        s1 = arg1.toString(),
        s2 = arg2.toString();
      try { m += s1.split(".")[1].length } catch (e) {}
      try { m += s2.split(".")[1].length } catch (e) {}
      return Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m)
    },
    accurateJiaFa: function(arg1, arg2) { /*获取小数相加的精确结果*/
      var r1, r2, m;
      try { r1 = arg1.toString().split(".")[1].length } catch (e) { r1 = 0 }
      try { r2 = arg2.toString().split(".")[1].length } catch (e) { r2 = 0 }
      m = Math.pow(10, Math.max(r1, r2))
      return (arg1 * m + arg2 * m) / m
    },
    double45: function(arg1, number) { /*获取小数四舍五入,保留N位小数*/
      try {
        var baifen = 1;
        for (var h = 0; h < number; h++) {
          baifen = baifen * 10;
        }
        var f_x = Math.round(arg1 * baifen) / baifen;
        return f_x;
      } catch (e) {
        return arg1;
      }
    },
    zhengchu: function(exp1, exp2) { /*两数整除*/
      var me = this;
      var n1 = Math.round(exp1); //四舍五入
      var n2 = Math.round(exp2); //四舍五入
      var rslt = n1 / n2; //除
      if (rslt >= 0) {
        rslt = Math.floor(rslt); //返回小于等于原rslt的最大整数。
      } else {
        rslt = Math.ceil(rslt); //返回大于等于原rslt的最小整数。
      }
      return rslt;
    },
    random: function(min, max) { /*随机数范围*/
      if (arguments.length === 2) {
        return Math.floor(min + Math.random() * ((max + 1) - min))
      } else {
        return 0;
      }
    },
  },
  TypeFn: { //类型判断
    getType: function(obj) { /*判断对象是数组还是obj或变量分别对应返回 'arr(数组)','obj(对象)','var(单一变量)','Fn(函数)'*/
      if (typeof obj == 'function') {
        return 'Fn';
      } else if (typeof obj === 'object' && isNaN(obj.length)) {
        return 'obj';
      } else if (typeof obj === 'object' && !isNaN(obj.length)) {
        return 'arr';
      }
      return "variable"
    },
    isString: function(o) { //是否字符串
      return Object.prototype.toString.call(o).slice(8, -1) === 'String'
    },
    isNumber: function(o) { //是否数字
      return Object.prototype.toString.call(o).slice(8, -1) === 'Number'
    },
    isBoolean: function(o) { //是否boolean
      return Object.prototype.toString.call(o).slice(8, -1) === 'Boolean'
    },
    isFunction: function(o) { //是否函数
      return Object.prototype.toString.call(o).slice(8, -1) === 'Function'
    },
    isNull: function(o) { //是否为null
      return Object.prototype.toString.call(o).slice(8, -1) === 'Null'
    },
    isUndefined: function(o) { //是否undefined
      return Object.prototype.toString.call(o).slice(8, -1) === 'Undefined'
    },
    isObj: function(o) { //是否对象
      return Object.prototype.toString.call(o).slice(8, -1) === 'Object'
    },
    isArray: function(o) { //是否数组
      return Object.prototype.toString.call(o).slice(8, -1) === 'Array'
    },
    isDate: function(o) { //是否时间
      return Object.prototype.toString.call(o).slice(8, -1) === 'Date'
    },
    isRegExp: function(o) { //是否正则
      return Object.prototype.toString.call(o).slice(8, -1) === 'RegExp'
    },
    isError: function(o) { //是否错误对象
      return Object.prototype.toString.call(o).slice(8, -1) === 'Error'
    },
    isSymbol: function(o) { //是否Symbol函数
      return Object.prototype.toString.call(o).slice(8, -1) === 'Symbol'
    },
    isPromise: function(o) { //是否Promise对象
      return Object.prototype.toString.call(o).slice(8, -1) === 'Promise'
    },
    isSet: function(o) { //是否Set对象
      return Object.prototype.toString.call(o).slice(8, -1) === 'Set'
    },
    isFalse: function(o) {
      if (o == '' || o == undefined || o == null || o === 0 || o == false || o == NaN || o === 0.0) return true
      return false
    },
    isTrue: function(o) {
      return !this.isFalse(o)
    },
    checkStr: function(str, type) { //检查字符集本数据类型
      switch (type) {
        case 'phone': //手机号码
          return str.length == 11 && /^1[3|4|5|6|7|8|9][0-9]\d{4,8}$/.test(str);
        case 'tel': //座机
          return /^(0\d{2,3}-\d{7,8})(-\d{1,4})?$/.test(str);
        case 'card': //身份证
          return /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(str);
        case 'pwd': //密码以字母开头，长度在6~18之间，只能包含字母、数字和下划线
          return /^[a-zA-Z]\w{5,17}$/.test(str)
        case 'postal': //邮政编码
          return /[1-9]\d{5}(?!\d)/.test(str);
        case 'QQ': //QQ号
          return /^[1-9][0-9]{4,9}$/.test(str);
        case 'email': //邮箱
          return /^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/.test(str);
        case 'money': //金额(小数点2位)
          return /^\d*(?:\.\d{0,2})?$/.test(str);
        case 'URL': //网址
          return /(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?/.test(str)
        case 'IP': //IP
          return /((?:(?:25[0-5]|2[0-4]\\d|[01]?\\d?\\d)\\.){3}(?:25[0-5]|2[0-4]\\d|[01]?\\d?\\d))/.test(str);
        case 'date': //日期时间
          return /^(\d{4})\-(\d{2})\-(\d{2}) (\d{2})(?:\:\d{2}|:(\d{2}):(\d{2}))$/.test(str) || /^(\d{4})\-(\d{2})\-(\d{2})$/.test(str)
        case 'number': //数字
          return /^[0-9]$/.test(str);
        case 'english': //英文
          return /^[a-zA-Z]+$/.test(str);
        case 'chinese': //中文
          return /^[\u4E00-\u9FA5]+$/.test(str);
        case 'lower': //小写
          return /^[a-z]+$/.test(str);
        case 'upper': //大写
          return /^[A-Z]+$/.test(str);
        case 'HTML': //HTML标记
          return /<("[^"]*"|'[^']*'|[^'">])*>/.test(str);
        default:
          return true;
      }
    },
    isCardID: function(sId) { // 严格的身份证校验
      if (!/(^\d{15}$)|(^\d{17}(\d|X|x)$)/.test(sId)) {
        alert('你输入的身份证长度或格式错误')
        return false
      }
      //身份证城市
      var aCity = { 11: "北京", 12: "天津", 13: "河北", 14: "山西", 15: "内蒙古", 21: "辽宁", 22: "吉林", 23: "黑龙江", 31: "上海", 32: "江苏", 33: "浙江", 34: "安徽", 35: "福建", 36: "江西", 37: "山东", 41: "河南", 42: "湖北", 43: "湖南", 44: "广东", 45: "广西", 46: "海南", 50: "重庆", 51: "四川", 52: "贵州", 53: "云南", 54: "西藏", 61: "陕西", 62: "甘肃", 63: "青海", 64: "宁夏", 65: "新疆", 71: "台湾", 81: "香港", 82: "澳门", 91: "国外" };
      if (!aCity[parseInt(sId.substr(0, 2))]) {
        alert('你的身份证地区非法')
        return false
      }
      // 出生日期验证
      var sBirthday = (sId.substr(6, 4) + "-" + Number(sId.substr(10, 2)) + "-" + Number(sId.substr(12, 2))).replace(/-/g, "/"),
        d = new Date(sBirthday)
      if (sBirthday != (d.getFullYear() + "/" + (d.getMonth() + 1) + "/" + d.getDate())) {
        alert('身份证上的出生日期非法')
        return false
      }
      // 身份证号码校验
      var sum = 0,
        weights = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2],
        codes = "10X98765432"
      for (var i = 0; i < sId.length - 1; i++) {
        sum += sId[i] * weights[i];
      }
      var last = codes[sum % 11]; //计算出来的最后一位身份证号码
      if (sId[sId.length - 1] != last) {
        alert('你输入的身份证号非法')
        return false
      }
      return true;
    }
  },
  systemFn: { //浏览器，设备，系统类型判断，视窗属性，编码
    getOsType: function() {
      var u = navigator.userAgent;
      if (u.indexOf('Android') > -1 || u.indexOf('Linux') > -1) { //安卓手机
        return "Android";
        //return false
      } else if (u.indexOf('iPhone') > -1) { //苹果手机
        return "iPhone";
        //return true
      } else if (u.indexOf('iPad') > -1) { //iPad
        return "iPad";
        //return false
      } else if (u.indexOf('Windows Phone') > -1) { //winphone手机
        return "Windows Phone";
        //return false
      } else {
        return false
      }
    },
    isPC: function() { //是否为PC端
      var userAgentInfo = navigator.userAgent;
      var Agents = ["Android", "iPhone",
        "SymbianOS", "Windows Phone",
        "iPad", "iPod"
      ];
      var flag = true;
      for (var v = 0; v < Agents.length; v++) {
        if (userAgentInfo.indexOf(Agents[v]) > 0) {
          flag = false;
          break;
        }
      }
      return flag;
    },
    browserType: function() { //浏览器类型
      var userAgent = navigator.userAgent || 'navigator' in window && 'userAgent' in navigator && navigator.userAgent.toLowerCase() || ''; //取得浏览器的userAgent字符串
      var isOpera = userAgent.indexOf("Opera") > -1; //判断是否Opera浏览器
      var isIE = userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1 && !isOpera; //判断是否IE浏览器
      var isIE11 = userAgent.indexOf('Trident') > -1 && userAgent.indexOf("rv:11.0") > -1;
      var isEdge = userAgent.indexOf("Edge") > -1 && !isIE; //判断是否IE的Edge浏览器  
      var isFF = userAgent.indexOf("Firefox") > -1; //判断是否Firefox浏览器
      var isSafari = userAgent.indexOf("Safari") > -1 && userAgent.indexOf("Chrome") == -1; //判断是否Safari浏览器
      var isChrome = userAgent.indexOf("Chrome") > -1 && userAgent.indexOf("Safari") > -1; //判断Chrome浏览器
      if (isIE) {
        var reIE = new RegExp("MSIE (\\d+\\.\\d+);");
        reIE.test(userAgent);
        var fIEVersion = parseFloat(RegExp["$1"]);
        if (fIEVersion == 7) return "IE7"
        else if (fIEVersion == 8) return "IE8";
        else if (fIEVersion == 9) return "IE9";
        else if (fIEVersion == 10) return "IE10";
        else return "IE7以下" //IE版本过低
      }
      if (isIE11) return 'IE11';
      if (isEdge) return "Edge";
      if (isFF) return "FF";
      if (isOpera) return "Opera";
      if (isSafari) return "Safari";
      if (isChrome) return "Chrome";
    },
    getUuid: function() { /*获取uuid*/
      var s = [];
      var hexDigits = "0123456789abcdef";
      for (var i = 0; i < 36; i++) {
        s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
      }
      s[14] = "4"; // bits 12-15 of the time_hi_and_version field to 0010
      s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
      s[8] = s[13] = s[18] = s[23] = "";
      var uuid = s.join("");
      return uuid;
    },
    getClientHeight: function() { /*获取视窗的高度*/
      var clientHeight = 0;
      if (document.body.clientHeight && document.documentElement.clientHeight) {
        var clientHeight = (document.body.clientHeight < document.documentElement.clientHeight) ? document.body.clientHeight : document.documentElement.clientHeight;
      } else {
        var clientHeight = (document.body.clientHeight > document.documentElement.clientHeight) ? document.body.clientHeight : document.documentElement.clientHeight;
      }
      return clientHeight;
    },
    ProhibitCodeDebugging: function() { /*禁用代码检查和右键*/
      document.onkeydown = function() {
        var e = window.event || arguments[0];
        if (e.keyCode == 123) {
          console.log('请尊重劳动成果！');
          return false;
        } else if ((e.ctrlKey) && (e.shiftKey) && (e.keyCode == 73)) {
          return false;
        } else if ((e.ctrlKey) && (e.keyCode == 85)) {
          return false;
        } else if ((e.ctrlKey) && (e.keyCode == 83)) {
          return false;
        }
      }
      document.oncontextmenu = function() {
        return false;
      }
    },
    getExploreType: function() { /*获取浏览器类型和版本 @return {String}*/
      var sys = {},
        ua = navigator.userAgent.toLowerCase(),
        s;
      (s = ua.match(/rv:([\d.]+)\) like gecko/)) ? sys.ie = s[1]:
        (s = ua.match(/msie ([\d\.]+)/)) ? sys.ie = s[1] :
        (s = ua.match(/edge\/([\d\.]+)/)) ? sys.edge = s[1] :
        (s = ua.match(/firefox\/([\d\.]+)/)) ? sys.firefox = s[1] :
        (s = ua.match(/(?:opera|opr).([\d\.]+)/)) ? sys.opera = s[1] :
        (s = ua.match(/chrome\/([\d\.]+)/)) ? sys.chrome = s[1] :
        (s = ua.match(/version\/([\d\.]+).*safari/)) ? sys.safari = s[1] : 0;
      // 根据关系进行判断
      if (sys.ie) return ('IE: ' + sys.ie)
      if (sys.edge) return ('EDGE: ' + sys.edge)
      if (sys.firefox) return ('Firefox: ' + sys.firefox)
      if (sys.chrome) return ('Chrome: ' + sys.chrome)
      if (sys.opera) return ('Opera: ' + sys.opera)
      if (sys.safari) return ('Safari: ' + sys.safari)
      return 'Unkonwn'
    },
    getOS: function() { /*获取操作系统类型 @return {String}*/
      var userAgent = 'navigator' in window && 'userAgent' in navigator && navigator.userAgent.toLowerCase() || '';
      var vendor = 'navigator' in window && 'vendor' in navigator && navigator.vendor.toLowerCase() || '';
      var appVersion = 'navigator' in window && 'appVersion' in navigator && navigator.appVersion.toLowerCase() || '';

      if (/iphone/i.test(userAgent) || /ipad/i.test(userAgent) || /ipod/i.test(userAgent)) return 'ios'
      if (/android/i.test(userAgent)) return 'android'
      if (/win/i.test(appVersion) && /phone/i.test(userAgent)) return 'windowsPhone'
      if (/mac/i.test(appVersion)) return 'MacOSX'
      if (/win/i.test(appVersion)) return 'windows'
      if (/linux/i.test(appVersion)) return 'linux'
    },
    encode64: function(d) { /*Base64位加密*/
      d = (function(g) {
        var c = g.length;
        var a = "";
        for (var d = 0; d < c; d++) {
          var f = g.charCodeAt(d);
          if (f < 0) {
            f += 65536
          }
          if (f > 127) {
            f = UnicodeToAnsi(f)
          }
          if (f > 255) {
            var b = f & 65280;
            b = b >> 8;
            var e = f & 255;
            a += String.fromCharCode(b) + String.fromCharCode(e)
          } else {
            a += String.fromCharCode(f)
          }
        }
        return a;
      })(d);
      var b = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
      var a = "";
      var l, j, g = "";
      var k, h, f, e = "";
      var c = 0;
      do {
        l = d.charCodeAt(c++);
        j = d.charCodeAt(c++);
        g = d.charCodeAt(c++);
        k = l >> 2;
        h = ((l & 3) << 4) | (j >> 4);
        f = ((j & 15) << 2) | (g >> 6);
        e = g & 63;
        if (isNaN(j)) {
          f = e = 64
        } else {
          if (isNaN(g)) {
            e = 64
          }
        }
        a = a + b.charAt(k) + b.charAt(h) + b.charAt(f) + b.charAt(e);
        l = j = g = "";
        k = h = f = e = ""
      } while (c < d.length);
      return a
    },
  },
  urlFn: { //url函数
    getRootPath: function() { /*获取项目根路径url,路径后面默认没有斜杠*/
      var curWwwPath = window.document.location.href;
      var pathName = window.document.location.pathname;
      var pos = curWwwPath.indexOf(pathName);
      var localhostPaht = curWwwPath.substring(0, pos);
      var projectName = pathName.substring(0, pathName.substr(1).indexOf('/') + 1);
      return (localhostPaht + projectName);
    },
    getRootUrl: function() { /*获取项目根路径url,路径后面默认没有斜杠*/
      var url = window.location.protocol + "//" + window.location.host;
      //url += basePath;
      url = url.substr(url.length - 1, 2) == '/' ? url.substr(0, url.length - 2) : url;
      return url;
    },
    getUrlParams: function(name) { /*获取网址参数*/
      var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
      var r = decodeURI(window.location.search).substr(1).match(reg);
      if (r != null) return r[2];
      return null;
    },
    getUrlAllParams: function(url) { /*获取全部url参数,并转换成json对象*/
      var url = url ? url : window.location.href;
      var _pa = url.substring(url.indexOf('?') + 1),
        _arrS = _pa.split('&'),
        _rs = {};
      for (var i = 0, _len = _arrS.length; i < _len; i++) {
        var pos = _arrS[i].indexOf('=');
        if (pos == -1) {
          continue;
        }
        var name = _arrS[i].substring(0, pos),
          value = window.decodeURIComponent(_arrS[i].substring(pos + 1));
        _rs[name] = value;
      }
      return _rs;
    },
    delParamsUrl: function(url, name) { /*删除url指定参数，返回url*/
      url = url ? url : window.location.href;
      var baseUrl = url.split('?')[0] + '?';
      var query = url.split('?')[1];
      if (query.indexOf(name) > -1) {
        var obj = {}
        var arr = query.split("&");
        for (var i = 0; i < arr.length; i++) {
          arr[i] = arr[i].split("=");
          obj[arr[i][0]] = arr[i][1];
        };
        delete obj[name];
        var url = baseUrl + JSON.stringify(obj).replace(/[\"\{\}]/g, "").replace(/\:/g, "=").replace(/\,/g, "&");
        return url
      } else {
        return url;
      }
    },
    objToQueryUrlString: function(obj) { /*@description   对象序列化(对象转成url参数) @param  {Object} obj  @return {String}*/
      if (!obj) return '';
      var pairs = [];
      for (var key in obj) {
        var value = obj[key];

        if (value instanceof Array) {
          for (var i = 0; i < value.length; ++i) {
            pairs.push(encodeURIComponent(key + '[' + i + ']') + '=' + encodeURIComponent(value[i]));
          }
          continue;
        }
        pairs.push(encodeURIComponent(key) + '=' + encodeURIComponent(obj[key]));
      }
      return pairs.join('&');
    },
  },
  DateFn: { //时间处理函数
    formatDate: function(date, format) { /*通用化格式时间*/
      //new Date( year, month, date, hrs, min, sec)
      //new Date() ;     //参数可以为整数; 也可以为字符串; 但格式必须正确  
      //examplenew Date(2009,1,1);       //正确  new Date("2009/1/1");    //正确  
      //example  formatDate(new Date(), "当前日期为：YYYY-MM-DD，星期w，为第qq季度，时间为：hh:mm:ss:c")
      date = new Date(date);
      var o = {
        "M+": date.getMonth() + 1, //month  MM
        "D+": date.getDate(), //day  DD
        "h+": date.getHours(), //hour  hh
        "m+": date.getMinutes(), //minute mm
        "s+": date.getSeconds(), //second ss
        "q+": Math.floor((date.getMonth() + 3) / 3), //quarter 季度 q
        "c": date.getMilliseconds(), //millisecond 毫秒 c
        "w": ['一', '二', '三', '四', '五', '六', '日'][date.getDay() - 1] //week 星期 w
      };
      if (/(Y+)/.test(format)) { //year  YYYY
        format = format.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
      }
      for (var k in o) {
        if (new RegExp("(" + k + ")").test(format)) {
          format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
        }
      }
      return format;
    },
    parserDate: function(date) { //如何将标准时间 Thu Mar 07 2019 12:00:00 GMT+0800 (中国标准时间)转换为2019-03-07 12:00:00
      date = new Date(date)
      var resDate = date.getFullYear() + '-' + (function(p) { return p < 10 ? '0' + p : p })(date.getMonth() + 1) + '-' + (function(p) { return p < 10 ? '0' + p : p })(date.getDate());
      var resTime = (function(p) { return p < 10 ? '0' + p : p })(date.getHours()) + ':' + (function(p) { return p < 10 ? '0' + p : p })(date.getMinutes()) + ':' + (function(p) { return p < 10 ? '0' + p : p })(date.getSeconds());
      return resDate + " " + resTime;
    },
    parseSandardDate: function(date) { //如何将2019-03-07 12:00:00转换为标准时间 Thu Mar 07 2019 12:00:00 GMT+0800 (中国标准时间)
      var t = Date.parse(date);
      if (!isNaN(t)) {
        return new Date(Date.parse(date.replace(/-/g, "/")));
      } else {
        return new Date();
      }
    },
    getmillisecond: function(time1) { //时间格式‘2016 - 01 - 01 17: 22: 37’字符串转为时间戳（毫秒）
      var date = new Date(time1.replace(/-/g, '/')); //开始时间  
      return date.getTime();
    },
    betweenTime: function(date1, date2) { /*计算2个时间之间的间隔 date1  开始时间 date2  结束时间 (" 相差 "+days+"天 "+hours+"小时 "+minutes+" 分钟"+seconds+" 秒")*/
      var me = this;
      date1 = new Date(date1.replace(/-/g, '/'));
      date2 = new Date(date2.replace(/-/g, '/'));
      var date3 = date2.getTime() - date1.getTime(); //时间差的毫秒数
      //计算出相差天数
      var days = Math.floor(date3 / (24 * 3600 * 1000));
      //计算出小时数
      var leave1 = date3 % (24 * 3600 * 1000); //计算天数后剩余的毫秒数
      var hours = Math.floor(leave1 / (3600 * 1000));
      //计算相差分钟数
      var leave2 = leave1 % (3600 * 1000); //计算小时数后剩余的毫秒数
      var minutes = Math.floor(leave2 / (60 * 1000));
      //计算相差秒数
      var leave3 = leave2 % (60 * 1000); //计算分钟数后剩余的毫秒数
      var seconds = Math.round(leave3 / 1000);
      //
      var str = "";
      if (days > 0) {
        str += days + "天 ";
      }
      if (hours > 0) {
        str += hours + "小时 ";
      }
      if (minutes > 0) {
        str += minutes + " 分钟";
      }
      if (seconds > 0) {
        str += seconds + " 秒";
      }
      return str;
    },
    betweenTimeByLong: function(date1, date2) { /*根据时间的毫秒数算差*/
      var me = this;
      var date3 = date2 - date1; //时间差的毫秒数
      //计算出相差天数
      var days = Math.floor(date3 / (24 * 3600 * 1000));
      //计算出小时数
      var leave1 = date3 % (24 * 3600 * 1000); //计算天数后剩余的毫秒数
      var hours = Math.floor(leave1 / (3600 * 1000));
      //计算相差分钟数
      var leave2 = leave1 % (3600 * 1000); //计算小时数后剩余的毫秒数
      var minutes = Math.floor(leave2 / (60 * 1000));
      //计算相差秒数
      var leave3 = leave2 % (60 * 1000); //计算分钟数后剩余的毫秒数
      var seconds = Math.round(leave3 / 1000);
      //
      var str = "";
      if (days > 0) {
        str += days + "天 ";
      }
      if (hours > 0) {
        str += hours + "小时 ";
      }
      if (minutes > 0) {
        str += minutes + " 分钟";
      }
      if (seconds > 0) {
        str += seconds + " 秒";
      }
      return str;
    },
    formatDateValue: function(value) { /*检测年月日时分秒20190609110000 返回yyyy-MM-dd hh:mm:ss*/
      var me = this;
      if (typeof(value) == "undefined" || value == "") {
        return "";
      }
      if (value.length != 14) { //长度14
        return value;
      } else if (!(value.indexOf("15") == 0 || value.indexOf("16") == 0 || value.indexOf("17") == 0 ||
          value.indexOf("19") == 0 || value.indexOf("20") == 0)) {
        //不是18或者19或者20开头
        return value;
      } else if (isNaN(value)) { //是字符串（非数字）
        return value;
      } else {
        var year = me.strToInt(value.substring(0, 4));
        var yue = me.strToInt(value.substring(4, 6));
        var day = me.strToInt(value.substring(6, 8));
        var hour = me.strToInt(value.substring(8, 10));
        var min = me.strToInt(value.substring(10, 12));
        var second = strToInt(value.substring(12, 14));
        if (yue < 1 || yue > 12) { //月小于1大于12
          return value;
        } else if (day < 1 || day > 31) { //日小于1大于31
          return value;
        } else if (hour < 0 || hour > 24) { //时 小于0大于24
          return value;
        } else if (min < 0 || min > 59) { //分 小于0大于59
          return value;
        } else if (second < 0 || second > 59) { //秒 小于0大于59
          return value;
        } else {
          return value.substring(0, 4) + "-" + value.substring(4, 6) + "-" + value.substring(6, 8) +
            " " + value.substring(8, 10) + ":" + value.substring(10, 12) + ":" + value.substring(12, 14);
        }
      }
    },
    getMonths: function(time, len, direction) { /*返回指定长度的月份集合*/
      /* 
       * @param  {time} 时间
       * @param  {len} 长度
       * @param  {direction} 方向：  1: 前几个月;  2: 后几个月;  3:前后几个月  默认 3
       * @return {Array} 数组
       * @example   getMonths('2018-1-29', 6, 1)  // ->  ["2018-1", "2017-12", "2017-11", "2017-10", "2017-9", "2017-8", "2017-7"]
       */
      var mm = new Date(time).getMonth(),
        yy = new Date(time).getFullYear(),
        direction = isNaN(direction) ? 3 : direction,
        index = mm;
      var cutMonth = function(index) {
        if (index <= len && index >= -len) {
          return direction === 1 ? formatPre(index).concat(cutMonth(++index)) :
            direction === 2 ? formatNext(index).concat(cutMonth(++index)) : formatCurr(index).concat(cutMonth(++index))
        }
        return []
      }
      var formatNext = function(i) {
        var y = Math.floor(i / 12),
          m = i % 12
        return [yy + y + '-' + (m + 1)]
      }
      var formatPre = function(i) {
        var y = Math.ceil(i / 12),
          m = i % 12
        m = m === 0 ? 12 : m
        return [yy - y + '-' + (13 - m)]
      }
      var formatCurr = function(i) {
        var y = Math.floor(i / 12),
          yNext = Math.ceil(i / 12),
          m = i % 12,
          mNext = m === 0 ? 12 : m
        return [yy - yNext + '-' + (13 - mNext), yy + y + '-' + (m + 1)]
      }
      // 数组去重
      var unique = function(arr) {
        if (Array.hasOwnProperty('from')) {
          return Array.from(new Set(arr));
        } else {
          var n = {},
            r = [];
          for (var i = 0; i < arr.length; i++) {
            if (!n[arr[i]]) {
              n[arr[i]] = true;
              r.push(arr[i]);
            }
          }
          return r;
        }
      }
      return direction !== 3 ? cutMonth(index) : unique(cutMonth(index).sort(function(t1, t2) {
        return new Date(t1).getTime() - new Date(t2).getTime()
      }))
    },
    getDays: function(time, len, diretion) { /*返回指定长度的天数集合*/
      /**
       * @param  {time} 时间
       * @param  {len} 长度
       * @param  {direction} 方向： 1: 前几天;  2: 后几天;  3:前后几天  默认 3
       * @return {Array} 数组
       *
       * @example date.getDays('2018-1-29', 6) // -> ["2018-1-26", "2018-1-27", "2018-1-28", "2018-1-29", "2018-1-30", "2018-1-31", "2018-2-1"]
       */
      var tt = new Date(time)
      var getDay = function(day) {
        var t = new Date(time)
        t.setDate(t.getDate() + day)
        var m = t.getMonth() + 1
        return t.getFullYear() + '-' + m + '-' + t.getDate()
      }
      var arr = []
      if (diretion === 1) {
        for (var i = 1; i <= len; i++) {
          arr.unshift(getDay(-i))
        }
      } else if (diretion === 2) {
        for (var i = 1; i <= len; i++) {
          arr.push(getDay(i))
        }
      } else {
        for (var i = 1; i <= len; i++) {
          arr.unshift(getDay(-i))
        }
        arr.push(tt.getFullYear() + '-' + (tt.getMonth() + 1) + '-' + tt.getDate())
        for (var i = 1; i <= len; i++) {
          arr.push(getDay(i))
        }
      }
      return diretion === 1 ? arr.concat([tt.getFullYear() + '-' + (tt.getMonth() + 1) + '-' + tt.getDate()]) :
        diretion === 2 ? [tt.getFullYear() + '-' + (tt.getMonth() + 1) + '-' + tt.getDate()].concat(arr) : arr
    },
    formatHMS: function(s) { /*秒转化为时分秒*/
      /**
       * @param  {s} 秒数
       * @return {String} 字符串 
       *
       * @example formatHMS(3610) // -> 1h0m10s
       */
      var str = ''
      if (s > 3600) {
        str = Math.floor(s / 3600) + 'h' + Math.floor(s % 3600 / 60) + 'm' + s % 60 + 's'
      } else if (s > 60) {
        str = Math.floor(s / 60) + 'm' + s % 60 + 's'
      } else {
        str = s % 60 + 's'
      }
      return str
    },
    getweek: function(date) { /*获取星期几*/
      date = new Date(date);
      return ['一', '二', '三', '四', '五', '六', '日'][date.getDay() - 1] //week 星期
    },
    getquarter: function(date) { /*获取第几季度*/
      date = new Date(date);
      return ["第一季度", "第二季度", "第三季度", "第四季度"][Math.floor((data.getMonth() + 3) / 3) - 1]; //quarter 季度 q
    },
    getMonthOfDay: function(time) { /*获取某月有多少天*/
      var date = new Date(time)
      var year = date.getFullYear()
      var mouth = date.getMonth() + 1
      var days

      //当月份为二月时，根据闰年还是非闰年判断天数
      if (mouth == 2) {
        days = (year % 4 == 0 && year % 100 == 0 && year % 400 == 0) || (year % 4 == 0 && year % 100 != 0) ? 28 : 29
      } else if (mouth == 1 || mouth == 3 || mouth == 5 || mouth == 7 || mouth == 8 || mouth == 10 || mouth == 12) {
        //月份为：1,3,5,7,8,10,12 时，为大月.则天数为31；
        days = 31
      } else {
        //其他月份，天数为：30.
        days = 30
      }
      return days
    },
    getYearOfDay: function(time) { /*获取某年有多少天*/
      var firstDayYear = this.getFirstDayOfYear(time);
      var lastDayYear = this.getLastDayOfYear(time);
      var numSecond = (new Date(lastDayYear).getTime() - new Date(firstDayYear).getTime()) / 1000;
      return Math.ceil(numSecond / (24 * 3600));
    },
    getFirstDayOfYear: function(time) { /*获取某年的第一天*/
      var year = new Date(time).getFullYear();
      return year + "-01-01 00:00:00";
    },
    getLastDayOfYear: function(time) { /*获取某年最后一天*/
      var year = new Date(time).getFullYear();
      var dateString = year + "-12-01 00:00:00";
      var endDay = this.getMonthOfDay(dateString);
      return year + "-12-" + endDay + " 23:59:59";
    },
    getDayOfYear: function(time) { /*获取某个日期是当年中的第几天*/
      return Math.ceil(((new Date(time).getTime() - new Date(this.getFirstDayOfYear(time)).getTime()) / 1000) / (24 * 3600));
    },
    getDayOfYearWeek: function(time) { /*获取某个日期在这一年的第几周*/
      return Math.ceil(this.getDayOfYear(time) / 7);
    },
    datedifferencedays: function(sDate1, sDate2) { //获取两个日期之间的时间间隔 sDate1和sDate2默认是2019-6-8或标准时间格式  
      var dateSpan = (new Date(sDate2.replace(/-/g, '/'))) - (new Date(sDate1.replace(/-/g, '/')));
      return Math.floor(Math.abs(dateSpan) / (24 * 3600 * 1000));
    },
    CurentTime: function() { //返回"2019-04-18 15:49:04"
      var date = new Date();
      return this.formatDate(date, "YYYY-MM-DD hh:mm:ss");
      // var now = new Date();
      // var year = now.getFullYear(); //年
      // var month = now.getMonth() + 1; //月
      // var day = now.getDate(); //日
      // var hh = now.getHours(); //时
      // var mm = now.getMinutes(); //分
      // var ss = now.getSeconds(); //秒
      // var clock = year + "-";
      // if (month < 10)
      //     clock += "0";
      // clock += month + "-";
      // if (day < 10)
      //     clock += "0";
      // clock += day + " ";
      // if (hh < 10)
      //     clock += "0";
      // clock += hh + ":";
      // if (mm < 10) clock += '0';
      // clock += mm + ":";
      // if (ss < 10) clock += '0';
      // clock += ss;
      // return (clock);
    },
    getDiffYear: function(nowValue) { /*计算年龄,输入年月日返回年龄*/
      var me = this;
      //20140102101010
      var reg1 = /^((?!0000)[0-9]{4}((0[1-9]|1[0-2])(0[1-9]|1[0-9]|2[0-8])|(0[13-9]|1[0-2])(29|30)|(0[13578]|1[02])31)|([0-9]{2}(0[48]|[2468][048]|[13579][26])|(0[48]|[2468][048]|[13579][26])00)0229)(([0-2][0-3])|([0-1][0-9]))[0-5][0-9][0-5][0-9]$/;
      //2015-05-23T03:00:00.000Z
      var reg2 = /^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d.\d\d\dZ$/;
      if (reg1.test(nowValue) || reg2.test(nowValue)) {
        var year = 0;
        var month = 0;
        var day = 0;
        if (reg1.test(nowValue)) {
          year = nowValue.substring(0, 4);
          month = nowValue.substring(4, 6);
          day = nowValue.substring(6, 8);
        } else {
          year = nowValue.substring(0, 4);
          month = nowValue.substring(5, 7);
          day = nowValue.substring(8, 10);
        }
        var birthDate = new Date(year + "/" + month + "/" + day);
        var returnAge;
        var birthYear = birthDate.getYear();
        var birthMonth = birthDate.getMonth() + 1;
        var birthDay = birthDate.getDate();
        d = new Date();
        var nowYear = d.getYear();
        var nowMonth = d.getMonth() + 1;
        var nowDay = d.getDate();

        if (nowYear == birthYear) {
          returnAge = 0; //同年 则为0岁
        } else {
          var ageDiff = nowYear - birthYear; //年之差
          if (ageDiff > 0) {
            if (nowMonth == birthMonth) {
              var dayDiff = nowDay - birthDay; //日之差
              if (dayDiff < 0) {
                returnAge = ageDiff - 1;
              } else {
                returnAge = ageDiff;
              }
            } else {
              var monthDiff = nowMonth - birthMonth; //月之差
              if (monthDiff < 0) {
                returnAge = ageDiff - 1;
              } else {
                returnAge = ageDiff;
              }
            }
          } else {
            returnAge = -1; //返回-1 表示出生日期输入错误 晚于今天
          }
        }
        return returnAge; //返回周岁年龄
      } else {
        return "";
      }
    },
    formatRemainTime: function(endTime) { /*格式化现在距${endTime}（2030-10-5）的剩余时间. {Date} endTime  @return {String}*/
      var startDate = new Date(); //开始时间
      var endDate = new Date(endTime); //结束时间
      var t = endDate.getTime() - startDate.getTime(); //时间差
      var d = 0,
        h = 0,
        m = 0,
        s = 0;
      if (t >= 0) {
        d = Math.floor(t / 1000 / 3600 / 24);
        h = Math.floor(t / 1000 / 60 / 60 % 24);
        m = Math.floor(t / 1000 / 60 % 60);
        s = Math.floor(t / 1000 % 60);
      }
      return (function(dd) { return Math.round(dd * 100) / 100 })(d) + "天 " + (function(dd) { return Math.round(dd * 100) / 100 })(h) + "小时 " + (function(dd) { return Math.round(dd * 100) / 100 })(m) + "分钟 " + (function(dd) { return Math.round(dd * 100) / 100 })(s) + "秒";
    },
    formatFrontTime: function(startTime) { /*格式化startTime到现在的逝去时间. {Date} startTime  @return {String}*/
      var startDate = new Date(startTime); //开始时间
      var endDate = new Date(); //结束时间
      var t = endDate.getTime() - startDate.getTime(); //时间差
      var d = 0,
        h = 0,
        m = 0,
        s = 0;
      if (t >= 0) {
        d = Math.floor(t / 1000 / 3600 / 24);
        h = Math.floor(t / 1000 / 60 / 60 % 24);
        m = Math.floor(t / 1000 / 60 % 60);
        s = Math.floor(t / 1000 % 60);
      }
      return (function(dd) { return Math.round(dd * 100) / 100 })(d) + "天 " + (function(dd) { return Math.round(dd * 100) / 100 })(h) + "小时 " + (function(dd) { return Math.round(dd * 100) / 100 })(m) + "分钟 " + (function(dd) { return Math.round(dd * 100) / 100 })(s) + "秒";
    }
  },
  ArrayFn: { //数组处理函数
    groupbytype: function(arr, field) { /*按单字段分组*/
      var me = this;
      var map = {},
        dest = [];
      for (var i = 0; i < arr.length; i++) {
        var ai = arr[i];
        if (!map[ai[field]]) {
          dest.push({
            Group: ai[field],
            data: [ai]
          });
          map[ai[field]] = ai;
        } else {
          for (var j = 0; j < dest.length; j++) {
            var dj = dest[j];
            if (dj[field] == ai[field]) {
              dj.data.push(ai);
              break;
            }
          }
        }
      }
      return dest;
    },
    arrmovebit: function(arr, movedirection, movebit) { /**数组偏移*/
      var me = this;
      for (var i = 0; i < movebit; i++) {
        if (movedirection == "right") {
          arr.unshift(arr.pop())
        } else {
          arr.push(arr.shift())
        }
      }
      return arr;
    },
    arrunique: function(arr) { /*数组去重*/
      if (Array.hasOwnProperty('from')) {
        return Array.from(new Set(arr));
      } else if (Array.hasOwnProperty('some')) { // Array.hasOwnProperty('some') || Array.hasOwnProperty("indexOf")
        var tmp = [];
        for (var i in arr) {
          if (!(tmp.some(function(currentValue) { return currentValue == arr[i]; }))) {
            //if (tmp.indexOf(arr[i]) == -1) {
            tmp.push(arr[i]);
          }
        }
        return tmp;
      } else {
        var n = {},
          r = [];
        for (var i = 0; i < arr.length; i++) {
          if (!n[arr[i]]) {
            n[arr[i]] = true;
            r.push(arr[i]);
          }
        }
        return r;
      }
    },
    arrsort: function(srry, key, isasc) { /**通用单字段数组对象排序方法*/
      var me = this;
      srry.sort(function(a, b) {
        if (isasc == "asc") {
          if (typeof(a[key]) == "string" && typeof(b[key]) == "string") {
            return (a[key].toString()).localeCompare(b[key].toString());
          }
          return a[key] - b[key];
        } else {
          if (typeof(a[key]) == "string" && typeof(b[key]) == "string") {
            return (b[key].toString()).localeCompare(a[key].toString());
          }
          return b[key] - a[key];
        }
      })
      return srry;
    },
    muchfieldarrsort: function(sarr, keys) { /** sarr：原始数组。 keys:要排序的多个字段,必须为数组*/
      return sarr.sort(compare);

      function compare(a, b, c = keys[0], i = 0) { //按合并类型递归排序
        //var c = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : groupfieldarr[0];
        //var i = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;
        if (a[c] == b[c]) { //等于的话进行判断是否还有后续字段需要排序，没有则返回0；有则递归进行后续字段排序处理。
          if (i == (keys.length - 1)) { //没有后续字段
            i = 0;
            return 0;
          }
          i += 1;
          return compare(a, b, keys[i], i); //递归排序后续字段
        } else if (a[c] > b[c]) { //大于返回1
          return 1;
        } else { //小于返回-1
          return -1;
        }
      }
    },
    contains: function(arr, val) { /*判断一个元素是否在数组中*/
      tmp.some(function(currentValue) { return currentValue == arr[i]; })
      //return arr.indexOf(val) != -1 ? true : false;
    },
    getIndex: function(arr, obj) { //根据数据取得再数组中的索引
      // for (var i = 0; i < arr.length; i++) {
      //     if (obj == arr[i]) {
      //         return i;
      //     }
      // }
      // return -1;

      var i = 0;
      var bool = arr.some(function(currentValue, index) {
        i = index;
        return currentValue == obj
      })
      if (bool) return i;
      return -1;
    },
    remove: function(arr, ele) { //移除数组中的某元素
      // var index = arr.indexOf(ele);
      // if (index > -1) {
      //     arr.splice(index, 1);
      // }
      for (var i = 0; i < arr.length; i++) {
        if (ele == arr[i]) {
          arr.splice(i, 1);
          break;
        }
      }
      return arr;
    },
    each: function(arr, fn) { /*数组each方法*/
      /**
       * @param  {arr} 数组
       * @param  {fn} 回调函数
       * @return {undefined}
       */
      fn = fn || Function;
      var a = [];
      var args = Array.prototype.slice.call(arguments, 1);
      for (var i = 0; i < arr.length; i++) {
        var res = fn.apply(arr, [arr[i], i].concat(args));
        if (res != null) a.push(res);
      }
    },
    map: function(arr, fn, thisObj) { /*改造数组*/
      /**
       * @param  {arr} 数组
       * @param  {fn} 回调函数
       * @param  {thisObj} this指向
       * @return {Array} 
       */
      var scope = thisObj || window;
      var a = [];
      for (var i = 0, j = arr.length; i < j; ++i) {
        var res = fn.call(scope, arr[i], i, this);
        if (res != null) a.push(res);
      }
      return a;
    },
    sort: function(arr, type) { /*数组排序2*/
      /**
       * @param  {arr} 数组
       * @param  {type} 1：从小到大   2：从大到小   3：随机
       * @return {Array}
       */
      type = type || 1;
      return arr.sort((a, b) => {
        switch (type) {
          case 1:
            return a - b;
          case 2:
            return b - a;
          case 3:
            return Math.random() - 0.5;
          default:
            return arr;
        }
      })
    },
    union: function(a, b) { /*求两个集合的并集*/
      var newArr = a.concat(b);
      return this.unique(newArr);
    },
    intersect: function(a, b) { /*求两个集合的交集*/
      var _this = this;
      a = this.unique(a);
      return this.map(a, function(o) {
        return _this.contains(b, o) ? o : null;
      });
    },
    formArray: function(ary) { /*将类数组转换为数组的方法*/
      var arr = [];
      if (Array.isArray(ary)) {
        arr = ary;
      } else {
        arr = Array.prototype.sHlice.call(ary);
      };
      return arr;
    },
    max: function(arr) { /*最大值*/
      return Math.max.apply(null, arr);
    },
    min: function(arr) { /*最小值*/
      return Math.min.apply(null, arr);
    },
    sum: function(arr) { /*求和*/
      return arr.reduce((pre, cur) => {
        return pre + cur
      })
    },
    average: function(arr) { /*平均值*/
      return this.sum(arr) / arr.length
    },
    toArray: function(str, tag) { //将一个字符串用给定的tag字符分割成数组
      tag = tag || "";
      if (str.indexOf(tag) != -1) {
        return str.split(tag);
      } else {
        if (str != '') {
          return [str.toString()];
        } else {
          return [];
        }
      }
    },
  },
  StringFn: { //字符串处理函数
    trim: function(str, type) { /*去除空格 @param  {str} @param  {type} 1-所有空格  2-前后空格  3-前空格 4-后空格 @return {String}*/
      type = type || 1
      switch (type) {
        case 1:
          return str.replace(/\s+/g, "");
        case 2:
          return str.replace(/(^\s*)|(\s*$)/g, "");
        case 3:
          return str.replace(/(^\s*)/g, "");
        case 4:
          return str.replace(/(\s*$)/g, "");
        default:
          return str;
      }
    },
    interceptString: function(str, len) { //字符串截取后面加入...
      if (str.length > len) {
        return str.substring(0, len) + "...";
      } else {
        return str;
      }
    },
    toNumber: function(str) { //获取字符串中数字
      return str.replace(/\D/g, "");
    },
    toCN: function(str) { //保留中文  
      var regEx = /[^\u4e00-\u9fa5\uf900-\ufa2d]/g;
      return str.replace(regEx, '');
    },
    toInt: function(str) { //转成int
      var temp = str.replace(/\D/g, "");
      return isNaN(parseInt(temp)) ? str.toString() : parseInt(temp);
    },
    startsWith: function(str, tag) { //是否是以XX开头
      return str.substring(0, tag.length) == tag;
    },
    endWith: function(str, tag) { //是否已XX结尾
      return str.substring(str.length - tag.length) == tag;
    },
    replaceAll: function(str, from, to) { //替换全部 将str中的所有from替换为to
      return str.replace(new RegExp(from, "gm"), to);
    },
    changeCase: function(str, type) { /*type:  1:首字母大写  2：首字母小写  3：大小写转换  4：全部大写  5：全部小写  @return {String}*/
      type = type || 4
      switch (type) {
        case 1:
          return str.replace(/\b\w+\b/g, function(word) {
            return word.substring(0, 1).toUpperCase() + word.substring(1).toLowerCase();

          });
        case 2:
          return str.replace(/\b\w+\b/g, function(word) {
            return word.substring(0, 1).toLowerCase() + word.substring(1).toUpperCase();
          });
        case 3:
          return str.split('').map(function(word) {
            if (/[a-z]/.test(word)) {
              return word.toUpperCase();
            } else {
              return word.toLowerCase()
            }
          }).join('')
        case 4:
          return str.toUpperCase();
        case 5:
          return str.toLowerCase();
        default:
          return str;
      }
    },
    StringBuffer: function() { //字符串缓存
      var StringBufferarr = function() {
        this._strs = new Array;
      };
      StringBufferarr.prototype.append = function(str) {
        this._strs.push(str);
      };
      StringBufferarr.prototype.toString = function() {
        return this._strs.join("");
      };
      return new StringBufferarr();
    },
    filterTag: function(str) { /*过滤html代码(把<>转换字符串)*/
      var me = this;
      str = me.replaceAll(str, /&/ig, "&amp;");
      str = me.replaceAll(str, /</ig, "&lt;");
      str = me.replaceAll(str, />/ig, "&gt;");
      str = me.replaceAll(str, " ", "&nbsp;");
      return str;
    }
  },
  QueryDataFn: { //QueryData ajax axios请求
    ajax: function(setting) { //仿JQuery ajax请求
      /*
      let url = 'http://demo.com/api'
      例: 
      initUtil.QueryDataFn.ajax({
          url: url,
          success: function(data) {

          }
      })
      */
      //设置参数的初始值
      var opts = {
        method: (setting.method || "GET").toUpperCase(), //请求方式
        url: setting.url || "", // 请求地址
        async: setting.async || true, // 是否异步
        dataType: setting.dataType || "json", // 解析方式
        data: setting.data || "", // 参数
        success: setting.success || function() {}, // 请求成功回调
        error: setting.error || function() {} // 请求失败回调
      }
      // 参数格式化
      function params_format(obj) {
        var str = ''
        for (var i in obj) {
          str += i + '=' + obj[i] + '&'
        }
        return str.split('').slice(0, -1).join('')
      }
      // 创建ajax对象
      var xhr = new XMLHttpRequest();
      // 连接服务器open(方法GET/POST，请求地址， 异步传输)
      if (opts.method == 'GET') {
        xhr.open(opts.method, opts.url + "?" + params_format(opts.data), opts.async);
        xhr.send();
      } else {
        xhr.open(opts.method, opts.url, opts.async);
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        xhr.send(opts.data);
      }
      /*
       ** 每当readyState改变时，就会触发onreadystatechange事件
       ** readyState属性存储有XMLHttpRequest的状态信息
       ** 0 ：请求未初始化
       ** 1 ：服务器连接已建立
       ** 2 ：请求已接受
       ** 3 : 请求处理中
       ** 4 ：请求已完成，且相应就绪
       */
      xhr.onreadystatechange = function() {
        if (xhr.readyState === 4 && (xhr.status === 200 || xhr.status === 304)) {
          switch (opts.dataType) {
            case "json":
              var json = JSON.parse(xhr.responseText);
              opts.success(json);
              break;
            case "xml":
              opts.success(xhr.responseXML);
              break;
            default:
              opts.success(xhr.responseText);
              break;
          }
        }
      }
      xhr.onerror = function(err) {
        opts.error(err);
      }
    },
    axios: function(url, setting = {}) { //仿axios请求
      /*
      let url = 'http://demo.com/api'
      例: 
          axios(url).
              then( res => {
                  console.log(res)
              }).catch( e => {
                  console.log(e)
              })
          axios(url, {
              method: 'POST',
          })
      */
      //设置参数的初始值
      let opts = {
        method: (setting.method || 'GET').toUpperCase(), //请求方式
        headers: setting.headers || {}, // 请求头设置
        credentials: setting.credentials || true, // 设置cookie是否一起发送
        body: setting.body || {},
        mode: setting.mode || 'cors', // 可以设置 cors, no-cors, same-origin
        redirect: setting.redirect || 'follow', // follow, error, manual
        cache: setting.cache || 'default' // 设置 cache 模式 (default, reload, no-cache)
      }
      let dataType = setting.dataType || "json", // 解析方式  
        data = setting.data || "" // 参数
      // 参数格式化
      function params_format(obj) {
        var str = ''
        for (var i in obj) {
          str += `${i}=${obj[i]}&`
        }
        return str.split('').slice(0, -1).join('')
      }

      if (opts.method === 'GET') {
        url = url + (data ? `?${params_format(data)}` : '')
      } else {
        setting.body = data || {}
      }
      return new Promise((resolve, reject) => {
        fetch(url, opts).then(async res => {
          let data = dataType === 'text' ? await res.text() :
            dataType === 'blob' ? await res.blob() : await res.json()
          resolve(data)
        }).catch(e => {
          reject(e)
        })
      })
    }
  },
  DomFn: { //操作dom方法
    $: function(selector) { /*仿JQuery$选择器*/
      var type = selector.substring(0, 1);
      if (type === '#') {
        if (document.querySelecotor) return document.querySelector(selector)
        return document.getElementById(selector.substring(1))

      } else if (type === '.') {
        if (document.querySelecotorAll) return document.querySelectorAll(selector)
        return document.getElementsByClassName(selector.substring(1))
      } else {
        return document['querySelectorAll' ? 'querySelectorAll' : 'getElementsByTagName'](selector)
      }
    },
    hasClass: function(ele, name) { /*检测类名*/
      return ele.className.match(new RegExp('(\\s|^)' + name + '(\\s|$)'));
    },
    addClass: function(ele, name) { /*添加类名*/
      if (!this.hasClass(ele, name)) ele.className += " " + name;
    },
    removeClass: function(ele, name) { /*删除类名*/
      if (this.hasClass(ele, name)) {
        var reg = new RegExp('(\\s|^)' + name + '(\\s|$)');
        ele.className = ele.className.replace(reg, '');
      }
    },
    replaceClass: function(ele, newName, oldName) { /*替换类名*/
      this.removeClass(ele, oldName);
      this.addClass(ele, newName);
    },
    siblings: function(ele) { /*获取兄弟节点*/
      var chid = ele.parentNode.children,
        eleMatch = [];
      for (var i = 0, len = chid.length; i < len; i++) {
        if (chid[i] != ele) {
          eleMatch.push(chid[i]);
        }
      }
      return eleMatch;
    },
    getByStyle: function(obj, name) { /*获取行间样式属性*/
      if (obj.currentStyle) {
        return obj.currentStyle[name];
      } else {
        return getComputedStyle(obj, false)[name];
      }
    }
  },
  StorageFn: { //浏览器缓存操作
    ls: window.localStorage,
    ss: window.sessionStorage,
    /*-----------------cookie---------------------*/
    setCookie: function(name, value, day) { /*设置cookie*/
      var setting = arguments[0];
      if (Object.prototype.toString.call(setting).slice(8, -1) === 'Object') {
        for (var i in setting) {
          var oDate = new Date();
          oDate.setDate(oDate.getDate() + day);
          document.cookie = i + '=' + setting[i] + ';expires=' + oDate;
        }
      } else {
        var oDate = new Date();
        oDate.setDate(oDate.getDate() + day);
        document.cookie = name + '=' + value + ';expires=' + oDate;
      }
    },
    getCookie: function(name) { /*获取cookie*/
      var arr = document.cookie.split('; ');
      for (var i = 0; i < arr.length; i++) {
        var arr2 = arr[i].split('=');
        if (arr2[0] == name) {
          return arr2[1];
        }
      }
      return '';
    },
    removeCookie: function(name) { /*删除cookie*/
      this.setCookie(name, 1, -1);
    },
    /*-----------------localStorage---------------------*/
    setLocal: function(key, val) { /*设置localStorage*/
      var setting = arguments[0];
      if (Object.prototype.toString.call(setting).slice(8, -1) === 'Object') {
        for (var i in setting) {
          this.ls.setItem(i, JSON.stringify(setting[i]))
        }
      } else {
        this.ls.setItem(key, JSON.stringify(val))
      }
    },
    getLocal: function(key) { /*获取localStorage*/
      if (key) return JSON.parse(this.ls.getItem(key))
      return null;
    },
    removeLocal: function(key) { /*移除localStorage*/
      this.ls.removeItem(key)
    },
    clearLocal: function() { /*移除所有localStorage*/
      this.ls.clear()
    },
    /*-----------------sessionStorage---------------------*/
    setSession: function(key, val) { /*设置sessionStorage*/
      var setting = arguments[0];
      if (Object.prototype.toString.call(setting).slice(8, -1) === 'Object') {
        for (var i in setting) {
          this.ss.setItem(i, JSON.stringify(setting[i]))
        }
      } else {
        this.ss.setItem(key, JSON.stringify(val))
      }
    },
    getSession: function(key) { /*获取sessionStorage*/
      if (key) return JSON.parse(this.ss.getItem(key))
      return null;
    },
    removeSession: function(key) { /*移除sessionStorage*/
      this.ss.removeItem(key)
    },
    clearSession: function() { /*移除所有sessionStorage*/
      this.ss.clear()
    }
  },
  loadFn: { //加载函数
    loadImg: function(arr, callback) { /*图片加载*/
      var arrImg = [];
      for (var i = 0; i < arr.length; i++) {
        var img = new Image();
        img.src = arr[i];
        img.onload = function() {
          arrImg.push(this);
          if (arrImg.length == arr.length) {
            callback && callback();
          }
        }
      }
    },
    loadAudio: function(src, callback) { /*音频加载*/
      var audio = new Audio(src);
      audio.onloadedmetadata = callback;
      audio.src = src;
    },
    loadScript: function(url, callback) { /**动态添加js*/
      var script = document.createElement("script");
      script.type = "text/javascript";
      if (typeof(callback) != "undefined") {
        if (script.readyState) {
          script.onreadystatechange = function() {
            if (script.readyState == "loaded" || script.readyState == "complete") {
              script.onreadystatechange = null;
              callback();
            }
          };
        } else {
          script.onload = function() {
            callback();
          };
        }
      };
      script.src = url;
      document.body.appendChild(script);
    },
    loadJSCDN: function(scripts, styles) { /**动态在head添加js和style*/
      var head = document.head || document.getElementsByTagName('head')[0];
      for (var i in scripts) {
        var script = document.createElement('script');
        script.setAttribute("src", i);
        head.appendChild(script);
      }
      for (var j in styles) {
        var style = document.createElement('link');
        style.setAttribute("href", j);
        head.appendChild(style);
      }
    },
  },
  colorFn: { //颜色处理函数
    getRandomColor: function() { /*获取十六进制随机颜色*/
      return '#' + (function(h) {
        return new Array(7 - h.length).join("0") + h;
      })((Math.random() * 0x1000000 << 0).toString(16));
      //return '#'+('00000'+Math.random()*0x1000000<<0).toString(16).slice(-6)
    },
    generateRandomColor: function() { /*生成随机颜色:rgb(r,g,b)*/
      var r = Math.floor(Math.random() * 256);
      var g = Math.floor(Math.random() * 256);
      var b = Math.floor(Math.random() * 256);
      return 'rgb(' + r + ',' + g + ',' + b + ')';
    },
    hsbTorgb: function(hsb) { /*hsb转化为rgb*/
      var rgb = {};
      var h = Math.round(hsb.h);
      var s = Math.round(hsb.s * 255 / 100);
      var v = Math.round(hsb.b * 255 / 100);
      if (s === 0) {
        rgb.r = rgb.g = rgb.b = v;
      } else {
        var t1 = v;
        var t2 = (255 - s) * v / 255;
        var t3 = (t1 - t2) * (h % 60) / 60;
        if (h === 360) h = 0;
        if (h < 60) {
          rgb.r = t1;
          rgb.b = t2;
          rgb.g = t2 + t3;
        } else if (h < 120) {
          rgb.g = t1;
          rgb.b = t2;
          rgb.r = t1 - t3;
        } else if (h < 180) {
          rgb.g = t1;
          rgb.r = t2;
          rgb.b = t2 + t3;
        } else if (h < 240) {
          rgb.b = t1;
          rgb.r = t2;
          rgb.g = t1 - t3;
        } else if (h < 300) {
          rgb.b = t1;
          rgb.g = t2;
          rgb.r = t2 + t3;
        } else if (h < 360) {
          rgb.r = t1;
          rgb.g = t2;
          rgb.b = t1 - t3;
        } else {
          rgb.r = 0;
          rgb.g = 0;
          rgb.b = 0;
        }
      }
      return {
        r: Math.round(rgb.r),
        g: Math.round(rgb.g),
        b: Math.round(rgb.b)
      };
    },
    rgbTohsb: function(rgb) { /*rgb转化为hsb*/
      var hsb = { h: 0, s: 0, b: 0 };
      var min = Math.min(rgb.r, rgb.g, rgb.b);
      var max = Math.max(rgb.r, rgb.g, rgb.b);
      var delta = max - min;
      hsb.b = max;
      hsb.s = max !== 0 ? 255 * delta / max : 0;
      if (hsb.s !== 0) {
        if (rgb.r === max) {
          hsb.h = (rgb.g - rgb.b) / delta;
        } else if (rgb.g === max) {
          hsb.h = 2 + (rgb.b - rgb.r) / delta;
        } else {
          hsb.h = 4 + (rgb.r - rgb.g) / delta;
        }
      } else {
        hsb.h = -1;
      }
      hsb.h *= 60;
      if (hsb.h < 0) {
        hsb.h += 360;
      }
      hsb.s *= 100 / 255;
      hsb.b *= 100 / 255;
      return hsb;
    },
    hexToRGB: function(hex) { /*hex value to RGB 形如#00000（#000）转化为 rgb(0,0,0)*/
      if (hex[0] == "#") { hex = hex.slice(1, hex.length); }
      strips = hex.length == 3 ? [hex.slice(0, 1), hex.slice(1, 2), hex.slice(2, 3)] : [hex.slice(0, 2), hex.slice(2, 4), hex.slice(4, 6)]; // Cut up into 2-digit
      strips = strips.map(function(x) { return parseInt(x, 16); }); // To RGB
      return 'rgb(' + strips.join(",") + ')';
    },
    rgbToHex: function(rgb) { /*RGB to hex value 形如rgb(0,0,0)转化为 #00000（#000)*/
      rgb = rgb.substr(4, rgb.length - 4);
      rgb = rgb.split(",");
      var hexvals = rgb.map(function(x) { return Math.round(x).toString(16); });
      // Add leading 0s to make a valid 6 digit hex
      hexvals = hexvals.map(function(x) {
        return x.length == 1 ? "0" + x : x;
      });
      return "#" + hexvals.join("");
    },
    getCodeFromColor: function(color) { /*获取颜色的数值,返回[r,g,b]*/
      var me = this;
      var code = [];
      if (!color)
        return code;
      if (color[0] == "#") {
        color = color.slice(1, color.length);
        code = color.length == 3 ? [color.slice(0, 1), color.slice(1, 2), color.slice(2, 3)] : [color.slice(0, 2), color.slice(2, 4), color.slice(4, 6)]; // Cut up into 2-digit
        code = code.map(function(x) { return parseInt(x, 16); })
      } else if (color.slice(0, 3).toLowerCase() == "rgb") {
        code = color.slice(5, color.length - 1).split(",");
      } else if (color.slice(0, 4).toLowerCase() == "rgba") {
        code = color.slice(6, color.length - 1).split(",");
      }
      code = code.map(function(x) {
        return new String(x).trim();
      })
      return code;
    },
    colorToRGBA: function(color, opacity) { /*返回rgba(r,g,b,a)*/
      me = this;
      if (!color)
        return color;
      var code = me.getCodeFromColor(color);
      if (code.length == 0)
        return color;
      return "rgba(" + code[0] + "," + code[1] + "," + code[2] + "," + (opacity || 1) + ")";
    },
    colorToHex: function(color) { /*color to hex*/
      var me = this;
      if (!color)
        return color;
      var code = me.getCodeFromColor(color);
      if (code.length == 0)
        return color;
      if (code.length == 4)
        code.pop();
      var hexvals = code.map(function(x) { return Math.round(x).toString(16); });
      // Add leading 0s to make a valid 6 digit hex
      hexvals = hexvals.map(function(x) {
        return x.length == 1 ? "0" + x : x;
      });
      return "#" + hexvals.join("");
    },
    lightenHex: function(hex, percent) { /*将给定的hex调亮percent(%数值)*/
      var me = this;
      if (hex[0] == "#") {
        hex = hex.slice(1, hex.length);
      }
      strips = hex.length == 3 ? [hex.slice(0, 1), hex.slice(1, 2), hex.slice(2, 3)] : [hex.slice(0, 2), hex.slice(2, 4), hex.slice(4, 6)];
      var rgb = strips.map(function(x) { return parseInt(x, 16); });
      if (percent > 100) percent = 100; // Limit to 100%
      var newRgb = rgb.map(function(x) {
        return x + percent / 100.0 * (255 - x); // This works because math.
      });
      var hexvals = newRgb.map(function(x) { return Math.round(x).toString(16); });
      hexvals = hexvals.map(function(x) {
        return x.length == 1 ? "0" + x : x;
      });
      return "#" + hexvals.join("");
    },
    reduceColor: function(hex, n) { /*颜色淡化为原来的n分之一*/
      var me = this;
      if (hex[0] == "#") {
        hex = hex.slice(1, hex.length);
      }
      strips = hex.length == 3 ? [hex.slice(0, 1), hex.slice(1, 2), hex.slice(2, 3)] : [hex.slice(0, 2), hex.slice(2, 4), hex.slice(4, 6)];
      var arr = strips.map(function(x) { return (parseInt(x, 16) / n).toString(16).split(".")[0]; });
      return "#" + arr.join("");
    },
  },
  sourceDataFn: { //插件数据源
    menology: { //日历或日期选择插件数据来源
      getYeardata: function(year, month) { //获取year month 渲染dom所有数据
        month = parseInt(month);
        var me = this;
        if (!year || year.toString().length != 4) {
          var now = new Date();
          year = now.getFullYear()
        }
        if (!month) {
          var now = new Date();
          month = now.getMonth() + 1()
        }
        return me.getMonthData(year, month, me.getMonthHaveDays(year, month));
      },
      getDayWeekCn(index) { //获取星期几
        var me = this;
        var weekDay = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"];
        return weekDay[index];
      },
      getMonthData(year, month, days) { //获取year month 渲染dom数据
        var me = this;
        var monthobj = {
          year: year,
          month: month,
          days: days,
          monthdata: [],
          monthalldata: [],
          firstdayweek: me.getDayWeek(new Date(year.toString() + '-' + month + '-' + 1)),
          firstdayweekcn: me.getDayWeekCn(me.getDayWeek(new Date(year.toString() + '-' + month + '-' + 1)))
        };
        for (var i = 1; i <= days; i++) {
          monthobj.monthdata.push(me.getDayData(year, month, i))
        } //获取year month 月数据
        monthobj.monthalldata = me.getMonthAllData(year, month, JSON.parse(JSON.stringify(monthobj.monthdata)));
        return monthobj;
      },
      getMonthAllData(year, month, monthdata) { //获取year month 渲染dom 所有数据，5*7 35或5*8格数据
        var me = this;
        var count = 35;
        if (monthdata[0].week == 0) { //本月1号为周日，补充下月数据，凑够5*7 35格数据
          var curlength = monthdata.length;
          for (var i = 0; i < count - curlength; i++) {
            monthdata.push({
              year: year,
              month: month + 1,
              day: i,
              weekcn: me.getDayWeekCn(me.getDayWeek(new Date(year.toString() + '-' + (+month + 1) + '-' + i))),
              week: me.getDayWeek(new Date(year.toString() + '-' + (+month + 1) + '-' + i)),
            })
          }
        } else {
          //本月1号为周日，补充上月和下月数据，凑够5*7 35格数据
          var prevmonthdays = me.getMonthHaveDays(year, month - 1);
          var firstweek = monthdata[0].week;
          for (i = prevmonthdays; i > prevmonthdays - firstweek; i--) {
            monthdata.unshift({
              year: year,
              month: month - 1,
              day: i,
              weekcn: me.getDayWeekCn(me.getDayWeek(new Date(year.toString() + '-' + (month - 1) + '-' + i))),
              week: me.getDayWeek(new Date(year.toString() + '-' + (month - 1) + '-' + i)),
            })
          }
          if (monthdata.length > 35) {
            count = 42;
          }
          var curandprevdays = monthdata.length;
          for (var j = 1; j <= count - curandprevdays; j++) {
            monthdata.push({
              year: year,
              month: month + 1,
              day: j,
              weekcn: me.getDayWeekCn(me.getDayWeek(new Date(year.toString() + '-' + (+month + 1) + '-' + j))),
              week: me.getDayWeek(new Date(year.toString() + '-' + (+month + 1) + '-' + j)),
            })
          }
        }
        return monthdata;
      },
      getDayData: function(year, month, day) { //获取某天数据
        var me = this;
        var daydata = {
          year: year,
          month: month,
          day: day,
          weekcn: me.getDayWeekCn(me.getDayWeek(new Date(year.toString() + '-' + month + '-' + day))),
          week: me.getDayWeek(new Date(year.toString() + '-' + month + '-' + day)),
        };
        return daydata;
      },
      getMonthHaveDays(year, month) { //获取某月有多少天
        var me = this;
        var yearmonthdays = [31, me.isLeapYear(year) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
        return yearmonthdays[+month - 1];
      },
      getDayWeek: function(date) { //获取某一天是星期几 data:new Date("2015-7-12")
        // var me = this;
        //var week;
        // switch (date.getDay()) {
        //     case 0:
        //         week = 0;
        //         break;
        //     case 1:
        //         week = 1;
        //         break;
        //     case 2:
        //         week = 2;
        //         break;
        //     case 3:
        //         week = 3;
        //         break;
        //     case 4:
        //         week = 4;
        //         break;
        //     case 5:
        //         week = 5;
        //         break;
        //     case 6:
        //         week = 6;
        //         break;
        // }
        //return week;

        return date.getDay()
      },
      isLeapYear: function(year) { //是否为闰年
        var me = this;
        var cond1 = year % 4 == 0; //条件1：年份必须要能被4整除
        var cond2 = year % 100 != 0; //条件2：年份不能是整百数
        var cond3 = year % 400 == 0; //条件3：年份是400的倍数
        //当条件1和条件2同时成立时，就肯定是闰年，所以条件1和条件2之间为“与”的关系。
        //如果条件1和条件2不能同时成立，但如果条件3能成立，则仍然是闰年。所以条件3与前2项为“或”的关系。
        //所以得出判断闰年的表达式：
        var cond = cond1 && cond2 || cond3;
        if (cond) {
          return true;
        } else {
          return false;
        }
      }
    },
  },
  plugin: { //pengin插件
    mutilSelectStatus: false,
    crumsarr: [],
    scrollnum: function(id, n, bitn, step) { //数字滚动函数 id:容器，n:数字,bitn：显示位数，step：背景图Y偏移值
      var realsum = String(n);
      n = (function(digit, num) { //num位数不够digit位前面添加0
        var str = num.toString();
        var len = str.length;
        var arr = str.split('');
        var zeroNum = digit - len;
        for (var i = 0; i < zeroNum; i++) {
          arr.unshift("0");
        }
        return arr.join('')
      })(bitn, realsum);
      var it = $(id + " i");
      var len = n.length;
      for (var i = 0; i < len; i++) {
        if (it.length <= i && i != len) {
          $(id).append("<i></i>");
        }
        var num = n.charAt(i);
        //根据数字图片的高度设置相应的值
        var y = -parseInt(num) * step;
        var obj = $(id + " i").eq(i);
        var pos = String(y) + 'rem';
        obj.animate({
          backgroundPositionY: pos
        }, 'slow', 'swing', function() {});
      }
      // <div class="fn-inline sj sjday" id="days">div>
      //  i {
      //     width: 1.975rem;
      //     height: 2.575rem;
      //     margin: 0 -0.125rem;
      //     vertical-align: bottom;
      //     display: inline-block;
      //     background: url(../img/zzimg/countimg.png) no-repeat;
      //     background-size: 100% auto;
      //     background-position: 0 0;
      // }
      //调用 initUtil.plugin.scrollnum(".sjday",initUtil.dateFn.datedifference("2019-12-31",initUtil.dateFn.CurentTime().substr(0,10)).toString(), 3,'2.59rem');
    },
    comparimg: function(dragpictool, piccompar, toppic, topminwidth) { //图片比对
      topminwidth = topminwidth || 5;
      var active = false,
        point = {},
        downx = 0,
        downy = 0,
        mouseX2 = 0,
        mouseY2 = 0,
        topwidth = '50%',
        outwidth = document.querySelector(piccompar).offsetWidth;

      var scrollerTop = document.querySelector(dragpictool);

      scrollerTop.addEventListener('mousedown', function(e) {
        active = true;
        downx = event.clientX;
        downy = event.clientY;
        mouseX2 = event.clientX;
        mouseY2 = event.clientY;
        topwidth = document.querySelector(toppic).offsetWidth;
      });

      document.body.addEventListener('mouseleave', function() {
        active = false;
        document.body.style.cursor = "auto";
        point = {};
        downx = 0;
        downy = 0;
        mouseX2 = 0;
        mouseY2 = 0;
      });
      document.body.addEventListener('mouseup', function() {
        active = false;
        document.body.style.cursor = "auto";
        point = {};
        downx = 0;
        downy = 0;
        mouseX2 = 0;
        mouseY2 = 0;
      });

      document.body.addEventListener('mousemove', function(e) {
        mouseX2 = event.clientX;
        mouseY2 = event.clientY;
        if (active) {
          document.body.style.cursor = "move";
          scrollIt(e);
        }
      });

      function scrollIt(e) {
        let transformx = mouseX2 - downx;
        if (transformx + topwidth < outwidth && transformx + topwidth > topminwidth) {
          document.querySelector(toppic).style.width = (transformx + topwidth) + 'px'
        }
      }
      //dom结构记样式
      /*<div class="piccompar fn-inline" id="DoubleViewer">
          <div class="bottompic fn-inline">
              <img src="dist/img/comparimg/yt.jpeg"></img>
          </div>
          <div class="toppic fn-inline">
              <div class="dragpic-tool">
                  <div class="dragpic-tool-con h">
                      <span>治 理 后</span>
                      <i></i>
                  </div>
                  <div class="dragpic-tool-con q">
                      <span>治 理 前</span>
                      <i></i>
                  </div>
              </div>
              <img src="dist/img/comparimg/st.jpeg"></img>
          </div>
      </div>
      .piccompar {
          position: relative;
          width: 13.05rem;
          height: 4.425rem;

          img {
              width: 13.05rem;
              height: 4.425rem;
          }

          .toppic {

              position: absolute;
              overflow: hidden;
              left: 0;
              top: 0;
              width: 50%;
              min-width: 0.05rem;
              height: 4.425rem;
          }

          .bottompic {
              width: 100%;
          }

          .dragpic-tool {
              position: absolute;
              right: 0;
              height: 4.425rem;
              width: 0.05rem;
              background: #00ffff;
          }

          .dragpic-tool-con {
              padding: 0.25rem 0;
              height: 2.25rem;
              width: 0.575rem;
              background: url(../img/zsimg/stxfzltk.png) no-repeat;
              background-size: 100% 100%;
              text-align: center;
              position: absolute;
              right: 0.025rem;
              top: 0.85rem;

              span {
                  display: block;
                  color: #00ffff;
                  font-size: 0.35rem;
                  line-height: 0.5rem;
              }

              i {
                  margin: 0.25rem auto;
                  display: block;
                  height: 0.425rem;
                  width: 0.3rem;
                  background: url(../img/zsimg/stxfzlzsjt.png) no-repeat;
                  background-size: 100% 100%;
              }
          }

          .dragpic-tool-con.q {
              display: none;
              position: absolute;
              right: -0.5rem;
              top: 0.85rem;
              background: url(../img/zsimg/stxfzltkr.png) no-repeat;
              background-size: 100% 100%;
              i {
                  background: url(../img/zsimg/stxfzlysjt.png) no-repeat;
                  background-size: 100% 100%;
              }
          }
      }*/
      // 调用 initUtil.comparimg('.dragpic-tool', '.piccompar', '.toppic', 5);
    },
    setIframeHeight: function(id) { /*自动设置iframe 高度*/
      iframe = document.getElementById(id)
      if (iframe) {
        var iframeWin = iframe.contentWindow || iframe.contentDocument.parentWindow;
        if (iframeWin.document.body) {
          iframe.height = iframeWin.document.documentElement.scrollHeight || iframeWin.document.body.scrollHeight;
        }
      }
    },
    filter: function(inputid, droplistparent, dropele) { /*下拉搜索过滤，*/
      /** inputid:输入框id
       * droplistparent:下拉列表父级标签
       * dropele：过滤的list元素名
       * */
      var filter, a, i, div;
      document.getElementById(inputid).addEventListener('input', function(e) {
        filter = document.getElementById(inputid).value.toUpperCase();
        div = document.getElementById(droplistparent);
        a = div.getElementsByTagName(dropele);
        for (i = 0; i < a.length; i++) {
          if (a[i].innerHTML.toUpperCase().indexOf(filter) > -1) {
            a[i].style.display = "";
          } else {
            a[i].style.display = "none";
          }
        }
      })
    },
    filtertype2: function(inputid, droplistparent, dropele, s) { /*下拉搜索过滤，*/
      /** inputid:输入框id
       * droplistparent:下拉列表父级标签
       * dropele：过滤的list元素名
       * */
      var filter, a, i, div;
      document.getElementById(inputid).addEventListener('input', function(e) {
        filter = document.getElementById(inputid).value.toUpperCase();
        div = document.getElementById(droplistparent);
        a = div.getElementsByTagName(dropele);
        for (i = 0; i < a.length; i++) {
          if (a[i].getElementsByTagName(s).innerHTML.toUpperCase().indexOf(filter) > -1) {
            a[i].style.display = "";
          } else {
            a[i].style.display = "none";
          }
        }
      })
    },
    contextBoxSelect: function(boxSelctCallback) { /*右键拖动框选 返回相对于body左上方的坐标对象{pointer1:{x:left,y:top},pointer2:{x:right,y:bottom}}*/
      var me = this;
      //是否需要(允许)处理鼠标的移动事件,默认识不处理
      var select = false;
      // 记录鼠标按下时的坐标
      var downX = 0;
      var downY = 0;
      // 记录鼠标抬起时候的坐标
      var mouseX2 = downX;
      var mouseY2 = downY;
      var idVal = "rect_select_1";

      function createRect() {
        var rect = document.createElement("div");
        // 设置默认值,目的是隐藏图层
        rect.id = idVal;
        rect.className = 'rect';
        rect.style.width = 0;
        rect.style.background = 'rgba(255,255,255,0.5)';
        rect.style.height = 0;
        rect.style.visibility = 'hidden';
        //让你要画的图层位于最上层
        rect.style.zIndex = 1500;
        rect.style.position = "absolute";
        document.body.appendChild(rect);
      }

      function getSelectRect() {
        var rect = document.getElementById(idVal);
        if (!rect) {
          createRect();
          rect = document.getElementById(idVal);
        }
        return rect;
      }
      //处理鼠标按下事件
      function mouse_down(event) {
        if (event.shiftKey != true && me.mutilSelectStatus == false)
          return;
        var rect = getSelectRect();
        // 鼠标按下时才允许处理鼠标的移动事件
        select = true;
        //让你要画框的那个图层显示出来
        //rect.style.visibility = 'visible';
        // 取得鼠标按下时的坐标位置
        downX = event.clientX;
        downY = event.clientY;

        //设置你要画的矩形框的起点位置
        rect.style.left = downX;
        rect.style.top = downY;
      }
      //鼠标抬起事件
      function mouse_up(event) {
        if (select != true)
          return;
        var rect = getSelectRect();
        //鼠标抬起,就不允许在处理鼠标移动事件
        select = false;
        //隐藏图层
        rect.style.visibility = 'hidden';
        //根据框选区域获取选择的节点
        var left = getIntNumber(rect.style.left);
        var top = getIntNumber(rect.style.top);
        var right = left + getIntNumber(rect.style.width);
        var bottom = top + getIntNumber(rect.style.height);
        var boxpointerobj = {
          pointer1: {
            x: left,
            y: top
          },
          pointer2: {
            x: right,
            y: bottom
          }
        }
        if (boxSelctCallback) {
          boxSelctCallback(boxpointerobj);
        } else {
          console.log("框选区域基于body的坐标为 左上角：(" + left + "," + top + "); 右下角：(" + right + "," + bottom + ")");
        }
      }

      function getIntNumber(val) {
        return parseInt(val.split("px")[0]);
      }
      //鼠标移动事件,最主要的事件
      function mouse_move(event) {
        if (select != true)
          return;
        var rect = getSelectRect();
        // 取得鼠标移动时的坐标位置
        mouseX2 = event.clientX;
        mouseY2 = event.clientY;
        // 设置拉框的大小
        rect.style.width = Math.abs(mouseX2 - downX) + "px";
        rect.style.height = Math.abs(mouseY2 - downY) + "px";
        /*
         * 这个部分,根据你鼠标按下的位置,和你拉框时鼠标松开的位置关系,可以把区域分为四个部分,根据四个部分的不同,
         * 我们可以分别来画框,否则的话,就只能向一个方向画框,也就是点的右下方画框.
         */
        rect.style.visibility = 'visible';
        // A part
        if (mouseX2 < downX && mouseY2 < downY) {
          rect.style.left = mouseX2 + "px";
          rect.style.top = mouseY2 + "px";
        }
        // B part
        if (mouseX2 > downX && mouseY2 < downY) {
          rect.style.left = downX + "px";
          rect.style.top = mouseY2 + "px";
        }
        // C part
        if (mouseX2 < downX && mouseY2 > downY) {
          rect.style.left = mouseX2 + "px";
          rect.style.top = downY + "px";
        }
        // D part
        if (mouseX2 > downX && mouseY2 > downY) {
          rect.style.left = downX + "px";
          rect.style.top = downY + "px";
        }
        /*
         * 终止事件冒泡，阻止拖动画布事件触发
         */
        window.event.cancelBubble = true;
        window.event.returnValue = false;
      }
      //按下shift，鼠标多选功能事件注;
      $(document).mousedown(mouse_down);
      $(document).mouseup(mouse_up);
      $(document).mousemove(mouse_move);
    },
  },
  highplugin: { //高级插件
    DataBing: function(dataoptions) { /*仿vue双向数据绑定，数据驱动*/
      var iswatch = false; //页面初始加载不执行监听
      function DataBinginit(options) { /*option:主调用函数传回来的参数对象*/
        var self = this;
        this.data = options.data; /*data对象集合*/
        this.methods = options.methods; /*methods:方法集合*/
        this.watchs = options.watchs; /*watchs:监听对象集合*/
        Object.keys(this.data).forEach(function(key) { /*遍历每一个属性*/
          self.proxyKeys(key); /*创建访问或修改data中的每一个属性的服务*/
        });
        observe(this.data); /*创建记录数据变化的服务*/
        new Compile(options.el, this); //模板编译
        iswatch = true;
        options.mounted.call(this); // 所有事情处理好后执行mounted函数
      }
      DataBinginit.prototype = {
        proxyKeys: function(key) {
          var self = this;
          //Object.defineProperty(obj, prop, descriptor)
          //obj: 需要被操作的目标对象
          //prop: 目标对象需要定义或修改的属性的名称
          //descriptor: 将被定义或修改的属性的描述符
          Object.defineProperty(this, key, {
            enumerable: false, //表示该属性是否可枚举，即是否通过for-in循环或Object.keys()返回属性，如果直接使用字面量定义对象，默认值为true
            configurable: true, //表示能否通过delete删除此属性，能否修改属性的特性，或能否修改把属性修改为访问器属性，如果直接使用字面量定义对象，默认值为true delete:
            /*Writable:false,*/ //当writable为false(并且configrubale为true),[[value]]可以通过defineeProperty修改, 但不能直接赋值修改
            get: function getter() { //一个给属性提供 getter 的方法(访问对象属性时调用的函数,返回值就是当前属性的值)，如果没有 getter 则为 undefined。该方法返回值被用作属性值。默认为 undefined
              return self.data[key];
            },
            set: function setter(newVal) { //一个给属性提供 setter 的方法(给对象属性设置值时调用的函数)，如果没有 setter 则为 undefined。该方法将接受唯一参数，并将该参数的新值分配给该属性。默认为 undefined
              self.data[key] = newVal;
            }
          });
        }
      }

      function Observer(data) {
        this.data = data; /*data*/
        this.walk(data);
      }
      Observer.prototype = {
        walk: function(data) {
          var self = this;
          Object.keys(data).forEach(function(key) {
            self.defineReactive(data, key, data[key]); //访问或修改data中的每一个属性
          });
        },
        defineReactive: function(data, key, val) {
          var dep = new Dep();
          var childObj = observe(val);
          Object.defineProperty(data, key, {
            enumerable: true,
            configurable: true,
            get: function getter() { //缓存实体，new出来的 dep数组用来保存数据
              if (Dep.target) {
                dep.addSub(Dep.target);
              }
              return val;
            },
            set: function setter(newVal) { /*更新缓存里的值(重新获取)*/
              if (newVal === val) {
                return;
              }
              val = newVal;
              dep.notify();
            }
          });
        }
      };

      function observe(value, vm) {
        if (!value || typeof value !== 'object') {
          return;
        }
        return new Observer(value);
      };

      function Dep() {
        this.subs = [];
      }
      Dep.prototype = {
        addSub: function(sub) {
          this.subs.push(sub); /*缓存*/
        },
        notify: function() {
          this.subs.forEach(function(sub) {
            sub.update(); /*缓存更新*/
          });
        }
      };
      /*编译展现*/
      function Compile(el, vm) {
        this.vm = vm;
        this.el = document.querySelector(el); /*当前模板dom对象*/
        this.fragment = null;
        this.init();
      }
      Compile.prototype = {
        init: function() {
          if (this.el) {
            this.fragment = this.nodeToFragment(this.el); //创建虚拟dom
            this.compileElement(this.fragment);
            this.el.appendChild(this.fragment);
          } else {
            console.log('Dom元素不存在');
          }
        },
        nodeToFragment: function(el) {
          var fragment = document.createDocumentFragment();
          var child = el.firstChild;
          while (child) {
            // 将Dom元素移入fragment中
            fragment.appendChild(child);
            child = el.firstChild
          }
          return fragment;
        },
        compileElement: function(el) {
          var childNodes = el.childNodes;
          var self = this;
          [].slice.call(childNodes).forEach(function(node) {
            var reg = /\{\{(.*)\}\}/; //用来判定是否为 {{*}} ;
            var text = node.textContent; //当前node(选中dom)的文本内容(就是要显示的文本等)
            if (self.isElementNode(node)) { //dom
              self.compile(node);
            } else if (self.isTextNode(node) && reg.test(text)) { //文本
              self.compileText(node, reg.exec(text)[1]);
            }
            if (node.childNodes && node.childNodes.length) { //递归调用
              self.compileElement(node);
            }

          });
        },
        compile: function(node) {
          var nodeAttrs = node.attributes; //用户属性集合
          var self = this;
          Array.prototype.forEach.call(nodeAttrs, function(attr) {
            var attrName = attr.name;
            if (self.isDirective(attrName)) { /*过滤用户属性保留V-指令*/
              var exp = attr.value; //获取 用户v-指令的值
              var dir = attrName.substring(2);
              if (self.isEventDirective(dir)) { // 是否为事件指令
                self.compileEvent(node, self.vm, exp, dir); //执行对应事件
              } else if (self.isattrDirective(dir)) {
                dir = dir.substring(6);
                self.compileAttr(node, self.vm, exp, dir); /*v-model:属性 数据绑定编译处理*/
              } else { // 为v-model 指令
                self.compileModel(node, self.vm, exp, dir); /*v-model 数据绑定编译处理*/
              }
              node.removeAttribute(attrName);

            }
          });
        },
        compileText: function(node, exp) {
          var self = this;
          var initText = this.vm[exp];
          this.updateText(node, initText);
          new Watcher(this.vm, exp, function(value) {
            self.updateText(node, value);
            self.compilewatch(node, self.vm, exp);
          });
        },
        compileEvent: function(node, vm, exp, dir) { /*事件*/
          var self = this;
          var eventType = dir.split(':')[1];
          var ev = self.getargs(exp);
          var args = '';
          if (ev) {
            args = ev;
            var zk = exp.indexOf('(');
            exp = exp.substr(0, zk)
          }
          var cb = vm.methods && vm.methods[exp];
          if (eventType && cb) {
            node.addEventListener(eventType, cb.bind(vm, args), true);
            //node.addEventListener(eventType, cb.apply(vm,args), false);
            //node.addEventListener(eventType,cb.call(vm,'name','age'), false);
          }
        },
        getargs: function(exp) {
          var reg = /\((.*)\)/;
          var args;
          if (reg.test(exp)) {
            args = reg.exec(exp)[1].split(",");
            var reg1 = /\"(.*)\"/,
              reg2 = /\'(.*)\'/;
            for (var i in args) {
              if (reg1.test(args[i])) { args[i] = reg1.exec(args[i])[1] }
              if (reg2.test(args[i])) { args[i] = reg2.exec(args[i])[1] }
            }
          }
          return args;
        },
        compilewatch: function(node, vm, exp) { /*监听值改变*/
          var wt = vm.watchs && vm.watchs[exp];
          if (wt && iswatch) {
            wt.call(vm);
          }
        },
        compileModel: function(node, vm, exp, dir) {

          var self = this;
          var val = this.vm[exp];
          this.modelUpdater(node, val, "value"); /*数据赋给dom*/
          new Watcher(this.vm, exp, function(value) {
            self.modelUpdater(node, value, "value");
            self.compilewatch(node, self.vm, exp);
          });
          node.addEventListener('input', function(e) { //dom 值赋给数据
            var newValue = e.target.value;
            if (val === newValue) {
              return;
            }
            self.vm[exp] = newValue; //复制
            val = newValue;
          });
        },
        compileAttr: function(node, vm, exp, dir) {
          var self = this;
          var val = this.vm[exp];
          this.modelUpdater(node, val, dir); /*数据赋给dom*/
          new Watcher(this.vm, exp, function(value) {
            self.modelUpdater(node, value, dir);
            self.compilewatch(node, self.vm, exp);
          });
        },
        updateText: function(node, value) {
          node.textContent = typeof value == 'undefined' ? '' : value; //更新dom  {{*}}的值
        },
        modelUpdater: function(node, value, attr) {
          node[attr] = typeof value == 'undefined' ? '' : value; //更新 attr属性的值
        },
        isDirective: function(attr) {
          return attr.indexOf('v-') == 0; //指令
        },
        isEventDirective: function(dir) {
          return dir.indexOf('on:') === 0; //事件
        },
        isattrDirective: function(dir) {
          return dir.indexOf(':') === 4 || dir.indexOf(':') === 5 && dir.indexOf('on:') === -1; //属性
        },
        isElementNode: function(node) {
          return node.nodeType == 1;
        },
        isTextNode: function(node) {
          return node.nodeType == 3;
        }
      }
      /*数据缓存*/
      Dep.target = null; /*用来缓存遍历当前this*/
      function Watcher(vm, exp, cb) {
        this.cb = cb;
        this.vm = vm;
        this.exp = exp;
        this.value = this.get(); // 获取缓存的当前属性的值
      }
      Watcher.prototype = {
        update: function() {
          this.run(); /*更新值*/
        },
        run: function() {
          var value = this.vm.data[this.exp]; /*获取实时的值*/
          var oldVal = this.value;
          if (value !== oldVal) {
            this.value = value;
            this.cb.call(this.vm, value, oldVal);
          }
        },
        get: function() {
          Dep.target = this; // 缓存自己
          var value = this.vm.data[this.exp] // 从缓存里获取当前属性的值
          Dep.target = null; // 释放自己
          return value;
        }
      };
      new DataBinginit(dataoptions);
      /*页面调用*/
      /*<div id="app">
          <h2>{{title}}</h2>
          <!--<input v-model="name">-->
          <textarea v-model="name" placeholder="请输入关键字进行查询" v-model:name="attrname"></textarea>
          <h1>{{name}}</h1>
          <h1>{{name1}}</h1>
          <h1>当前时间为<span>{{date}}</span></h1>
          <button v-on:click="clickMe">click me 来清空input输入框值!</button>
          <button v-on:click="getval">获取input输入框值!</button>
          <button v-on:click="clickto">click me try!</button>
      </div>*/
      /*initUtil.DataBing({
          el: '#app',
          data: {
              title: 'hello world！',
              name: '请输入',
              name1: '哈哈哈',
              attrname:"attrname",
              date:getNowDateStr(),
          },
          methods: {
              clickMe: function () {
                  this.name ='';
              },
              clickto:function () {
                  this.name = 'hello world';
                  this.attrname = '测试';
              },
              getval:function(){
                 console.log(this.name);
              }
          },
          watchs: {
             name:function(){
               console.log(this.name);
             },
             attrname:function(){
                alert(this.attrname);
             }
          },
          mounted: function () {
              window.setInterval(() => {
                  this.date=getNowDateStr();
              }, 1000);
          }
      });*/
    },
  },
  validate: { //校验
    rule: {
      isEmpty: function(str) { /*是否为空*/
        return !/0+/.test(str) && !str;
      },
      isNumber: function(str) { /*是否为数字*/
        return /^[0-9]*$/.test(str);
      },
      isZipCode: function(str) { /*是否为邮编*/
        return /^[0-9]{6}$/.test(str);
      },
      isIdCardNo: function(str) { /*是否为身份证好*/
        return /^(\d{6})()?(\d{4})(\d{2})(\d{2})(\d{3})(\w)$/.test(str);
      },
      isMobile: function(str) { /*是否为手机号码*/
        return str.length == 11 && /^1[3|4|5|8|7][0-9]\d{4,8}$/.test(str);
      },
      isQQ: function(str) { /*是否为QQ号码*/
        return /^\s*[.0-9]{5,11}\s*$/.test(str);
      },
      isEmail: function(str) { /*是否为邮箱*/
        return /\w@\w*\.\w/.test(str);
      },
      isUrl: function(str) { /*是否为网页url*/
        return /(https?|ftp|mms):\/\/([A-z0-9]+[_\-]?[A-z0-9]+\.)*[A-z0-9]+\-?[A-z0-9](\/.*)*\/?/.test(str);
      },
      isPhone: function(str) { /*是否为固定电话*/
        return /^(0[0-9]{2,3}-?)?([2-9][0-9]{6,7})+(-?[0-9]{1,4})?$/.test(str);
      },
      isTel: function(str) { /*是否为手机号码或固定电话*/
        var _length = str.length,
          _mobile = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/,
          _tel = /^(0[0-9]{2,3}-?)?([2-9][0-9]{6,7})+(-?[0-9]{1,4})?$/;
        return (_tel.test(str) && _length <= 12) || (_mobile.test(str) && _length == 11);
      },
      isIp: function(str) { /*是否为ip地址*/
        return /^(([1-9]|([1-9]\d)|(1\d\d)|(2([0-4]\d|5[0-5])))\.)(([1-9]|([1-9]\d)|(1\d\d)|(2([0-4]\d|5[0-5])))\.){2}([1-9]|([1-9]\d)|(1\d\d)|(2([0-4]\d|5[0-5])))$/.test(str);
      },
      cnLength: function(str, params) { /*验证字符串长度是否在params([smax,smin])范围内*/
        var _length = str.length,
          _totalLen = _length,
          smin = 0,
          smax = 0;
        if (params instanceof Array) {
          switch (params.length) {
            case 0:
              return false;
              break;
            case 1:
              smax = parseInt(params[0]);
              if (smax == 0 || isNaN(smax)) {
                return false;
              }
              break;
            default:
              smin = parseInt(params[0]);
              smax = parseInt(params[1]);
              if (smax == 0 || isNaN(smax) || isNaN(smin)) {
                return false;
              }
          }
        } else {
          return false;
        }
        for (var i = 0; i < _length; i++) {
          if (str.charCodeAt(i) > 127) {
            _totalLen += 2;
          }
        }
        return _totalLen >= smin && _totalLen <= smax;
      },
      chineseMax: function(str, params) { /*验证字符串长度是否在0-params范围内*/
        var _length = str.length,
          smin = 0;
        var smax = parseInt(params);
        return _length >= smin && _length <= smax;;
      },
      charMin: function(str, params) { /*验证字符串的长度是否大于params*/
        return str.length >= parseInt(params);
      },
      cnMax: function(str, params) { /*验证字符数字是否小于params*/
        return Number(str) <= Number(params);
      },
      cnMin: function(str, params) { /*验证字符数字是否大于params*/
        return Number(str) > Number(params);
      },
      userName: function(str) { /*只允许输入中英文字符，数字和下划线*/
        return /^[a-zA-Z0-9_\u4e00-\u9fa5]+$/.test(str);
      },
      userNameExtend: function(str) { /*只允许输入中英文字符，数字和下划线,括号  以及 ·.、*/
        return /^[a-zA-Z0-9_\(\)\{\}·.、\[\]\（\）\【\】\u4e00-\u9fa5]+$/.test(str);
      },
      chrnum: function(str) { /*字母和数字的验证*/
        return /^([a-zA-Z0-9]+)$/.test(str);
      },
      decimal2: function(str) { /*是否为两位小数*/
        return /^-?\d+\.?\d{0,2}$/.test(str);
      },
      decimal_num: function(str) { /*是否为数字和小数*/
        return /(^d*.?d*[0-9]+d*$)|(^[0-9]+d*.d*$)/.test(str);
      },
      chinese: function(str) { /*是否为中文*/
        return /^[\u4e00-\u9fa5]+$/.test(str);
      },
      userPassword: function(str) { /*密码的验证a-zA-Z0-9 5-17位*/
        return /^[a-zA-Z]\w{5,17}$/.test(str);
      },
      isDefaultPassword: function(str, params) { /*是否默认密码params(["123456",'111111','111222'])*/
        var isd = false;
        for (var strp in params) {
          if (str.toString() == params[strp]) {
            isd = true;
          }
        }
        return isd;
      },
      isSimplePassword: function(str) { /*是否简单密码*/
        function isASC(test) {
          for (var i = 1; i < test.length; i++) {
            if (test.charCodeAt(i) != (test.charCodeAt(i - 1) + 1)) {
              return false;
            }
          }
          return true;
        }

        function isDESC(test) {
          for (var i = 1; i < test.length; i++) {
            if (test.charCodeAt(i) != (test.charCodeAt(i - 1) - 1)) {
              return false;
            }
          }
          return true;
        }

        function isSame(test) {
          for (var i = 1; i < test.length; i++) {
            if (test.charCodeAt(i) != (test.charCodeAt(i - 1))) {
              return false;
            }
          }
          return true;
        }
        return !(isASC(str) || isDESC(str) || isSame(str));
      },
      identifier: function(str) { /*是否是编号*/
        return /^[a-zA-Z0-9_\u4e00-\u9fa5\-]+$/.test(str);
      },
      isPic: function(str) { /*是否是图片*/
        return /.jpg|.png|.gif|.jpeg$/.test(str.toLowerCase());
      },
      isInteger: function(str) { /*是否是正整数*/
        return /^[1-9]+[0-9]*$/.test(str);
      },
      isPInt: function(str) { /*校验正整数*/
        return /^[0-9]*[0-9][0-9]*$/.test(str);
      },
      onlyEn_Num: function(str) { /*只允许输入英文字符，数字和下划线*/
        return /^\w+$/.test(str);
      },
      onlyCn_En_Num: function(str) { /*只允许输入中英文字符，数字和下划线*/
        return /^[a-zA-Z0-9_\u4e00-\u9fa5]+$/.test(str);
      },
      onlyCn_En_Num_Point: function(str) { /*只能包括中英文字母、数字、下划线和中文标点符号*/
        return /^[a-zA-Z0-9_\u4e00-\u9fa5，。“”；！？@、]+$/.test(str);
      },
      onlyCn_En_Num_Point_zhong_ying: function(str) { /*只能包括中英文字母、数字、下划线和中英文标点符号*/
        return /^[a-zA-Z0-9_\u4e00-\u9fa5，。“”；！？@、,.?!"";]+$/.test(str);
      },
      onlyCn_En_Num_Point_extend: function(str) { /*只能包括中英文字母、数字、下划线和中文标点符号及部分特殊符号*/
        return /^[a-zA-Z0-9_\u4e00-\u9fa5，。“”；！：？@、\(\)\{\}·.:\[\]\（\）\【\】]+$/.test(str);
      },
      onlyCn_En_Num_Point_return: function(str) { /*只能包括中英文字母、数字、下划线和中英文标点符号、空格、回车、括号类符号*/
        return /^[a-zA-Z0-9_\u4e00-\u9fa5，,。.“”；"";：·:！!？?@、.\(\)\（\）\[\]\{\}\【\】\n\s]+$/.test(str);
      },
      onlyCn_En_Num_bufen_return: function(str) { /*只能包括中英文字母、数字、下划线、横杠和中英文标点符号、空格、回车、括号类符号*/
        return /^[a-zA-Z0-9_\u4e00-\u9fa5，,。.“”；‘’''"";：:！!？?@、.<>\-《》\(\)\（\）\[\]\{\}\【\】\n\s]+$/.test(str);
      },
      onlyCn_En_Num_Point_all_extend: function(str) { /*只能包括中英文字母、数字、下划线、中文标点符号、空格和回车及部分特殊符号*/
        return /^[a-zA-Z0-9_\u4e00-\u9fa5，。“”；：！？@、\(\)\{\}·.\[\]\（\）\【\】\n\s]+$/.test(str);
      },
      onlyNum_Point: function(str) { /*只能是数字、小数点后两位*/
        return /^(\d)*(\.(\d){1,2})?$/.test(str);
      },
      onlyNum_Point3: function(str) { /*只能是数字、小数点后两位*/
        return /^(\d)*(\.(\d){0,3})?$/.test(str);
      },
      doubles7: function(str) { /*是否小于9999999*/
        var par = parseInt(str)
        return par <= 9999999;
      },
      doubles5: function(str) { /*是否小于999*/
        var par = parseInt(str)
        return par <= 999;
      },
      onlyNum_Point4: function(str) { /*是否数字、小数点后四位*/
        return /^(\d)*(\.(\d){0,4})?$/.test(str);
      },
      onlyNum_Point7: function(str) { /*是否数字、小数点后七位*/
        return /^(\d)*(\.(\d){0,7})?$/.test(str);
      },
      socode: function(str) { /*是否统一社会信用代码*/
        return /^[0-9A-Z]+$/.test(str);
      },
      onlycar_number_Eng: function(str) { /*是否为车牌号*/
        return /(^[\u4E00-\u9FA5]{1}[A-Z0-9]{6}$)|(^[A-Z]{2}[A-Z0-9]{2}[A-Z0-9\u4E00-\u9FA5]{1}[A-Z0-9]{4}$)|(^[\u4E00-\u9FA5]{1}[A-Z0-9]{5}[挂学警军港澳]{1}$)|(^[A-Z]{2}[0-9]{5}$)|(^(08|38){1}[A-Z0-9]{4}[A-Z0-9挂学警军港澳]{1}$)|(^[A-Z]{2}[\u4E00-\u9FA5]{1}[A-Z0-9]{4}[A-Z0-9挂学警军港澳]{1}$)/.test(str);
      },
      onlyChNun_Eng: function(str) { /*是否为英文字母、数字和中文*/
        //return /^[\u4e00-\u9fa5]{1}[A-Z]{1}[A-Z_0-9]{5}$/.test(str);
        return /^(([\u4e00-\u9fa5]|[a-zA-Z0-9])+)$/.test(str);
      },
    },
    validateFn: function(selector) { //容器表单校验方法
      /*
       */
    },
    promptMsg: { //错误信息
      "notEmpty": "不能为空！",
      "isNumber": "只能输入数字！",
      "isZipCode": "邮政编码不正确!",
      "isIdCardNo": "身份证号码格式不正确!",
      "isMobile": "手机号码格式不正确!",
      "isPhone": "电话号码格式不正确!",
      "isTel": "联系电话格式不正确!",
      "isQQ": "QQ号码格式不正确！",
      "isEmail": "email格式不正确！",
      "isUrl": "网址格式不正确！",
      "isIp": "ip地址格式不正确!",
      "cnLength": "长度要介于{0}到{1}之间!",
      "cnLength": "您可输入{0}到{1}个字符，中文占3个字符！",
      "chineseMax": "您最多能输入{0}个字!",
      "cnMax": "请输入介于0到{0}之间的数字!",
      "cnMin": "请输入大于{0}的数字!",
      "userName": "只能包括中英文、数字和下划线!",
      "chrnum": "只能输入数字和字母(字符A-Z, a-z, 0-9)！",
      "chinese": "只能输入中文！",
      "userPassword": "以字母开头，长度在6-18之间，只能包含字符、数字或下划线！",
      "isDefaultPassword": "登录密码不能为默认密码！",
      "isSimplePassword": "登录密码太简单！",
      "isPic": "只能是jpg、png、gif、jpeg格式的图片！",
      "isPInt": "只能输入非负整数！",
      "charMin": "至少15位",
      "isInteger": "只能输入正整数！",
      "onlyEn_Num": "只能输入英文，数字和下划线!",
      "onlyCn_En_Num": "只能输入中英文，数字和下划线!",
      "onlyCn_En_Num_Point": "只能输入中英文，数字、下划线和中文标点符号!",
      "onlyCn_En_Num_Point_zhong_ying": "只能输入中英文，数字、下划线和标点符号!",
      "onlyCn_En_Num_Point_extend": "只能输入中英文，数字、下划线和中文标点符号及部分特殊符号!",
      "onlyCn_En_Num_Point_all_extend": "只能包括中英文、数字、下划线、中文标点符号、空格和回车及部分特殊符号",
      "onlyCn_En_Num_Point_return": "只能输入中英文，数字、下划线、中英文标点符号、空格、换行及括号类符号!",
      "orgTreeValid": "您还没有选择用户！",
      "equalTo": "请输入相同的值！",
      "decimal2": "请输入数字，小数点后保留2位！",
      "equalTo": "请输入相同的值！",
      "onlyNum_Point": "只能输入自然数，小数点后两位！",
      "onlyNum_Point3": "只能输入自然数，最多小数点后三位！",
      "onlyNum_Point4": "只能输入自然数，最多小数点后四位！",
      "onlyNum_Point7": "只能输入自然数，最多小数点后七位！",
      "onlycar_number_Eng": "请输入正确的车牌号！",
      "onlyCn_En_Num_bufen_return": "只能输入中英文字符、中英文标点符号、空格以及下划线和中线",
      "decimal_num": "请输入数字或小数",
      "onlyChNun_Eng": "只能输入英文字母、数字和中文！",
      "socode": "统一社会信用代码!",
      "doubles7": "您输入的值的整数部分不能大于9999999，请重新输入！",
      "doubles5": "您输入的值的整数部分不能大于999，请重新输入！"
    },
  },
}
//分页全局配置
const pagenationconfig = {
  isshowtotle: false,
  isshowpagesize: false,
  isshowpagesizeselect: false,
  btncount: 5,
  isshowfirstorlastpage: true,
  isshowgopage: true,
  defaltpagesize: 10,
}
export default initUtil
// module.exports.initUtil = initUtil
// module.exports.pagenationconfig = pagenationconfig
// import { initUtil } from '@/common/js/util.js'
