<template>
  <section id="app-main" class="app-main" @mouseover="screenfulMouseOver($event)">
    <!-- <transition name="fade-transform" mode="out-in">
      <keep-alive :include="cachedViews">
        <router-view :key="key"/>
      </keep-alive>
    </transition> -->
    <keep-alive :include="cachedViews">
      <router-view v-if="!$route.meta.iframe" :key="key"/>
    </keep-alive>
    <div v-show="!!$route.meta.iframe" id="iframe-sel-con" :class="{'fullscreen-iframe': fullScreen}" class="iframe-sel-con"></div>
  </section>
</template>

<script>
import Cookies from 'js-cookie'
export default {
  name: 'AppMain',
  data: () => {
    return {
      tabArr: []
    }
  },
  computed: {
    cachedViews() {
      return this.$store.state.tagsView.cachedViews
    },
    key() {
      return this.$route.fullPath
    },
    hrefLink() {
      return this.$route.query.href + '&smartbiCookie=' + Cookies.get('Admin-Token')
    },
    visitedViews() {
      return this.$store.state.tagsView.visitedViews
    },
    fullScreen() {
      return this.$store.state.app.fullScreen
    }
  },
  watch: {
    // 监听相同路由下参数变化的时候，从而实现异步刷新
    '$route'(to, from) {
      if (to.meta.iframe) {
        this.visitedViews.map(item => {
          if (item.meta.iframe && item.path === to.fullPath) {
            document.getElementById(decodeURIComponent(item.path.substr(item.path.indexOf('=') + 1, item.path.length))).style.display = 'block'
          } else if (item.meta.iframe && item.path !== to.fullPath) {
            document.getElementById(decodeURIComponent(item.path.substr(item.path.indexOf('=') + 1, item.path.length))).style.display = 'none'
          }
        })
      }
    }
  },
  mounted() {
    // 解决 在iframe 页面 刷新空白的问题
    if (this.visitedViews[0].meta.iframe) {
      const iframe = document.createElement('iframe')
      iframe.style.width = '100%'
      iframe.style.height = '100%'
      iframe.style.overflow = 'hidden'
      iframe.style.border = 'none'
      iframe.style.display = 'block'
      // iframe.src = decodeURIComponent(this.visitedViews[0].path.substr(this.visitedViews[0].path.indexOf('=') + 1, this.visitedViews[0].path.length)) + '&smartbiCookie=' + Cookies.get('Admin-Token')
      iframe.src = decodeURIComponent(this.visitedViews[0].path.substr(this.visitedViews[0].path.indexOf('=') + 1, this.visitedViews[0].path.length))
      iframe.id = decodeURIComponent(this.visitedViews[0].path.substr(this.visitedViews[0].path.indexOf('=') + 1, this.visitedViews[0].path.length))
      document.getElementById('iframe-sel-con').appendChild(iframe)
    }
  },
  methods: {
    // 鼠标划上最左边、顶部时切换相应的状态
    screenfulMouseOver(e) {
      if (this.fullScreen) {
        if (e.screenX < 20) {
          this.$store.dispatch('ToggleFullsereenSiderbar')
        }
        if (e.screenY < 20) {
          this.$store.dispatch('ToggleFullsereenTagview')
        }
      }
    }
  }
}
</script>

<style scoped>
.app-main {
  /*50 = navbar  */
  height: calc(100vh - 110px);
  position: relative;
  padding: 20px 20px 0 20px;
  /* overflow: hidden; */
}
.iframe-sel-con{
  background: #fff;
  border-radius: 6px;
  /* margin: 20px 20px 0 20px; */
  padding: 20px 22px 0 22px;
  height: calc(100vh - 132px);
}
.fullscreen-iframe{
  height: calc(100vh - 30px);
}
</style>
