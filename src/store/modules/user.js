import { getToken, setToken, removeToken } from '@/utils/auth'
import { validateLogin, getInfo, logout } from '@/api/login'
import { Message } from 'element-ui'
import Cookies from 'js-cookie'

const user = {
  state: {
    token: getToken(),
    userName: '', // 用户名
    roles: [], // 引导页子系统角色列表
    firsrModuleData: [], // 子系统数据列表
    moduleChildren: [], // 子系统子级 数据列表
    moduleChildrenpid: '', // 点击引导页子系统进入主页面加载左侧树需要pid(子系统id)
    moduleName: '' // 点击引导页子系统进入主页面标题
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_NAME: (state, userName) => {
      state.userName = userName
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SET_MODULE_DATA: (state, firsrModuleData) => {
      state.firsrModuleData = firsrModuleData
    },
    SET_MODULE_CHILDREN_DATA: (state, moduleChildren) => {
      state.moduleChildren = moduleChildren
    },
    SET_MODULE_CHILDREN_PID: (state, moduleChildrenpid) => {
      state.moduleChildrenpid = moduleChildrenpid
    },
    SET_MODULE_NAME: (state, moduleName) => {
      state.moduleName = moduleName
    }
  },

  actions: {
    // 登录
    Login({ commit }, userInfo) {
      const { username, password } = userInfo
      return new Promise((resolve, reject) => {
        validateLogin({ userid: username.trim(), pswd: password }).then(response => {
          const { retData } = response
          // commit('SET_NAME', retData.userName)
          Cookies.set('username', username)
          localStorage.setItem('userName', retData.userName)

          if (retData.smartbiCookie) {
            commit('SET_TOKEN', retData.smartbiCookie)
            setToken(retData.smartbiCookie)
          }
          if (retData.smartbiUserid) {
            Cookies.set('smartbiUserid', retData.smartbiUserid)
          }
          // 表示登录smartBI服务器失败。此时的error只是登录smartBI服务器失败，而登录已然是成功的。所以在前端一下smartBI登录未成功，依然可以跳转到主页面。
          if (retData.error) {
            Message({
              message: retData.error,
              type: 'warning',
              duration: 2000
            })
          }
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 获取子系统用户信息
    getUserInfo({ commit, state }, params) {
      const { dataID, queryParams } = params
      return new Promise((resolve, reject) => {
        getInfo({ dataID: dataID, queryParams: queryParams }).then(response => {
          const roleId = []
          const data = response.retData.rows
          if (!data) {
            reject('验证失败，请重新登录')
          } else if (data.length > 0) {
            data.map(function(item) {
              roleId.push(item.id)
            })
          } 
          // 将roles村的存储在localstorage,防止刷新时，vuex清空的问题
          localStorage.setItem('roles', JSON.stringify(roleId)) 
          commit('SET_ROLES', roleId)
          commit('SET_MODULE_DATA', data)
          resolve(data)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 获取子系统子级信息
    getSystemChildren({ commit, state, dispatch }, params) {
      const { dataID, queryParams, mc } = params
      return new Promise((resolve, reject) => {
        getInfo({ dataID: dataID, queryParams: queryParams }).then(response => {
          const data = response.retData.rows
          commit('SET_MODULE_CHILDREN_DATA', data)
          commit('SET_MODULE_CHILDREN_PID', queryParams.qParams.pid)
          commit('SET_MODULE_NAME', mc)
          dispatch('delAllViews', null, { root: true }) // 注销登录后页签页重置

          resolve(data)
        }).catch(error => {
          reject(error)
        })
      })
    },
    
    // 退出登录 注销
    LogOut({ commit, state, dispatch }) {
      return new Promise((resolve, reject) => {
        logout({ userid: Cookies.get('username') }).then(() => {
          commit('SET_TOKEN', '')
          removeToken()
          commit('SET_ROLES', [])
          localStorage.removeItem('userName')
          localStorage.removeItem('roles')
          localStorage.removeItem('isFirstId')
          localStorage.removeItem('moduleChildId')
          localStorage.removeItem('moduleName')
          localStorage.removeItem('moduleId')
          localStorage.removeItem('smartbiName')

          Cookies.remove('username')
          Cookies.remove('sidebarStatus')
          dispatch('delAllViews', null, { root: true }) // 注销登录后页签页重置
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 清空token
    resetToken({ commit }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '')
        commit('SET_ROLES', [])
        removeToken()
        resolve()
      })
    },

    // 前端 登出
    FedLogOut({ commit }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '')
        removeToken()
        resolve()
      })
    }
  }
}

export default user
