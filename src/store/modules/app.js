import Cookies from 'js-cookie'

const app = {
  state: {
    // 菜单侧边栏参数true
    sidebar: {   
      opened: Cookies.get('sidebarStatus') ? !!+Cookies.get('sidebarStatus') : true,
      // opened: true,
      withoutAnimation: false
    },
    // 系统侧边栏true
    systembar: {
      systemOpened: false,
      systemWithoutAnimation: false
    },
    // 模式（pc和移动）
    device: 'desktop',
    // 全屏状态
    fullScreen: false,
    // 全屏状态中 tagview显示隐藏
    fullScreenTagview: false,
    // 全屏状态中 侧边栏显示隐藏
    fullScreenSiderbar: false
  },
  mutations: {
    // 侧边栏 切换
    TOGGLE_SIDEBAR: state => {
      state.sidebar.opened = !state.sidebar.opened
      state.sidebar.withoutAnimation = true
      if (state.sidebar.opened) {
        Cookies.set('sidebarStatus', 1)
      } else {
        Cookies.set('sidebarStatus', 0)
      }
    },
    // 侧边栏
    CLOSE_SIDEBAR: (state, withoutAnimation) => {
      Cookies.set('sidebarStatus', 1)
      state.sidebar.opened = true
      state.sidebar.withoutAnimation = withoutAnimation
    },
    // 切换 模式
    TOGGLE_DEVICE: (state, device) => {
      state.device = device
    },
    // 系统侧边栏入口 切换
    TOGGLE_SYSTEMBAR: state => {
      if (state.systembar.systemOpened) {
        Cookies.set('systembarStatus', 1)
      } else {
        Cookies.set('systembarStatus', 0)
      }
      state.systembar.systemOpened = !state.systembar.systemOpened
      state.systembar.systemWithoutAnimation = true
    },
    // 切换全屏
    TOGGLE_FULLSCREEN: (state) => {
      state.fullScreen = !state.fullScreen
    },
    // 切换全屏状态中 tagview显示隐藏
    TOGGLE_FULLSCREEN_TAGVIEW: (state) => {
      state.fullScreenTagview = !state.fullScreenTagview
    },
    // 切换全屏状态中 侧边栏显示隐藏
    TOGGLE_FULLSCREEN_SIDERBAR: (state) => {
      state.fullScreenSiderbar = !state.fullScreenSiderbar
    }
  },
  actions: {
    /**
     * 侧边栏切换
     */
    ToggleSideBar: ({ commit }) => {
      commit('TOGGLE_SIDEBAR')
    },
    CloseSideBar({ commit }, { withoutAnimation }) {
      commit('CLOSE_SIDEBAR', withoutAnimation)
    },
    /**
     * 全屏模式切换
     */
    ToggleDevice({ commit }, device) {
      commit('TOGGLE_DEVICE', device)
    },
    /**
     * 子系统侧边栏切换
     */
    ToggleSystemBar: ({ commit }) => {
      commit('TOGGLE_SYSTEMBAR')
    },
    /**
     * 全屏切换
     */
    ToggleFullsereen: ({ commit }) => {
      commit('TOGGLE_FULLSCREEN')
    },
    /**
     * 全屏切换tagview显示隐藏
     */
    ToggleFullsereenTagview: ({ commit }) => {
      commit('TOGGLE_FULLSCREEN_TAGVIEW')
    },
    /**
     * 全屏切换tagview显示隐藏
     */
    ToggleFullsereenSiderbar: ({ commit }) => {
      commit('TOGGLE_FULLSCREEN_SIDERBAR')
    }
  }
}

export default app
