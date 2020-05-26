/**
 * 校验
 */

import Vue from 'vue'
import Validator from 'vue-validator'

Vue.use(Validator)

const validataconfig = {
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
    // return /^(\d{6})()?(\d{4})(\d{2})(\d{2})(\d{3})(\w)$/.test(str);
    return /^(^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$)|(^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{2}$)$/.test(
      str)
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
  isBackId: (value) => { /*银行卡号合法16-19位*/
    return /^([1-9]{1})(\d{15}|\d{18})$/.test(value)
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
  specialChar: function(str) { /*排除特殊字符验证 (可以输入加号|斜杠|顿号|括号 中英文)*/
    return new RegExp(
      "[`~!@#$^&*=|':;',.<>?~！@#￥……&*‘；：”“'。，？%———— ]"
    ).test(str)
  },
  isChineseCharacters: function(value) { /*排除特殊字符验证*/
    return new RegExp(
      "[`~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）|{}【】‘；：”“'。，、？%+———— ]"
    ).test(value)
  },
  postSal5: function(value) { /*工资只能为5位数以内*/
    return value !== "" && value !== null && value !== undefined && !/^(0|[1-9]\d{0,4})$/.test(value)
  },
  nonnegativeInteger: function(value) { /*1~4）位非负整数验证*/
    return /^\d{1,4}$/.test(value)
  },
  isNumber5: function(value) { /*5位数字验证*/
    return value !== "" && value !== null && value !== undefined && !/^\d{5}$/.test(value)
  },
  Number0To100: function(value) { /*(0~100)的数字*/
    return /^100$|^(\d|[1-9]\d)(\.\d{1,2})*$/.test(value)
  },
  Numberint0To100: function(value) { /*(0~100)的整数*/
    return value !== "" && value !== null && value !== undefined && !/^([1-4][0-9]{2}|100|[1-9]?[0-9])$/.test(value)
  },
  isNumber8: function(value) { /*数字0~8位可为空，如果输入多位，第一位不能为0(可保留2位小数)*/
    return value != "" && !/^(0|[1-9]\d{0,7})(\.\d{1,2})?$/.test(value)
  },
  isPositive: function(value) { /*输入必须为正数*/
    return /^[0-9]+([.]{1}[0-9]{1,2})?$/.test(value)
  },

  checkTax: function(value) { /* 验证税号,15或者17或者18或者20位字母、数字组成*/
    return /^[A-Z0-9]{15}$|^[A-Z0-9]{17}$|^[A-Z0-9]{18}$|^[A-Z0-9]{20}$/.test(value)
  },
  isUserCode: function(value) { /* 人员编号合法验证  字母和数字的组合  最长10位  /^[0-9]{8,10}$/*/
    return value !== "" || value !== null || value !== undefined && /^([a-z]|[A-Z]|[0-9]){1,10}$/.test(value)
  },
  isComAccount: function(value) { /*账户合法验证*/
    return /^[0-9]{15}$/.test(value)

  },
  isInsurBaseRule: function(value) { /*险种基数为1位到8位数字，小数点后最多两位*/
    return /^(0|[1-9]\d{0,7})(\.\d{1,2})?$/.test(value);

  },
  isPercent: function(value) { /*百分数，最多两位小数点*/
    return !/^(100|(([1-9]\d|\d)(\.\d{1,2})?))$/.test(value)
  },
  //错误信息
}
const validataeMsg = {
  "notEmpty": "不能为空！",
  "isNumber": "只能输入数字！",
  "isZipCode": "邮政编码不正确!",
  "isIdCardNo": "身份证号码格式不正确!",
  "isMobile": "手机号码格式错啦!",
  "isPhone": "电话号码格式错啦!",
  "isTel": "联系电话格式错啦!",
  "isQQ": "QQ号码格式错啦！",
  "isEmail": "email格式错啦！",
  "isBackId": "请正确填写您的银行卡号!",
  "isUrl": "网址格式错啦！",
  "isIp": "ip地址格式错啦!",
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
  //"decimal_num":"请输入数字或小数"
  "onlyChNun_Eng": "只能输入英文字母、数字和中文！",
  "socode": "统一社会信用代码!",
  "doubles7": "您输入的值的整数部分不能大于9999999，请重新输入！",
  "doubles5": "您输入的值的整数部分不能大于999，请重新输入！",
  // 排除特殊字符验证 项目名称可以输入+号 (可以输入加号|斜杠|顿号|括号 中英文)
  "specialChar": "内容不能出现特殊字符!",
  "postSal5": "薪资最多为5位整数",
  "isChineseCharacters": "内容不能出现特殊字符!",
  "nonnegativeInteger": "输入内容必须为(1~4)位非负整数！",
  "isNumber5": "只能输入5位数字",
  "Number0To100": "只能输入(0~100)的数字（可保留到2位小数)",
  "Numberint0To100": "只能输入(0~100)的整数",
  "isNumber8": "最多8位整数(可保留2位小数)",
  "isPositive": "输入必须为正数",
  "checkTax": "请输入正确的税号",
  "isUserCode": "数字、字母均可,最长10位!",
  "isComAccount": "请输入正确的账号!",
  "isInsurBaseRule": "请输入合法的基数!"，
  "isPercent": "只能输入百分数"
}


/**
vue-validato官方提供的api如下
input[type="text"]
input[type="radio"]
input[type="checkbox"]
input[type="number"]
input[type="password"]
input[type="email"]
input[type="tel"]
input[type="url"]
select
textarea
但是以上的不一定满足我们的需求，这时就需要用到另一个全局api，用于注册和获取全局验证器。 
*/

//自定义验证器：Vue.validator( id, [definition] )
//例如添加一个简单的手机号验证 

Vue.validator('phone', function(val) {
  return validataconfig.isPhone(val)
});
//添加一个密码验证
//匹配6-20位的任何字类字符，包括下划线。与“[A-Za-z0-9_]”等效。
Vue.validator('passw', function(val) {
  return /^(\w){6,20}$/.test(val)
});
/*
验证器语法
<validator name="validation">
    <input type="text" v-model='comment' id='comment' v-validate:comment="{ minlength: 3, maxlength: 15 }">
    <div>
      <span v-show="$validation.comment.minlength">不得少于3个字符</span>
      <span v-show="$validation.comment.maxlength">不得大于15个字符</span>
    </div>
</validator>

Terminal 指令问题

<validator name="test_validator">
    <!-- @invalid：valid的逆 ，表示验证不通过 -->
    <input  @invalid="notphone" @valid="isphone" type="password" v-model='phone'  v-validate:phone="['phone']"  detect-change="off" initial='off' placeholder='请输入密码'>
    <input  @invalid="passwInvalid" @valid="passwok" type="password" v-model='password' id='password' v-validate:password="['passw']"  detect-change="off" initial='off' placeholder='请输入密码'>
</validator>

//导入validation.js  此处的validation.js就是上文中自定义验证器的内容
import validator from '../validator/validation';

export default{    
    data(){
        return{
            phone:'',//电话号码
        }
    },
    methods:{
        //手机号验证失败时执行的方法
        notphone(){
            //设置提示信息内容
            alert('手机不正确');
        },
        //密码验证成功时执行的方法
        isphone(){
            //user option
        }, 
        passwInvalid(){
            alert('只能输入6-20个字母、数字、下划线');
        },
        passwok(){
            //alert('验证码符合规范')
        }
   } 
}

默认情况下，vue-validator 会根据 validator 和 v-validate 指令自动进行验证。然而有时候我们需要关闭自动验证，在有需要时手动触发验证。如果你不需要自动验证，可以通过 initial 属性或 v-validate 验证规则来关闭自动验证。如下：

<validator name="validation">
     <input type="text" v-model='comment' id='comment' v-validate:comment="{ minlength: 3, maxlength: 15 }"  detect-change="off" initial='off'>
     <div>
       <span v-show="$validation.comment.minlength">不得少于3个字符</span>
       <span v-show="$validation.comment.maxlength">不得大于15个字符</span>
     </div>
</validator>
*/
