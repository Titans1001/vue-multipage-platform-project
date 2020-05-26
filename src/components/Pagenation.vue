<!-- 这是一个分页组件，本demo仅且只提供了这一个组件案例，如果你已具备vue基础，相信不难看懂，为何这样写，为何向父组件传值放在watch里而不放在每一个methods里面，为何这里用的回调数据而不是prop数据-->
<template>
  <div class="pagination">
    <div class="fn-inline curpagedetail">
      共计
      <span class="fn-inline totals">{{ totals }}</span>
      条数据&nbsp;&nbsp;当前显示
      <span class="fn-inline curpagesize">{{ curpagetotals }}</span>
      条数据
    </div>
    <i
      class="fn-inline firstpage pagetoone"
      v-show="isshowpageone && isshowfirstorlastpage"
      @click="topagefirst"
    >
      首页
    </i>
    <i class="fn-inline prev pagetoone" v-show="isshowpageone" @click="goprevpage">上一页</i>
    <ul class="fn-inline pagebtngroup">
      <li v-for="(item, index) in pagebtn" :key="index" @click="pagebtnevent(index)" :class="item.isactive ? 'active fn-inline' : 'fn-inline'">
        {{ item.btn }}
      </li>
    </ul>
    <i class="fn-inline next pagetoone" v-show="isshowpageone" @click="gonextpage">下一页</i>
    <i
      class="fn-inline lastpage pagetoone"
      v-show="isshowpageone && isshowfirstorlastpage"
      @click="topagelast"
    >
      尾页
    </i>
    <span class="text fn-inline" v-show="isshowpageone">跳转到</span>
    <input type class="topage fn-inline" v-model="gopageval" name v-show="isshowpageone" />
    <button class="fn-inline go" @click="gopage" v-show="isshowpageone">确定</button>
    <div class="fn-inline pagesize" v-show="isshowpagesizeselect">
      <div class="select" @click="changepagesizep">
        <input class="pagesize" type name v-model="dompagesize" />
        <span class="fn-inline selecti">{{pagesizeeditstatus?"&#61655;":"&#61656;"}}</span>
      </div>
      <ul class="option" v-show="pagesizeeditstatus">
        <li v-for="(item, index) in pagesizelist" :key="index" @click="changepagesizes(index)">
          <span class="fn-inline">{{ item }}</span>
          <i class="fn-inline">条/页</i>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
