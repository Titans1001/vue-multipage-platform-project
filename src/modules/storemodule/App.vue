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
      message: '店铺（storemodule）'
    }
  }
}
</script>

<style>
</style>
