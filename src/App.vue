<template>
  <div id="app">
    <!-- <img alt="Vue logo" src="./assets/logo.png">
    <HelloWorld msg="Welcome to Your Vue.js App"/> -->
    <Report></Report>
  </div>
</template>

<script>
import HelloWorld from './components/HelloWorld'
import D3Test from "./components/D3Test";
import Legends from "./components/Legends";
import Report from "./components/Report";

export default {
  name: 'app',
  components: {
    HelloWorld,
    Legends,
    D3Test,
    Report
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
