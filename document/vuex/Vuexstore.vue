<template>
  <div class="vuexstore">
    <h1>{{ msg }}</h1>
    <br>
    <Button type="primary" @click="goBack">goBack one step</Button>
    <br>
    <br>
    <Button type="primary" @click="getstate">getstate</Button>
    <Button type="primary" @click="setstate">setstate</Button>
    <Button type="primary" @click="setstateasync">setstateasync</Button>
    <Button type="primary" @click="getmapvuex">getmapvuex</Button>
  </div>
</template>
<script>
import { mapGetters, mapMutations, mapState, mapActions } from 'vuex'
export default {
  name: 'Vuexstore',
  components: {

  },
  data() {
    return {
      msg: "以下是一个vue project组件VUEX",
    }
  },
  computed: {
    // 使用对象展开运算符将 getter 混入 computed 对象中
    ...mapGetters([
      'getuserInfo',
      'islogin',
      'isloading'
      // ...
    ]),
    // getuserInfo(){
    //   return this.$store.getters.getuserInfo
    // },

    ...mapState([
      // 映射 this.shopList为 store.state.shopList
      'shopList'
    ]),
    ...mapState('modulea', ['usera'])


  },
  methods: {
    goBack() {
      window.history.length > 1 ?
        this.$router.go(-1) :
        this.$router.push('/')
    },
    getstate() {
       alert(this.getuserInfo)
      alert(this.$store.state.userInfo.phone)
      this.$store.state.userInfo.phone=12344566
      alert(this.$store.state.modulea.usera)
    },
    setstate() {
      this.$store.commit("setlogin", true)
      alert(this.$store.getters.islogin)
      //this.setusera("taitanmodul");
      this.$store.commit('modulea/setusera',"taitanmodul")

      alert(this.$store.state.modulea.usera)
      alert(this.$store.getters['modulea/getusera']) 
      this.setusera("taitanmodulmap");
      alert(this.$store.state.modulea.usera)
    },
    setstateasync() {
      this.$store.dispatch("asyncsetoading", false)
      alert(this.$store.getters.isloading)
      this.$store.dispatch('modulea/asyncsetusera',"taitanmodulceshi")
      alert(this.$store.getters['modulea/getusera']) 
    },
    getmapvuex() {
      console.log(this.getuserInfo);
      console.log(this.shopList);
      this.setlogin("mapfalse")
      console.log(this.$store.getters.islogin);

      this.setuserInfo({
        phone: 19993170150,
        account: "Titans",
      })
      console.log(this.$store.state.userInfo.phone);
      this.asyncsetoading("已经加载")
      console.log(this.$store.getters.isloading);
      console.log(this.usera);

    },
    ...mapMutations('modulea',[
      'setusera', 
    ]),
    ...mapMutations([
      'setlogin', // 将 `this.setlogin(true)` 映射为 `this.$store.commit('setlogin',true)`
      // `mapMutations` 也支持载荷：
      'setuserInfo' // 将 `this.setuserInfo(info)` 映射为 `this.$store.commit('setuserInfo', info)`
    ]),
    ...mapActions({
      asyncsetoading: 'asyncsetoading' // 将 `this.asyncsetoading(false)` 映射为 `this.$store.dispatch("asyncsetoading", false)`
    })

  },
  mounted() {

  },
}

</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1,
h2 {
  font-weight: normal;
  font-size: 14px;
}

</style>
