<!-- :to="{ path: tag.path, query: tag.query, fullPath: tag.fullPath }"  -->
<template>
  <div id="tags-view-container" class="tags-view-container" @mouseleave="screenfulMouseLeave($event)">
    <scroll-pane ref="scrollPane" class="tags-view-wrapper">
      <router-link 
        v-for="tag in visitedViews" 
        ref="tag" 
        :class="isActive(tag)?'active':''"
        :to="tag.path" 
        :key="tag.path" 
        tag="span"
        class="tags-view-item" 
        @click.middle.native="!isAffix(tag)?closeSelectedTag(tag):''"
        @contextmenu.prevent.native="openMenu(tag,$event)">
        {{ tag.title }}
        <i v-if="!isAffix(tag)" class="el-icon-close" @click.prevent.stop="closeSelectedTag(tag)" />
      </router-link>
    </scroll-pane>
    <div v-show="!fullScreen" class="screen-con" @click="handleFullScreen">
      <!-- 右边组件部分全屏 -->
      <!-- <el-tooltip class="item" effect="light" content="全屏" placement="bottom">
        <svg-icon icon-class="screenful" class="screenful-icon" @click="handleFullScreen"/>
      </el-tooltip> -->
      <!-- 使用插件 做全屏功能 所有内容全屏-->
      <screenfull id="screenfull" class="right-menu-item hover-effect"/>
    </div>
    <ul v-show="visible" :style="{left:left+'px',top:top+'px'}" class="contextmenu">
      <li v-if="!isAffix(selectedTag)" @click="closeSelectedTag(selectedTag)">关闭</li>
      <li @click="closeOthersTags">关闭其他</li>
      <li @click="closeAllTags(selectedTag)">关闭所有</li>
    </ul>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import ScrollPane from './ScrollPane'
  import path from 'path'
  import Hamburger from '@/components/Hamburger'
  // import Screenfull from '@/components/Screenfull'
  import Screenfull from './Screenfull'

  export default {
    components: { Hamburger, Screenfull, ScrollPane },
    data() {
      return {
        visible: false,
        top: 0,
        left: 0,
        selectedTag: {},
        affixTags: []
      }
    },
    computed: {
      ...mapGetters([
        'sidebar',
        'device',
        'fullScreen'
      ]),
      visitedViews() {
        return this.$store.state.tagsView.visitedViews
      }
    },
    watch: {
      $route() {
        this.addTags()
        this.moveToCurrentTag()
      },
      visible(value) {
        if (value) {
          document.body.addEventListener('click', this.closeMenu)
        } else {
          document.body.removeEventListener('click', this.closeMenu)
        }
      }
    },
    mounted() {
      this.initTags()
      this.addTags()
    },
    methods: {
      isActive(route) {
        // return route.path === this.$route.path
        return route.path === this.$route.fullPath || route.path === this.$route.path
      },
      isAffix(tag) {
        return tag.meta && tag.meta.affix
      },
      filterAffixTags(routes, basePath = '/') {
        let tags = []
        routes.forEach(route => {
          if (route.meta && route.meta.affix) {
            tags.push({
              path: path.resolve(basePath, route.path),
              name: route.name,
              meta: { ...route.meta }
            })
          }
          if (route.children) {
            const tempTags = this.filterAffixTags(route.children, route.path)
            if (tempTags.length >= 1) {
              tags = [...tags, ...tempTags]
            }
          }
        })
        return tags
      },
      initTags() {
        const affixTags = this.affixTags = this.filterAffixTags(this.$router.options.routes)
        for (const tag of affixTags) {
          // Must have tag name
          if (tag.name) {
            this.$store.dispatch('addVisitedView', tag)
          }
        }
      },
      addTags() {
        const { name } = this.$route
        if (name) {
          this.$store.dispatch('addView', this.$route)
        }
        return false
      },
      moveToCurrentTag() {
        const tags = this.$refs.tag
        this.$nextTick(() => {
          for (const tag of tags) {
            if (tag.to.path === this.$route.path) {
              if (tag.to.fullPath !== this.$route.fullPath) {
                this.$store.dispatch('updateVisitedView', this.$route)
              }
              break
            }
          }
        })
      },
      refreshSelectedTag(view) {
        this.$store.dispatch('delCachedView', view).then(() => {
          const { fullPath } = view
          this.$nextTick(() => {
            this.$router.replace({
              path: '/redirect' + fullPath
            })
          })
        })
      },
      // 关闭 当前的tag
      closeSelectedTag(view) {
        if (view.meta.iframe) {
          document.getElementById(decodeURIComponent(view.path.substr(view.path.indexOf('=') + 1, view.path.length))).remove()
        }
        this.$store.dispatch('delView', view).then(({ visitedViews }) => {
          if (this.isActive(view)) {
            this.toLastView(visitedViews)
          }
        })
      },
      // 关闭其他
      closeOthersTags() {
        // 区分 iframe 和 本地组件
        if (this.selectedTag && !this.selectedTag.meta.iframe) {
          this.$router.push(this.selectedTag)
        } else if (this.selectedTag && this.selectedTag.meta.iframe) {
          this.$router.push({ path: this.selectedTag.path })
        }
        this.$store.dispatch('delOthersViews', this.selectedTag).then(() => {
          this.moveToCurrentTag()
        })
      },
      closeAllTags(view) {
        this.$store.dispatch('delAllViews').then(({ visitedViews }) => {
          if (this.affixTags.some(tag => tag.path === view.path)) {
            return
          }
          this.toLastView(visitedViews)
        })
      },
      toLastView(visitedViews) {
        const latestView = visitedViews.slice(-1)[0]
        if (latestView && !latestView.meta.iframe) {
          this.$router.push(latestView)
        } else if (latestView && latestView.meta.iframe) { // 当为iframe时，关闭时异常情况
          this.$router.push({ path: latestView.path })
        } else {
          // You can set another route
          this.$router.push('/')
        }
      },
      openMenu(tag, e) {
        const menuMinWidth = 105
        const offsetLeft = this.$el.getBoundingClientRect().left // container margin left
        const offsetWidth = this.$el.offsetWidth // container width
        const maxLeft = offsetWidth - menuMinWidth // left boundary
        const left = e.clientX - offsetLeft + 15 // 15: margin right

        if (left > maxLeft) {
          this.left = maxLeft
        } else {
          this.left = left
        }
        this.top = e.clientY - 30

        this.visible = true
        this.selectedTag = tag
      },
      closeMenu() {
        this.visible = false
      },
      // 全屏
      handleFullScreen() {
        this.$store.dispatch('ToggleFullsereen')
      },
      // 全屏模式下 鼠标离开tagview时切换状态
      screenfulMouseLeave(e) {
        if (this.fullScreen) {
          if (e.screenY >= 42) {
            this.$store.dispatch('ToggleFullsereenTagview')
          }
        }
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .tags-view-container {
    height: 42px;
    width: 100%;
    background: #fff;
    position: relative;
    /* border-bottom: 1px solid #d8dce5;
    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, .12), 0 0 3px 0 rgba(0, 0, 0, .04); */
    .tags-view-wrapper {
      width: 94%;
      float: left;
      height: 42px;
      /* overflow-x: auto;
      overflow-y: hidden;
      white-space: nowrap; */
      .tags-view-item {
        display: inline-block;
        position: relative;
        cursor: pointer;
        height: 36px;
        line-height: 35px;
        color: #495060;
        padding: 0 20px;
        font-size: 12px;
        margin: 0 1px;
        margin-top: 6px;
        border-radius: 6px 6px 0 0;
        border: 1px solid #eee;
        border-bottom: none;

        &:first-of-type {
          /* margin-left: 5px; */
          margin-left: 0;
        }
        &.active {
          background: #f0f0f0;
        }
      }
      /deep/ .el-scrollbar__bar.is-vertical{
        display: none !important;
      }
    }

    .contextmenu {
      margin: 0;
      background: #fff;
      z-index: 100;
      position: absolute;
      list-style-type: none;
      padding: 5px 0;
      border-radius: 4px;
      font-size: 12px;
      font-weight: 400;
      color: #409EFF;
      box-shadow: 2px 2px 3px 0 rgba(0, 0, 0, .3);

      li {
        margin: 0;
        padding: 7px 16px;
        cursor: pointer;

        &:hover {
          background: #eee;
        }
      }
    }
  }
</style>

<style rel="stylesheet/scss" lang="scss">
  .tags-view-wrapper {
    background: #fff;
    .tags-view-item {
      .el-icon-close{
        border: 1px solid transparent;
        vertical-align: middle;
        margin-left: 3px;
        text-align: center;
        &:hover{
          border-radius: 50%;
          text-align: center;
          border: 1px solid #20CE94;
          color: #20CE94;
        }
      }
      &.active{
        .el-icon-close {
          text-align: center;
        }
      }
    }
  }

  .right-menu-item {
    float: left;
    line-height: 42px;
    width: 20px;
    height: 20px;
    /* margin-top: 12px; */
    position: relative;
    display: inline-block;
    &.hover-effect {
      cursor: pointer;
      transition: color .3s;

      &:hover {
        color: #1890ff;
      }
    }
  }

  .screen-con{
    position: absolute;
    right: 30px;
    margin-top: 12px;
  }
</style>
