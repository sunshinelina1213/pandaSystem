<template>
  <div>
    <el-tooltip class="item" effect="light" content="全屏" placement="bottom">
      <svg-icon icon-class="screenful" class="screenful-icon" @click="click" />
    </el-tooltip>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import screenfull from 'screenfull'
  export default {
    name: 'Screenfull',
    data() {
      return {
        isFullscreen: false
      }
    },
    computed: {
      ...mapGetters([
        'fullScreen'
      ])
    },
    mounted() {
      this.init()
    },
    beforeDestroy() {
      this.destroy()
    },
    methods: {
      click() {
        // 如果 不能进入全屏
        if (!screenfull.isEnabled) {
          this.$message({
            message: '不支持全屏',
            type: 'warning'
          })
          return false
        }
        screenfull.toggle()
      },
      change() {
        this.isFullscreen = screenfull.isFullscreen
      },
      init() {
        if (screenfull.isEnabled) {
          // screenfull.on('change', this.change)
          // 当 按esc时 会取消全屏状态
          screenfull.on('change', () => {
            if (screenfull.isFullscreen) {
              this.isFullscreen = screenfull.isFullscreen
            } else {
              this.$store.dispatch('ToggleFullsereen')
            }
          })
        }
      },
      destroy() {
        if (screenfull.isEnabled) {
          screenfull.off('change', this.change)
        }
      }
    }
  }
  </script>
  
  <style scoped>
  .screenfull-svg {
    display: inline-block;
    cursor: pointer;
    fill: #5a5e66;;
    width: 20px;
    height: 20px;
    vertical-align: 10px;
  }
  .screenful-icon{
    position: absolute;
    top: 1px;
    left: 1px;
  }
</style>
