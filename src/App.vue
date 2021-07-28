<template>
  <div id="app">
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
  </div>
</template>
<style lang="less">
html,
body {
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
  overflow: hidden;
  scroll-behavior:smooth;
}
#app {
  width: 100%;
  height: 100%;
  position: relative;
  box-sizing: border-box;
  overflow: hidden;
  -webkit-overflow-scrolling: touch;
  -webkit-font-smoothing: antialiased;
}
</style>