export default {
  name: 'rule',
  props: ['pageinit', 'curpagetotal', 'pageconfig'], //这部分用来接收组件传递值，告诉组件这个值就是调用传的值，记得接收。
  data() {
    return {
      isshowtotal: true, //是否显示总条数
      isshowpagesize: true, //是否显示当前页的数据条数
      isshowpagesizeselect: true, //是否可以改变pagesize
      btncount: 7, //显示的btn数量
      isshowfirstorlastpage: true, //是否显示首页或尾页
      isshowgopage: true, //是否显示输入框
      pagesize: 10, //默认每页数据条数
      gopageval: '',
      isshowpageone: true,
      pagesizelist: [10, 20, 50, 100, 500],
      totals: this.total || 0,
      curpagetotals: this.curpagetotal || 0,
      curpage: 1,
      pagesizeeditstatus: false,
      pagebtn: [{
        btn: 1,
        isactive: true
      }]
    };
  },
  computed: {
    dompagesize() {
      return this.pagesize + '条/页';
    }
  },
  mounted() {
    if (this.pageconfig) {
      this.isshowtotal =
        this.pageconfig['isshowtotal'] == undefined || this.pageconfig['isshowtotal'] == '' ?
        this.isshowtotal :
        this.pageconfig['isshowtotal'];
      this.isshowpagesize =
        this.pageconfig['isshowpagesize'] == undefined ||
        this.pageconfig['isshowpagesize'] == '' ?
        this.isshowpagesize :
        this.pageconfig['isshowpagesize'];
      this.isshowpagesizeselect =
        this.pageconfig['isshowpagesizeselect'] == undefined ||
        this.pageconfig['isshowpagesizeselect'] == '' ?
        this.isshowpagesizeselect :
        this.pageconfig['isshowpagesizeselect'];
      this.btncount =
        this.pageconfig['btncount'] == undefined || this.pageconfig['btncount'] == '' ?
        this.btncount :
        this.pageconfig['btncount'];
      this.isshowfirstorlastpage =
        this.pageconfig['isshowfirstorlastpage'] == undefined ||
        this.pageconfig['isshowfirstorlastpage'] == '' ?
        this.isshowfirstorlastpage :
        this.pageconfig['isshowfirstorlastpage'];
      this.isshowgopage =
        this.pageconfig['isshowgopage'] == undefined ||
        this.pageconfig['isshowgopage'] == '' ?
        this.isshowgopage :
        this.pageconfig['isshowgopage'];
      this.pagesize =
        this.pageconfig['pagesize'] == undefined || this.pageconfig['pagesize'] == '' ?
        this.pagesize :
        this.pageconfig['pagesize'];
    }

    if (Math.ceil(this.totals / this.pagesize) < 3) {
      this.isshowpageone = false;
    } else {
      this.isshowpageone = true;
    }
    var self = this;
    this.$emit('onchange', this.curpage, this.pagesize, function(curpagetotal, total, curpage) {
      self.curpagetotals = curpagetotal;
      self.totals = total;
      self.pagebtn = self.getpagebtnarr(self.curpage, self.btncount, self.totals, self.pagesize);
    });

  },
  methods: {
    getpagebtnarr(curpage, btncount, totals, pagesize) {
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
    changepagesizes(index) {
      this.pagesize = this.pagesizelist[index];
      this.pagesizeeditstatus = false;
    },
    changepagesizep() {
      this.pagesizeeditstatus = !this.pagesizeeditstatus;
    },
    topagefirst() {
      this.curpage = 1;
    },
    topagelast() {
      this.curpage = Math.ceil(this.totals / this.pagesize);
    },
    goprevpage() {
      this.curpage = parseInt(this.curpage <= 1 ? 1 : this.curpage - 1);
    },
    gonextpage() {
      this.curpage = parseInt(
        this.curpage >= Math.ceil(this.totals / this.pagesize) ?
        this.curpage :
        this.curpage + 1
      );
    },
    pagebtnevent(index) {
      this.curpage = parseInt(this.pagebtn[index]["btn"]);
    },
    gopage() {
      var topageval = parseInt(this.gopageval);
      if (
        !(
          isNaN(topageval) ||
          topageval == '' ||
          topageval == undefined ||
          topageval < 1 ||
          topageval > Math.ceil(this.totals / this.pagesize)
        )
      ) {
        this.curpage = topageval;
        this.gopageval = '';
      } else {
        this.gopageval = '';
      }
    }
  },
  watch: {
    total: {
      handler() {
        self.totals = total;
      },
      deep: true,
    },
    curpagetotal: {
      handler() {
        self.curpagetotals = curpagetotal;
      },
      deep: true,
    },
    pagesize: {
      handler() {
        this.curpage = 1;
        var self = this;
        this.$emit('onchange', this.curpage, this.pagesize, function(curpagetotal, total, curpage) {
          self.curpagetotals = curpagetotal;
          self.totals = total
          self.pagebtn = self.getpagebtnarr(self.curpage, self.btncount, self.totals, self.pagesize);
        });

      },
      deep: true,
    },
    curpage: {
      handler() {
        var self = this;
        this.$emit('onchange', this.curpage, this.pagesize, function(curpagetotal, total, curpage) {
          self.curpagetotals = curpagetotal;
          self.totals = total
          self.pagebtn = self.getpagebtnarr(self.curpage, self.btncount, self.totals, self.pagesize);
        });

      },
      deep: true,
    },
    curpagetotals: { //深度监听，告诉vue,这个值或内部属性任意一个的值改变了，你立马给我渲染试图。
      handler() {},
      deep: true,
    },
    totals: {
      handler() {
        this.pagebtn = this.getpagebtnarr(this.curpage, this.btncount, this.totals, this.pagesize);
        if (Math.ceil(this.totals / this.pagesize) < 3) {
          this.isshowpageone = false;
        } else {
          this.isshowpageone = true;
        }
      },
      deep: true,
    },
    pageinit: {
      handler() {
        if (this.curpage == 1) {
          var self = this;
          this.$emit('onchange', this.curpage, this.pagesize, function(curpagetotal, total, curpage) {
            self.curpagetotals = curpagetotal;
            self.totals = total;
            self.pagebtn = self.getpagebtnarr(self.curpage, self.btncount, self.totals, self.pagesize);
          });

        } else {
          this.curpage = 1
        }
      },
      deep: true,
    }
  }
};

</script>
<style>
.fn-inline {
  display: inline-block;
  vertical-align: middle;
  font-style: normal;
}

.pagination {
  text-align: center;
}

.pagination .curpagedetail {
  font-size: 0.4rem;
  color: #666;
  margin-right: 0.25rem;
}

.pagination .pagetoone {
  margin: 0 0.25rem;
  height: 1.05rem;
  width: 2.0rem;
  font-size: 0.4rem;
  color: #fff;
  background: #41b7f9;
  outline: none;
  border: none;
  cursor: pointer;
  line-height: 1.0rem;
  text-align: center;
}

.pagination .text {
  color: #41b7f9;
  font-size: 0.4rem;
}

.pagination .pagebtngroup {
  margin: 0 0.25rem;
}

.pagination .pagebtngroup li {
  line-height: 0.95rem;
  width: 1.125rem;
  border: solid 1px #41b7f9;
  color: #41b7f9;
  font-size: 0.4rem;
  text-align: center;
  margin-right: -1px;
  cursor: pointer;
}

.pagination .pagebtngroup li.active {
  background: #41b7f9;
  color: #fff;
}

.pagination .topage {
  margin: 0 0.25rem;
  height: 1rem;
  width: 1.2rem;
  padding: 0.25rem;
  font-size: 0.4rem;
  color: #41b7f9;
  background: transparent;
  outline: none;
  border: solid 1px #41b7f9;
  cursor: pointer;
  line-height: 1.0rem;
  text-align: center;
}

.pagination button.go {
  margin: 0 0.25rem 0 0;
  height: 1rem;
  width: 1.625rem;
  border-radius: 0.075rem;
  font-size: 0.4rem;
  color: #fff;
  background: #41b7f9;
  outline: none;
  border: none;
  cursor: pointer;
  line-height: 1.0rem;
  text-align: center;
}

.pagination .pagesize {
  position: relative;
  cursor: pointer;
}

.pagination .pagesize .select {
  width: 3.0rem;
  line-height: 1.0rem;
  border: solid 1px #41b7f9;
  height: 1rem;
}

.pagination .pagesize .select input {
  border: none;
  background: none;
  outline: none;
  width: 65%;
  text-align: center;
  font-size: 0.4rem;
  color: #41b7f9;
  line-height: 1rem;
}

.pagination .pagesize .select span.selecti {
  width: 15%;
  text-align: center;
}

.pagination .pagesize .select span.selecti {
  height: 0.45rem;
  width: 0.35rem;
  font-size: 0.4rem;
  color: #41b7f9;
  font: normal normal normal 14px/1 FontAwesome;
}

.pagination .pagesize .option {
  position: absolute;
  width: 100%;
  bottom: 0.95rem;
}

.pagination .pagesize .option li {
  line-height: 0.75rem;
  border: solid 1px #41b7f9;
  color: #41b7f9;
  font-size: 0.4rem;
  padding: 0 0.25rem;
  text-align: left;
  margin: -1px 0 0 0 !important;
  display: block;
}

</style>
<!-- 
  调用：
  首先懒加载引入并组册组件
  <Pagenationuser @onchange="pageevent" :pageinit="pageinit" :curpagetotal="0" :total="0"></Pagenationuser>
  methods:{
  initpage() {
      this.pageinit = !this.pageinit;
      // 从新初始化分页，会从第一页开始发起请求，
    },
    pageevent(curpage, pagesize, callback) {
      console.log(curpage, pagesize);
      //通过curpage, pagesize以及其他参数querydata;
      // callback(当前页数据条数, 数据总条数,当前页码);  当前页数据条数, 数据总条数为必要参数
      //callback(0, 0);
      callback(10, 100);
    },
  }
 -->
