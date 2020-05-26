<template>
  <div>
    <div class="wrapper">
      <div class="wrapper-text">{{language=='Chinese'?"&lt;广告&gt;":"&lt;advertising&gt;"}}</div>
    </div>
    <nav class="nav">
      <div class="nav-con">
        <ul>
          <li v-for="(item,index) in manulist" v-if="item.defalut" :class="item.iscurselect?'active':''" @click="onNavClick(index,'web')">
            <!-- <div v-if="item.module" :href="type=='total'?('./'+item.module+'.html'):('../'+item.module+'/index.html')" target="container"> -->
            <div class="navbtn" v-if="item.module" target="container">
              <span v-if="item.showtype=='text'">{{language=='Chinese'?item.cnname:item.name}}</span>
              <img v-if="item.showtype=='ico'" :src="item.ico">
            </div>
            <div class="navbtn" v-if="!item.module" target="container">
              <span v-if="item.showtype=='text'">{{language=='Chinese'?item.cnname:item.name}}</span>
              <img v-if="item.showtype=='ico'" :src="item.ico">
            </div>
          </li>
        </ul>
        <transition name="slide-fade">
          <aside v-show="isshowaccount" :language="language" :theme="theme" class="account">
            <Account @accountClick="onAccountClick"></Account>
          </aside>
        </transition>
      </div>
    </nav>
    <nav class="navsmall">
      <ul class="nav-con">
        <li v-for="(item,index) in manulist2" :class="item.iscurselect?'active':''" @click="onNavPhoneClick(index,'phonenav')">
          <!-- <div v-if="item.module" :href="type=='total'?('./'+item.module+'.html'):('../'+item.module+'/index.html')" target="container"> -->
          <div class="navbtn" target="container">
            <span v-if="item.showtype=='text'">{{language=='Chinese'?item.cnname:item.name}}</span>
            <img v-if="item.showtype=='ico'" :src="item.ico">
          </div>
        </li>
      </ul>
      <transition name="slide-fade">
        <aside :language="language" :theme="theme" v-if="isshowaccount" class="account">
          <Account @accountClick="onAccountClick"></Account>
        </aside>
      </transition>
      <transition name="slide-fade">
        <ul class="navsmall-nav" v-show="isshowponenavlist">
          <li v-for="(item,index) in manulist" v-if="item.small" :class="item.iscurselect?'active':''" @click="onNavClick(index,'phone')">
            <!-- <div v-if="item.module" :href="type=='total'?('./'+item.module+'.html'):('../'+item.module+'/index.html')" target="container"> -->
            <div class="navbtn" v-if="item.module" target="container">
              <span v-if="item.showtype=='text'">{{language=='Chinese'?item.cnname:item.name}}</span>
              <img v-if="item.showtype=='ico'" :src="item.ico">
            </div>
            <div class="navbtn" v-if="!item.module" target="container">
              <span v-if="item.showtype=='text'">{{language=='Chinese'?item.cnname:item.name}}</span>
              <img v-if="item.showtype=='ico'" :src="item.ico">
            </div>
          </li>
        </ul>
      </transition>
    </nav>
    <div class="module-container fn-inline" :style="{height:modulecontainerheight}">
      <iframe width="100%" height="100%" :src="iframe" name="container" frameborder="0"></iframe>
    </div>
  </div>
