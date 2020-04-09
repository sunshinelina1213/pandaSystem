import Vue from 'vue'
import 'babel-polyfill'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import VueAwesomeSwiper from 'vue-awesome-swiper'

import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/zh-CN' // lang i18n
import 'swiper/dist/css/swiper.css'

import '@/styles/index.scss' // global css
import '@/fonts/iconfont.css'

import App from './App'
import store from './store'
import router from './router'

import '@/icons' // icon
import '@/permission' // permission control
import '@/assets/icon/iconfont.css' // 引入iconfont 步骤 1 将图标下载至本地 放入/assets/icon中 2 <i class="icon iconfont XXX"></i>
/**
 * This project originally used easy-mock to simulate data,
 * but its official service is very unstable,
 * and you can build your own service if you need it.
 * So here I use Mock.js for local emulation,
 * it will intercept your request, so you won't see the request in the network.
 * If you remove `../mock` it will automatically request easy-mock data.
 */
// import '../mock' // simulation data
// window.baseURL = 'http://112.124.8.90:8088/czyDing/manage'
window.baseURL = 'http://rap2.taobao.org:38080/app/mock/250231' // mock 地址
// window.baseURL = 'http://112.124.8.90:18080/czy' 
// window.baseURL = `http://${document.location.host}/czy` 

Vue.use(ElementUI, { locale }, VueAwesomeSwiper)

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
