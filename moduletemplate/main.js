import Vue from 'vue'
import Vue from 'vue'
import App from './App'
import router from './router'
import iView from 'iview';
import 'iview/dist/styles/iview.css';
import store from '../../vuex/store';
import { fetch, post } from '../../axios/http';
import Vuex from 'vuex';

Vue.use(Vuex)
Vue.use(iView);

Vue.config.productionTip = false

Vue.prototype.$fetch = fetch
Vue.prototype.$post = post
Vue.prototype.$loading = function (show) {
    Vue.nextTick(function () {
        store.commit('FETCH_LOADING', show)
    })
}
router.beforeEach((to, from, next) => {
    iView.LoadingBar.start();
    next();
});

router.afterEach(route => {
    iView.LoadingBar.finish();
});
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  render: h => h(App)
  //components: { App },
  template: '<App/>'
})