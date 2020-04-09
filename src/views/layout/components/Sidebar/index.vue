<template>
  <!-- <el-scrollbar wrap-class="scrollbar-wrapper"> -->
  <!-- <el-menu
      :show-timeout="200"
      :default-active="$route.path"
      :collapse="isCollapse"
      :background-color="variables.menuBg"
      :text-color="variables.menuText"
      :active-text-color="variables.menuActiveText"
      mode="vertical"
    >
      <sidebar-item v-for="route in routes" :key="route.path" :item="route" :base-path="route.path"/>
    </el-menu> -->
  <div :class="{'full-screen-special' : fullScreen}" class="sider-content" @mouseenter="siderbarMouse" @mouseleave="siderbarMouseLeave($event)">
    <!-- <div class="search-box">
      <el-input
        v-model="searchInput"
        placeholder=""
        clearable
        suffix-icon="el-icon-search"
      >
      </el-input>
    </div> -->
    <!-- <div class="title-con">
      <span v-if="moduleName!==''">{{ moduleName }}</span>
      <span v-else>{{ moduleNameLocalstorage }}</span>
      <div class="corners top"></div>
      <div class="corners bottom"></div>
    </div> -->
    <div class="title-content">
      <div class="user-con">
        <!-- <span class="user-icon">
          <svg-icon icon-class="user" />
        </span> -->
        <img src="@/assets/user_photo.png" />
        <span class="user-info">{{ userName }}</span>
      </div>
      <div class="line-mid"></div>
      <div class="name-con">
        <span v-if="moduleName && moduleName!==''">{{ moduleName }}</span>
        <span v-else>{{ moduleNameLocalstorage }}</span>
      </div>
    </div>
    <el-tree   
      ref="treeSider" 
      :props="defaultProps" 
      :load="loadNode" 
      :render-content="renderContent" 
      lazy 
      highlight-current 
      node-key="id" 
      @node-click="clickhandler" 
    />
    <div v-show="!fullScreen" :class="{'is-active-resize': isActiveResize}" class="resize">
      <hamburger :toggle-click="toggleSideBar" :is-active="sidebar.opened" class="hamburger-container"/>
      <!-- <span class="top-radius"></span>
      <span class="bottom-radius"></span> -->
    </div>
  </div>
  <!-- </el-scrollbar> -->
</template>

