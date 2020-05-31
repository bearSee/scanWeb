/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-04-01 18:36:51
 * @LastEditTime: 2020-05-30 11:21:32
 * @LastEditors: Please set LastEditors
 */

import Vue from 'vue';
import axios from 'axios';
import qs from 'qs';
import { MessageBox } from 'element-ui';

const root = `${window.location.protocol}//${window.location.host}`;
const config = {
  baseURL: `${root}/sys`,
  timeout: 30 * 1000, // Timeout
  withCredentials: true, // Check cross-site Access-Control
};

const _axios = axios.create(config);

_axios.interceptors.request.use(
  (config) => {
    // 让每个请求携带token--['X-Token']为自定义key
    if (Vue.prototype.$cookies.get('user_session')) {
      config.headers['X-Token'] = Vue.prototype.$cookies.get('user_session');
    }
    if (Vue.prototype.$cookies.get('user_language')) {
      config.headers['Accept-Language'] = Vue.prototype.$cookies.get('user_language');
    }
    // get请求增加时间戳，避免服务器304
    if (config.method === 'get') {
      config.params = {
        _t: Date.parse(new Date()) / 1000,
        ...config.params,
      };
    }
    return config;
  },
  (error) => {
    Promise.reject(error);
  },
);

// Add a response interceptor
_axios.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const response = error.response;
    const data = response.data;
    // Vue.prototype.$alert(data.message || '服务器内部异常');
    Message.error(data.message || '服务器内部异常');
    return Promise.reject(error);
  },
);

const Plugin = {};

Plugin.install = (Vue) => {
  Vue.axios = _axios;
  window.axios = _axios;
  Object.defineProperties(Vue.prototype, {
    axios: {
      get() {
        return _axios;
      },
    },
    $axios: {
      get() {
        return _axios;
      },
    },
    $http: {
      get() {
        return _axios;
      },
    },
    $qs: {
      get() {
        return qs;
      },
    },
  });
};

Vue.use(Plugin);

export default Plugin;
