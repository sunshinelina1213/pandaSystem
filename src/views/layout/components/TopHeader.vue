<template>
  <div class="main-header">
    <div class="main-header-left">
      <!-- 系统侧边栏 -->
      <!-- <div :class="{isopen: systembar.systemOpened}" class="menu-show-con">
        <i class="el-icon-menu menu-show" @click="toggleSystemBar"/>
      </div> -->
      <!-- <div :class="{isopen: systembar.systemOpened}" class="menu-show-con">
        <i class="el-icon-menu menu-show" />
      </div> -->
      <div class="header-left-text">Web系统<i>v1.0</i></div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'TopHeader',
    computed: {
      systembar() {
        return this.$store.getters.systembar
      },
      moduleTitle() {
        return localStorage.getItem('moduleName')
      }
    },
    methods: {
      toggleSystemBar() {
        this.$store.dispatch('ToggleSystemBar')
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  $primaryColor: #20CE94;
  .main-header{
    background-color: $primaryColor;
    color: #ffffff;
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    height: 50px;
    width: 100%;
    z-index: 3002;
    padding-left: 20px;
  }
  .main-header-left{
    float: left;
    height: 100%;
    line-height: 51px;
  }
  .menu-show-con{
    display: inline-block;
    width: 50px;
    text-align: center;
  }
  .menu-show{
    margin-left: 10px;
    margin-right: 4px;
    /* cursor: pointer; */
  }
  .header-left-text{
    font-family: microsoft yahei;
    display: inline-block;
    font-size: 16px;
    i{
      font-style: normal;
      font-size: 14px;
      margin-left: 6px;
    }
  }
  .main-header-right{
    float: right;
    height: 100%;
    line-height: 50px;
    margin-right: 20px;
    color: #fff;
  }
  .isopen{
    background-color: #284062;
    margin-right: 15px;
  }
</style>
