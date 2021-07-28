/*
 * @Descripttion: your project
 * @version: 1.0
 * @Author: Summer
 * @Date: 2021-05-07 09:25:53
 * @LastEditors: Summer
 * @LastEditTime: 2021-05-10 20:36:21
 */
const SentryCliPlugin = require('@sentry/webpack-plugin')

module.exports = {
  lintOnSave: true,
  productionSourceMap: true,
  publicPath: process.env.NODE_ENV === 'production' ? './' : '/',
  chainWebpack: (config) => {
    config.optimization.minimizer('terser').tap((args) => {
      args[0].terserOptions.compress.drop_console = true
      return args
    })

    console.log('process.env.NODE_ENV:::', process.env.NODE_ENV)

    process.env.NODE_ENV === 'production' && config.plugin('SentryCliPlugin').use(SentryCliPlugin, [{
      include: './dist',
      ignore: ['node_modules'],
      urlPrefix: '~/',
      configFile: '.sentryclirc',
      release: process.env.npm_package_version,
      deploy: {
        env: process.env.DEPLOY_ENV
      }
    }])
  },
  configureWebpack: {
    mode: process.env.NODE_ENV,
    externals: {}
  },
  css: {
    loaderOptions: {
      css: {},
      postcss: {
        plugins: [
          require('postcss-px2rem')({
            remUnit: 37.5
          })
        ]
      }
    }
  },
  devServer: {
    // 设置代理
    proxy: {
      '/xzfgpm': {
        target: 'http://172.16.110.111:84/xzfgpm',
        // target: 'http://192.168.3.136:8884/xzfgpm',
        // target: 'http://172.16.110.113:84/xzfgpm',
        changeOrigin: true,
        pathRewrite: {
          '^/xzfgpm': '/'
        }
      }
    }
  }
}
