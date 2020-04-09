import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // 进度条
import 'nprogress/nprogress.css' // 进度条样式
// import { getToken } from '@/utils/auth' // 获取token
import Cookies from 'js-cookie'

NProgress.configure({ showSpinner: false })// NProgress configuration

const whiteList = ['/login'] // 不重定向白名单

router.beforeEach(async(to, from, next) => {
  NProgress.start()
  if (Cookies.get('username')) {
    if (to.path === '/login') {
      // 如果已登录 则跳转到主页面
      next({ path: '/' })
      NProgress.done()
    } else {
      // 判断用户是否包含角色权限 如果没有通过获取用户信息接口得到
      // const hasRoles = store.getters.roles && store.getters.roles.length > 0
      // const hasRoles = store.getters.roles
      const hasRoles = JSON.parse(localStorage.getItem('roles'))
      if (hasRoles) {
        next()
      } else {
        try {
          const params = {
            // operator: '', 
            qParams: {
              pid: ''
            }
          }
          // 获取用户信息
          // const data = await store.dispatch('getUserInfo', { dataID: 'authModules', queryParams: params })
          // const roles = []
          // if (data && data.length > 0) {
          //   data.map(function(item) {
          //     roles.push(item.id)
          //   })
          // }
          // localStorage.setItem('roles', roles)
          await store.dispatch('getUserInfo', { dataID: 'authModules', queryParams: params })
          next({ ...to, replace: true })
        } catch (error) {
          // remove token and go to login page to re-login
          await store.dispatch('resetToken')
          // Message.error(error || 'Has Error')
          Message.error('Has Error')
          // next(`/login?redirect=${to.path}`)
          next(`/login`)
          NProgress.done()
        }
      }
    }
    // 监听路由参数是否发生变化
    if (to.name === from.name && to.params.type !== from.params.type) {
      next({ name: 'empty', query: { toPath: to.fullPath }})
    } else {
      next()
    }
  } else {
    if (whiteList.indexOf(to.path) !== -1) {
      next()
    } else {
      // next(`/login?redirect=${to.path}`) // 否则全部重定向到登录页
      next(`/login`) // 否则全部重定向到登录页
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  NProgress.done() // 结束Progress
})
