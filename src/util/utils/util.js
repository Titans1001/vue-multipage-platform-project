import $ from '../../static/lib/jquery/' //Jquery
var initUtil = {
  mutilSelectStatus: false,
  remouldgroupdata: function(datalist, groupkey) { /*按照groupkey字段的值对datalist进行分组,返回[{sorkkeyval: "",sortkey: groupkey,data: []},...]*/
    var me = this;
    var map = {},
      key = groupkey,
      dest = [];
    for (var i = 0; i < datalist.length; i++) {
      var ai = datalist[i];
      if (!map[ai[key]]) {
        dest.push({
          sorkkeyval: ai[key],
          sortkey: key,
          data: [ai]
        });
        map[ai[key]] = ai;
      } else {
        for (var j = 0; j < dest.length; j++) {
          var dj = dest[j];
          if (dj.sorkkeyval == ai[key]) {
            dj.data.push(ai);
            break;
          }
        }
      }
    }
    return dest;
  },
  remoulddata: function(datalist, groupfieldarr) { /*按groupfieldarr数组里的字段将data进行递归排序*/
    function compare(a, b, c = groupfieldarr[0], i = 0) { //按合并类型递归排序
      //var c = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : groupfieldarr[0];
      //var i = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;
      if (a[c] == b[c]) { //等于的话进行判断是否还有后续字段需要排序，没有则返回0；有则递归进行后续字段排序处理。
        if (i == (groupfieldarr.length - 1)) { //没有后续字段
          i = 0;
          return 0;
        }
        i += 1;
        return compare(a, b, groupfieldarr[i], i); //递归排序后续字段
      } else if (a[c] > b[c]) { //大于返回1
        return 1;
      } else { //小于返回-1
        return -1;
      }
    }
    if (groupfieldarr.length > 0)
      return (datalist.sort(compare));
  },
  SetIframeAutoHeight: function(id) {
    setTimeout(function() {
      var cwin = document.getElementById(id);
      if (document.getElementById) {
        if (cwin && !window.opera) {
          if (cwin.contentDocument && cwin.contentDocument.body.offsetHeight)
            cwin.height = cwin.contentDocument.body.offsetHeight;
          else if (cwin.Document && cwin.Document.body.scrollHeight)
            cwin.height = cwin.Document.body.scrollHeight;
        }
      }
    },1000)
  },
  getpagebtnarr: function(curpage, btncount, totals, pagesize) { /**根据当前页，总数据条数，分页尺寸及现实的按钮数量返回按钮数组*/
    var startbtn = curpage < Math.floor(btncount / 2) ? 1 : curpage - Math.floor(btncount / 2);
    startbtn = startbtn <= 0 ? +startbtn + 1 : startbtn;
    var endbtn = +startbtn + btncount >= +Math.ceil(totals / pagesize) + 1 ?
      +Math.ceil(totals / pagesize) + 1 :
      +startbtn + btncount;
    endbtn = endbtn <= startbtn ? +startbtn + 1 : endbtn;
    startbtn = +startbtn + btncount > endbtn ? endbtn - btncount : startbtn;
    if (Math.ceil(totals / pagesize) < btncount) {
      startbtn = 1;
      endbtn = Math.ceil(totals / pagesize) + 1;
    }
    var pagebtn = [];
    for (var i = startbtn; i < endbtn; i++) {
      if (i == curpage) {
        pagebtn.push({
          btn: i,
          isactive: true
        });
      } else {
        pagebtn.push({
          btn: i,
          isactive: false
        });
      }
    }
    return pagebtn;
  },
  arrsort: function(srry, key, isasc) { /**通用数组对象排序方法*/
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
  },
  each: function(object, callback) { /*js原生each方法封装*/
    var type = (function() {
      switch (object.constructor) {
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
    })();
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
  DataBing: function(dataoptions) { /*双向数据绑定原理*/
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
  getClientHeight: function() { /*获取视窗的高度*/
    var clientHeight = 0;
    if (document.body.clientHeight && document.documentElement.clientHeight) {
      var clientHeight = (document.body.clientHeight < document.documentElement.clientHeight) ? document.body.clientHeight : document.documentElement.clientHeight;
    } else {
      var clientHeight = (document.body.clientHeight > document.documentElement.clientHeight) ? document.body.clientHeight : document.documentElement.clientHeight;
    }
    return clientHeight;
  },
  arrunique: function(arr) { /*数组去重*/
    var me = this;
    var tmp = [];
    for (var i in arr) {
      if (tmp.indexOf(arr[i]) == -1) {
        tmp.push(arr[i]);
      }
    }
    return tmp;
  },
  strToInt: function(n) { /*字符串转化成整数,保留整数部分*/
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
  strToInt45: function(n) { /*字符串转化成整数，四舍五入*/
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
  strToFloat: function(n) { /*字符串转化成小数*/
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
  getChuFa: function(arg1, arg2) { /*获取小数相除的精确结果*/
    var me = this;
    if (arg2 == 0) {
      return 0.00;
    }
    var t1 = 0,
      t2 = 0,
      r1, r2;
    try { t1 = arg1.toString().split(".")[1].length } catch (e) {}
    try { t2 = arg2.toString().split(".")[1].length } catch (e) {}
    with(Math) {
      r1 = Number(arg1.toString().replace(".", ""))
      r2 = Number(arg2.toString().replace(".", ""))
      return (r1 / r2) * pow(10, t2 - t1);
    }
  },
  getChengFa: function(arg1, arg2) { /*获取小数相乘的精确结果*/
    var me = this;
    arg1 = strToFloat(arg1);
    var m = 0,
      s1 = arg1.toString(),
      s2 = arg2.toString();
    try { m += s1.split(".")[1].length } catch (e) {}
    try { m += s2.split(".")[1].length } catch (e) {}
    return Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m)
  },
  getJiaFa: function(arg1, arg2) { /*获取小数相加的精确结果*/
    var me = this;
    var r1, r2, m;
    try { r1 = arg1.toString().split(".")[1].length } catch (e) { r1 = 0 }
    try { r2 = arg2.toString().split(".")[1].length } catch (e) { r2 = 0 }
    m = Math.pow(10, Math.max(r1, r2))
    return (arg1 * m + arg2 * m) / m
  },
  getDouble45: function(arg1, number) { /*获取小数四舍五入,保留N位小数*/
    var me = this;
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
  trimStr: function(nullStr) { /*空转化为‘’*/
    var me = this;
    if (nullStr == null || typeof(nullStr) == "undefined") {
      return "";
    } else {
      return nullStr;
    }
  },
  getRootPath: function() { /*获取项目根路径url,路径后面默认没有斜杠*/
    var me = this;
    var curWwwPath = window.document.location.href;
    var pathName = window.document.location.pathname;
    var pos = curWwwPath.indexOf(pathName);
    var localhostPaht = curWwwPath.substring(0, pos);
    var projectName = pathName.substring(0, pathName.substr(1).indexOf('/') + 1);
    return (localhostPaht + projectName);
  },
  getRootUrl: function() { /*获取项目根路径url,路径后面默认没有斜杠*/
    var url = window.location.protocol + "//" + window.location.host;
    url += basePath;
    url = url.substr(url.length - 1, 2) == '/' ? url.substr(0, url.length - 2) : url;
    return url;
  },
  formatNum: function(num) { /*格式化数字  1000,343,343*/
    var me = this;
    return num.split('').reverse().join('').replace(/(\d{3})/g, '$1,').replace(/\,$/, '').split('').reverse().join('');
  },
  getUuid: function() { /*获取uuid*/
    var me = this;
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
  strToDate: function(dateStr) { /*字符串格式的日期转化为 Date @param dateStr "2016-01-01 01:01:01"*/
    var me = this;
    var date = new Date(dateStr);
    return date;
  },
  strToTime: function(dateStr) { /*字符串格式的日期转化为 Date @param dateStr "2016-01-01 01:01:01"*/
    var me = this;
    var date = new Date(dateStr);
    var time = date.getTime();
    return time;
  },
  betweenTime: function(date1, date2) { /*计算2个时间之间的间隔 date1  开始时间 date2  结束时间 (" 相差 "+days+"天 "+hours+"小时 "+minutes+" 分钟"+seconds+" 秒")*/
    var me = this;
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
  getNowDateStr: function() { /*获取现在的日期及时间 返回yyyy-MM-dd hh:mm:ss*/
    var me = this;
    var date = new Date();
    return date.format("yyyy-MM-dd hh:mm:ss");
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
  formatDateValue: function(value) { /*检测年月日时分秒20160609110000 返回yyyy-MM-dd hh:mm:ss*/
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
    var string = val;
    try {
      string = string.replace(/\n|\r\n| /g, ",");
      string = string.replace(/、/g, ",");
      string = string.replace(/，/g, ",");
    } catch (e) {
      console.info(e);
    }
    string = string.split(",");
    var strstring = ''
    me.each(string, function(i, t) {
      if (t != "") {
        strstring += t;
        strstring += ','
      }
    })
    return strstring.substr(0, strstring.length - 1);
  },
  hexToRGB: function(hex) { /*hex value to RGB 形如#00000（#000）转化为 rgb(0,0,0)*/
    if (hex[0] == "#") { hex = hex.slice(1, hex.length); }
    strips = hex.length == 3 ? [hex.slice(0, 1), hex.slice(1, 2), hex.slice(2, 3)] : [hex.slice(0, 2), hex.slice(2, 4), hex.slice(4, 6)]; // Cut up into 2-digit
    strips = strips.map(function(x) { return parseInt(x, 16); }); // To RGB
    return 'rgb(' + strips.join(",") + ')';
  },
  rgbToHex: function(rgb) { /*RGB to hex value 形如rgb(0,0,0)转化为 #00000（#000*/
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
    strips = hex.length == 3 ? [hex.slice(0, 1), hex.slice(1, 2), hex.slice(2, 3)] : [hex.slice(0, 2), hex.slice(2, 4), hex.slice(4, 6)]; // Cut up into 2-digit
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
    strips = hex.length == 3 ? [hex.slice(0, 1), hex.slice(1, 2), hex.slice(2, 3)] : [hex.slice(0, 2), hex.slice(2, 4), hex.slice(4, 6)]; // Cut up into 2-digit
    var arr = strips.map(function(x) { return (parseInt(x, 16) / n).toString(16).split(".")[0]; });
    return "#" + arr.join("");
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
  checkedradio: function(name) {
    var radio = document.getElementsByName(name);
    var selectvalue = null; //  selectvalue为radio中选中的值
    for (var i = 0; i < radio.length; i++) {

      if (radio[i].checked == true) {
        selectvalue = radio[i].value;
        break;
      }
    }
    return selectvalue;
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
  }
};

//slideRight扩展
// jQuery.fn.slideRight = function(speed, width, right, opacity, callback) {
//     this.animate({
//         width: width,
//         right: right,
//         opacity: opacity
//     }, speed, callback);
// };
Date.prototype.format = function(format) {
  var o = {
    "M+": this.getMonth() + 1, //month
    "d+": this.getDate(), //day
    "h+": this.getHours(), //hour
    "m+": this.getMinutes(), //minute
    "s+": this.getSeconds(), //second
    "q+": Math.floor((this.getMonth() + 3) / 3), //quarter
    "S": this.getMilliseconds() //millisecond
  };
  if (/(y+)/.test(format)) {
    format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
  }
  for (var k in o) {
    if (new RegExp("(" + k + ")").test(format)) {
      format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
    }
  }
  return format;
};