<script>
  import { mapGetters } from 'vuex'
  import variables from '@/styles/variables.scss'
  import SidebarItem from './SidebarItem'
  import Cookies from 'js-cookie'
  import { Message } from 'element-ui'
  import Hamburger from '@/components/Hamburger'

  import { 
    getList // 树形菜单
  } from '@/api/role-management'

  export default {
    components: { SidebarItem, Hamburger },
    data: () => {
      return {
        defaultProps: { // 树形菜单设置 文本 是否有子节点
          label: 'mc',
          isLeaf: 'isleaf',
          children: []
        },
        node_had: '', // 将node.level == 0的node存起来
        resolve_had: '', // 将node.resolve_had == 0的node存起来
        searchInput: '',
        isActiveResize: false,
        iframeArr: []
      }
    },
    computed: {
      ...mapGetters([
        'sidebar',
        'fullScreen',
        'fullScreenSiderbar'
      ]),
      routes() {
        return this.$router.options.routes
      },
      variables() {
        return variables
      },
      isCollapse() {
        return !this.sidebar.opened
      },
      moduleChildren() {
        return this.$store.getters.moduleChildren
      },
      userName() {
        return localStorage.getItem('userName')
      },
      // 从vuex中获取的当前顶级模块的id
      moduleChildrenpid() {
        return this.$store.getters.moduleChildrenpid
      },
      // 从vuex中获取子系统标题的数据，初始或者刷新的时候为空，所以会判断如果为空的话从localstorage中取得
      moduleName() {
        return this.$store.getters.moduleName
      },
      // 从localstorage中获取到子系统标题
      moduleNameLocalstorage() {
        return localStorage.getItem('moduleName')
      }
    },
    watch: {
      // 监听模块侧边栏点击的时候模块id的变化，如果有变化则重新请求模块子节点内容即刷新子系统侧边栏的内容
      // moduleChildrenpid: {
      //   handler: function(newVal, oldVal) {
      //     this.loadNode(this.node_had, this.resolve_had)
      //   }
      // },
      // 监听子系统侧边栏标题的变化，当点击顶级模块切换的时候会重新赋值标题到localstorage中
      moduleName: {
        handler: function(newVal, oldVal) {
          localStorage.setItem('moduleName', newVal)
        }
      }
    },
    methods: {
      renderContent(h, { node, data, store }) {
        if (!data.clickhandler) {
          return (
            <a class='custom-treesider-node'>
              {data.isleaf === false ? <svg-icon icon-class='folder' class='folder' /> : <svg-icon icon-class = 'sildertable' class='folder' /> }
              <span style='margin-left:5px;' title={data.mc}>{data.mc}</span>
            </a>
          )
        } else if (data.clickhandler && data.target !== 'mid_right' && Cookies.get('Admin-Token')) {
          return (
            // <a class='custom-treesider-node' href={data.href + '&smartbiCookie=' + Cookies.get('Admin-Token')} target={data.target}>
            <a class='custom-treesider-node' href={data.href} target={data.target}>
              {data.isleaf === false ? <svg-icon icon-class='folder' class='folder' /> : <svg-icon icon-class = 'sildertable' class='folder' /> }
              <span style='margin-left:5px;' title={data.mc}>{data.mc}</span>
            </a>
          )
        } else {
          return (
            <a class='custom-treesider-node'>
              {data.isleaf === false ? <svg-icon icon-class='folder' class='folder' /> : <svg-icon icon-class = 'sildertable' class='folder' /> }
              <span style='margin-left:5px;' title={data.mc}>{data.mc}</span>
            </a>
          )
        }
      },
      loadNode(node, resolve) {
        if (node.level === 0) {
          this.node_had = node // 这里是关键！在data里面定义一个变量，将node.level == 0的node存起来
          this.resolve_had = resolve // 同上，把node.level == 0的resolve也存起来
          this.node_had.childNodes = [] // 把存起来的node的子节点清空，不然会界面会出现重复树！
          this.getInitNodes(resolve)
        }
        if (node.level >= 1) {
          this.getChildrenNodes(node, resolve)
        }
      },
      // 获取树形菜单的数据
      getInitNodes(resolve) {
        let params = {}
        const dataId = 'modulesTree'
        params = {
          qParams: {
            pid: localStorage.getItem('moduleId')
          }
        }
        // console.log(this.moduleChildren)
        getList({ dataID: dataId, queryParams: params }).then(response => {
          // console.log(response)
          let gaoliangChildId = ''
          this.menuTree = response.retData.rows // 树形初始菜单
          this.menuTree && this.menuTree.length > 0 && this.menuTree.map(item => {
            if (item.id === localStorage.getItem('moduleChildId')) {
              gaoliangChildId = item.id
            }
          })
          // 设置初始默认高亮
          this.$nextTick(function() {
            // 如果 入口是顶级节点 设置第一项为高亮
            if (localStorage.getItem('isFirstId') === '1') {
              this.$refs.treeSider.setCurrentKey(response.retData.rows[0].id)
            } else if (localStorage.getItem('isFirstId') === '0') { // 如果 入口是子级节点 设置第一项为高亮
              this.$refs.treeSider.setCurrentKey(gaoliangChildId)
            }
          })
          this.menuTree.forEach((item) => {
            // 判断是否是叶子节点
            if (item.isleaf === '1') {
              item.isleaf = true
            } else {
              item.isleaf = false
            }
          })
          resolve(this.menuTree)
        })
      },
      // 获取树形菜单数据子节点
      getChildrenNodes(node, resolve) {
        let params = {}
        const dataId = 'modulesTree'
        params = {
          qParams: {
            pid: node.data.id
          }
        }

        getList({ dataID: dataId, queryParams: params }).then(response => {
          this.menuTree = response.retData.rows
          this.menuTree.forEach((item) => {
            // 判断是否有子节点
            if (item.isleaf === '1') {
              item.isleaf = true
            } else {
              item.isleaf = false
            }
          })
          resolve(this.menuTree)
        })
      },
      // 树形菜单节点 节点被点击事件
      smartbiClickhandler(href, target, mc) {
        if (!Cookies.get('Admin-Token')) {
          Message({
            message: 'smartbi未登录成功',
            type: 'warning',
            duration: 1000
          })
        } else if (Cookies.get('Admin-Token') && href && target === 'mid_right') {
          // console.log(href)
          this.$router.push({ name: 'IframeParent', query: { href: href }})
          // 动态创建iframe标签
          const iframe = document.createElement('iframe')
          iframe.style.width = '100%'
          iframe.style.height = '100%'
          iframe.style.overflow = 'hidden'
          iframe.style.border = 'none'
          iframe.style.display = 'none'
          // iframe.src = href + '&smartbiCookie=' + Cookies.get('Admin-Token')
          iframe.src = href
          iframe.id = href
          document.getElementById('iframe-sel-con').appendChild(iframe)
          // 怎么能让不是当前路由的iframe隐藏掉
          this.iframeArr.push({
            link: href
          })
          // console.log(this.iframeArr)
          this.$nextTick(() => {
            this.iframeArr.length > 0 && this.iframeArr.map((item) => {
              if (item.link === href) {
                document.getElementById(item.link).style.display = 'block'
              } else {
                document.getElementById(item.link).style.display = 'none'
              }
            })
          })
        }
      },
      clickhandler(data) {
        // console.log(data)
        if (!data.clickhandler && data.href) {
          this.$router.push({ path: data.href })
        } else if (data.clickhandler && data.href) {
          this.smartbiClickhandler(data.href, data.target, data.mc)
          localStorage.setItem('smartbiName', data.mc)
        }
      },
      // 侧边栏收缩
      toggleSideBar() {
        this.$store.dispatch('ToggleSideBar')
      },
      // 鼠标划过侧边栏 更改收缩按钮的状态
      siderbarMouse() {
        this.isActiveResize = true
      },
      // 鼠标离开时
      siderbarMouseLeave(e) {
        if (!this.$store.getters.sidebar.opened) {
          this.isActiveResize = true
        } else {
          this.isActiveResize = false
        }
        // 全屏模式下的 鼠标离开侧边栏时切换状态
        if (this.fullScreen) {
          if (e.screenX >= 280) {
            this.$store.dispatch('ToggleFullsereenSiderbar')
          }
        }
      }
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss">
  .sider-content{
    height: 100%;
    background: #fff;
  }
  .full-screen-special{
    box-shadow: 2px 2px 4px #afa1a1;
    z-index: 10;
  }
  .sider-content .el-tree{
    width: 100%;
    background: #fff;
    height: calc(100% - 54px);
    overflow-y: auto;
  }
  .sider-content .el-tree-node__content{
    height: 34px;
    position: relative;
    &:hover{
      background: rgba(30, 149, 193, .3);
    }
    /* background: #f9fafc; */
    /* border-right: 1px solid #e6e6e6; */
  }
  .sider-content .el-tree--highlight-current .el-tree-node.is-current>.el-tree-node__content{
    background-color: rgba(30, 149, 193, .3);
  }
  .sider-content .el-tree-node__content .custom-treesider-node{
    width: 100%;
    flex: 1;
    /* display: flex;  */
    align-items: center;
    justify-content: space-between;
    font-size: 12px;
    padding-right: 8px;
    height: 100%;
    line-height: 40px;
    span{
      color: #666;
    }
    .svg-icon{
      font-size: 16px;
      margin-right: 5px !important;
      color: #666;
    }
  }
  /* 修改tree 折叠和展开图标 */
  .sider-content .el-tree-node__expand-icon{
    padding: 8px 6px 6px 6px;
    color: #666;
  }
  .sider-content .el-icon-caret-right.is-leaf{
    color: transparent;
  }
  .sider-content .el-tree-node__content .el-icon-caret-right:before{
    content: "\E604";
  }
  .search-box{
    width: 100%;
    height: 50px;
    display: flex;
    padding: 0 15px;
    margin-bottom: 5px;
    .el-input__inner{
      height: 30px;
      margin-top: 10px;
      padding-left: 8px;
    }
    .el-input__suffix{
      color: #000;
    }
  }
  /* 四个角（废弃） */
  .title-con{
    width: 100%;
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    span{
      font-size: 16px;
    }
    .corners {
      position: absolute;
      width: 96%;
      -webkit-transition-duration: 0.3s;
      transition-duration: 0.3s;
    }
    .corners.top {
      top: 10px;
    }
    .corners.bottom {
      bottom: 15px;
    }
    .corners:before {
      left: 20px;
    }
    .corners:after {
      right: 20px;
    }
    .corners:after, .corners:before {
      border-color: #20CE94;
      content: '';
      position: absolute;
      width: 7px;
      height: 7px;
      border-style: solid;
      -webkit-transition-duration: 0.3s;
      transition-duration: 0.3s;
      -webkit-transform: translateZ(0);
      transform: translateZ(0);
    }
    .corners.top:before {
      border-width: 1px 0 0 1px;
    }
    .corners.top:after {
      border-width: 1px 1px 0 0;
    }
    .corners.bottom:before {
      border-width: 0 0 1px 1px;
    }
    .corners.bottom:after {
      border-width: 0 1px 1px 0;
    }
    &:hover{
      .corners.top {
        top: 1px;
      }
      .corners.bottom {
        bottom: 8px;
      }
      .corners:before {
        left: 0px;
      }
      .corners:after {
        right: 0px;
      }
    }
  }

  /* 包含用户的侧边标题栏 */
  .title-content{
    width: 100%;
    height: 43px;
    border-bottom: 1px solid #F3F6FE;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    margin-bottom: 10px;
    span{
      font-size: 13px;
      color: #666;
    }
    .line-mid{
      width: 1px;
      height: 28px;
      background-color: #F3F6FE;
    }
    .user-con{
      width: 49%;
      text-align: center;
      /* .user-icon{
        color: #999;
        margin-right: 6px;
        .svg-icon{
          margin-right: 0px !important;
        }
      } */
      img{
        width: 22px;
        height: 23px;
        vertical-align: middle;
      }
      span{
        margin-left: 10px;
        vertical-align: middle;
        display: inline-block;
        padding-top: 5px;
      }
    }
    .name-con{
      width: 49%;
      text-align: center;
      padding-top: 5px;
    }
  }
  .is-active-resize.resize{
    display: block;
  }
  .resize{
    display: none;
    position: absolute;
    right: -19px;
    top: 36%;
    cursor: pointer;
    /* width: 14px; */
    width: 20px;
    height: 150px;
    line-height: 162px;
    /* background: #fff; */
    z-index: 1;
    overflow: hidden;
    background: url("../../../../assets/resize_hu.png") no-repeat;
    background-size: cover;
    .top-radius{
      position: absolute;
      top: -20px;
      left: 0;
      width: 46px;
      height: 50px;
      border-radius: 50%;
      background: #f0f0f0;
      /* top: 0px;
      left: 0;
      width: 0px;
      height: 0px;
      border-color: #f0f0f0 #f0f0f0 #fff #fff;
      border-width: 10px 8px 10px 8px;
      border-style: solid; */
    }
    .bottom-radius{
      position: absolute;
      bottom: -20px;
      left: 0;
      width: 46px;
      height: 50px;
      border-radius: 50%;
      background: #f0f0f0;
      /* bottom: 0px;
      left: 0;
      width: 0px;
      height: 0px;
      border-color: #fff #f0f0f0 #f0f0f0 #fff;
      border-width: 10px 8px 10px 8px;
      border-style: solid; */
    }
  }
</style>

