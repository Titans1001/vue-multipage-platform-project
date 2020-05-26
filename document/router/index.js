import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)


// import HelloWorld from '@/components/HelloWorld'
// const HelloWorld = () => import('../components/HelloWorld')
const Home = r => require.ensure([], () => r(require('@/components/Home')), 'Home');
const HelloWorld = r => require.ensure([], () => r(require('@/components/childrenleve1/HelloWorld')), 'HelloWorld');
const Component1 = r => require.ensure([], () => r(require('@/components/childrenleve1/component1')), 'Component');
const Component2 = r => require.ensure([], () => r(require('@/components/childrenleve1/component2')), 'Component');
const Vuexstore = r => require.ensure([], () => r(require('@/components/childrenleve1/Vuexstore')), 'Vuexstore');
const Table = r => require.ensure([], () => r(require('@/components/childrenleve1/table')), 'Table');
const Vuerender = r => require.ensure([], () => r(require('@/components/childrenleve1/Vuerender')), 'Vuerender');
export default new Router({
  routes: [{
    path: '/',
    name: 'Home',
    component: Home,
    children: [{
        path: 'HelloWorld',
        name: 'HelloWorld',
        component: HelloWorld, //resolve => require(['../components/HelloWorld'], resolve)
        meta: {
          auth: true,
          keepAlive: true
        }
      },
      {
        path: 'HelloWorld/Component1',
        name: 'Component1',
        component: Component1,

      },
      {
        path: 'Component2',
        name: 'Component2',
        component: Component2,
        meta: {
          keepAlive: true
        },
        children: [{
          path: '/Vuexstore',
          name: 'Vuexstore',
          component: Vuexstore,
        }]
      },
      {
        path: 'Table',
        name: 'Table',
        component:Table ,
      },

    ]
  }]
})
