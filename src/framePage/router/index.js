import Vue from 'vue'
import Router from 'vue-router'
import index from '../components/index'

Vue.use(Router)


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
