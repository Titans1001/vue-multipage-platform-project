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
      message: '首页（homemodule）'
    }
  }
}
</script>

<style>
</style>
