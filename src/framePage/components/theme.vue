<template>
  <div>
  </div>
</template>
<script>
const Account = () => import('./account')
export default {
  name: 'loginindex',
  components: {

  },
  data() {
    return {
      language: "cn",
      theme: "",

    }
  },
  methods: {

  },
  created() {
    //this.manulist = this.getQueryString("manulist").split(",")
  },
  mounted() { //

  },
  watch: {
    type: {
      handler() {},
      deep: true,
      immediately: true
    },

  }
}

</script>
<style scoped lang="scss">

</style>
