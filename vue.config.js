/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-08-12 09:52:19
 * @LastEditTime: 2020-05-30 21:35:33
 * @LastEditors: Please set LastEditors
 */

const CompressionWebpackPlugin = require('compression-webpack-plugin');

// cdn预加载使用
const externals = {
  'element-ui': 'ELEMENT',
  'vue': 'Vue',
  'vue-router': 'VueRouter',
  'vuex': 'Vuex',
}

// cdn地址配置
const cdn = {
  // 开发环境
  dev: {
    css: [
      'https://cdnjs.cloudflare.com/ajax/libs/animate.css/3.7.2/animate.min.css',
      'https://unpkg.com/element-ui/lib/theme-chalk/index.css',
    ],
    js: []
  },
  // 生产环境
  build: {
    css: [
      'https://cdnjs.cloudflare.com/ajax/libs/animate.css/3.7.2/animate.min.css',
      'https://unpkg.com/element-ui/lib/theme-chalk/index.css',
    ],
    js: []
  }
}

// 是否使用gzip
const productionGzip = true;
// 需要gzip压缩的文件后缀
const productionGzipExtensions = ['js', 'css'];

module.exports = {
  devServer: {
    port: 6868,
  },

  chainWebpack: (config) => {
    config.module
      .rule('svg-sprite')
      .use('svgo-loader')
      .loader('svgo-loader');

    // 添加CDN参数到htmlWebpackPlugin配置中， 详见public/index.html 修改
    config.plugin('html').tap(args => {
      if (process.env.NODE_ENV === 'production') {
        args[0].cdn = cdn.build;
      }
      if (process.env.NODE_ENV === 'development') {
        args[0].cdn = cdn.dev;
      }
      return args;
    });
  },

  publicPath: '',
  outputDir: undefined,
  assetsDir: undefined,
  runtimeCompiler: undefined,
  productionSourceMap: false,
  parallel: undefined,
  css: undefined,
  transpileDependencies: [],

  configureWebpack: config => {
    const myConfig = {}
    // if (process.env.NODE_ENV === 'production') {
    //   // 生产环境npm包转CDN
    //   myConfig.externals = externals;

    //   // 构建时开启gzip，降低服务器压缩对CPU资源的占用，服务器也要相应开启gzip
    //   myConfig.plugins = [];
    //   productionGzip && myConfig.plugins.push(
    //     new CompressionWebpackPlugin({
    //       test: new RegExp('\\.(' + productionGzipExtensions.join('|') + ')$'),
    //       threshold: 8192,
    //       minRatio: 0.8,
    //     })
    //   );
    // }
    if (process.env.NODE_ENV === 'development') {
      // 关闭host check，方便使用ngrok之类的内网转发工具
      myConfig.devServer = {
        disableHostCheck: true,
      };
    }
    return myConfig;
  },
};
