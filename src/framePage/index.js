/**
 * Created by Titans on 2019/9/10.
 */
import Vue from 'vue'
import App from './App'
import router from './router'
import Router from 'vue-router'
import store from '@/common/js/store.js'
Vue.config.productionTip = false
import '@/common/css/common.css'
import '@/common/js/viewport/viewport1366.js'

import initUtil from '@/common/js/util.js'
//console.log(initUtil)
const routerPush = Router.prototype.push
Router.prototype.push = function push(location) {
  return routerPush.call(this, location).catch(error => error)
}
Vue.prototype.$initUtil = initUtil
window.framePage = new Vue({
  el: '#app',
  store,
  router,
  render: h => h(App)
})
console.log("Vue.$initUtil:", window.framePage.$initUtil)
