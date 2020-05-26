/**
 * Created by Administrator on 2018/4/22.
 */
import Vue from 'vue'
import App from './App'
import router from './router'

Vue.config.productionTip = false
import '@/common/css/common.css'
import '@/assets/css/style.css'



/* eslint-disable no-new */
window.homemodule=new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
