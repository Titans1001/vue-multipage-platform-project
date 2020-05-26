import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

const state = {
  loading: false,
  userInfo: {
    phone: 12345678900,
    account: "Titans",
  }, //用户信息
  login: true, //是否登录
};

const getters = { //实时监听state值的变化(最新状态)
  isshowloading(state) { 
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
  showloading(state, isshow) { //自定义改变state初始值的方法，这里面的参数除了state之外还可以再传额外的参数(变量或对象);
    state.loading = isshow;
  },
  setlogin(state, islogin) { 
    state.islogin = islogin;
  },
  setuserInfo(state, userInfoobj){
  	state.userInfo=userInfoobj
  }
};
const actions = {
  showloading: context => {
    context.commit('showloading',false);
  },
};
export default new Vuex.Store({
  state,
  getters,
  mutations,
  actions
});
