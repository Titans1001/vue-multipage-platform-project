<template>
  <div id="app">
    <h2>{{message}}</h2>
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App',
  data () {
    return {
      message: '产品（productmodule）'
    }
  }
}
</script>

<style>

</style>
