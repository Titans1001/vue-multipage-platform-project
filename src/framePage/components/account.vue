<template>
  <div class="account-con">
    <div class="account-head">
    </div>
    <ul>
      <li v-for="(item,index) in accountmodulelist" :key="index" :class="item.iscurselect?'active':''" @click="onNavAccountClick(index)">
        <div class="navbtn" target="container">
          <span v-if="item.showtype=='text'">{{curlanguage=='Chinese'?item.cnname:item.name}}</span>
          <img v-if="item.showtype=='ico'" :src="item.ico">
        </div>
        <dl v-show="item.iscurselect">
          <dt v-for="(itemc,indexc) in item.children" :key="indexc" :class="itemc.iscurselect?'active':''" @click="onNavAccountClick(index,indexc)">
            {{curlanguage=='Chinese'?itemc.cnname:itemc.name}}
          </dt>
        </dl>
      </li>
    </ul>
  </div>
</template>
<script>
export default {
  name: 'frameaccount',
  props: {
    language: {
      type: String,
      default () { return "Chinese" }
    },
    theme: {
      type: String,
      default () { return "luxury" }
    }
  },
  data() {
    return {
      curlanguage: this.language,
      curtheme: this.theme,
      accountmodulelist: [{
          name: "theme",
          cnname: "主题",
          showtype: "text",
          // ico:require(""),
          iscurselect: false,
          children: [{
            name: "luxury",
            cnname: "轻奢",
            iscurselect: false,
          }, {
            name: "vitality",
            cnname: "活力",
            iscurselect: false,
          }, {
            name: "youth",
            cnname: "年轻",
            iscurselect: false,
          }, {
            name: "mature",
            cnname: "成熟",
            iscurselect: false,
          }]
        },
        {
          name: "language",
          cnname: "语言",
          showtype: "text",
          // ico:require(""),
          iscurselect: false,
          children: [{
            name: "Chinese",
            cnname: "汉语",
            iscurselect: false,
          }, {
            name: "English",
            cnname: "英语",
            iscurselect: false,
          }]
        },
        {
          name: "account",
          cnname: "账户",
          showtype: "text",
          // ico:require(""),
          iscurselect: false
        },
        {
          name: "login",
          cnname: "登录",
          showtype: "text",
          // ico:require(""),
          iscurselect: false
        }
      ]
    }
  },
  methods: {
    onNavAccountClick(index, indexc) {
      let self = this
      self.setAllNoSelect(index)
      switch (self.accountmodulelist[index].name) {
        case "theme":
          self.setTheme(index, indexc)
          break;
        case "language":
          self.setlanguage(index, indexc)
          break;
        case "account":
          self.setAccount(index, indexc)
          break;
        case "login":
          self.toLogin(index, indexc)
          break;
        case "loginout":
          self.toLoginOut(index, indexc)
          break;
        default:
          break;
      }
      // self.$emit("accountClick", false)
    },
    setTheme(index, indexc) {
      let self = this
      if (indexc >= 0) {
        self.setAllCNoSelect(index);
        self.curtheme = self.accountmodulelist[index].children[indexc].name
        self.$set(self.accountmodulelist[index].children[indexc], "iscurselect", true)
        self.$set(self.accountmodulelist[index], "iscurselect", false)
        self.$emit("accountClick", false, "theme", self.accountmodulelist[index].children[indexc].name)
      }

    },
    setlanguage(index, indexc) {
      let self = this
      if (indexc >= 0) {
        self.setAllCNoSelect(index);
        self.curlanguage = self.accountmodulelist[index].children[indexc].name
        self.$set(self.accountmodulelist[index].children[indexc], "iscurselect", true)
        self.$set(self.accountmodulelist[index], "iscurselect", false)
        self.$emit("accountClick", false, "language", self.accountmodulelist[index].children[indexc].name)
      }

    },
    setAccount(index, indexc) {
      let self = this
      self.$emit("accountClick", false)
    },
    toLogin(index) {
      let self = this
      self.$emit("accountClick", false)
    },
    toLoginOut(index) {
      let self = this
      self.$emit("accountClick", false)
    },
    setAllNoSelect(index) {
      let self = this
      for (var i = 0; i < self.accountmodulelist.length; i++) {
        if (index == i) {
          self.$set(self.accountmodulelist[i], "iscurselect", !
            self.accountmodulelist[i].iscurselect);
          continue;
        }
        self.$set(self.accountmodulelist[i], "iscurselect", false);
      }
    },
    setAllCNoSelect(index) {
      let self = this
      let arr = []
      self.accountmodulelist[index].children.forEach(function(t, i) {
        self.$set(t, "iscurselect", false);
        arr.push(t)
      })
      self.accountmodulelist[index].children = arr
      self.$set(self.accountmodulelist, index, self.accountmodulelist[index]);

    }
  },
  mounted() { //
    this.curlanguage = this.language
    this.curtheme = this.theme
  },
  watch: {
    language: {
      handler(newValue, oldValue) {
        this.curlanguage = newValue
      },
      deep: true,
      immediately: true
    },
    theme: {
      handler(newValue, oldValue) {
        this.curtheme = newValue
      },
      deep: true,
      immediately: true
    },

  }
}

</script>
<style scoped lang="scss">
.account-con {
  position: relative;

  .account-head {
    left: 50%;
    border: 1px solid #2e2f30;
    content: "";
    display: block;
    position: absolute;
    top: -10px;
    width: 12px;
    height: 12px;
    background: #2e2f30;
    transform: rotate(45deg);
    transform-origin: 0% 0;
  }

  ul {
    width: 200px;
    background: #2e2f30;
    padding: 20px;

  }

  dl {
    display: block;
    background: #484a4b;

    dt {
      cursor: pointer;
      line-height: 25px;
      color: #bbb;
      font-size: 13px;
      padding: 5px 20px 5px 20px;
      border-bottom: solid 1px #787a7e;
    }

    dt.active {
      color: #fff;
    }

    dt:hover {
      color: #fff;
    }
  }


  li {
    text-align: left;
    border-bottom: solid 1px #787a7e;
    cursor: pointer;

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

@media only screen and (max-width: 1215px) {
  .account-con .account-head {
    top: -10px;
    left: 87%;
  }
}

@media only screen and (max-width: 650px) {
  .account-con .account-head {
    top: -10px;
    left: 80%;
  }
}

</style>
