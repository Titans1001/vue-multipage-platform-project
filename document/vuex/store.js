import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

const state = {
  loading: false,
  userInfo: {
    phone: 123456789000000,
    account: "Titans",
  }, //用户信息
  login: false, //是否登录
  shopList:[{
    id: 1,
    name: '兰博基尼',
    price: 10
  },{
    id: 2,
    name: '五菱宏光',
    price: 99999
  }],
};

const getters = { //实时监听state值的变化(最新状态)
  isloading(state) { //承载变化的login的值.  //.$store.getters.isloading
    return state.loading
  },
  islogin(state) { 
    return state.login
  },
  getuserInfo(state){
  	return state.userInfo
  }
};
const mutations = {
  setloading(state, isshow) { //自定义改变state初始值的方法，这里面的参数除了state之外还可以再传额外的参数(变量或对象);
    state.loading = isshow;
  },
  setlogin(state, islogin) { //this.$store.commit("setlogin", true)
    state.login = islogin;
  },
  setuserInfo(state, userInfoobj){
  	state.userInfo=userInfoobj
  }
};
const actions = {
  asyncsetoading: (context,loadingstatus) => {//this.$store.dispatch("asyncsetoading", false)
    context.commit('setloading',loadingstatus);
  },
};
const modulea = {
  namespaced: true,
  state: {
    usera: "taitan",
    shopList: [{
      id: 1,
      name: '兰博基尼',
      price: 10
    }, {
      id: 2,
      name: '五菱宏光',
      price: 99999
    }],
  },
  mutations: {
    setusera(state,name) {
      state.usera = name
    }
  },
  actions: {
    asyncsetusera:(context, name)=> {
      context.commit("setusera", name)
    }
  },
  getters: {
    getusera(state) {
      return state.modulea.usera
    }

  }
}
export default new Vuex.Store({
  state,
  getters,
  mutations,
  actions,
  modules: { modulea
   }
});