</template>
<script>
const Account = () => import('./account')
export default {
  name: 'frameindex',
  components: {
    Account
  },
  data() {
    return {
      language: "Chinese",
      theme: "",
      iframe: "",
      isshowponenavlist: false,
      isshowaccount: false,
      modulecontainerheight: "0px",
      manulist: [{
          name: "home",
          cnname: "首页",
          module: "homemodule",
          // ico:require(""),
          defalut: true,
          small: true,
          showtype: "text",
          iscurselect: true
        },
        {
          name: "club",
          cnname: "社区",
          defalut: true,
          small: true,
          module: "clubmodule",
          // ico:require(""),
          showtype: "text",
          iscurselect: false
        },
        {
          name: "bbs",
          cnname: "论坛",
          defalut: true,
          small: true,
          module: "bbsmodule",
          // ico:require(""),
          showtype: "text",
          iscurselect: false
        },
        {
          name: "product",
          cnname: "产品",
          defalut: true,
          small: true,
          module: "productmodule",
          // ico:require(""),
          showtype: "text",
          iscurselect: false
        },
        {
          name: "course",
          cnname: "网课",
          defalut: true,
          small: true,
          module: "coursemodule",
          // ico:require(""),
          showtype: "text",
          iscurselect: false
        },
        {
          name: "blog",
          cnname: "博客",
          defalut: true,
          small: true,
          module: "blogmodule",
          // ico:require(""),
          showtype: "text",
          iscurselect: false
        },
        {
          name: "store",
          cnname: "店铺",
          defalut: true,
          small: true,
          module: "storemodule",
          // ico:require(""),
          showtype: "text",
          iscurselect: false
        },
        {
          name: "music",
          cnname: "音乐",
          defalut: true,
          small: true,
          module: "musicmodule",
          // ico:require(""),
          showtype: "text",
          iscurselect: false
        },
        {
          name: "text",
          cnname: "文字",
          defalut: true,
          small: true,
          module: "textmodule",
          // ico:require(""),
          showtype: "text",
          iscurselect: false
        },
        {
          name: "social",
          cnname: "社交",
          defalut: true,
          small: true,
          module: "socialmodule",
          // ico:require(""),
          showtype: "text",
          iscurselect: false
        },
        {
          name: "support",
          cnname: "支持",
          defalut: true,
          small: true,
          module: "supportmodule",
          // ico:require(""),
          showtype: "text",
          iscurselect: false
        },
        {
          name: "count",
          cnname: "账户",
          defalut: true,
          small: false,
          showtype: "text",
          module: "",
          // ico:require(""),
          iscurselect: false
        }
      ],
      type: '',
      manulist2: [{
        name: "manu",
        cnname: "菜单",
        module: "",
        // ico:require(""),
        showtype: "text",
        iscurselect: false
      }, {
        name: "home",
        cnname: "首页",
        module: "homemodule",
        // ico:require(""),
        showtype: "text",
        iscurselect: false
      }, {
        name: "count",
        cnname: "账户",
        showtype: "text",
        module: "",
        // ico:require(""),
        iscurselect: false
      }]
    }
  },
  methods: {
    getQueryString(name) {
      var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
      var r = window.location.search.substr(1).match(reg);
      if (r != null) return unescape(r[2]);
      return null;
    },
    onNavClick(index, type) {
      if (this.manulist[index].cnname == "账户") {
        this.onAccountClick(!this.isshowaccount)
        return
      }
      var self = this;
      this.manulist.forEach(function(t, i) {
        self.$set(self.manulist[i], "iscurselect", false);
      })
      this.$set(this.manulist[index], "iscurselect", true);
      if (this.manulist[index].module) {
        this.iframe = this.type == 'total' ? ('./' + this.manulist[index].module + '.html') : ('../' + this.manulist[index].module + '/index.html')
      }
      if (type == "phone") {
        this.isshowponenavlist = false
        self.$set(self.manulist2[0], "iscurselect", false);
        this.manulist2[1] = this.manulist[index]
      }
    },
    onAccountClick(ishow, type, value) {
      this.isshowponenavlist = false
      this.isshowaccount = ishow
      switch (type) {
        case "theme":
          this.theme = value
          break;
        case "language":
          this.language = value
          break;
        default:
          break;
      }
    },
    onNavPhoneClick(index) {
      if (index == 0) {
        this.manulist2[0].iscurselect = !this.manulist2[0].iscurselect
        this.isshowponenavlist = !this.isshowponenavlist
        this.isshowaccount = false
      }
      if (index == 2) {
        this.manulist2[0].iscurselect = false
        this.onAccountClick(!this.isshowaccount)
      }
    },
    getWinHeight() {
      let winHeight = 0;
      winHeight = window.innerHeight;
      return winHeight;
    },
    setIframeHeight() {
      let self = this
      self.modulecontainerheight = self.getWinHeight() - 90 + 'px'
      window.onresize = function() {
        self.modulecontainerheight = self.getWinHeight() - 90 + 'px'
      }
    }
  },
  created() {
    //this.manulist = this.getQueryString("manulist").split(",")
  },
  mounted() { //
    // this.theme = this.$store.getters.gettheme
    // this.language = this.$store.getters.getlanguage
    this.type = this.getQueryString("type") || "separate" //totle,
    // this.manulist = this.getQueryString("manulist") ? this.getQueryString("manulist").split(",") : []
    this.iframe = this.type == 'total' ? ('./' + this.manulist[0].module + '.html') : ('../' + this.manulist[0].module + '/index.html')
    this.setIframeHeight()
  },
  watch: {
    type: {
      handler() {},
      deep: true,
      immediately: true
    },
    theme: {
      handler(newValue, oldValue) {
        this.$store.commit("setcurtheme", newValue)
      },
      deep: true,
      immediately: true
    },
    language: {
      handler(newValue, oldValue) {
        this.$store.commit("setlanguage", newValue)
      },
      deep: true,
      immediately: true
    },
    manulist: {
      handler() {
        console.log(this.getQueryString("manulist"))
        this.manulist == undefined ? this.manulist = [] : this.manulist = this.manulist
      },
      deep: true,
      immediately: true
    },
    iframe: {
      handler() {},
      deep: true,
      immediately: true
    },
  }
}

