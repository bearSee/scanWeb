<!--
 * @Author: your name
 * @Date: 2020-05-30 10:32:53
 * @LastEditTime: 2020-05-30 12:18:57
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /scanWeb/src/App.vue
-->
<template>
  <div id="app">
    <transition
      name="main-classes-transition"
      enter-active-class="animated fadeIn"
      leave-active-class="animated zoomOutDown">
      <router-view></router-view>
    </transition>
  </div>
</template>

<style lang="scss">
@import "@/assets/scss/style.scss";

html{
  overflow: hidden;
}
html,body{
  height: 100%;
  background-color: #f9fbff;
  padding: 0 !important;
}
textarea {
  font-family: inherit;
}
a {
  text-decoration:none;
  color: inherit;
}
#app {
  height: 100%;
}
</style>
