/*
 * @Date:   2017-05-29 09:54:53
 * Author: Titans
 * @Last Modified time: 2019-09-18 10:56:49
 */
/* eslint-disable */
/* eslint-disable no-alert, no-console */
const ToolFn = {
  each(object, callback) {
    /* js原生each方法 */
    let type = (function (obj) {
      switch (obj.constructor) {
        case Object:
          return 'Object'
        case Array:
          return 'Array'
        case NodeList:
          return 'NodeList'
        default:
          return 'null'
      }
    })(object)
    // 为数组或类数组时, 返回: index, value
    if (type === 'Array' || type === 'NodeList') {
      // 由于存在类数组NodeList, 所以不能直接调用every方法
      [].every.call(object, function (v, i) {
        return callback.call(v, i, v) !== false
      })
    } else if (type === 'Object') {
      for (let i in object) {
        if (callback.call(object[i], i, object[i]) === false) {
          break
        }
      }
    } // 为对象格式时,返回:key, value
  },
  utilFn: { // 工具类函数
    deepCopy(obj) { // 深拷贝通用方法
      // let new_arr = JSON.parse(JSON.stringify(arr)) // 不仅可拷贝数组还能拷贝对象（ 但不能拷贝函数）
      // 只拷贝对象
      let me = this
      if (typeof obj !== 'object') return
      // 根据obj的类型判断是新建一个数组还是一个对象
      let newObj = obj instanceof Array ? [] : {}
      for (let key in obj) {
        // 遍历obj,并且判断是obj的属性才拷贝
        if (obj.hasOwnProperty(key)) {
          // 判断属性值的类型，如果是对象递归调用深拷贝
          newObj[key] = typeof obj[key] === 'object' ? me.deepCopy(obj[key]) : obj[key]
        }
      }
      return newObj
    },
    shallowCopy(obj) { // 浅拷贝通用方法
      // 只拷贝对象
      if (typeof obj !== 'object') return
      // 根据obj的类型判断是新建一个数组还是一个对象
      let newObj = obj instanceof Array ? [] : {}
      // 遍历obj,并且判断是obj的属性才拷贝
      for (let key in obj) {
        if (obj.hasOwnProperty(key)) {
          newObj[key] = obj[key]
        }
      }
      return newObj
    },
    numTostring(digit, num) { // num位数不够digit位前面添加0
      let str = num.toString()
      let len = str.length
      let arr = str.split('')
      let zeroNum = digit - len
      for (let i = 0; i < zeroNum; i++) {
        arr.unshift('0')
      }
      return arr.join('')
    },
    checkPwd(str) {
      /* 检测密码强度 */
      let Lv = 0
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
      // eslint-disable-next-line no-useless-escape
      if (/[\.|-|_]/.test(str)) {
        Lv++
      }
      return Lv
    }
  },
  transformFn: { // 转化函数
    formatNum(num) {
      if (typeof num === 'string') {
        return num.split('').reverse().join('').replace(/(\d{3})/g, '$1,').replace(/\,$/, '').split('').reverse().join('')
      } else if (typeof num === 'number') {
        return (num).toString().split('').reverse().join('').replace(/(\d{3})/g, '$1,').replace(/\,$/, '').split('').reverse().join('')
      }
    },
    numberToStr3(n) {
      /* 数字转化为PB TB GB GB MB */
      let me = this
      let str = ''
      let temp = n
      let p = 0
      if (n >= 1024 * 1024 * 1024) {
        p = ToolFn.numberFn.zhengchu(n, 1024 * 1024 * 1024)
        str += p + 'PB'
        temp = temp - p * 1024 * 1024 * 1024
      }
      let t = 0
      if (n >= 1024 * 1024) {
        t = ToolFn.numberFn.zhengchu(n, 1024 * 1024)
        str += t + 'TB'
        temp = temp - t * 1024 * 1024
      }
      let g = 0
      if (temp >= 1024) {
        g = ToolFn.numberFn.zhengchu(n, 1024)
        str += g + 'GB'
        temp = temp - g * 1024
      }

      let m = 0
      if (temp >= 1) {
        m = temp
        str += m + 'MB'
      }
      return str
    },
    formatterNum(num) {
      num = num + ''
      if (num !== 'undefined' && num !== '-') {
        num = num.split('').reverse().join('').replace(/(\d{3})/g, '$1,').replace(/\,$/, '').split('').reverse().join('')
      }
      return num
    },
    formattedNumber(num) {
      num = (num || 0).toString()
      let result = ''
      while (num.length > 3) {
        result = ',' + num.slice(-3) + result
        num = num.slice(0, num.length - 3)
      }
      if (num) {
        result = num + result
      }
      return result
    },
    wordwrap(text, limit) {
      let words = text.split(' ')
      let lines = ['']
      let lastLine = 0
      for (let i = 0; i < words.length; i++) {
        let word = words[i]
        lastLine = lines[lines.length - 1]
        if (lastLine.length + word.length > limit) {
          lines.push(word)
        } else {
          lines[lines.length - 1] = lastLine + ' ' + word
        }
      }
      return lines.join('\n').trim() // Trim because the first line will start with a
    },
    unwrap(text) {
      return text.replace(/\n/g, ' ')
    },
    trimStr(nullStr) {
      if (nullStr === null || typeof (nullStr) === 'undefined') {
        return ''
      } else {
        return nullStr
      }
    },
    getByteLength(val) {
      let len = 0
      for (let i in val) {
        // eslint-disable-next-line no-control-regex
        if (val[i].match(/[^\x00-\xff]/ig) !== null) // 全角
        {
          len += 2
        } else {
          len += 1
        }
      }
      return len
    },
    ProcessingSeparator(val) {
      /* 处理用空格、换行符、逗号、顿号（以上符号数量不限制）隔开的字符串，返回用单个英文逗号隔开的字符 */
      let me = this
      try {
        val = val.replace(/\n|\r\n| /g, ',')
        val = val.replace(/、/g, ',')
        val = val.replace(/，/g, ',')
      } catch (e) {
        console.info(e)
      }
      val = val.split(',')
      let strstring = ''
      ToolFn.each(val, function (i, t) {
        if (t !== '') {
          strstring += t + ','
        }
      })
      return strstring.substr(0, strstring.length - 1)
    },
    digitUppercase(n) {
      /* 现金额大写 */
      if (typeof n === 'number') {
        n = new String(n)
      };
      n = n.replace(/,/g, '') // 替换tomoney()中的“,”
      n = n.replace(/ /g, '') // 替换tomoney()中的空格
      n = n.replace(/￥/g, '') // 替换掉可能出现的￥字符
      // if (isNaN(n)) { //验证输入的字符是否为数字
      //     //alert("请检查小写金额是否正确");
      //     return "";
      // };
      let fraction = ['角', '分']
      let digit = [
        '零', '壹', '贰', '叁', '肆',
        '伍', '陆', '柒', '捌', '玖'
      ]
      let unit = [
        ['元', '万', '亿', '万', '亿'],
        ['', '拾', '佰', '仟']
      ]
      let head = n < 0 ? '欠' : ''
      n = Math.abs(n)
      let s = ''
      for (let i = 0; i < fraction.length; i++) {
        s += (digit[Math.floor(n * 10 * Math.pow(10, i)) % 10] + fraction[i]).replace(/零./, '')
      }
      s = s || '整'
      n = Math.floor(n)
      for (let i = 0; i < unit[0].length && n > 0; i++) {
        let p = ''
        for (let j = 0; j < unit[1].length && n > 0; j++) {
          p = digit[n % 10] + unit[1][j] + p
          n = Math.floor(n / 10)
        }
        s = p.replace(/(零.)*零$/, '').replace(/^$/, '零') + unit[0][i] + s
      }
      return head + s.replace(/(零.)*零元/, '元')
        .replace(/(零.)+/g, '零')
        .replace(/^整$/, '零元整')
    },
    numberToChinese(num, type) {
      /* 将阿拉伯数字翻译成中文的大写数字 */
      if (typeof num === 'number') {
        num = new String(num)
      };
      num = num.replace(/,/g, '') // 替换tomoney()中的“,”
      num = num.replace(/ /g, '') // 替换tomoney()中的空格
      num = num.replace(/￥/g, '') // 替换掉可能出现的￥字符
      let rel = num < 0 ? (type === 'money' ? '欠' : '负') : ''
      num = num < 0 ? -(num) : num
      let AA = new Array('零', '一', '二', '三', '四', '五', '六', '七', '八', '九', '十')
      let BB = new Array('', '十', '百', '千', /* "萬", "億", */ '万', '亿', '点', '')
      let a = ('' + num).replace(/(^0*)/g, '').split('.')
      let k = 0
      let re = ''
      for (let i = a[0].length - 1; i >= 0; i--) {
        switch (k) {
          case 0:
            re = BB[7] + re
            break
          case 4:
            if (!new RegExp('0{4}//d{' + (a[0].length - i - 1) + '}$')
              .test(a[0])) {
              re = BB[4] + re
            }
            break
          case 8:
            re = BB[5] + re
            BB[7] = BB[5]
            k = 0
            break
        }
        if (k % 4 === 2 && a[0].charAt(i + 2) !== 0 && a[0].charAt(i + 1) === 0) {
          re = AA[0] + re
        }
        if (a[0].charAt(i) !== 0) {
          re = AA[a[0].charAt(i)] + BB[k % 4] + re
        }
        k++
      }

      if (a.length > 1) // 加上小数部分(如果有小数部分)
      {
        re += BB[6]
        for (let i = 0; i < a[1].length; i++) {
          re += AA[a[1].charAt(i)]
        }
      }
      if (re === '一十') {
        re = '十'
      }
      if (re.match(/^一/) && re.length === 3) {
        re = re.replace('一', '')
      }
      return rel + re
    },
    getfigure() { // 获取对应格式数字
    },
    domToStirng(htmlDOM) {
      /* DOM转字符串 */
      let div = document.createElement('div')
      div.appendChild(htmlDOM)
      return div.innerHTML
    },
    stringToDom(htmlString) {
      /* 字符串转DOM */
      let div = document.createElement('div')
      div.innerHTML = htmlString
      return div.children[0]
    }
  },
  numberFn: { // 数字
    strToInt(n) {
      if (n === null || typeof (n) === 'undefined' || isNaN(n)) {
        return 0
      } else {
        let newNumber = parseInt(n)
        if (isNaN(newNumber)) {
          return 0
        } else {
          return newNumber
        }
      }
    },
    strToInt45(n) {
      if (n === null || typeof (n) === 'undefined' || isNaN(n)) {
        return 0
      } else {
        let newNumber = Math.round(n)
        if (isNaN(newNumber)) {
          return 0
        } else {
          return newNumber
        }
      }
    },
    strToFloat(n) {
      if (n === null || typeof (n) === 'undefined' || isNaN(n)) {
        return 0
      } else if (typeof (n) === 'number') {
        return n
      } else {
        let newNumber = parseFloat(n)
        if (isNaN(newNumber)) {
          return 0
        } else {
          return newNumber
        }
      }
    },
    accurateChuFa(arg1, arg2) {
      /* 获取小数相除的精确结果 */
      if (arg2 === 0) {
        return 0.00
      }
      let t1 = 0
      let t2 = 0
      let r1
      let r2
      try {
        t1 = arg1.toString().split('.')[1].length
      } catch (e) {}
      try {
        t2 = arg2.toString().split('.')[1].length
      } catch (e) {}
      r1 = Number(arg1.toString().replace('.', ''))
      r2 = Number(arg2.toString().replace('.', ''))
      return (r1 / r2) * Math.pow(10, t2 - t1)
    },
    accurateChengFa(arg1, arg2) {
      /* 获取小数相乘的精确结果 */
      arg1 = ToolFn.numberFn.strToFloat(arg1)
      let m = 0
      let s1 = arg1.toString()
      let s2 = arg2.toString()
      try {
        m += s1.split('.')[1].length
      } catch (e) {}
      try {
        m += s2.split('.')[1].length
      } catch (e) {}
      return Number(s1.replace('.', '')) * Number(s2.replace('.', '')) / Math.pow(10, m)
    },
    accurateJiaFa(arg1, arg2) {
      /* 获取小数相加的精确结果 */
      let r1, r2, m
      try {
        r1 = arg1.toString().split('.')[1].length
      } catch (e) {
        r1 = 0
      }
      try {
        r2 = arg2.toString().split('.')[1].length
      } catch (e) {
        r2 = 0
      }
      m = Math.pow(10, Math.max(r1, r2))
      return (arg1 * m + arg2 * m) / m
    },
    double45(arg1, number) {
      /* 获取小数四舍五入,保留N位小数 */
      try {
        let baifen = 1
        for (let h = 0; h < number; h++) {
          baifen = baifen * 10
        }
        let f_x = Math.round(arg1 * baifen) / baifen
        return f_x
      } catch (e) {
        return arg1
      }
    },
    zhengchu(exp1, exp2) {
      let n1 = Math.round(exp1) // 四舍五入
      let n2 = Math.round(exp2) // 四舍五入
      let rslt = n1 / n2 // 除
      if (rslt >= 0) {
        rslt = Math.floor(rslt) // 返回小于等于原rslt的最大整数。
      } else {
        rslt = Math.ceil(rslt) // 返回大于等于原rslt的最小整数。
      }
      return rslt
    },
    random(min, max) {
      /* 随机数范围 */
      if (arguments.length === 2) {
        return Math.floor(min + Math.random() * ((max + 1) - min))
      } else {
        return 0
      }
    }
  },
  TypeFn: { // 类型判断
    getType(obj) {
      /* 判断对象是数组还是obj或变量分别对应返回 'arr(数组)','obj(对象)','let(单一变量)','Fn(函数)' */
      if (typeof obj === 'function') {
        return 'Fn'
      } else if (typeof obj === 'object' && isNaN(obj.length)) {
        return 'obj'
      } else if (typeof obj === 'object' && !isNaN(obj.length)) {
        return 'arr'
      }
      return 'let'
    },
    isType(o,type){
      // 'String' 'Number' 'Array' 'Boolean' 'Function' 'Object' 'Undefined' 'Null'  'Date' 'RegExp' 'Symbol' 'Promise' 'Set'
      return Object.prototype.toString.call(o).slice(8, -1) === type
    },
    isFalse(o) {
      if (o === '' || o === undefined || o === null || o === 0 || o === false || o === NaN || o === 0.0) return true
      return false
    },
    isTrue(o) {
      return !this.isFalse(o)
    },
    checkStr(str, type) { // 检查字符集本数据类型
      switch (type) {
        case 'phone': // 手机号码
          return str.length === 11 && /^1[3|4|5|6|7|8|9][0-9]\d{4,8}$/.test(str)
        case 'tel': // 座机
          return /^(0\d{2,3}-\d{7,8})(-\d{1,4})?$/.test(str)
        case 'card': // 身份证
          return /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(str)
        case 'pwd': // 密码以字母开头，长度在6~18之间，只能包含字母、数字和下划线
          return /^[a-zA-Z]\w{5,17}$/.test(str)
        case 'postal': // 邮政编码
          return /[1-9]\d{5}(?!\d)/.test(str)
        case 'QQ': // QQ号
          return /^[1-9][0-9]{4,9}$/.test(str)
        case 'email': // 邮箱
          return /^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/.test(str)
        case 'money': // 金额(小数点2位)
          return /^\d*(?:\.\d{0,2})?$/.test(str)
        case 'URL': // 网址
          return /(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?/.test(str)
        case 'IP': // IP
          return /((?:(?:25[0-5]|2[0-4]\\d|[01]?\\d?\\d)\\.){3}(?:25[0-5]|2[0-4]\\d|[01]?\\d?\\d))/.test(str)
        case 'date': // 日期时间
          return /^(\d{4})\-(\d{2})\-(\d{2}) (\d{2})(?:\:\d{2}|:(\d{2}):(\d{2}))$/.test(str) || /^(\d{4})\-(\d{2})\-(\d{2})$/.test(str)
        case 'number': // 数字
          return /^[0-9]$/.test(str)
        case 'english': // 英文
          return /^[a-zA-Z]+$/.test(str)
        case 'chinese': // 中文
          return /^[\u4E00-\u9FA5]+$/.test(str)
        case 'lower': // 小写
          return /^[a-z]+$/.test(str)
        case 'upper': // 大写
          return /^[A-Z]+$/.test(str)
        case 'HTML': // HTML标记
          return /<("[^"]*"|'[^']*'|[^'">])*>/.test(str)
        default:
          return true
      }
    },
    isCardID(sId) { // 严格的身份证校验
      if (!/(^\d{15}$)|(^\d{17}(\d|X|x)$)/.test(sId)) {
        alert('你输入的身份证长度或格式错误')
        return false
      }
      // 身份证城市
      let aCity = {
        11: '北京',
        12: '天津',
        13: '河北',
        14: '山西',
        15: '内蒙古',
        21: '辽宁',
        22: '吉林',
        23: '黑龙江',
        31: '上海',
        32: '江苏',
        33: '浙江',
        34: '安徽',
        35: '福建',
        36: '江西',
        37: '山东',
        41: '河南',
        42: '湖北',
        43: '湖南',
        44: '广东',
        45: '广西',
        46: '海南',
        50: '重庆',
        51: '四川',
        52: '贵州',
        53: '云南',
        54: '西藏',
        61: '陕西',
        62: '甘肃',
        63: '青海',
        64: '宁夏',
        65: '新疆',
        71: '台湾',
        81: '香港',
        82: '澳门',
        91: '国外'
      }
      if (!aCity[parseInt(sId.substr(0, 2))]) {
        alert('你的身份证地区非法')
        return false
      }
      // 出生日期验证
      let sBirthday = (sId.substr(6, 4) + '-' + Number(sId.substr(10, 2)) + '-' + Number(sId.substr(12, 2))).replace(/-/g, '/')
      let d = new Date(sBirthday)
      if (sBirthday !== (d.getFullYear() + '/' + (d.getMonth() + 1) + '/' + d.getDate())) {
        alert('身份证上的出生日期非法')
        return false
      }
      // 身份证号码校验
      let sum = 0
      let weights = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2]
      let codes = '10X98765432'
      for (let i = 0; i < sId.length - 1; i++) {
        sum += sId[i] * weights[i]
      }
      let last = codes[sum % 11] // 计算出来的最后一位身份证号码
      if (sId[sId.length - 1] !== last) {
        alert('你输入的身份证号非法')
        return false
      }
      return true
    }
  },
  systemFn: { // 浏览器，设备，系统类型判断，视窗属性，编码
    getOsType() {
      let u = navigator.userAgent
      if (u.indexOf('Android') > -1 || u.indexOf('Linux') > -1) { // 安卓手机
        return 'Android'
        // return false
      } else if (u.indexOf('iPhone') > -1) { // 苹果手机
        return 'iPhone'
        // return true
      } else if (u.indexOf('iPad') > -1) { // iPad
        return 'iPad'
        // return false
      } else if (u.indexOf('Windows Phone') > -1) { // winphone手机
        return 'Windows Phone'
        // return false
      } else {
        return false
      }
    },
    isPC() { // 是否为PC端
      let userAgentInfo = navigator.userAgent
      let Agents = ['Android', 'iPhone',
        'SymbianOS', 'Windows Phone',
        'iPad', 'iPod'
      ]
      let flag = true
      for (let v = 0; v < Agents.length; v++) {
        if (userAgentInfo.indexOf(Agents[v]) > 0) {
          flag = false
          break
        }
      }
      return flag
    },

    browserType() { // 浏览器类型
      let userAgent = navigator.userAgent || 'navigator' in window && 'userAgent' in navigator && navigator.userAgent.toLowerCase() || '' // 取得浏览器的userAgent字符串
      let isOpera = userAgent.indexOf('Opera') > -1 // 判断是否Opera浏览器
      let isIE = userAgent.indexOf('compatible') > -1 && userAgent.indexOf('MSIE') > -1 && !isOpera // 判断是否IE浏览器
      let isIE11 = userAgent.indexOf('Trident') > -1 && userAgent.indexOf('rv:11.0') > -1
      let isEdge = userAgent.indexOf('Edge') > -1 && !isIE // 判断是否IE的Edge浏览器
      let isFF = userAgent.indexOf('Firefox') > -1 // 判断是否Firefox浏览器
      let isSafari = userAgent.indexOf('Safari') > -1 && userAgent.indexOf('Chrome') === -1 // 判断是否Safari浏览器
      let isChrome = userAgent.indexOf('Chrome') > -1 && userAgent.indexOf('Safari') > -1 // 判断Chrome浏览器
      if (isIE) {
        let reIE = new RegExp('MSIE (\\d+\\.\\d+);')
        reIE.test(userAgent)
        let fIEVersion = parseFloat(RegExp['$1'])
        if (fIEVersion === 7) return 'IE7'
        else if (fIEVersion === 8) return 'IE8'
        else if (fIEVersion === 9) return 'IE9'
        else if (fIEVersion === 10) return 'IE10'
        else return 'IE7以下' // IE版本过低
      }
      if (isIE11) return 'IE11'
      if (isEdge) return 'Edge'
      if (isFF) return 'FF'
      if (isOpera) return 'Opera'
      if (isSafari) return 'Safari'
      if (isChrome) return 'Chrome'
    },
    getBroswer() {
      let sys = {};
      let ua = navigator.userAgent.toLowerCase();
      let s;
      (s = ua.match(/edge\/([\d.]+)/)) ? sys.edge = s[1]:
        (s = ua.match(/rv:([\d.]+)\) like gecko/)) ? sys.ie = s[1] :
        (s = ua.match(/msie ([\d.]+)/)) ? sys.ie = s[1] :
        (s = ua.match(/firefox\/([\d.]+)/)) ? sys.firefox = s[1] :
        (s = ua.match(/chrome\/([\d.]+)/)) ? sys.chrome = s[1] :
        (s = ua.match(/opera.([\d.]+)/)) ? sys.opera = s[1] :
        (s = ua.match(/version\/([\d.]+).*safari/)) ? sys.safari = s[1] : 0;

      if (sys.edge) return {
        broswer: "Edge",
        version: sys.edge
      };
      if (sys.ie) return {
        broswer: "IE",
        version: sys.ie
      };
      if (sys.firefox) return {
        broswer: "Firefox",
        version: sys.firefox
      };
      if (sys.chrome) return {
        broswer: "Chrome",
        version: sys.chrome
      };
      if (sys.opera) return {
        broswer: "Opera",
        version: sys.opera
      };
      if (sys.safari) return {
        broswer: "Safari",
        version: sys.safari
      };

      return {
        broswer: "",
        version: "0"
      };
    },
    getUuid() {
      /* 获取uuid */
      let s = []
      let hexDigits = '0123456789abcdef'
      for (let i = 0; i < 36; i++) {
        s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1)
      }
      s[14] = '4' // bits 12-15 of the time_hi_and_version field to 0010
      s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1) // bits 6-7 of the clock_seq_hi_and_reserved to 01
      s[8] = s[13] = s[18] = s[23] = ''
      let uuid = s.join('')
      return uuid
    },
    getClientHeight() {
      /* 获取视窗的高度 */
      let clientHeight = 0
      if (document.body.clientHeight && document.documentElement.clientHeight) {} else {}
      return clientHeight
    },
    ProhibitCodeDebugging() {
      /* 禁用代码检查和右键 */
      document.onkeydown = function () {
        let e = window.event || arguments[0]
        if (e.keyCode === 123) {
          console.log('请尊重劳动成果！')
          return false
        } else if ((e.ctrlKey) && (e.shiftKey) && (e.keyCode === 73)) {
          return false
        } else if ((e.ctrlKey) && (e.keyCode === 85)) {
          return false
        } else if ((e.ctrlKey) && (e.keyCode === 83)) {
          return false
        }
      }
      document.oncontextmenu = function () {
        return false
      }
    },
    getExploreType() {
      /* 获取浏览器类型和版本 @return {String} */
      let sys = {}
      let ua = navigator.userAgent.toLowerCase()
      let s;
      (s = ua.match(/rv:([\d.]+)\) like gecko/)) ? sys.ie = s[1]: (s = ua.match(/msie ([\d\.]+)/)) ? sys.ie = s[1] :
        (s = ua.match(/edge\/([\d\.]+)/)) ? sys.edge = s[1] :
        (s = ua.match(/firefox\/([\d\.]+)/)) ? sys.firefox = s[1] :
        (s = ua.match(/(?:opera|opr).([\d\.]+)/)) ? sys.opera = s[1] :
        (s = ua.match(/chrome\/([\d\.]+)/)) ? sys.chrome = s[1] :
        (s = ua.match(/version\/([\d\.]+).*safari/)) ? sys.safari = s[1] : 0
      // 根据关系进行判断
      if (sys.ie) return ('IE: ' + sys.ie)
      if (sys.edge) return ('EDGE: ' + sys.edge)
      if (sys.firefox) return ('Firefox: ' + sys.firefox)
      if (sys.chrome) return ('Chrome: ' + sys.chrome)
      if (sys.opera) return ('Opera: ' + sys.opera)
      if (sys.safari) return ('Safari: ' + sys.safari)
      return 'Unkonwn'
    },
    getExplorerInfo() {
      try {
        let explorer = window.navigator.userAgent.toLowerCase()
        //ie
        if (explorer.indexOf("msie") >= 0) {
          let ver = explorer.match(/msie ([\d.]+)/)[1];
          return {
            type: "IE",
            version: ver
          };
        }
        //firefox
        else if (explorer.indexOf("firefox") >= 0) {
          let ver = explorer.match(/firefox\/([\d.]+)/)[1];
          return {
            type: "Firefox",
            version: ver
          };
        }
        //Chrome
        else if (explorer.indexOf("chrome") >= 0) {
          let ver = explorer.match(/chrome\/([\d.]+)/)[1];
          return {
            type: "Chrome",
            version: ver
          };
        }
        //Opera
        else if (explorer.indexOf("opera") >= 0) {
          let ver = explorer.match(/opera.([\d.]+)/)[1];
          return {
            type: "Opera",
            version: ver
          };
        }
        //Safari
        else if (explorer.indexOf("Safari") >= 0) {
          let ver = explorer.match(/version\/([\d.]+)/)[1];
          return {
            type: "Safari",
            version: ver
          };
        }
      } catch (e) {
        debugger
      }

    },
    getOS() {
      /* 获取操作系统类型 @return {String} */
      let userAgent = 'navigator' in window && 'userAgent' in navigator && navigator.userAgent.toLowerCase() || ''
      let appVersion = 'navigator' in window && 'appVersion' in navigator && navigator.appVersion.toLowerCase() || ''

      if (/iphone/i.test(userAgent) || /ipad/i.test(userAgent) || /ipod/i.test(userAgent)) return 'ios'
      if (/android/i.test(userAgent)) return 'android'
      if (/win/i.test(appVersion) && /phone/i.test(userAgent)) return 'windowsPhone'
      if (/mac/i.test(appVersion)) return 'MacOSX'
      if (/win/i.test(appVersion)) return 'windows'
      if (/linux/i.test(appVersion)) return 'linux'
    },
    encode64(d) {
      /* Base64位加密 */
      d = (function (g) {
        let c = g.length
        let a = ''
        for (let d = 0; d < c; d++) {
          let f = g.charCodeAt(d)
          if (f < 0) {
            f += 65536
          }
          if (f > 127) {
            f = UnicodeToAnsi(f)
          }
          if (f > 255) {
            let b = f & 65280
            b = b >> 8
            let e = f & 255
            a += String.fromCharCode(b) + String.fromCharCode(e)
          } else {
            a += String.fromCharCode(f)
          }
        }
        return a
      })(d)
      let b = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/='
      let a = ''
      let l
      let j
      let g = ''
      let k
      let h
      let f
      let e = ''
      let c = 0
      do {
        l = d.charCodeAt(c++)
        j = d.charCodeAt(c++)
        g = d.charCodeAt(c++)
        k = l >> 2
        h = ((l & 3) << 4) | (j >> 4)
        f = ((j & 15) << 2) | (g >> 6)
        e = g & 63
        if (isNaN(j)) {
          f = e = 64
        } else {
          if (isNaN(g)) {
            e = 64
          }
        }
        a = a + b.charAt(k) + b.charAt(h) + b.charAt(f) + b.charAt(e)
        l = j = g = ''
        k = h = f = e = ''
      } while (c < d.length)
      return a
    }
  },
  ValiBroswerFn: {
    getBroswer() {
      var sys = {
        broswer: false,
        version: false
      }
      var typeObj = {
        Edge: /edge\/([\d.]+)/,
        IE: /msie ([\d.]+)/,
        Firefox: /firefox\/([\d.]+)/,
        Chrome: /Chrome\/([\d.]+)/,
        Opera: /opera.([\d.]+)/,
        Safari: /version\/([\d.]+).*Safari/
      }
      var ua = navigator.userAgent.toLowerCase()
      for (var key in typeObj) {
        var stype = ua.match(typeObj[key])
        if (stype) {
          sys.broswer = key
          sys.version = stype[1]
        }
      }
      return sys
    },
    getBrowserType() {
      var userAgent = navigator.userAgent // 取得浏览器的userAgent字符串
      var isOpera = userAgent.indexOf('Opera') > -1 // 判断是否Opera浏览器
      var isIE = userAgent.indexOf('compatible') > -1 && userAgent.indexOf('MSIE') > -1 && !isOpera // 判断是否IE浏览器
      var isEdge = userAgent.indexOf('Edge') > -1 // 判断是否IE的Edge浏览器
      var isFF = userAgent.indexOf('Firefox') > -1 // 判断是否Firefox浏览器
      var isSafari = userAgent.indexOf('Safari') > -1 && userAgent.indexOf('Chrome') === -1 // 判断是否Safari浏览器
      var isChrome = userAgent.indexOf('Chrome') > -1 && userAgent.indexOf('Safari') > -1 // 判断Chrome浏览器
      var typeObj = {
        Edge: /Edge\/([\d.]+)/,
        IE: /msie ([\d.]+)/,
        Firefox: /Firefox\/([\d.]+)/,
        Chrome: /Chrome\/([\d.]+)/,
        Opera: /Opera.([\d.]+)/,
        Safari: /version\/([\d.]+).*safari/
      }
      if (isIE) {
        var reIE = new RegExp('MSIE (\\d+\\.\\d+);')
        reIE.test(userAgent)
        var fIEVersion = parseFloat(RegExp['$1'])
        if (fIEVersion === 7) {
          return {
            broswer: 'IE',
            version: 7
          }
        } else if (fIEVersion === 8) {
          return {
            broswer: 'IE',
            version: 8
          }
        } else if (fIEVersion === 9) {
          return {
            broswer: 'IE',
            version: 9
          }
        } else if (fIEVersion === 10) {
          return {
            broswer: 'IE',
            version: 10
          }
        } else if (fIEVersion === 11) {
          return {
            broswer: 'IE',
            version: 11
          }
        } else {
          return '0'
        } // IE版本过低
      } // isIE end

      if (isFF) {
        return {
          broswer: 'Firefox',
          version: userAgent.match(typeObj['Firefox'])[1]
        }
      }
      if (isOpera) {
        return {
          broswer: 'Opera',
          version: userAgent.match(typeObj['Opera'])[1]
        }
      }
      if (isSafari) {
        return {
          broswer: 'Safari',
          version: userAgent.match(typeObj['Safari'])[1]
        }
      }
      if (isChrome) {
        return {
          broswer: 'Chrome',
          version: userAgent.match(typeObj['Chrome'])[1]
        }
      }
      if (isEdge) {
        return {
          broswer: 'Edge',
          version: userAgent.match(typeObj['Edge'])[1]
        }
      }
      return {
        broswer: false,
        version: false
      }
    },
    isIE() {
      var userAgent = navigator.userAgent // 取得浏览器的userAgent字符串
      var isOpera = userAgent.indexOf('Opera') > -1 // 判断是否Opera浏览器
      var isIE = userAgent.indexOf('compatible') > -1 && userAgent.indexOf('MSIE') > -1 && !isOpera // 判断是否IE浏览器
      if (isIE) {
        return true
      } else {
        return false
      }
    },
    IEVersion() {
      var userAgent = navigator.userAgent // 取得浏览器的userAgent字符串
      var isIE = userAgent.indexOf('compatible') > -1 && userAgent.indexOf('MSIE') > -1 // 判断是否IE<11浏览器
      // var isEdge = userAgent.indexOf('Edge') > -1 && !isIE // 判断是否IE的Edge浏览器
      var isIE11 = userAgent.indexOf('Trident') > -1 && userAgent.indexOf('rv:11.0') > -1
      if (isIE) {
        var reIE = new RegExp('MSIE (\\d+\\.\\d+);')
        reIE.test(userAgent)
        var fIEVersion = parseFloat(RegExp['$1'])
        if (fIEVersion === 7) {
          return {
            broswer: 'IE',
            version: 7
          }
        } else if (fIEVersion === 8) {
          return {
            broswer: 'IE',
            version: 8
          }
        } else if (fIEVersion === 9) {
          return {
            broswer: 'IE',
            version: 9
          }
        } else if (fIEVersion === 10) {
          return {
            broswer: 'IE',
            version: 10
          }
        } else {
          return {
            broswer: 'IE',
            version: 6
          }
        }
      } else if (isIE11) {
        return {
          broswer: 'IE',
          version: 11
        }
      } else {
        return false // 不是ie浏览器
      }
    },
    getValiBroswer(obj = {}) {
      var valiObj = {
        Edge: false,
        IE: false,
        Firefox: '72.0.1',
        Chrome: '80.0.3945.117',
        Opera: false,
        Safari: '72.0.1'
      }
      valiObj = Object.assign(valiObj, obj)
      return valiObj
    },
    valiBroswer(obj) {
      var curobj = this.getBrowserType()
      var valiObj = obj || this.getValiBroswer()
      var result = valiObj[curobj.broswer]
      if (result === true) {
        return true
      } else if (result === false) {
        return false
      } else {
        return curobj.version.split('.')[0] >= result.split('.')[0]
      }
    },
    getPromptMsg(promptMsgdefault = {}) {
      var curobj = this.getBrowserType()
      var promptMsg = {
        Edge: '<p>系统监测到您使用的是Edge浏览器，它可能会带来安全风险。</p><p>请下载并安装谷歌，火狐等主流浏览器以提供更好更快的互联网体验。</p><p>我们建议您选择一个不同的浏览器。</p>',
        IE: '<p>系统监测到您使用的是过时的ie浏览器，它可能会带来安全风险。</p><p>请下载并安装谷歌，火狐等主流浏览器以提供更好更快的互联网体验。</p><p>我们建议您选择一个不同的浏览器。</p>',
        Firefox: '<p>系统监测到您使用的是过时的火狐老版本浏览器。</p><p>请更新您的的浏览器至最新版本或下载安装谷歌等主流浏览器以支持新的功能，提供更好更快的互联网体验。</p><p>我们建议您更新浏览器版本或选择一个不同的浏览器。</p>',
        Chrome: '<p>系统监测到您使用的是过时的谷歌老版本浏览器。</p><p>请更新您的的浏览器至最新版本以支持新的功能，提供更好更快的互联网体验。</p><p>我们建议您更新浏览器版本或选择一个不同的浏览器。</p>',
        Opera: '<p>系统监测到您使用的是过时的Opera浏览器。</p><p>请下载并安装谷歌，火狐等主流浏览器以提供更好更快的互联网体验。</p><p>我们建议您更新浏览器版本或选择一个不同的浏览器。</p>',
        Safari: '<p>系统监测到您使用的是过时的谷歌老版本浏览器。</p><p>请更新您的的浏览器至最新版本以支持新的功能，提供更好更快的互联网体验。</p><p>我们建议您更新浏览器版本或选择一个不同的浏览器。</p>',
        default: '<p>系统监测到您使用的是非专业的浏览器。</p><p>请下载并安装谷歌，火狐等主流浏览器以提供更好更快的互联网体验。</p><p>我们建议您更新浏览器版本或选择一个不同的浏览器。</p>'
      }
      Object.assign(promptMsg, promptMsgdefault)
      if (promptMsg[curobj.broswer]) {
        return promptMsg[curobj.broswer]
      } else {
        return promptMsg['default']
      }
    },
    showTooltip(msg, obj) {
      var broswerTipArr = {
        Firefox: {
          href: 'http://www.mozilla.org/sv-SE/firefox/new',
          img: './static/images/browsers/firefox.png'
        },
        Opera: {
          href: 'http://www.opera.com/download/',
          img: './static/images/browsers/opera.png'
        },
        Chrome: {
          href: 'http://www.google.com/chrome?hl=sv',
          img: './static/images/browsers/chrome.png'
        },
        Safari: {
          href: 'http://www.apple.com/se/safari/',
          img: './static/images/browsers/safari.png'
        },
        Edge: {
          href: 'http://windows.microsoft.com/sv-SE/internet-explorer/downloads/ie',
          img: './static/images/browsers/ie.png" alt="Internet Explorer 9'
        }
      }
      msg = msg || this.getPromptMsg()
      var browerstr = ''
      obj = obj || broswerTipArr
      for (var i in obj) {
        if (obj[i]) {
          browerstr += '<a href="' + broswerTipArr[i].href + '" class="browserLink" title=""' + i + '"" target="_blank"><img class="browserIcon" src="' + broswerTipArr[i].img + '" alt="Firefox" /></a>'
        }
      }
      var tooltipStr = `<div class="killie">
        <div  class="killie-main">
        <h1>请更新或升级你的浏览器!</h1>
        <div class="main-msg">${msg}</div>
        <h1>选择一个浏览器下载并安装:</h1>
        <div class="browerList"></div>
         ${browerstr}
        </div>
      </div>`
      document.getElementById('app').innerHTML = tooltipStr
    }
  },
  urlFn: { // url函数
    getRootPath() {
      /* 获取项目根路径url,路径后面默认没有斜杠 */
      let curWwwPath = window.document.location.href
      let pathName = window.document.location.pathname
      let pos = curWwwPath.indexOf(pathName)
      let localhostPaht = curWwwPath.substring(0, pos)
      let projectName = pathName.substring(0, pathName.substr(1).indexOf('/') + 1)
      return (localhostPaht + projectName)
    },
    getRootUrl() {
      /* 获取项目根路径url,路径后面默认没有斜杠 */
      let url = window.location.protocol + '//' + window.location.host
      // url += basePath;
      url = url.substr(url.length - 1, 2) === '/' ? url.substr(0, url.length - 2) : url
      return url
    },
    getUrlParams(name) {
      /* 获取网址参数 */
      let reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)')
      let r = decodeURI(window.location.search).substr(1).match(reg)
      if (r !== null) return r[2]
      return null
    },
    getUrlAllParams(url) {
      /* 获取全部url参数,并转换成json对象 */
      url = url || window.location.href
      let _pa = url.substring(url.indexOf('?') + 1)
      let _arrS = _pa.split('&')
      let _rs = {}
      for (let i = 0, _len = _arrS.length; i < _len; i++) {
        let pos = _arrS[i].indexOf('=')
        if (pos === -1) {
          continue
        }
        let name = _arrS[i].substring(0, pos)
        let value = window.decodeURIComponent(_arrS[i].substring(pos + 1))
        _rs[name] = value
      }
      return _rs
    },
    delParamsUrl(url, name) {
      /* 删除url指定参数，返回url */
      url = url || window.location.href
      let baseUrl = url.split('?')[0] + '?'
      let query = url.split('?')[1]
      if (query.indexOf(name) > -1) {
        let obj = {}
        let arr = query.split('&')
        for (let i = 0; i < arr.length; i++) {
          arr[i] = arr[i].split('=')
          obj[arr[i][0]] = arr[i][1]
        };
        delete obj[name]
        let url = baseUrl + JSON.stringify(obj).replace(/[\"\{\}]/g, '').replace(/\:/g, '=').replace(/\,/g, '&')
        return url
      } else {
        return url
      }
    },
    objToQueryUrlString(obj) {
      /* @description   对象序列化(对象转成url参数) @param  {Object} obj  @return {String} */
      if (!obj) return ''
      let pairs = []
      for (let key in obj) {
        let value = obj[key]

        if (value instanceof Array) {
          for (let i = 0; i < value.length; ++i) {
            pairs.push(encodeURIComponent(key + '[' + i + ']') + '=' + encodeURIComponent(value[i]))
          }
          continue
        }
        pairs.push(encodeURIComponent(key) + '=' + encodeURIComponent(obj[key]))
      }
      return pairs.join('&')
    }
  },
  DateFn: { // 时间处理函数
    formatDate(date, format) {
      /* 通用化格式时间 */
      // new Date( year, month, date, hrs, min, sec)
      // new Date() ;     //参数可以为整数; 也可以为字符串; 但格式必须正确
      // examplenew Date(2009,1,1);       //正确  new Date("2009/1/1");    //正确
      // example  formatDate(new Date(), "当前日期为：YYYY-MM-DD，星期w，为第qq季度，时间为：hh:mm:ss:c")
      date = new Date(date)
      let o = {
        'M+': date.getMonth() + 1, // month  MM
        'D+': date.getDate(), // day  DD
        'h+': date.getHours(), // hour  hh
        'm+': date.getMinutes(), // minute mm
        's+': date.getSeconds(), // second ss
        'q+': Math.floor((date.getMonth() + 3) / 3), // quarter 季度 q
        'c': date.getMilliseconds(), // millisecond 毫秒 c
        'w': ['一', '二', '三', '四', '五', '六', '日'][date.getDay() - 1] // week 星期 w
      }
      if (/(Y+)/.test(format)) { // year  YYYY
        format = format.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
      }
      for (let k in o) {
        if (new RegExp('(' + k + ')').test(format)) {
          format = format.replace(RegExp.$1, RegExp.$1.length === 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length))
        }
      }
      return format
    },
    parserDate(date) { // 如何将标准时间 Thu Mar 07 2019 12:00:00 GMT+0800 (中国标准时间)转换为2019-03-07 12:00:00
      date = new Date(date)
      let resDate = date.getFullYear() + '-' + (function (p) {
        return p < 10 ? '0' + p : p
      })(date.getMonth() + 1) + '-' + (function (p) {
        return p < 10 ? '0' + p : p
      })(date.getDate())
      let resTime = (function (p) {
        return p < 10 ? '0' + p : p
      })(date.getHours()) + ':' + (function (p) {
        return p < 10 ? '0' + p : p
      })(date.getMinutes()) + ':' + (function (p) {
        return p < 10 ? '0' + p : p
      })(date.getSeconds())
      return resDate + ' ' + resTime
    },
    parseSandardDate(date) { // 如何将2019-03-07 12:00:00转换为标准时间 Thu Mar 07 2019 12:00:00 GMT+0800 (中国标准时间)
      let t = Date.parse(date)
      if (!isNaN(t)) {
        return new Date(Date.parse(date.replace(/-/g, '/')))
      } else {
        return new Date()
      }
    },
    getmillisecond(time1) { // 时间格式‘2016 - 01 - 01 17: 22: 37’字符串转为时间戳（毫秒）
      let date = new Date(time1.replace(/-/g, '/')) // 开始时间
      return date.getTime()
    },
    betweenTime(date1, date2) {
      date1 = new Date(date1.replace(/-/g, '/'))
      date2 = new Date(date2.replace(/-/g, '/'))
      let date3 = date2.getTime() - date1.getTime() // 时间差的毫秒数
      // 计算出相差天数
      let days = Math.floor(date3 / (24 * 3600 * 1000))
      // 计算出小时数
      let leave1 = date3 % (24 * 3600 * 1000) // 计算天数后剩余的毫秒数
      let hours = Math.floor(leave1 / (3600 * 1000))
      // 计算相差分钟数
      let leave2 = leave1 % (3600 * 1000) // 计算小时数后剩余的毫秒数
      let minutes = Math.floor(leave2 / (60 * 1000))
      // 计算相差秒数
      let leave3 = leave2 % (60 * 1000) // 计算分钟数后剩余的毫秒数
      let seconds = Math.round(leave3 / 1000)
      //
      let str = ''
      if (days > 0) {
        str += days + '天 '
      }
      if (hours > 0) {
        str += hours + '小时 '
      }
      if (minutes > 0) {
        str += minutes + ' 分钟'
      }
      if (seconds > 0) {
        str += seconds + ' 秒'
      }
      return str
    },
    betweenTimeByLong(date1, date2) {
      let date3 = date2 - date1 // 时间差的毫秒数
      // 计算出相差天数
      let days = Math.floor(date3 / (24 * 3600 * 1000))
      // 计算出小时数
      let leave1 = date3 % (24 * 3600 * 1000) // 计算天数后剩余的毫秒数
      let hours = Math.floor(leave1 / (3600 * 1000))
      // 计算相差分钟数
      let leave2 = leave1 % (3600 * 1000) // 计算小时数后剩余的毫秒数
      let minutes = Math.floor(leave2 / (60 * 1000))
      // 计算相差秒数
      let leave3 = leave2 % (60 * 1000) // 计算分钟数后剩余的毫秒数
      let seconds = Math.round(leave3 / 1000)
      //
      let str = ''
      if (days > 0) {
        str += days + '天 '
      }
      if (hours > 0) {
        str += hours + '小时 '
      }
      if (minutes > 0) {
        str += minutes + ' 分钟'
      }
      if (seconds > 0) {
        str += seconds + ' 秒'
      }
      return str
    },
    formatDateValue(value) {
      /* 检测年月日时分秒20190609110000 返回yyyy-MM-dd hh:mm:ss */
      let me = this
      if (typeof (value) === 'undefined' || value === '') {
        return ''
      }
      if (value.length !== 14) { // 长度14
        return value
      } else if (!(value.indexOf('15') === 0 || value.indexOf('16') === 0 || value.indexOf('17') === 0 ||
          value.indexOf('19') === 0 || value.indexOf('20') === 0)) {
        // 不是18或者19或者20开头
        return value
      } else if (isNaN(value)) { // 是字符串（非数字）
        return value
      } else {
        let yue = me.strToInt(value.substring(4, 6))
        let day = me.strToInt(value.substring(6, 8))
        let hour = me.strToInt(value.substring(8, 10))
        let min = me.strToInt(value.substring(10, 12))
        let second = strToInt(value.substring(12, 14))
        if (yue < 1 || yue > 12) { // 月小于1大于12
          return value
        } else if (day < 1 || day > 31) { // 日小于1大于31
          return value
        } else if (hour < 0 || hour > 24) { // 时 小于0大于24
          return value
        } else if (min < 0 || min > 59) { // 分 小于0大于59
          return value
        } else if (second < 0 || second > 59) { // 秒 小于0大于59
          return value
        } else {
          return value.substring(0, 4) + '-' + value.substring(4, 6) + '-' + value.substring(6, 8) +
            ' ' + value.substring(8, 10) + ':' + value.substring(10, 12) + ':' + value.substring(12, 14)
        }
      }
    },
    getMonths(time, len, direction) {
      /* 返回指定长度的月份集合 */
      /*
       * @param  {time} 时间
       * @param  {len} 长度
       * @param  {direction} 方向：  1: 前几个月;  2: 后几个月;  3:前后几个月  默认 3
       * @return {Array} 数组
       * @example   getMonths('2018-1-29', 6, 1)  // ->  ["2018-1", "2017-12", "2017-11", "2017-10", "2017-9", "2017-8", "2017-7"]
       */
      let mm = new Date(time).getMonth()
      let yy = new Date(time).getFullYear()
      direction = isNaN(direction) ? 3 : direction
      let index = mm
      let cutMonth = function (index) {
        if (index <= len && index >= -len) {
          return direction === 1 ? formatPre(index).concat(cutMonth(++index)) :
            direction === 2 ? formatNext(index).concat(cutMonth(++index)) : formatCurr(index).concat(cutMonth(++index))
        }
        return []
      }
      let formatNext = function (i) {
        let y = Math.floor(i / 12)
        let m = i % 12
        return [yy + y + '-' + (m + 1)]
      }
      let formatPre = function (i) {
        let y = Math.ceil(i / 12)
        let m = i % 12
        m = m === 0 ? 12 : m
        return [yy - y + '-' + (13 - m)]
      }
      let formatCurr = function (i) {
        let y = Math.floor(i / 12)
        let yNext = Math.ceil(i / 12)
        let m = i % 12
        let mNext = m === 0 ? 12 : m
        return [yy - yNext + '-' + (13 - mNext), yy + y + '-' + (m + 1)]
      }
      // 数组去重
      let unique = function (arr) {
        if (Array.hasOwnProperty('from')) {
          return Array.from(new Set(arr))
        } else {
          let n = {}
          let r = []
          for (let i = 0; i < arr.length; i++) {
            if (!n[arr[i]]) {
              n[arr[i]] = true
              r.push(arr[i])
            }
          }
          return r
        }
      }
      return direction !== 3 ? cutMonth(index) : unique(cutMonth(index).sort(function (t1, t2) {
        return new Date(t1).getTime() - new Date(t2).getTime()
      }))
    },
    getDays(time, len, diretion) {
      /* 返回指定长度的天数集合 */
      /**
       * @param  {time} 时间
       * @param  {len} 长度
       * @param  {direction} 方向： 1: 前几天;  2: 后几天;  3:前后几天  默认 3
       * @return {Array} 数组
       *
       * @example date.getDays('2018-1-29', 6) // -> ["2018-1-26", "2018-1-27", "2018-1-28", "2018-1-29", "2018-1-30", "2018-1-31", "2018-2-1"]
       */
      let tt = new Date(time)
      let getDay = function (day) {
        let t = new Date(time)
        t.setDate(t.getDate() + day)
        let m = t.getMonth() + 1
        return t.getFullYear() + '-' + m + '-' + t.getDate()
      }
      let arr = []
      if (diretion === 1) {
        for (let i = 1; i <= len; i++) {
          arr.unshift(getDay(-i))
        }
      } else if (diretion === 2) {
        for (let i = 1; i <= len; i++) {
          arr.push(getDay(i))
        }
      } else {
        for (let i = 1; i <= len; i++) {
          arr.unshift(getDay(-i))
        }
        arr.push(tt.getFullYear() + '-' + (tt.getMonth() + 1) + '-' + tt.getDate())
        for (let i = 1; i <= len; i++) {
          arr.push(getDay(i))
        }
      }
      return diretion === 1 ? arr.concat([tt.getFullYear() + '-' + (tt.getMonth() + 1) + '-' + tt.getDate()]) :
        diretion === 2 ? [tt.getFullYear() + '-' + (tt.getMonth() + 1) + '-' + tt.getDate()].concat(arr) : arr
    },
    formatHMS(s) {
      /* 秒转化为时分秒 */
      /**
       * @param  {s} 秒数
       * @return {String} 字符串
       *
       * @example formatHMS(3610) // -> 1h0m10s
       */
      let str = ''
      if (s > 3600) {
        str = Math.floor(s / 3600) + 'h' + Math.floor(s % 3600 / 60) + 'm' + s % 60 + 's'
      } else if (s > 60) {
        str = Math.floor(s / 60) + 'm' + s % 60 + 's'
      } else {
        str = s % 60 + 's'
      }
      return str
    },
    getweek(date) {
      /* 获取星期几 */
      date = new Date(date)
      return ['一', '二', '三', '四', '五', '六', '日'][date.getDay() - 1] // week 星期
    },
    getquarter(date) {
      /* 获取第几季度 */
      d = new Date(date)
      return ['第一季度', '第二季度', '第三季度', '第四季度'][Math.floor((d.getMonth() + 3) / 3) - 1] // quarter 季度 q
    },
    getMonthOfDay(time) {
      /* 获取某月有多少天 */
      let date = new Date(time)
      let year = date.getFullYear()
      let mouth = date.getMonth() + 1
      let days

      // 当月份为二月时，根据闰年还是非闰年判断天数
      if (mouth === 2) {
        days = (year % 4 === 0 && year % 100 === 0 && year % 400 === 0) || (year % 4 === 0 && year % 100 !== 0) ? 28 : 29
      } else if (mouth === 1 || mouth === 3 || mouth === 5 || mouth === 7 || mouth === 8 || mouth === 10 || mouth === 12) {
        // 月份为：1,3,5,7,8,10,12 时，为大月.则天数为31；
        days = 31
      } else {
        // 其他月份，天数为：30.
        days = 30
      }
      return days
    },
    getYearOfDay(time) {
      /* 获取某年有多少天 */
      let firstDayYear = this.getFirstDayOfYear(time)
      let lastDayYear = this.getLastDayOfYear(time)
      let numSecond = (new Date(lastDayYear).getTime() - new Date(firstDayYear).getTime()) / 1000
      return Math.ceil(numSecond / (24 * 3600))
    },
    getFirstDayOfYear(time) {
      /* 获取某年的第一天 */
      let year = new Date(time).getFullYear()
      return year + '-01-01 00:00:00'
    },
    getLastDayOfYear(time) {
      /* 获取某年最后一天 */
      let year = new Date(time).getFullYear()
      let dateString = year + '-12-01 00:00:00'
      let endDay = this.getMonthOfDay(dateString)
      return year + '-12-' + endDay + ' 23:59:59'
    },
    getDayOfYear(time) {
      /* 获取某个日期是当年中的第几天 */
      return Math.ceil(((new Date(time).getTime() - new Date(this.getFirstDayOfYear(time)).getTime()) / 1000) / (24 * 3600))
    },
    getDayOfYearWeek(time) {
      /* 获取某个日期在这一年的第几周 */
      return Math.ceil(this.getDayOfYear(time) / 7)
    },
    datedifferencedays(sDate1, sDate2) { // 获取两个日期之间的时间间隔 sDate1和sDate2默认是2019-6-8或标准时间格式
      let dateSpan = (new Date(sDate2.replace(/-/g, '/'))) - (new Date(sDate1.replace(/-/g, '/')))
      return Math.floor(Math.abs(dateSpan) / (24 * 3600 * 1000))
    },
    CurentTime() { // 返回"2019-04-18 15:49:04"
      let date = new Date()
      return this.formatDate(date, 'YYYY-MM-DD hh:mm:ss')
      // let now = new Date();
      // let year = now.getFullYear(); //年
      // let month = now.getMonth() + 1; //月
      // let day = now.getDate(); //日
      // let hh = now.getHours(); //时
      // let mm = now.getMinutes(); //分
      // let ss = now.getSeconds(); //秒
      // let clock = year + "-";
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
    getDiffYear(nowValue) {
      // 20140102101010
      let reg1 = /^((?!0000)[0-9]{4}((0[1-9]|1[0-2])(0[1-9]|1[0-9]|2[0-8])|(0[13-9]|1[0-2])(29|30)|(0[13578]|1[02])31)|([0-9]{2}(0[48]|[2468][048]|[13579][26])|(0[48]|[2468][048]|[13579][26])00)0229)(([0-2][0-3])|([0-1][0-9]))[0-5][0-9][0-5][0-9]$/
      // 2015-05-23T03:00:00.000Z
      let reg2 = /^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d.\d\d\dZ$/
      if (reg1.test(nowValue) || reg2.test(nowValue)) {
        let year = 0
        let month = 0
        let day = 0
        if (reg1.test(nowValue)) {
          year = nowValue.substring(0, 4)
          month = nowValue.substring(4, 6)
          day = nowValue.substring(6, 8)
        } else {
          year = nowValue.substring(0, 4)
          month = nowValue.substring(5, 7)
          day = nowValue.substring(8, 10)
        }
        let birthDate = new Date(year + '/' + month + '/' + day)
        let returnAge
        let birthYear = birthDate.getYear()
        let birthMonth = birthDate.getMonth() + 1
        let birthDay = birthDate.getDate()
        d = new Date()
        let nowYear = d.getYear()
        let nowMonth = d.getMonth() + 1
        let nowDay = d.getDate()

        if (nowYear === birthYear) {
          returnAge = 0 // 同年 则为0岁
        } else {
          let ageDiff = nowYear - birthYear // 年之差
          if (ageDiff > 0) {
            if (nowMonth === birthMonth) {
              let dayDiff = nowDay - birthDay // 日之差
              if (dayDiff < 0) {
                returnAge = ageDiff - 1
              } else {
                returnAge = ageDiff
              }
            } else {
              let monthDiff = nowMonth - birthMonth // 月之差
              if (monthDiff < 0) {
                returnAge = ageDiff - 1
              } else {
                returnAge = ageDiff
              }
            }
          } else {
            returnAge = -1 // 返回-1 表示出生日期输入错误 晚于今天
          }
        }
        return returnAge // 返回周岁年龄
      } else {
        return ''
      }
    },
    formatRemainTime(endTime) {
      /* 格式化现在距${endTime}（2030-10-5）的剩余时间. {Date} endTime  @return {String} */
      let startDate = new Date() // 开始时间
      let endDate = new Date(endTime) // 结束时间
      let t = endDate.getTime() - startDate.getTime() // 时间差
      let d = 0
      let h = 0
      let m = 0
      let s = 0
      if (t >= 0) {
        d = Math.floor(t / 1000 / 3600 / 24)
        h = Math.floor(t / 1000 / 60 / 60 % 24)
        m = Math.floor(t / 1000 / 60 % 60)
        s = Math.floor(t / 1000 % 60)
      }
      return (function (dd) {
        return Math.round(dd * 100) / 100
      })(d) + '天 ' + (function (dd) {
        return Math.round(dd * 100) / 100
      })(h) + '小时 ' + (function (dd) {
        return Math.round(dd * 100) / 100
      })(m) + '分钟 ' + (function (dd) {
        return Math.round(dd * 100) / 100
      })(s) + '秒'
    },
    formatFrontTime(startTime) {
      /* 格式化startTime到现在的逝去时间. {Date} startTime  @return {String} */
      let startDate = new Date(startTime) // 开始时间
      let endDate = new Date() // 结束时间
      let t = endDate.getTime() - startDate.getTime() // 时间差
      let d = 0
      let h = 0
      let m = 0
      let s = 0
      if (t >= 0) {
        d = Math.floor(t / 1000 / 3600 / 24)
        h = Math.floor(t / 1000 / 60 / 60 % 24)
        m = Math.floor(t / 1000 / 60 % 60)
        s = Math.floor(t / 1000 % 60)
      }
      return (function (dd) {
        return Math.round(dd * 100) / 100
      })(d) + '天 ' + (function (dd) {
        return Math.round(dd * 100) / 100
      })(h) + '小时 ' + (function (dd) {
        return Math.round(dd * 100) / 100
      })(m) + '分钟 ' + (function (dd) {
        return Math.round(dd * 100) / 100
      })(s) + '秒'
    }
  },
  ArrayFn: { // 数组处理函数
    groupbytype(arr, field) {
      let map = {}
      let dest = []
      for (let i = 0; i < arr.length; i++) {
        let ai = arr[i]
        if (!map[ai[field]]) {
          dest.push({
            Group: ai[field],
            data: [ai]
          })
          map[ai[field]] = ai
        } else {
          for (let j = 0; j < dest.length; j++) {
            let dj = dest[j]
            if (dj[field] === ai[field]) {
              dj.data.push(ai)
              break
            }
          }
        }
      }
      return dest
    },
    arrmovebit(arr, movedirection, movebit) {
      for (let i = 0; i < movebit; i++) {
        if (movedirection === 'right') {
          arr.unshift(arr.pop())
        } else {
          arr.push(arr.shift())
        }
      }
      return arr
    },
    arrunique(arr) {
      /* 数组去重 */
      if (Array.hasOwnProperty('from')) {
        return Array.from(new Set(arr))
      } else if (Array.hasOwnProperty('some')) { // Array.hasOwnProperty('some') || Array.hasOwnProperty("indexOf")
        let tmp = []
        for (let i in arr) {
          if (!(tmp.some(function (currentValue) {
              return currentValue === arr[i]
            }))) {
            // if (tmp.indexOf(arr[i]) === -1) {
            tmp.push(arr[i])
          }
        }
        return tmp
      } else {
        let n = {}
        let r = []
        for (let i = 0; i < arr.length; i++) {
          if (!n[arr[i]]) {
            n[arr[i]] = true
            r.push(arr[i])
          }
        }
        return r
      }
    },
    arrsort(srry, key, isasc) {
      srry.sort(function (a, b) {
        if (isasc === 'asc') {
          if (typeof (a[key]) === 'string' && typeof (b[key]) === 'string') {
            return (a[key].toString()).localeCompare(b[key].toString())
          }
          return a[key] - b[key]
        } else {
          if (typeof (a[key]) === 'string' && typeof (b[key]) === 'string') {
            return (b[key].toString()).localeCompare(a[key].toString())
          }
          return b[key] - a[key]
        }
      })
      return srry
    },
    muchfieldarrsort(sarr, keys) {
      /** sarr：原始数组。 keys:要排序的多个字段,必须为数组 */
      return sarr.sort(compare)
      function compare(a, b) { // 按合并类型递归排序
        let c = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : groupfieldarr[0];
        let i = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;
        if (a[keys] === b[keys]) { // 等于的话进行判断是否还有后续字段需要排序，没有则返回0；有则递归进行后续字段排序处理。
          if (i === (keys.length - 1)) { // 没有后续字段
            i = 0
            return 0
          }
          i += 1
          return compare(a, b, keys[i], i) // 递归排序后续字段
        } else if (a[keys] > b[keys]) { // 大于返回1
          return 1
        } else { // 小于返回-1
          return -1
        }
      }
    },
    contains(arr, value) {
      /* 判断一个元素是否在数组中 */
      return arr.some(function (currentValue) {
        return currentValue === value
      })
      // return arr.indexOf(val) !== -1 ? true : false;
    },
    getIndex(arr, obj) { // 根据数据取得再数组中的索引
      // for (let i = 0; i < arr.length; i++) {
      //     if (obj === arr[i]) {
      //         return i;
      //     }
      // }
      // return -1;

      let i = 0
      let bool = arr.some(function (currentValue, index) {
        i = index
        return currentValue === obj
      })
      if (bool) return i
      return -1
    },
    remove(arr, ele) { // 移除数组中的某元素
      // let index = arr.indexOf(ele);
      // if (index > -1) {
      //     arr.splice(index, 1);
      // }
      for (let i = 0; i < arr.length; i++) {
        if (ele === arr[i]) {
          arr.splice(i, 1)
          break
        }
      }
      return arr
    },
    each(arr, fn) {
      /* 数组each方法 */
      /**
       * @param  {arr} 数组
       * @param  {fn} 回调函数
       * @return {undefined}
       */
      fn = fn || Function
      let a = []
      let args = Array.prototype.slice.call(arguments, 1)
      for (let i = 0; i < arr.length; i++) {
        let res = fn.apply(arr, [arr[i], i].concat(args))
        if (res !== null) a.push(res)
      }
    },
    map(arr, fn, thisObj) {
      /* 改造数组 */
      /**
       * @param  {arr} 数组
       * @param  {fn} 回调函数
       * @param  {thisObj} this指向
       * @return {Array}
       */
      let scope = thisObj || window
      let a = []
      for (let i = 0, j = arr.length; i < j; ++i) {
        let res = fn.call(scope, arr[i], i, this)
        if (res !== null) a.push(res)
      }
      return a
    },
    sort(arr, type) {
      /* 数组排序2 */
      /**
       * @param  {arr} 数组
       * @param  {type} 1：从小到大   2：从大到小   3：随机
       * @return {Array}
       */
      type = type || 1
      return arr.sort(function (a, b) {
        switch (type) {
          case 1:
            return a - b
          case 2:
            return b - a
          case 3:
            return Math.random() - 0.5
          default:
            return arr
        }
      })
    },
    union(a, b) {
      /* 求两个集合的并集 */
      let newArr = a.concat(b)
      return this.unique(newArr)
    },
    intersect(a, b) {
      /* 求两个集合的交集 */
      let _this = this
      a = this.unique(a)
      return this.map(a, function (o) {
        return _this.contains(b) ? o : null
      })
    },
    formArray(ary) {
      /* 将类数组转换为数组的方法 */
      let arr = []
      if (Array.isArray(ary)) {
        arr = ary
      } else {
        arr = Array.prototype.slice.call(ary)
      };
      return arr
    },
    max(arr) {
      /* 最大值 */
      return Math.max.apply(null, arr)
    },
    min(arr) {
      /* 最小值 */
      return Math.min.apply(null, arr)
    },
    sum(arr) {
      /* 求和 */
      return arr.reduce(function (pre, cur) {
        return pre + cur
      })
    },
    average(arr) {
      /* 平均值 */
      return this.sum(arr) / arr.length
    },
    toArray(str, tag) { // 将一个字符串用给定的tag字符分割成数组
      tag = tag || ''
      if (str.indexOf(tag) !== -1) {
        return str.split(tag)
      } else {
        if (str !== '') {
          return [str.toString()]
        } else {
          return []
        }
      }
    }
  },
  StringFn: { // 字符串处理函数
    randomStr(len = 32) { // 生成随机字符串
      const $chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890';
      const maxPos = $chars.length;
      let str = '';
      for (let i = 0; i < len; i++) {
        str += $chars.charAt(Math.floor(Math.random() * maxPos));
      }
      return str;
    },
    trim(str, type) {
      /* 去除空格 @param  {str} @param  {type} 1-所有空格  2-前后空格  3-前空格 4-后空格 @return {String} */
      type = type || 1
      switch (type) {
        case 1:
          return str.replace(/\s+/g, '')
        case 2:
          return str.replace(/(^\s*)|(\s*$)/g, '')
        case 3:
          return str.replace(/(^\s*)/g, '')
        case 4:
          return str.replace(/(\s*$)/g, '')
        default:
          return str
      }
    },
    interceptString(str, len) { // 字符串截取后面加入...
      if (str.length > len) {
        return str.substring(0, len) + '...'
      } else {
        return str
      }
    },
    toNumber(str) { // 获取字符串中数字
      return str.replace(/\D/g, '')
    },
    toCN(str) { // 保留中文
      let regEx = /[^\u4e00-\u9fa5\uf900-\ufa2d]/g
      return str.replace(regEx, '')
    },
    toInt(str) { // 转成int
      let temp = str.replace(/\D/g, '')
      return isNaN(parseInt(temp)) ? str.toString() : parseInt(temp)
    },
    startsWith(str, tag) { // 是否是以XX开头
      return str.substring(0, tag.length) === tag
    },
    endWith(str, tag) { // 是否已XX结尾
      return str.substring(str.length - tag.length) === tag
    },
    replaceAll(str, from, to) { // 替换全部 将str中的所有from替换为to
      return str.replace(new RegExp(from, 'gm'), to)
    },
    changeCase(str, type) {
      /* type:  1:首字母大写  2：首字母小写  3：大小写转换  4：全部大写  5：全部小写  @return {String} */
      type = type || 4
      switch (type) {
        case 1:
          return str.replace(/\b\w+\b/g, function (word) {
            return word.substring(0, 1).toUpperCase() + word.substring(1).toLowerCase()
          })
        case 2:
          return str.replace(/\b\w+\b/g, function (word) {
            return word.substring(0, 1).toLowerCase() + word.substring(1).toUpperCase()
          })
        case 3:
          return str.split('').map(function (word) {
            if (/[a-z]/.test(word)) {
              return word.toUpperCase()
            } else {
              return word.toLowerCase()
            }
          }).join('')
        case 4:
          return str.toUpperCase()
        case 5:
          return str.toLowerCase()
        default:
          return str
      }
    },
    StringBuffer() { // 字符串缓存
      let StringBufferarr = function () {
        this._strs = new Array()
      }
      StringBufferarr.prototype.append = function (str) {
        this._strs.push(str)
      }
      StringBufferarr.prototype.toString = function () {
        return this._strs.join('')
      }
      return new StringBufferarr()
    },
    filterTag(str) {
      /* 过滤html代码(把<>转换字符串) */
      let me = this
      str = me.replaceAll(str, /&/ig, '&amp;')
      str = me.replaceAll(str, /</ig, '&lt;')
      str = me.replaceAll(str, />/ig, '&gt;')
      str = me.replaceAll(str, ' ', '&nbsp;')
      return str
    }
  },
  QueryDataFn: { // QueryData ajax axios请求
    ajax(setting) { // 仿JQuery ajax请求
      /*
                  let url = 'http://demo.com/api'
                  例:
                  ToolFn.QueryDataFn.ajax({
                      url: url,
                      success: function(data) {

                      }
                  })
                  */
      // 设置参数的初始值
      let opts = {
        method: (setting.method || 'GET').toUpperCase(), // 请求方式
        url: setting.url || '', // 请求地址
        async: setting.async || true, // 是否异步
        dataType: setting.dataType || 'json', // 解析方式
        data: setting.data || '', // 参数
        success: setting.success || function () {}, // 请求成功回调
        error: setting.error || function () {} // 请求失败回调
      }
      // 参数格式化
      function params_format(obj) {
        let str = ''
        for (let i in obj) {
          str += i + '=' + obj[i] + '&'
        }
        return str.split('').slice(0, -1).join('')
      }
      // 创建ajax对象
      let xhr = new XMLHttpRequest()
      // 连接服务器open(方法GET/POST，请求地址， 异步传输)
      if (opts.method === 'GET') {
        xhr.open(opts.method, opts.url + '?' + params_format(opts.data), opts.async)
        xhr.send()
      } else {
        xhr.open(opts.method, opts.url, opts.async)
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded')
        xhr.send(opts.data)
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
      xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && (xhr.status === 200 || xhr.status === 304)) {
          switch (opts.dataType) {
            case 'json':
              let json = JSON.parse(xhr.responseText)
              opts.success(json)
              break
            case 'xml':
              opts.success(xhr.responseXML)
              break
            default:
              opts.success(xhr.responseText)
              break
          }
        }
      }
      xhr.onerror = function (err) {
        opts.error(err)
      }
    },
    // axios: function(url, setting = {}) { //仿axios请求
    //     /*
    //    let  url = 'http://demo.com/api'
    //     例:
    //         axios(url).
    //             then( res => {
    //                 console.log(res)
    //             }).catch( e => {
    //                 console.log(e)
    //             })
    //         axios(url, {
    //             method: 'POST',
    //         })
    //     */
    //     //设置参数的初始值
    //     let opts = {
    //         method: (setting.method || 'GET').toUpperCase(), //请求方式
    //         headers: setting.headers || {}, // 请求头设置
    //         credentials: setting.credentials || true, // 设置cookie是否一起发送
    //         body: setting.body || {},
    //         mode: setting.mode || 'cors', // 可以设置 cors, no-cors, same-origin
    //         redirect: setting.redirect || 'follow', // follow, error, manual
    //         cache: setting.cache || 'default' // 设置 cache 模式 (default, reload, no-cache)
    //     }
    //     let let dataType = setting.dataType || "json", // 解析方式
    //         data = setting.data || "" // 参数
    //     // 参数格式化
    //     function params_format(obj) {
    //         let str = ''
    //         for (let i in obj) {
    //             str += `${i}=${obj[i]}&`
    //         }
    //         return str.split('').slice(0, -1).join('')
    //     }

    //     if (opts.method === 'GET') {
    //         url = url + (data ? `?${params_format(data)}` : '')
    //     } else {
    //         setting.body = data || {}
    //     }
    //     return new Promise(function(resolve, reject){
    //         fetch(url, opts).then(async function res() {
    //             let data = dataType === 'text' ? await res.text() :
    //                 dataType === 'blob' ? await res.blob() : await res.json()
    //             resolve(data)
    //         }).catch(function(e){
    //             reject(e)
    //         })
    //     })
    // },
    queryAjax(queryUrl, queryParams, beforeSendCallback, completeCallback) {
      /* Ajax异步请求全局处理 */
      /*
       * queryUrl：请求地址；
       * queryParams：请求Data
       * beforeSendCallback：发送请求前要执行的回调函数
       * completeCallback：请求完成后要执行的回调函数
       * isfjroolUrl：是否带根路径
       * 需要引入JQuery2.5版本及以上，解决异步调用，这里可对全局ajax请求做超时或错误处理，全局打印请求结果
       * */
      let requesthead = {
        url: queryUrl,
        async: false,
        dataType: 'json',
        type: 'post',
        contentType: 'application/json;charset=UTF-8',
        beforeSend(XHR) {
          // 这里可全局处理加载
          if (beforeSendCallback) beforeSendCallback(XHR)
        },
        complete(XHR) {
          if (completeCallback) completeCallback(XHR)
          // 需要冲内存中获取最新的数据
          // sesionTimeOutHandle(XHR); //系统超时处理自定义
        },
        success(res) {
          console.log(res)
        },
        error(err) {
          // 这里可全局处理error
          console.log(err)
        }
      }

      if (queryParams) requesthead.data = queryParams
      let jsonData = $.ajax(requesthead).responseJSON
      if (!jsonData || jsonData.length === 0) {
        return
      }
      return jsonData
    }
  },
  DomFn: { // 操作dom方法
    $(selector) {
      /* 仿JQuery$选择器 */
      let type = selector.substring(0, 1)
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
    hasClass(ele, name) {
      /* 检测类名 */
      return ele.className.match(new RegExp('(\\s|^)' + name + '(\\s|$)'))
    },
    addClass(ele, name) {
      /* 添加类名 */
      if (!this.hasClass(ele, name)) ele.className += ' ' + name
    },
    removeClass(ele, name) {
      /* 删除类名 */
      if (this.hasClass(ele, name)) {
        let reg = new RegExp('(\\s|^)' + name + '(\\s|$)')
        ele.className = ele.className.replace(reg, '')
      }
    },
    replaceClass(ele, newName, oldName) {
      /* 替换类名 */
      this.removeClass(ele, oldName)
      this.addClass(ele, newName)
    },
    siblings(ele) {
      /* 获取兄弟节点 */
      let chid = ele.parentNode.children
      let eleMatch = []
      for (let i = 0, len = chid.length; i < len; i++) {
        if (chid[i] !== ele) {
          eleMatch.push(chid[i])
        }
      }
      return eleMatch
    },
    getByStyle(obj, name) {
      /* 获取行间样式属性 */
      if (obj.currentStyle) {
        return obj.currentStyle[name]
      } else {
        return getComputedStyle(obj, false)[name]
      }
    }
  },
  StorageFn: { // 浏览器缓存操作
    ls: window.localStorage,
    ss: window.sessionStorage,
    /* -----------------cookie--------------------- */
    setCookie(name, value, day) {
      /* 设置cookie */
      let setting = arguments[0]
      if (Object.prototype.toString.call(setting).slice(8, -1) === 'Object') {
        for (let i in setting) {
          let oDate = new Date()
          oDate.setDate(oDate.getDate() + day)
          document.cookie = i + '=' + setting[i] + ';expires=' + oDate
        }
      } else {
        let oDate = new Date()
        oDate.setDate(oDate.getDate() + day)
        document.cookie = name + '=' + value + ';expires=' + oDate
      }
    },
    getCookie(name) {
      /* 获取cookie */
      let arr = document.cookie.split('; ')
      for (let i = 0; i < arr.length; i++) {
        let arr2 = arr[i].split('=')
        if (arr2[0] === name) {
          return arr2[1]
        }
      }
      return ''
    },
    removeCookie(name) {
      /* 删除cookie */
      this.setCookie(name, 1, -1)
    },
    /* -----------------localStorage--------------------- */
    setLocal(key, val) {
      /* 设置localStorage */
      let setting = arguments[0]
      if (Object.prototype.toString.call(setting).slice(8, -1) === 'Object') {
        for (let i in setting) {
          this.ls.setItem(i, JSON.stringify(setting[i]))
        }
      } else {
        this.ls.setItem(key, JSON.stringify(val))
      }
    },
    getLocal(key) {
      /* 获取localStorage */
      if (key) return JSON.parse(this.ls.getItem(key))
      return null
    },
    removeLocal(key) {
      /* 移除localStorage */
      this.ls.removeItem(key)
    },
    clearLocal() {
      /* 移除所有localStorage */
      this.ls.clear()
    },
    /* -----------------sessionStorage--------------------- */
    setSession(key, val) {
      /* 设置sessionStorage */
      let setting = arguments[0]
      if (Object.prototype.toString.call(setting).slice(8, -1) === 'Object') {
        for (let i in setting) {
          this.ss.setItem(i, JSON.stringify(setting[i]))
        }
      } else {
        this.ss.setItem(key, JSON.stringify(val))
      }
    },
    getSession(key) {
      /* 获取sessionStorage */
      if (key) return JSON.parse(this.ss.getItem(key))
      return null
    },
    removeSession(key) {
      /* 移除sessionStorage */
      this.ss.removeItem(key)
    },
    clearSession() {
      /* 移除所有sessionStorage */
      this.ss.clear()
    }
  },
  loadFn: { // 加载函数
    loadImg(arr, callback) {
      /* 图片加载 */
      let arrImg = []
      for (let i = 0; i < arr.length; i++) {
        let img = new Image()
        img.src = arr[i]
        img.onload = function () {
          arrImg.push(this)
          if (arrImg.length === arr.length) {
            callback && callback(arrImg)
          }
        }
      }
    },
    loadAudio(src, callback) {
      /* 音频加载 */
      let audio = new Audio(src)
      audio.onloadedmetadata = callback
      audio.src = src
    },
    loadScript(url, callback) {
      /** 动态添加js */
      let script = document.createElement('script')
      script.type = 'text/javascript'
      if (typeof (callback) !== 'undefined') {
        if (script.readyState) {
          script.onreadystatechange = function () {
            if (script.readyState === 'loaded' || script.readyState === 'complete') {
              script.onreadystatechange = null
              callback()
            }
          }
        } else {
          script.onload = function () {
            callback()
          }
        }
      };
      script.src = url
      document.body.appendChild(script)
    },
    loadJSCDN(scripts, styles) {
      /** 动态在head添加js和style */
      let head = document.head || document.getElementsByTagName('head')[0]
      for (let i in scripts) {
        let script = document.createElement('script')
        script.setAttribute('src', scripts[i])
        head.appendChild(script)
      }
      for (let j in styles) {
        let style = document.createElement('link')
        style.setAttribute('href', styles[j])
        head.appendChild(style)
      }
    }
  },
  colorFn: { // 颜色处理函数
    getRandomColor() {
      /* 获取十六进制随机颜色 */
      return '#' + (function (h) {
        return new Array(7 - h.length).join('0') + h
      })((Math.random() * 0x1000000 << 0).toString(16))
      // return '#'+('00000'+Math.random()*0x1000000<<0).toString(16).slice(-6)
    },
    generateRandomColor() {
      /* 生成随机颜色:rgb(r,g,b) */
      let r = Math.floor(Math.random() * 256)
      let g = Math.floor(Math.random() * 256)
      let b = Math.floor(Math.random() * 256)
      return 'rgb(' + r + ',' + g + ',' + b + ')'
    },
    hsbTorgb(hsb) {
      /* hsb转化为rgb */
      let rgb = {}
      let h = Math.round(hsb.h)
      let s = Math.round(hsb.s * 255 / 100)
      let v = Math.round(hsb.b * 255 / 100)
      if (s === 0) {
        rgb.r = rgb.g = rgb.b = v
      } else {
        let t1 = v
        let t2 = (255 - s) * v / 255
        let t3 = (t1 - t2) * (h % 60) / 60
        if (h === 360) h = 0
        if (h < 60) {
          rgb.r = t1
          rgb.b = t2
          rgb.g = t2 + t3
        } else if (h < 120) {
          rgb.g = t1
          rgb.b = t2
          rgb.r = t1 - t3
        } else if (h < 180) {
          rgb.g = t1
          rgb.r = t2
          rgb.b = t2 + t3
        } else if (h < 240) {
          rgb.b = t1
          rgb.r = t2
          rgb.g = t1 - t3
        } else if (h < 300) {
          rgb.b = t1
          rgb.g = t2
          rgb.r = t2 + t3
        } else if (h < 360) {
          rgb.r = t1
          rgb.g = t2
          rgb.b = t1 - t3
        } else {
          rgb.r = 0
          rgb.g = 0
          rgb.b = 0
        }
      }
      return {
        r: Math.round(rgb.r),
        g: Math.round(rgb.g),
        b: Math.round(rgb.b)
      }
    },
    rgbTohsb(rgb) {
      /* rgb转化为hsb */
      let hsb = {
        h: 0,
        s: 0,
        b: 0
      }
      let min = Math.min(rgb.r, rgb.g, rgb.b)
      let max = Math.max(rgb.r, rgb.g, rgb.b)
      let delta = max - min
      hsb.b = max
      hsb.s = max !== 0 ? 255 * delta / max : 0
      if (hsb.s !== 0) {
        if (rgb.r === max) {
          hsb.h = (rgb.g - rgb.b) / delta
        } else if (rgb.g === max) {
          hsb.h = 2 + (rgb.b - rgb.r) / delta
        } else {
          hsb.h = 4 + (rgb.r - rgb.g) / delta
        }
      } else {
        hsb.h = -1
      }
      hsb.h *= 60
      if (hsb.h < 0) {
        hsb.h += 360
      }
      hsb.s *= 100 / 255
      hsb.b *= 100 / 255
      return hsb
    },
    hexToRGB(hex) {
      /* hex value to RGB 形如#00000（#000）转化为 rgb(0,0,0) */
      if (hex[0] === '#') {
        hex = hex.slice(1, hex.length)
      }
      let strips = hex.length === 3 ? [hex.slice(0, 1), hex.slice(1, 2), hex.slice(2, 3)] : [hex.slice(0, 2), hex.slice(2, 4), hex.slice(4, 6)] // Cut up into 2-digit
      strips = strips.map(function (x) {
        return parseInt(x, 16)
      }) // To RGB
      return 'rgb(' + strips.join(',') + ')'
    },
    rgbToHex(rgb) {
      /* RGB to hex value 形如rgb(0,0,0)转化为 #00000（#000) */
      rgb = rgb.substring(4, rgb.length - 4)
      rgb = rgb.split(',')
      let hexvals = rgb.map(function (x) {
        return Math.round(x).toString(16)
      })
      // Add leading 0s to make a valid 6 digit hex
      hexvals = hexvals.map(function (x) {
        return x.length === 1 ? '0' + x : x
      })
      return '#' + hexvals.join('')
    },
    getCodeFromColor(color) {
      let code = []
      if (!color) {
        return code
      }
      if (color[0] === '#') {
        color = color.slice(1, color.length)
        code = color.length === 3 ? [color.slice(0, 1), color.slice(1, 2), color.slice(2, 3)] : [color.slice(0, 2), color.slice(2, 4), color.slice(4, 6)] // Cut up into 2-digit
        code = code.map(function (x) {
          return parseInt(x, 16)
        })
      } else if (color.slice(0, 3).toLowerCase() === 'rgb') {
        code = color.slice(5, color.length - 1).split(',')
      } else if (color.slice(0, 4).toLowerCase() === 'rgba') {
        code = color.slice(6, color.length - 1).split(',')
      }
      code = code.map(function (x) {
        return new String(x).trim()
      })
      return code
    },
    colorToRGBA(color, opacity) {
      /* 返回rgba(r,g,b,a) */
      let me = this
      if (!color) {
        return color
      }
      let code = me.getCodeFromColor(color)
      if (code.length === 0) {
        return color
      }
      return 'rgba(' + code[0] + ',' + code[1] + ',' + code[2] + ',' + (opacity || 1) + ')'
    },
    colorToHex(color) {
      /* color to hex */
      let me = this
      if (!color) {
        return color
      }
      let code = me.getCodeFromColor(color)
      if (code.length === 0) {
        return color
      }
      if (code.length === 4) {
        code.pop()
      }
      let hexvals = code.map(function (x) {
        return Math.round(x).toString(16)
      })
      // Add leading 0s to make a valid 6 digit hex
      hexvals = hexvals.map(function (x) {
        return x.length === 1 ? '0' + x : x
      })
      return '#' + hexvals.join('')
    },
    lightenHex(hex, percent) {
      if (hex[0] === '#') {
        hex = hex.slice(1, hex.length)
      }
      let strips = hex.length === 3 ? [hex.slice(0, 1), hex.slice(1, 2), hex.slice(2, 3)] : [hex.slice(0, 2), hex.slice(2, 4), hex.slice(4, 6)]
      let rgb = strips.map(function (x) {
        return parseInt(x, 16)
      })
      if (percent > 100) percent = 100 // Limit to 100%
      let newRgb = rgb.map(function (x) {
        return x + percent / 100.0 * (255 - x) // This works because math.
      })
      let hexvals = newRgb.map(function (x) {
        return Math.round(x).toString(16)
      })
      hexvals = hexvals.map(function (x) {
        return x.length === 1 ? '0' + x : x
      })
      return '#' + hexvals.join('')
    },
    reduceColor(hex, n) {
      if (hex[0] === '#') {
        hex = hex.slice(1, hex.length)
      }
      let strips = hex.length === 3 ? [hex.slice(0, 1), hex.slice(1, 2), hex.slice(2, 3)] : [hex.slice(0, 2), hex.slice(2, 4), hex.slice(4, 6)]
      let arr = strips.map(function (x) {
        return (parseInt(x, 16) / n).toString(16).split('.')[0]
      })
      return '#' + arr.join('')
    }
  },
  sourceDataFn: { // 插件数据源
    menology: { // 日历或日期选择插件数据来源
      getYeardata(year, month) { // 获取year month 渲染dom所有数据
        month = parseInt(month)
        let me = this
        if (!year || year.toString().length !== 4) {
          let now = new Date()
          year = now.getFullYear()
        }
        if (!month) {
          let now = new Date()
          month = now.getMonth() + 1()
        }
        return me.getMonthData(year, month, me.getMonthHaveDays(year, month))
      },
      getDayWeekCn(index) { // 获取星期几
        let weekDay = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']
        return weekDay[index]
      },
      getMonthNames(index) { // 获取星期几
        let months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
        return months[index]
      },
      getMonthData(year, month, days) { // 获取year month 渲染dom数据
        let me = this
        let monthobj = {
          year: year,
          month: month,
          days: days,
          monthdata: [],
          monthalldata: [],
          firstdayweek: me.getDayWeek(new Date(year.toString() + '-' + month + '-' + 1)),
          firstdayweekcn: me.getDayWeekCn(me.getDayWeek(new Date(year.toString() + '-' + month + '-' + 1)))
        }
        for (let i = 1; i <= days; i++) {
          monthobj.monthdata.push(me.getDayData(year, month, i))
        } // 获取year month 月数据
        monthobj.monthalldata = me.getMonthAllData(year, month, JSON.parse(JSON.stringify(monthobj.monthdata)))
        return monthobj
      },
      getMonthAllData(year, month, monthdata) { // 获取year month 渲染dom 所有数据，5*7 35或5*8格数据
        let me = this
        let count = 35
        if (monthdata[0].week === 0) { // 本月1号为周日，补充下月数据，凑够5*7 35格数据
          let curlength = monthdata.length
          for (let i = 0; i < count - curlength; i++) {
            monthdata.push({
              year: year,
              month: month + 1,
              day: i,
              weekcn: me.getDayWeekCn(me.getDayWeek(new Date(year.toString() + '-' + (+month + 1) + '-' + i))),
              week: me.getDayWeek(new Date(year.toString() + '-' + (+month + 1) + '-' + i))
            })
          }
        } else {
          // 本月1号为周日，补充上月和下月数据，凑够5*7 35格数据
          let prevmonthdays = me.getMonthHaveDays(year, month - 1)
          let firstweek = monthdata[0].week
          for (i = prevmonthdays; i > prevmonthdays - firstweek; i--) {
            monthdata.unshift({
              year: year,
              month: month - 1,
              day: i,
              weekcn: me.getDayWeekCn(me.getDayWeek(new Date(year.toString() + '-' + (month - 1) + '-' + i))),
              week: me.getDayWeek(new Date(year.toString() + '-' + (month - 1) + '-' + i))
            })
          }
          if (monthdata.length > 35) {
            count = 42
          }
          let curandprevdays = monthdata.length
          for (let j = 1; j <= count - curandprevdays; j++) {
            monthdata.push({
              year: year,
              month: month + 1,
              day: j,
              weekcn: me.getDayWeekCn(me.getDayWeek(new Date(year.toString() + '-' + (+month + 1) + '-' + j))),
              week: me.getDayWeek(new Date(year.toString() + '-' + (+month + 1) + '-' + j))
            })
          }
        }
        return monthdata
      },
      getDayData(year, month, day) { // 获取某天数据
        let me = this
        let daydata = {
          year: year,
          month: month,
          day: day,
          weekcn: me.getDayWeekCn(me.getDayWeek(new Date(year.toString() + '-' + month + '-' + day))),
          week: me.getDayWeek(new Date(year.toString() + '-' + month + '-' + day))
        }
        return daydata
      },
      getMonthHaveDays(year, month) { // 获取某月有多少天
        let me = this
        let yearmonthdays = [31, me.isLeapYear(year) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
        return yearmonthdays[+month - 1]
      },
      getDayWeek(date) { // 获取某一天是星期几 data:new Date("2015-7-12")
        // let me = this;
        // let week;
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
        // return week;

        return date.getDay()
      },
      isLeapYear(year) { // 是否为闰年
        let cond1 = year % 4 === 0 // 条件1：年份必须要能被4整除
        let cond2 = year % 100 !== 0 // 条件2：年份不能是整百数
        let cond3 = year % 400 === 0 // 条件3：年份是400的倍数
        // 当条件1和条件2同时成立时，就肯定是闰年，所以条件1和条件2之间为“与”的关系。
        // 如果条件1和条件2不能同时成立，但如果条件3能成立，则仍然是闰年。所以条件3与前2项为“或”的关系。
        // 所以得出判断闰年的表达式：
        let cond = cond1 && cond2 || cond3
        if (cond) {
          return true
        } else {
          return false
        }
      }
    }
  },
  plugin: { // pengin插件
    mutilSelectStatus: false,
    scrollnum(id, n, bitn, step) { // 数字滚动函数 id:容器，n:数字,bitn：显示位数，step：背景图Y偏移值
      let realsum = String(n)
      n = (function (digit, num) { // num位数不够digit位前面添加0
        let str = num.toString()
        let len = str.length
        let arr = str.split('')
        let zeroNum = digit - len
        for (let i = 0; i < zeroNum; i++) {
          arr.unshift('0')
        }
        return arr.join('')
      })(bitn, realsum)
      let it = $(id + ' i')
      let len = n.length
      for (let i = 0; i < len; i++) {
        if (it.length <= i && i !== len) {
          $(id).append('<i></i>')
        }
        let num = n.charAt(i)
        // 根据数字图片的高度设置相应的值
        let y = -parseInt(num) * step
        let obj = $(id + ' i').eq(i)
        let pos = String(y) + 'rem'
        obj.animate({
          backgroundPositionY: pos
        }, 'slow', 'swing', function () {})
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
      // 调用 ToolFn.plugin.scrollnum(".sjday",ToolFn.dateFn.datedifference("2019-12-31",ToolFn.dateFn.CurentTime().substr(0,10)).toString(), 3,'2.59rem');
    },
    comparimg(dragpictool, piccompar, toppic, topminwidth) { // 图片比对
      topminwidth = topminwidth || 5
      let active = false
      let downx = 0
      let mouseX2 = 0
      let topwidth = '50%'
      let outwidth = document.querySelector(piccompar).offsetWidth

      let scrollerTop = document.querySelector(dragpictool)

      scrollerTop.addEventListener('mousedown', function () {
        active = true
        downx = event.clientX
        mouseX2 = event.clientX
        topwidth = document.querySelector(toppic).offsetWidth
      })

      document.body.addEventListener('mouseleave', function () {
        active = false
        document.body.style.cursor = 'auto'
        downx = 0
        mouseX2 = 0
      })
      document.body.addEventListener('mouseup', function () {
        active = false
        document.body.style.cursor = 'auto'
        downx = 0
        mouseX2 = 0
      })

      document.body.addEventListener('mousemove', function (e) {
        mouseX2 = event.clientX
        if (active) {
          document.body.style.cursor = 'move'
          scrollIt()
        }
      })

      function scrollIt() {
        let transformx = mouseX2 - downx
        if (transformx + topwidth < outwidth && transformx + topwidth > topminwidth) {
          document.querySelector(toppic).style.width = (transformx + topwidth) + 'px'
        }
      }
      // dom结构记样式
      /* <div class="piccompar fn-inline" id="DoubleViewer">
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
                  } */
      // 调用 ToolFn.comparimg('.dragpic-tool', '.piccompar', '.toppic', 5);
    },
    setIframeHeight(id) {
      /* 自动设置iframe 高度 */
      iframe = document.getElementById(id)
      if (iframe) {
        let iframeWin = iframe.contentWindow || iframe.contentDocument.parentWindow
        if (iframeWin.document.body) {
          iframe.height = iframeWin.document.documentElement.scrollHeight || iframeWin.document.body.scrollHeight
        }
      }
      // window.onload = function() {
      //     setIframeHeight('external-frame');
      // };
    },
    contextBoxSelect(boxSelctCallback) {
      /* 右键拖动框选 返回相对于body左上方的坐标对象{pointer1:{x:left,y:top},pointer2:{x:right,y:bottom}} */
      let me = this
      // 是否需要(允许)处理鼠标的移动事件,默认识不处理
      let select = false
      // 记录鼠标按下时的坐标
      let downX = 0
      let downY = 0
      // 记录鼠标抬起时候的坐标
      let mouseX2 = downX
      let mouseY2 = downY
      let idVal = 'rect_select_1'

      function createRect() {
        let rect = document.createElement('div')
        // 设置默认值,目的是隐藏图层
        rect.id = idVal
        rect.className = 'rect'
        rect.style.width = 0
        rect.style.background = 'rgba(255,255,255,0.5)'
        rect.style.height = 0
        rect.style.visibility = 'hidden'
        // 让你要画的图层位于最上层
        rect.style.zIndex = 1500
        rect.style.position = 'absolute'
        document.body.appendChild(rect)
      }

      function getSelectRect() {
        let rect = document.getElementById(idVal)
        if (!rect) {
          createRect()
          rect = document.getElementById(idVal)
        }
        return rect
      }
      // 处理鼠标按下事件
      function mouse_down(event) {
        if (event.shiftKey !== true && me.mutilSelectStatus === false) {
          return
        }
        let rect = getSelectRect()
        // 鼠标按下时才允许处理鼠标的移动事件
        select = true
        // 让你要画框的那个图层显示出来
        // rect.style.visibility = 'visible';
        // 取得鼠标按下时的坐标位置
        downX = event.clientX
        downY = event.clientY

        // 设置你要画的矩形框的起点位置
        rect.style.left = downX
        rect.style.top = downY
      }
      // 鼠标抬起事件
      function mouse_up() {
        if (select !== true) {
          return
        }
        let rect = getSelectRect()
        // 鼠标抬起,就不允许在处理鼠标移动事件
        select = false
        // 隐藏图层
        rect.style.visibility = 'hidden'
        // 根据框选区域获取选择的节点
        let left = getIntNumber(rect.style.left)
        let top = getIntNumber(rect.style.top)
        let right = left + getIntNumber(rect.style.width)
        let bottom = top + getIntNumber(rect.style.height)
        let boxpointerobj = {
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
          boxSelctCallback(boxpointerobj)
        } else {
          console.log('框选区域基于body的坐标为 左上角：(' + left + ',' + top + '); 右下角：(' + right + ',' + bottom + ')')
        }
      }

      function getIntNumber(val) {
        return parseInt(val.split('px')[0])
      }
      // 鼠标移动事件,最主要的事件
      function mouse_move(event) {
        if (select !== true) {
          return
        }
        let rect = getSelectRect()
        // 取得鼠标移动时的坐标位置
        mouseX2 = event.clientX
        mouseY2 = event.clientY
        // 设置拉框的大小
        rect.style.width = Math.abs(mouseX2 - downX) + 'px'
        rect.style.height = Math.abs(mouseY2 - downY) + 'px'
        /*
         * 这个部分,根据你鼠标按下的位置,和你拉框时鼠标松开的位置关系,可以把区域分为四个部分,根据四个部分的不同,
         * 我们可以分别来画框,否则的话,就只能向一个方向画框,也就是点的右下方画框.
         */
        rect.style.visibility = 'visible'
        // A part
        if (mouseX2 < downX && mouseY2 < downY) {
          rect.style.left = mouseX2 + 'px'
          rect.style.top = mouseY2 + 'px'
        }
        // B part
        if (mouseX2 > downX && mouseY2 < downY) {
          rect.style.left = downX + 'px'
          rect.style.top = mouseY2 + 'px'
        }
        // C part
        if (mouseX2 < downX && mouseY2 > downY) {
          rect.style.left = mouseX2 + 'px'
          rect.style.top = downY + 'px'
        }
        // D part
        if (mouseX2 > downX && mouseY2 > downY) {
          rect.style.left = downX + 'px'
          rect.style.top = downY + 'px'
        }
        /*
         * 终止事件冒泡，阻止拖动画布事件触发
         */
        window.event.cancelBubble = true
        window.event.returnValue = false
      }
      // 按下shift，鼠标多选功能事件注;
      $(document).mousedown(mouse_down)
      $(document).mouseup(mouse_up)
      $(document).mousemove(mouse_move)
    }
  },
  validateFn: { // 校验
    rule: {
      notEmpty(str) {
        str = str && str.toString()
        /* 是否为空 */
        return !!(str && str.trim() !== '')
      },
      isNumber(str) {
        /* 是否为数字 */
        return /^[0-9]*$/.test(str)
      },
      isZipCode(str) {
        /* 是否为邮编 */
        return /^[0-9]{6}$/.test(str)
      },
      isIdCardNo(str) {
        /* 是否为身份证好 */
        return /^(\d{6})()?(\d{4})(\d{2})(\d{2})(\d{3})(\w)$/.test(str)
      },
      isMobile(str) {
        /* 是否为手机号码 */
        return str.length === 11 && /^1[3|4|5|8|7][0-9]\d{4,8}$/.test(str)
      },
      isQQ(str) {
        /* 是否为QQ号码 */
        return /^\s*[.0-9]{5,11}\s*$/.test(str)
      },
      isEmail(str) {
        /* 是否为邮箱 */
        return /\w@\w*\.\w/.test(str)
      },
      isUrl(str) {
        /* 是否为网页url */
        return /(https?|ftp|mms):\/\/([A-z0-9]+[_\-]?[A-z0-9]+\.)*[A-z0-9]+\-?[A-z0-9](\/.*)*\/?/.test(str)
      },
      isPhone(str) {
        /* 是否为固定电话 */
        return /^(0[0-9]{2,3}-?)?([2-9][0-9]{6,7})+(-?[0-9]{1,4})?$/.test(str)
      },
      isTel(str) {
        /* 是否为手机号码或固定电话 */
        let _length = str.length
        let _mobile = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/
        let _tel = /^(0[0-9]{2,3}-?)?([2-9][0-9]{6,7})+(-?[0-9]{1,4})?$/
        return (_tel.test(str) && _length <= 12) || (_mobile.test(str) && _length === 11)
      },
      isIp(str) {
        /* 是否为ip地址 */
        return /^(([1-9]|([1-9]\d)|(1\d\d)|(2([0-4]\d|5[0-5])))\.)(([1-9]|([1-9]\d)|(1\d\d)|(2([0-4]\d|5[0-5])))\.){2}([1-9]|([1-9]\d)|(1\d\d)|(2([0-4]\d|5[0-5])))$/.test(str)
      },
      cnLength(str, params) {
        /* 验证字符串长度是否在params([smax,smin])范围内 */
        let _length = str.length
        let _totalLen = _length
        let smin = 0
        let smax = 0
        if (params instanceof Array) {
          switch (params.length) {
            case 0:
              return false
            case 1:
              smax = parseInt(params[0])
              if (smax === 0 || isNaN(smax)) {
                return false
              }
              break
            default:
              smin = parseInt(params[0])
              smax = parseInt(params[1])
              if (smax === 0 || isNaN(smax) || isNaN(smin)) {
                return false
              }
          }
        } else {
          return false
        }
        for (let i = 0; i < _length; i++) {
          if (str.charCodeAt(i) > 127) {
            _totalLen += 2
          }
        }
        return _totalLen >= smin && _totalLen <= smax
      },
      chineseMax(str, params) {
        /* 验证字符串长度是否在0-params范围内 */
        let _length = str.length
        let smin = 0
        let smax = parseInt(params)
        return _length >= smin && _length <= smax
      },
      charMin(str, params) {
        /* 验证字符串的长度是否大于params */
        return str.length >= parseInt(params)
      },
      cnMax(str, params) {
        /* 验证字符数字是否小于params */
        return Number(str) <= Number(params)
      },
      cnMin(str, params) {
        /* 验证字符数字是否大于params */
        return Number(str) > Number(params)
      },
      userName(str) {
        /* 只允许输入中英文字符，数字和下划线 */
        return /^[a-zA-Z0-9_\u4e00-\u9fa5]+$/.test(str)
      },
      userNameExtend(str) {
        /* 只允许输入中英文字符，数字和下划线,括号  以及 ·.、 */
        return /^[a-zA-Z0-9_\(\)\{\}·.、\[\]\（\）\【\】\u4e00-\u9fa5]+$/.test(str)
      },
      chrnum(str) {
        /* 字母和数字的验证 */
        return /^([a-zA-Z0-9]+)$/.test(str)
      },
      decimal2(str) {
        /* 是否为两位小数 */
        return /^-?\d+\.?\d{0,2}$/.test(str)
      },
      decimal_num(str) {
        /* 是否为数字和小数 */
        return /(^d*.?d*[0-9]+d*$)|(^[0-9]+d*.d*$)/.test(str)
      },
      chinese(str) {
        /* 是否为中文 */
        return /^[\u4e00-\u9fa5]+$/.test(str)
      },
      userPassword(str) {
        /* 密码的验证a-zA-Z0-9 5-17位 */
        return /^[a-zA-Z]\w{5,17}$/.test(str)
      },
      isDefaultPassword(str, params) {
        /* 是否默认密码params(["123456",'111111','111222']) */
        params = params || ["123456", '111111', '111222']
        let isd = false
        for (let strp in params) {
          if (str.toString() === params[strp]) {
            isd = true
          }
        }
        return isd
      },
      isSimplePassword(str) {
        /* 是否简单密码 */
        function isASC(test) {
          for (let i = 1; i < test.length; i++) {
            if (test.charCodeAt(i) !== (test.charCodeAt(i - 1) + 1)) {
              return false
            }
          }
          return true
        }

        function isDESC(test) {
          for (let i = 1; i < test.length; i++) {
            if (test.charCodeAt(i) !== (test.charCodeAt(i - 1) - 1)) {
              return false
            }
          }
          return true
        }

        function isSame(test) {
          for (let i = 1; i < test.length; i++) {
            if (test.charCodeAt(i) !== (test.charCodeAt(i - 1))) {
              return false
            }
          }
          return true
        }
        return !(isASC(str) || isDESC(str) || isSame(str))
      },
      identifier(str) {
        /* 是否是编号 */
        return /^[a-zA-Z0-9_\u4e00-\u9fa5\-]+$/.test(str)
      },
      isPic(str) {
        /* 是否是图片 */
        return /.jpg|.png|.gif|.jpeg$/.test(str.toLowerCase())
      },
      isInteger(str) {
        /* 是否是正整数 */
        return /^[1-9]+[0-9]*$/.test(str)
      },
      isPInt(str) {
        /* 校验正整数 */
        return /^[0-9]*[0-9][0-9]*$/.test(str)
      },
      onlyEn_Num(str) {
        /* 只允许输入英文字符，数字和下划线 */
        return /^\w+$/.test(str)
      },
      onlyCn_En_Num(str) {
        /* 只允许输入中英文字符，数字和下划线 */
        return /^[a-zA-Z0-9_\u4e00-\u9fa5]+$/.test(str)
      },
      onlyCn_En_Num_Point(str) {
        /* 只能包括中英文字母、数字、下划线和中文标点符号 */
        return /^[a-zA-Z0-9_\u4e00-\u9fa5，。“”；！？@、]+$/.test(str)
      },
      onlyCn_En_Num_Point_zhong_ying(str) {
        /* 只能包括中英文字母、数字、下划线和中英文标点符号 */
        return /^[a-zA-Z0-9_\u4e00-\u9fa5，。“”；！？@、,.?!"";]+$/.test(str)
      },
      onlyCn_En_Num_Point_extend(str) {
        /* 只能包括中英文字母、数字、下划线和中文标点符号及部分特殊符号 */
        return /^[a-zA-Z0-9_\u4e00-\u9fa5，。“”；！：？@、\(\)\{\}·.:\[\]\（\）\【\】]+$/.test(str)
      },
      onlyCn_En_Num_Point_return(str) {
        /* 只能包括中英文字母、数字、下划线和中英文标点符号、空格、回车、括号类符号 */
        return /^[a-zA-Z0-9_\u4e00-\u9fa5，,。.“”；"";：·:！!？?@、.\(\)\（\）\[\]\{\}\【\】\n\s]+$/.test(str)
      },
      onlyCn_En_Num_bufen_return(str) {
        /* 只能包括中英文字母、数字、下划线、横杠和中英文标点符号、空格、回车、括号类符号 */
        return /^[a-zA-Z0-9_\u4e00-\u9fa5，,。.“”；‘’''"";：:！!？?@、.<>\-《》\(\)\（\）\[\]\{\}\【\】\n\s]+$/.test(str)
      },
      onlyCn_En_Num_Point_all_extend(str) {
        /* 只能包括中英文字母、数字、下划线、中文标点符号、空格和回车及部分特殊符号 */
        return /^[a-zA-Z0-9_\u4e00-\u9fa5，。“”；：！？@、\(\)\{\}·.\[\]\（\）\【\】\n\s]+$/.test(str)
      },
      onlyNum_Point(str) {
        /* 只能是数字、小数点后两位 */
        return /^(\d)*(\.(\d){1,2})?$/.test(str)
      },
      onlyNum_Point3(str) {
        /* 只能是数字、小数点后两位 */
        return /^(\d)*(\.(\d){0,3})?$/.test(str)
      },
      doubles7(str) {
        /* 是否小于9999999 */
        let par = parseInt(str)
        return par <= 9999999
      },
      doubles5(str) {
        /* 是否小于999 */
        let par = parseInt(str)
        return par <= 999
      },
      onlyNum_Point4(str) {
        /* 是否数字、小数点后四位 */
        return /^(\d)*(\.(\d){0,4})?$/.test(str)
      },
      onlyNum_Point7(str) {
        /* 是否数字、小数点后七位 */
        return /^(\d)*(\.(\d){0,7})?$/.test(str)
      },
      socode(str) {
        /* 是否统一社会信用代码 */
        return /^[0-9A-Z]+$/.test(str)
      },
      onlycar_number_Eng(str) {
        /* 是否为车牌号 */
        return /(^[\u4E00-\u9FA5]{1}[A-Z0-9]{6}$)|(^[A-Z]{2}[A-Z0-9]{2}[A-Z0-9\u4E00-\u9FA5]{1}[A-Z0-9]{4}$)|(^[\u4E00-\u9FA5]{1}[A-Z0-9]{5}[挂学警军港澳]{1}$)|(^[A-Z]{2}[0-9]{5}$)|(^(08|38){1}[A-Z0-9]{4}[A-Z0-9挂学警军港澳]{1}$)|(^[A-Z]{2}[\u4E00-\u9FA5]{1}[A-Z0-9]{4}[A-Z0-9挂学警军港澳]{1}$)/.test(str)
      },
      onlyChNun_Eng(str) {
        /* 是否为英文字母、数字和中文 */
        // return /^[\u4e00-\u9fa5]{1}[A-Z]{1}[A-Z_0-9]{5}$/.test(str);
        return /^(([\u4e00-\u9fa5]|[a-zA-Z0-9])+)$/.test(str)
      }
    },
    validate(type, str, params, callback) {
      // 全局数据或字符校验方法 @params: type:校验规则名 str：校验数据或字符 params:若校验规则中有两个参数则为校验附加参数，否则可以传入回掉函数,回调函数校验通过返回true,否则返回new error(提示)， callback:回掉函数
      // 调用
      // this.$ToolFn.validateFn.validate("isDefaultPassword", "111222",["123456", '111111', '111222'], function (e) {
      //   console.log(e) /* 是否默认密码params(["123456",'111111','111222']) */
      // })
      let validResult = this.rule[type](str, params)
      if (!validResult) {
        typeof params == 'function' && params(new Error(this.promptMsg[type]))
        typeof callback == 'function' && callback(new Error(this.promptMsg[type]))
        validResult = this.promptMsg[type]
      } else {
        typeof params == 'function' && params(true)
        typeof callback == 'function' && callback(true)
      }
      return validResult
    },
    promptMsg: { // 错误信息
      'notEmpty': '不能为空！',
      'isNumber': '只能输入数字！',
      'isZipCode': '邮政编码不正确!',
      'isIdCardNo': '身份证号码格式不正确!',
      'isMobile': '手机号码格式不正确!',
      'isPhone': '电话号码格式不正确!',
      'isTel': '联系电话格式不正确!',
      'isQQ': 'QQ号码格式不正确！',
      'isEmail': 'email格式不正确！',
      'isUrl': '网址格式不正确！',
      'isIp': 'ip地址格式不正确!',
      'cnLength': '您可输入{0}到{1}个字符，中文占3个字符！',
      'chineseMax': '您最多能输入{0}个字!',
      'cnMax': '请输入介于0到{0}之间的数字!',
      'cnMin': '请输入大于{0}的数字!',
      'userName': '只能包括中英文、数字和下划线!',
      'chrnum': '只能输入数字和字母(字符A-Z, a-z, 0-9)！',
      'chinese': '只能输入中文！',
      'userPassword': '以字母开头，长度在6-18之间，只能包含字符、数字或下划线！',
      'isDefaultPassword': '登录密码不能为默认密码！',
      'isSimplePassword': '登录密码太简单！',
      'isPic': '只能是jpg、png、gif、jpeg格式的图片！',
      'isPInt': '只能输入非负整数！',
      'charMin': '至少15位',
      'isInteger': '只能输入正整数！',
      'onlyEn_Num': '只能输入英文，数字和下划线!',
      'onlyCn_En_Num': '只能输入中英文，数字和下划线!',
      'onlyCn_En_Num_Point': '只能输入中英文，数字、下划线和中文标点符号!',
      'onlyCn_En_Num_Point_zhong_ying': '只能输入中英文，数字、下划线和标点符号!',
      'onlyCn_En_Num_Point_extend': '只能输入中英文，数字、下划线和中文标点符号及部分特殊符号!',
      'onlyCn_En_Num_Point_all_extend': '只能包括中英文、数字、下划线、中文标点符号、空格和回车及部分特殊符号',
      'onlyCn_En_Num_Point_return': '只能输入中英文，数字、下划线、中英文标点符号、空格、换行及括号类符号!',
      'orgTreeValid': '您还没有选择用户！',
      'equalTo': '请输入相同的值！',
      'decimal2': '请输入数字，小数点后保留2位！',
      'onlyNum_Point': '只能输入自然数，小数点后两位！',
      'onlyNum_Point3': '只能输入自然数，最多小数点后三位！',
      'onlyNum_Point4': '只能输入自然数，最多小数点后四位！',
      'onlyNum_Point7': '只能输入自然数，最多小数点后七位！',
      'onlycar_number_Eng': '请输入正确的车牌号！',
      'onlyCn_En_Num_bufen_return': '只能输入中英文字符、中英文标点符号、空格以及下划线和中线',
      'decimal_num': '请输入数字或小数',
      'onlyChNun_Eng': '只能输入英文字母、数字和中文！',
      'socode': '统一社会信用代码!',
      'doubles7': '您输入的值的整数部分不能大于9999999，请重新输入！',
      'doubles5': '您输入的值的整数部分不能大于999，请重新输入！'
    }
  }
}
export default ToolFn
