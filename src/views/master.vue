<!--
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-04-01 18:31:16
 * @LastEditTime: 2020-05-30 16:43:22
 * @LastEditors: Please set LastEditors
 -->
<template>
  <div class="master">
    <!-- <el-container class="master-content">
      <el-header class="master-head">
      </el-header>
      <el-main class="main-content">
      </el-main>
    </el-container> -->
    <keep-alive>
      <router-view v-if="$route.meta.keepAlive"></router-view>
    </keep-alive>
    <router-view v-if="!$route.meta.keepAlive"></router-view>
  </div>
</template>

<script>

export default {
  name: 'master',
  data() {
    return {
    };
  },
  methods: {
  },
};
</script>

<style lang="scss">
@import "@/assets/scss/theme.scss";

.master {
  height: 100vh;
  width: 100vw;
}
/*滚动条样式*/
.vertical-scrollbar::-webkit-scrollbar {
  width: 4px;
  background: #f8f8f8;
}
.vertical-scrollbar::-webkit-scrollbar-thumb {/*滚动条里面小方块*/
  -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
  background: #f8f8f8;
}
.vertical-scrollbar::-webkit-scrollbar-track {/*滚动条里面轨道*/
  border-radius: 4px;
  background: $theme;
}
</style>
