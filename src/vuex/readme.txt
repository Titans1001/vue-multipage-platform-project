

vueX使用说明

1、this.$store ： 我们可以通过 this.$store 在vue的组件中获取vuex的实例。
2、State ： vuex中的数据源，我们可以通过 this.$store.state 获取我们在vuex中声明的全局变量的值。
3、Getter： 相当于vue中的computed ， 及 计算属性， 可以用于监听、计算 state中的值的变化
4、Mutation： vuex中去操作数据的方法 （只能同步执行）
5、Action： 用来操作 Mutation 的动作 ， 他不能直接去操作数据源，但可以把mutation变为异步的
6、Module： 模块化，当你的应用足够大的时候，你可以把你的vuex分成多个子模块

import Vue from 'vue';
import Vuex from 'vuex';
Vue.use(Vuex);
export default new Vuex.Store({
    // 在state中去声明全局变量，可以通过 this.$store.state 访问
    state: {
        count: 0
    },
    // 在getters中声明state中变量的计算函数，缓存计算后的数据， 通过 this.$store.getters 调用
    getters: {
        // 接受state作为参数，每次 count发生变化时 ， 都会被调用
        consoleCount: state => {
            console.log('the state count : ' + state.count);
            return state.count;
        }
    },
    // 只能执行同步方法，不要去执行异步方法 通过 this.$store.commit 方法去调用
    mutations: {
        // 改变state状态的方法，不建议直接通过  
        // this.$store.state.? = ？的方式改变state中的状态
        addCount: state => {
            ++state.count;
        },
        // 自定义改变state初始值的方法，mutations的第一个参数即为state对象，并且可以向mutation传入额外的参数(变量或对象);
        addNumCount: (state, n) => {
            state.count+=n;
        },
    },
    // 借助actions的手去 执行 mutations ， 通过  this.$store.dispatch 的方式调用
    // 可以用来执行异步操作，可以跟踪异步数据状态变化
    actions: {
         // 调用 mutation
        addCount: context => {
            context.commit('addCount');
        },
        addNumCount: (context, n) => {
            context.commit('addNumCount', n);
        }
    }
})

我们在代码中分别注册了，state、getters、mutations、actions。
这样我们就可以在任何一个 component中通过 this.$store.dispatch('addNumCount', 5); 或者 this.$store.dispatch('addCount'); 去触发actions操作来改变state中的值。