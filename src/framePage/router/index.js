import Vue from 'vue'
import Router from 'vue-router'
import index from '../components/index'

Vue.use(Router)

const routerPush = Router.prototype.push
Router.prototype.push = function push(location) {
  return routerPush.call(this, location).catch(error => error)
}
const createRouter = routes => new VueRouter({
  routes
})

// 在使用addRoutes的地方
// 重置当前router的match = 初始router.match

Router.prototype.resetRouter = function resetRouter(routerData) {
  this.matcher = createRouter(routerData).matcher
  this.options.routes = routerData
}
// import HelloWorld from '@/components/HelloWorld'
// const HelloWorld = () => import('../components/HelloWorld')
//resolve => require(['../components/HelloWorld'], resolve)
//const Home = r => require.ensure([], () => r(require('@/components/Home')), 'Home');
export default new Router({
  //mode:"history",
  routes: [{
    path: '/',
    name: 'index',
    component: index
  }]
})
