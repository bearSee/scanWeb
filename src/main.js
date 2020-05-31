/*
 * @Author: your name
 * @Date: 2020-05-30 10:32:53
 * @LastEditTime: 2020-05-30 12:19:40
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /scanWeb/src/main.js
 */
import Vue from 'vue';
import App from './App';
import './plugins/cookies';
import './plugins/axios';
import './plugins/element';
import router from './router/index';
import store from './store';

Vue.config.productionTip = false;
new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app');