</script>
<style scoped lang="scss">
.fn-inline {
  display: inline-block;
  vertical-align: middle;
}

.wrapper {
  z-index: 9999;
  background: #767c84;
  line-height: 1;
  width: 100%;
  right: 0;
  height: 40px;
}

.wrapper .wrapper-text {
  font-family: "SF Pro SC", "HanHei SC", "SF Pro Text", "Myriad Set Pro", "PingFang SC", "Helvetica Neue", Helvetica, Arial, sans-serif;
  color: #c7d0d6;
  font-size: 12px;
  display: block;
  line-height: 40px;
  overflow: hidden;
  text-decoration: none;
  text-overflow: ellipsis;
  text-align: right;
  max-width: 980px;
  margin: 0 auto;
  padding: 0 15px;
}

.nav,
.navsmall {
  position: relative;
  z-index: 30;
  background: rgba(48, 51, 52, 0.8);
  backdrop-filter: saturate(100%) blur(15px)
}



.nav-con {
  padding: 0 15px;
  margin: 0 auto;
  font-size: 0;
  max-width: 1000px;
  position: relative;
  display: flex;
  justify-content: space-between;
  z-index: 2;

  ul {
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    width: 100%;
    justify-content: space-between;
  }

  li {
    cursor: pointer;
    min-width: 30px;
    height: 40px;
    padding: 5px 0;
    line-height: 40px;
    color: #ccc;
    text-align: center;
    font-size: 14px;

    .navbtn {
      display: inline-block;
      color: #ccc;
      line-height: 20px;
    }

    img {
      height: 20px;
      border: none;
    }
  }

  li:hover {
    color: #fff;
    font-size: 14px;

    .navbtn {
      color: #fff;
    }


  }

  li.active {
    color: #fff;
    font-size: 14px;

    .navbtn {
      color: #fff;
    }


  }
}

@media only screen and (max-width: 1920px) {
  .nav {
    display: block;


  }

  .navsmall {
    display: none;
  }

  .account {
    position: absolute;
    display: block;
    top: 50px;
    right: -90px;
    z-index: 30;

  }

}

@media only screen and (max-width: 1215px) {
  .account {
    position: absolute;
    display: block;
    top: 50px;
    right: 0px;
    z-index: 30;

  }
}

/*767px*/
@media only screen and (max-width: 650px) {
  .nav {
    display: none;
  }

  .navsmall {
    display: block;
    position: relative;
    z-index: 20;


  }

  .nav-con {
    padding: 0 30px;
  }

  .account {
    position: absolute;
    display: block;
    top: 50px;
    right: 0;
    z-index: 30;

  }

}


.navsmall-nav {
  position: absolute;
  display: block;
  background: #2e2f30;
  padding: 10px 30px;
  width: calc(100% - 60px);

  li {
    text-align: left;
    border-bottom: solid 1px #787a7e;

    .navbtn {
      display: inline-block;
      color: #ccc;
      line-height: 30px;
      font-size: 13px;
    }

  }

  li:last-child {
    border-bottom: solid 0px #787a7e;
  }

  li:hover .navbtn {
    color: #fff;
  }


}

.module-container {
  /*position: absolute;
  left: 0;
  bottom: 0;
  right: 0;
  top: 90px;*/
  z-index: 10;
  width: 100%;
  /*background: rgb(239, 242, 242);*/
  background: #1f2425;
  backdrop-filter: saturate(100%) blur(15px)
}



/* 可以设置不同的进入和离开动画 */
/* 设置持续时间和动画函数 */
.slide-fade-enter-active {
  transition: all .2s ease;
}

.slide-fade-leave-active {
  transition: all .3s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}

.slide-fade-enter,
.slide-fade-leave-to

/* .slide-fade-leave-active for below version 2.1.8 */
  {
  transform: translateY(-10px);
  opacity: 0;
}

</style>
