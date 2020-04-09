<template>
  <div :class="classObj" class="app-wrapper">
    <top-header v-show="!fullScreen"/>
    <div class="wrapper-main">
      <div v-if="device==='mobile'&&!sidebar.opened" class="drawer-bg" @click="handleClickOutside"/>
      <!-- <Systembar /> -->
      <div class="big-main-container">
        <sidebar v-show="!fullScreen || fullScreenSiderbar" class="sidebar-container"/>
        <!-- 这是右边的 -->
        <div class="main-container">
          <!-- <navbar/> -->
          <!-- <div class="header-right-special">
            <right-icon-groups />
          </div> -->
          <tags-view v-show="!fullScreen || fullScreenTagview"/>
          <app-main/> 
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { Navbar, Sidebar, AppMain, TagsView, TopHeader } from './components'
import Systembar from './components/Systembar'
import ResizeMixin from './mixin/ResizeHandler'

export default {
  name: 'Layout',
  components: {
    Navbar,
    Sidebar,
    AppMain,
    TagsView,
    TopHeader,
    Systembar
  },
  mixins: [ResizeMixin],
  data: () => {
    return {
      isActiveResize: false,
      tip: null
    }
  },
  computed: {
    sidebar() {
      return this.$store.state.app.sidebar
    },
    systembar() {
      return this.$store.state.app.systembar
    },
    device() {
      return this.$store.state.app.device
    },
    classObj() {
      return {
        hideSidebar: !this.sidebar.opened, // 侧边栏默认状态，现为展开
        openSidebar: this.sidebar.opened,
        withoutAnimation: !this.sidebar.withoutAnimation,
        mobile: this.device === 'mobile',
        hideSystembar: !this.systembar.systemOpened,
        // systemWithoutAnimation: !this.systembar.systemWithoutAnimation,
        fullScreen: this.fullScreen // 全屏
      }
    },
    ...mapGetters([
      'fullScreen',
      'fullScreenTagview',
      'fullScreenSiderbar'
    ])
  },
  mounted() {
    // 添加全局的键盘事件
    // document.body.addEventListener('keyup', this.handleFullScreen)
  },
  methods: {
    handleClickOutside() {
      this.$store.dispatch('CloseSideBar', { withoutAnimation: false })
    },
    // 侧边栏收缩
    toggleSideBar() {
      this.$store.dispatch('ToggleSideBar')
    },
    siderbarMouseFun() {
      // this.isActiveResize = true
    }
    // 全屏显示
    // handleFullScreen(event, start) {
    //   const e = event || window.event
    //   // 按下 shift + F11 组合 全屏显示
    //   if (e.keyCode === 122 && e.shiftKey || start) {
    //     this.$store.dispatch('ToggleFullsereen', !this.fullScreen)
    //     if (this.fullScreen) {
    //       Message({
    //         message: '按 Esc 或 shift + F11组合键 退出全屏模式',
    //         type: 'warning',
    //         duration: 3000
    //       })
    //     }
    //   }
    //   if (this.fullScreen && e.keyCode === 27) {
    //     this.$store.dispatch('ToggleFullsereen', !this.fullScreen)
    //   }
    // },
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  @import "src/styles/mixin.scss";
  .app-wrapper {
    @include clearfix;
    position: relative;
    height: 100%;
    width: 100%;
    &.mobile.openSidebar{
      position: fixed;
      top: 0;
    }
    &.fullScreen{
      .wrapper-main{
        height: 100%;
        top: 0;
      }
      .main-container{
        margin-left: 0 !important;
      }
      .app-main{
        height: 100%;
      }
      .iframe-sel-con{
        height: calc(100vh - 30px) !important;
      }
    }
  }
  .drawer-bg {
    background: #000;
    opacity: 0.3;
    width: 100%;
    top: 0;
    height: 100%;
    position: absolute;
    z-index: 999;
  }
  .wrapper-main{
    position: absolute;
    left: 0;
    top: 50px;
    width: 100%;
    height: calc(100% - 50px);
  }
  .big-main-container{
    height: 100%;
    margin-left: 50px;
  }
  .header-right-special{
    position: absolute;
    z-index: 3000;
    right: 0;
    top: -52px;
    color: #fff;
  }
</style>
