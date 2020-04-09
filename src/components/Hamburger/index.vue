<template>
  <!-- <div>
    <svg
      :class="{'is-active':isActive}"
      fill="#495060"
      class="hamburger"
      viewBox="0 0 1024 1024"
      xmlns="http://www.w3.org/2000/svg"
      width="64"
      height="64"
      @click="toggleClick">
      <path d="M256 158.208v709.734c0 30.157-22.938 54.58-51.2 54.58s-51.2-24.423-51.2-54.58V158.157c0-30.157 22.938-54.58 51.2-54.58S256 128 256 158.158z m307.2 0v709.734c0 30.157-22.938 54.58-51.2 54.58s-51.2-24.423-51.2-54.58V158.157c0-30.157 22.938-54.58 51.2-54.58s51.2 24.423 51.2 54.58z m307.2 0v709.734c0 30.157-22.938 54.58-51.2 54.58s-51.2-24.423-51.2-54.58V158.157c0-30.157 22.938-54.58 51.2-54.58s51.2 24.423 51.2 54.58z" />
    </svg>
  </div> -->
  <div v-if="opened" class="hamburger-icon" @click="toggleClick">
    <i class="el-icon-arrow-left"></i>
  </div>
  <div v-else class="hamburger-icon" @click="toggleClick">
    <i class="el-icon-arrow-right"></i>
  </div>
</template>

<script>
export default {
  name: 'Hamburger',
  props: {
    isActive: {
      type: Boolean,
      default: false
    },
    toggleClick: {
      type: Function,
      default: null
    }
  },
  computed: {
    opened() {
      return this.$store.state.app.sidebar.opened
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.hamburger {
  display: inline-block;
  cursor: pointer;
  /* cursor: e-resize; */
  width: 13px;
  height: 20px;
}
.hamburger.is-active {
  transform: rotate(180deg);
}
.hamburger-icon{
  i{
    font-size: 12px;
    color: #999;
    margin-left: 2px;
  }
}
</style>
