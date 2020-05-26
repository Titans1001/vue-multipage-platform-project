import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

const state = {
  loading: false,
  curlanguage: "Chinese",
  curtheme: "luxury",
  userInfo: {
    phone: 123456789000000,
    account: "Titans",
    theme: "luxury",
    language: "Chinese"
  }, //用户信息
  login: false, //是否登录
  themelist: {
    luxury: {
      wrapperbg: "#c7d0d6",
      navbg: "rgba(48,51,52,0.8)",
      navcolor: "#ddd",
      navaccolor: "#fff",
      containerbj: "#fff",
      containercolor: "#414a53",
      mainbg: "#fcfbfd",
      maincolor: "#71717f",
    },
    vitality: {
      wrapperbg: "#c7d0d6",
      navbg: "rgba(48,51,52,0.8)",
      navcolor: "#ddd",
      navaccolor: "#fff",
      containerbj: "#fff",
      containercolor: "#414a53",
      mainbg: "#fcfbfd",
      mainbg: "#424561",
    },
    youth: {
      wrapperbg: "#c7d0d6",
      navbg: "rgba(48,51,52,0.8)",
      navcolor: "#ddd",
      navaccolor: "#fff",
      containerbj: "#fff",
      containercolor: "#414a53",
      mainbg: "#fcfbfd",
      mainbg: "#424561",
    },
    mature: {
      wrapperbg: "#c7d0d6",
      navbg: "rgba(48,51,52,0.8)",
      navcolor: "#ddd",
      navaccolor: "#fff",
      containerbj: "#fff",
      containercolor: "#414a53",
      mainbg: "#fcfbfd",
      mainbg: "#424561",
    }
  },
};

const getters = { //实时监听state值的变化(最新状态)
  isloading(state) { //承载变化的login的值.  //this.$store.getters.isloading
    return state.loading
  },
  islogin(state) {
    return state.login
  },
  getuserInfo(state) {
    return state.userInfo
  },
  getlanguage(state) {
    return state.curlanguage
  },
  gettheme(state) {
    return state.curtheme
  },
  getthemelist(state) {
    return state.themelist
  },
  getcurtheme(state) {
    return state.curtheme
  }
};
const mutations = {
  setloading(state, isshow) { //自定义改变state初始值的方法，这里面的参数除了state之外还可以再传额外的参数(变量或对象);
    state.loading = isshow;
  },
  setlogin(state, islogin) { //this.$store.commit("setlogin", true)
    state.login = islogin;
  },
  setuserInfo(state, userInfoobj) {
    state.userInfo = userInfoobj
  },
  setcurtheme(state, curtheme) {
    state.curtheme = curtheme
  },
  setlanguage(state, curlanguage) {
    state.curlanguage = curlanguage
  },

};
const actions = {
  asyncsetoading: (context, loadingstatus) => { //this.$store.dispatch("asyncsetoading", false)
    context.commit('setloading', loadingstatus);
  },
};
const modulea = {
  namespaced: true,
  state: {
    usera: "taitan",
  },
  mutations: {
    setusera(state, name) {
      state.usera = name
    }
  },
  actions: {
    asyncsetusera: (context, name) => {
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
  modules: {
    modulea
  }
});
