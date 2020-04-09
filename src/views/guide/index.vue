<template>
  <div class="guide-content">
    <div class="guide-header">
      <span class="system-name">panda管理系统</span>
    </div>
    <!-- 轮播图 -->
    <div id="guide-box" class="guide-box">
      <div class="guide-main">
        <div class="guide-banner">
          <swiper ref="mySwiper" :options="swiperOption" class="swiper-content">
            <swiper-slide v-for="(item,index) in firstSystem" :key="index" :data_index="index" :class="{isactive: item.isActive, isunactive: item.isUnActive}" class="swiper-item">
              <div class="banner-init-info" @mouseenter="bannerMouseover(item,index)">
                <div class="banner-icon-box">
                  <i :class="item.icon" class="banner-init-icon icon iconfont"/>
                </div>
                <span class="banner-init-title">{{ item.mc }}</span>
                <span class="banner-init-divider" />
                <span class="banner-init-desc">快乐搬砖的简单文案介绍信息</span>
                <!-- <div class="banner-sanjiao"></div> -->
              </div>
              <div class="children-box">
                <ul class="children-box-ul">
                  <li v-for="(child,ind) in childrenSystem" :key="ind" :class="{'children-box-list-isactive': item.isActive}" class="children-box-list" @click.stop="gotoChildSystem(child,item)">
                    <div v-if="item.isActive">
                      <!-- <i :class="child.icon" class="child-icon"/> -->
                      <div v-if="child.mc.length>10" :class="{'is-scroll-text-box': isHoverId === child.moduleid}" class="scroll-text-box" @mouseenter="textOverScroll(child, ind)" @mouseleave="textLeaveStop(child, ind)">
                        <!-- 初始显示的部分 -->
                        <!-- <span v-if="isHoverId !== child.moduleid" :title="child.mc" class="child-mc-con">{{ child.mc.substring(0,6) }}..</span> -->
                        <span v-if="isHoverId !== child.moduleid" :title="child.mc" class="child-mc-con">{{ child.mc }}</span>
                        <!-- 滚动的名称全部 -->
                        <span v-else :title="child.mc" class="child-mc-con-all">{{ child.mc }}</span>
                      </div>
                      <div v-else class="scroll-text-box">
                        <span :title="child.mc" class="child-mc-con">{{ child.mc }}</span>
                      </div>
                      <!-- <div class="top"></div>
                      <div class="bottom"></div> -->
                    </div>
                    <div v-else></div>
                  </li>
                </ul>
              </div>
            </swiper-slide>
          </swiper>
          <div slot="button-prev" class="swiper-button-prev swiper-button-other"><i class="el-icon-arrow-left"></i></div>
          <div slot="button-next" class="swiper-button-next swiper-button-other"><i class="el-icon-arrow-right"></i></div>
        </div>
      </div>
      <!-- 底部 -->
      <div class="guide-footer">
        <p class="copyright-title">搬砖快乐 快乐搬砖</p>
        <p class="copyright">技术支持：panda斑斓小星愿</p>
      </div>
    </div>
  </div>
</template>

<script>
  let vm = null
  import { swiper, swiperSlide } from 'vue-awesome-swiper'
  import { Message } from 'element-ui'

  import Cookies from 'js-cookie'
  import { 
    getList, // 顶级节点
    saveItem // 更新菜单的点击数
  } from '@/api/role-management'
  import {
    getGuideList
  } from '@/api/guide'
  export default {
    name: 'Guide',
    components: {
      swiper,
      swiperSlide
    },
    data: () => {
      return {
        showBannerOpacity: false,
        firstSystem: [], // 获取的顶级节点
        childrenSystem: [], // 获取顶级节点子节点
        isHoverId: '',
        clickCount: '', // 底级菜单点击次数
        firstIsleaf: {}, // 鼠标划过时的第一个叶子节点
        iconBanner: [
          {
            name: 'iconmeitankaicai'
          },
          {
            name: 'iconsetting-copy'
          },
          {
            name: 'iconxiaoshoufenxi'
          },
          {
            name: 'iconcangku'
          },
          {
            name: 'icontianbao-copy'
          },
          {
            name: 'iconweituoguan'
          },
          {
            name: 'iconjiankongleixing-xiugai'
          },
          {
            name: 'iconphone'
          }
        ],
        childMenuIcons: [
          {
            name: 'el-icon-location-outline'
          },
          {
            name: 'el-icon-document'
          },
          {
            name: 'el-icon-message'
          },
          {
            name: 'el-icon-menu'
          },
          {
            name: 'el-icon-star-off'
          },
          {
            name: 'el-icon-location-outline'
          },
          {
            name: 'el-icon-document'
          },
          {
            name: 'el-icon-message'
          },
          {
            name: 'el-icon-menu'
          },
          {
            name: 'el-icon-star-off'
          }
        ],
        swiperOption: {
          observer: true,
          initialSlide: 0, // 初始索引值
          slidesPerView: 'auto', // slider容器能够同时显示的slides数量
          spaceBetween: 0, // 在slide之间设置距离（单位px）
          loop: false, // 循环模式
          navigation: { // 左右点击
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev'
          },
          grabCursor: true, // 拖动抓手形状
          on: {
            click: function() {
              // 这里有坑
              // 需要注意的是：this 指向的是 swpier 实例，而不是当前的 vue， 因此借助 vm，来调用 methods 里的方法 
              // console.log(this.clickedSlide && this.clickedSlide.getAttribute('data_index'))
              vm.handleClickSlide(this.clickedSlide && this.clickedSlide.getAttribute('data_index'))
            }
          }
        }
      }
    },
    computed: {
      swiper() {
        return this.$refs.mySwiper.swiper
      },
      userName() {
        return localStorage.getItem('userName')
      },
      roles() {
        // return this.$store.getters.roles
        return JSON.parse(localStorage.getItem('roles'))
      },
      firsrModuleData() {
        return this.$store.getters.firsrModuleData
      }
    },
    created() {
      this.fetchFirstSystem() // 获取所有顶级节点
    },
    mounted() {
      vm = this
    },
    methods: {
      // 获取所有菜单模块
      fetchFirstSystem() {
        let params = {}
        params = {
          pid: ''
        }
        getGuideList(params).then(response => { 
          this.firstSystem = response && response.retData && response.retData.rows
          // 给顶级节点模块加图标
          this.firstSystem.map((item, index) => {
            this.iconBanner.map((sub, ind) => {
              if (index === ind) {
                this.firstSystem[index].icon = this.iconBanner[ind].name
              }
            })
          })
        })
      },
      // 点击顶级节点进入子系统
      handleClickSlide(index) {
        // console.log(index)
        // 得到的index就是点击的item在实际数组中的下标index
        const pidTemp = this.firstSystem && index && this.firstSystem[index].id
        const pidMc = this.firstSystem && index && this.firstSystem[index].mc
        if (!this.roles.includes(pidTemp)) {
          Message({
            message: '抱歉，您无权限访问该页面！',
            type: 'warning',
            duration: 1000
          })
          return
        }
        if (this.firstIsleaf) {
          localStorage.setItem('moduleId', pidTemp)
          localStorage.setItem('moduleName', pidMc)
          localStorage.setItem('isFirstId', 1)
          if (!this.firstIsleaf.clickhandler && this.firstIsleaf.href) {
            this.$router.push({ path: this.firstIsleaf.href })
          } else {
            localStorage.setItem('smartbiName', this.firstIsleaf.mc)
            this.smartbiClickhandler(this.firstIsleaf.href, this.firstIsleaf.target)
          }
        }
        // const params = {
        //   // operator: '', 
        //   qParams: {
        //     pid: pidTemp
        //   }
        // }
        // // action 方式
        // this.$store.dispatch('getSystemChildren', { dataID: 'authModules', queryParams: params }).then((response) => {
        //   // console.log(response[0])
        //   const firstChild = response[0]
        //   localStorage.setItem('moduleId', pidTemp)
        //   localStorage.setItem('moduleName', pidMc)
        //   localStorage.setItem('isFirstId', 1)
        //   if (!firstChild.clickhandler && firstChild.href) {
        //     this.$router.push({ path: firstChild.href })
        //   } else {
        //     localStorage.setItem('smartbiName', firstChild.mc)
        //     this.smartbiClickhandler(firstChild.href, firstChild.target)
        //   }
        // })
      },
      // 鼠标划过banner时 获取子系统数据
      bannerMouseover(item, index) {
        if (!this.roles.includes(item.id)) {
          return
        }
        // 有权限的情况下 请求数据 改变样式
        // 鼠标划过slide时在给sidle加样式名
        this.firstSystem.map((sub, ind) => {
          if (ind === index) {
            this.firstSystem[ind].isActive = true
            this.firstSystem[ind].isUnActive = false
          } else {
            this.firstSystem[ind].isActive = false
            this.firstSystem[ind].isUnActive = true
          }
        })
        // 请求数据 频率较高的菜单入口数据
        let params = {}
        const dataId = 'topModules'
        params = {
          qParams: {
            rootMid: item.id
          }
        }
        getList({ dataID: dataId, queryParams: params }).then(response => { 
          // this.childrenSystem = response && response.retData && response.retData.rows
          this.childrenSystem = response && response.retData && response.retData.rows && response.retData.rows.slice(0, 4) // 修改 返回的是五条数据，只要前四个
          this.childrenSystem.map((item, index) => {
            this.childMenuIcons.map((sub, ind) => {
              if (index === ind) {
                this.childrenSystem[index].icon = this.childMenuIcons[ind].name
              }
            })
          })
          this.firstIsleaf = this.childrenSystem[0] // 获取第一个底级节点 用于顶级模块点击
        })
      },
      // 点击子节点进入子系统
      smartbiClickhandler(href, target) {
        if (!Cookies.get('Admin-Token')) {
          Message({
            message: 'smartbi未登录成功',
            type: 'warning',
            duration: 1000
          })
        } else if (Cookies.get('Admin-Token') && href) {
          this.$router.push({ name: 'IframeParent', query: { href: href }})
        }
      },
      gotoChildSystem(data, parentData) {
        // console.log(data)
        if (!data.clickhandler && data.href) {
          this.$router.push({ path: data.href })
          localStorage.setItem('moduleChildId', data.moduleid) // 设置子节点id
          localStorage.setItem('moduleId', parentData.id) // 设置子节点的pid
          localStorage.setItem('moduleName', parentData.mc) // 设置子系统父级名称标题
          localStorage.setItem('isFirstId', 0)
        } else {
          localStorage.setItem('moduleChildId', data.moduleid) // 设置子节点id
          localStorage.setItem('moduleId', parentData.id) // 设置子节点的pid
          localStorage.setItem('moduleName', parentData.mc) // 设置子系统父级名称标题
          localStorage.setItem('isFirstId', 0)
          localStorage.setItem('smartbiName', data.mc)
          this.smartbiClickhandler(data.href, data.target)
        }
        // 记录菜单次数
        let params = {}
        const dataId = 'moduleClicks'
        params = {
          mid: data.moduleid,
          clkCount: '1'
        }
        saveItem({ dataID: dataId, updateParams: params }).then(response => { 
          console.log(response.retData.info)
        })
      },
      // 鼠标划过文字滚动
      textOverScroll(child, ind) {
        this.isHoverId = child.moduleid
      },
      // 鼠标离开时 停止滚动
      textLeaveStop(child, ind) {
        this.isHoverId = ''
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  $primaryColor: #20CE94;
  .guide-content{
    font-family: microsoft yahei;
    height: 100%;
    position: relative;
    overflow: hidden;
  }
  .guide-header {
    /* background-color: #1e95c1; */
    color: #ffffff;
    height: 50px;
    line-height: 50px;
    padding: 0 20px;
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    background: $primaryColor;     
    /* background: linear-gradient(to right,#0885F5,#58B0FF);*/
  }
  .system-name{
    font-size: 16px;
    i{
      font-style: normal;
      font-size: 14px;
      margin-left: 6px;
    }
  }
  .guide-box{
    height: calc(100% - 50px);
    position: relative;
    overflow: hidden;
    margin-top: 50px;
    background: #f0f0f0;
  }
  .guide-main {
    width: 100%;
    margin-top: 134px;
    /* height: 260px; */
    height: 273px;
  }
  .guide-banner {
    width: 1260px;
    height: 100%;
    margin: 0 auto;
    background: #fff;
    display: flex;
    justify-content: center;
    background-size: cover;
    .swiper-button-prev, .swiper-button-next{
      background-image: none;
    }
    .swiper-slide{
      width: 210px;
      transition: all 0.5s;
    }
    .swiper-button-prev{
      left: 0;
    }
    .swiper-button-next{
      right: 0;
    }
    .swiper-button-other{
      width: 42px;
      text-align: center;
      top: 248px;
      i{
        color: #222;
        font-size: 48px;
      }
    }
    .swiper-button-prev.swiper-button-disabled, .swiper-button-next.swiper-button-disabled{
      opacity: 0.25;
    }
  }
  .guide-footer {
    margin-top: 90px;
    height: 60px;
    text-align: center;
  }

  .copyright-title {
    color: #373d41;
    font-size: 20px;
    letter-spacing: 6px;
  }

  .copyright {
    color: #BFBFBF;
    font-size: 10px;
    margin-top: 10px;
  }
  .swiper-content{
    width: 100%;
  }
  .banner-init-info{
    width: 209px;
    height: 100%;
    border-right: 1px solid #d5d5d5;
    position: relative;
    display: flex;
    display: -ms-flexbox;
    -ms-flex-pack: center;
    justify-content: center;
    cursor: pointer;
    background: #fff;
    transition: bmargin,color,top,left,bottom,right ease-in 0.5s;
    z-index: 999;
    /* font-family: microsoft yahei; */
    .banner-init-title {
      font-size: 16px;
      color: #666;
      position: absolute;
      bottom: 112px;
      /* 兼容IE 浏览器中的不居中问题 */
      left: 74px; 
    }
    .banner-init-divider{
      width: 80%;
      height: 1px;
      background: #dddddd;
      display: block;
      position: absolute;
      bottom: 99px;
       /* 兼容IE 浏览器中的不居中问题 */
      left: 22px;
    }
    .banner-init-desc{
      width: 80%;
      font-size: 12px;
      color: #999;
      position: absolute;
      top: 174px;
      line-height: 20px;
      text-align: left;
      /* 兼容IE 浏览器中的不居中问题 */
      left: 22px;
    }
    .banner-icon-box{
      width: 74px;
      height: 74px;
      border: 1px solid #F4F4F4;
      border-radius: 50%;
      margin-top: 44px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .banner-init-icon{
      display: block;
      font-size: 38px;
      color: rgba(0, 0, 0, 0.55)
    }
    .banner-sanjiao{
      display: none;
      width: 0; 
      height: 0;
      border-width: 12px;
      border-style: solid;
      border-color: transparent #fff transparent transparent;
      position: absolute;
      right: -1px;
    }
  }
  .children-box{
    width: 210px;
    height: 100%;
    border-right: 1px solid #EFF3FE;
    position: absolute;
    right: 0;
    top: 0;
    display: flex;
    justify-content: center;
    animation: childboxmove 0.5s;
    -webkit-animation: childboxmove 0.5s;
    -moz-animation: childboxmove 0.5s;
    animation-fill-mode: forwards;
    z-index: 998;
    .children-box-ul{
      width: 100%;
      padding-left: 0px;
      list-style: none;
      overflow: hidden;
      overflow-y: auto;
      /* margin: 33px auto; */
      margin: 0px auto;
      text-align: center;
      &::-webkit-scrollbar{
				display: none;
			}
      .children-box-list-isactive{
        border-bottom: 1px solid #f4f4f4;
      }
      .children-box-list{
        width: 205px;
        height: 67px;
        line-height: 68px;
        margin: 0px auto;
        cursor: pointer;
        text-align: left;
        display: flex;
        justify-content: center;
        align-items: center;
        position: relative;
        &:nth-last-child(1){
          border-bottom: none;
          height: 68px;
        }
        .child-icon{
          margin-right: 10px;
          color: $primaryColor;
        }
        .scroll-text-box{
          /* width: 100px; */
          width: 160px;
          white-space: nowrap;
          overflow: hidden;
        }
        .is-scroll-text-box{
          overflow: hidden;
          span{
            padding-left: 30px;
            white-space: nowrap;
            animation: wordsLoop 4s linear infinite;
            /* animation-fill-mode: forwards; */
          }
        }
        .child-mc-con-all{
          font-size: 16px;
          color: $primaryColor;
          display: inline-block;
        }
        .child-mc-con{
          font-size: 15px;
          color: $primaryColor;
          display: inline-block;
        }
        /* .top{
          width: 0px;
          height: 2px;
          background: #FF6347;
          position: absolute;
          left: 0;
          top: 0;
        }
        .bottom{
          width: 0px;
          height: 2px;
          background: #FF6347;
          position: absolute;
          right: 0;
          bottom: 0;
        } */
        &:hover{
          /* transition: all 150ms linear 0s;
          background: transparent;
          .child-icon{
            color: #f2625a;
          } */
          z-index:1;
          background:transparent;
          /* border-color: rgba(30, 149, 193, 0.3); */
          color: #606266;
          span{
            color: 	#fff;
          }
          /* .top{
            animation: bordertop 1s;
            -webkit-animation: bordertop 1s;
            -moz-animation: bordertop 1s;
            animation-fill-mode: forwards;
          }
          .bottom{
            animation: borderbottom 1s;
            -webkit-animation: borderbottom 1s;
            -moz-animation: borderbottom 1s;
            animation-fill-mode: forwards;
          } */
        }
      }
     
      .children-box-list:after,.children-box-list:before {
        content: '';
        position: absolute;
        left: 0;
        top: 0;
        width: 0;
        height: 100%;
        background: #fff;
        z-index:-2;
      }
      .children-box-list:before {
        transition: .2s;
        background: #20CE94;
        z-index:-1;
      }          
      .children-box-list:hover:after,.children-box-list:hover:before {
        width: 100%;
      }
      /* .children-box-list:before{
        border: 1px solid #fff;
        top: 0px;
        content: " ";
        display: block;
        position: absolute;
        -webkit-transition: all 280ms ease-in-out;
        transition: all 280ms ease-in-out;
        width: 0;
      }
      .children-box-list:after{
        border: 1px solid #fff;
        bottom: 0px;
        content: " ";
        display: block;
        position: absolute;
        -webkit-transition: all 280ms ease-in-out;
        transition: all 280ms ease-in-out;
        width: 0;
      }
      .children-box-list:hover:before{
        width: 100%;
        border-color: #FF6347;
      }
      .children-box-list:hover:after{
        width: 100%;
        border-color: #FF6347;
      } */
    }
  }
  .isactive{
    width: 420px !important;
    .banner-init-info{
      width: 210px;
      /* background: $primaryColor; */
      z-index: 999;
      animation: backgroundChange ease 0.5s;
      animation-fill-mode: forwards;
      .banner-icon-box{
        background: #fff;
      }
      .banner-init-icon{
        color: #20CE94;
      }
      .banner-init-title{
        color: #fff;
      }
      .banner-init-desc{
        color: #fff;
      }
      .banner-init-divider{
        background: #fff;
      }
      .banner-sanjiao{
        display: block;
        animation: mymove 0.5s;
        -webkit-animation: mymove 0.5s;
        -moz-animation: mymove 0.5s;
        animation-fill-mode: forwards; /*当动画完成时，动画会停留在最后一帧。*/
      }
    }
  }
  @keyframes backgroundChange{
    form {
      background: #fff;
    }
    to {
      background: $primaryColor;
    }
  }
  @keyframes mymove{
    from {
      bottom: 0px;
    }
    to {
      bottom: 45%;
    }
  }

  @-webkit-keyframes mymove {
    from {
      bottom: 0px;
    }
    to {
      bottom: 45%;
    }
  }
  @-moz-keyframes mymove {
    from {
      bottom: 0px;
    }
    to {
      bottom: 45%;
    }
  }
  @keyframes childboxmove{
    from {
      opacity: 0;
      transform: translateX(-50%);
    }
    to {
      opacity: 1;
      transform: translateX(0%);
    }
  }
  @-webkit-keyframes childboxmove{
    from {
      opacity: 0;
      transform: translateX(-50%);
    }
    to {
      opacity: 1;
      transform: translateX(0%);
    }
  }
  @-moz-keyframes childboxmove{
    from {
      opacity: 0;
      transform: translateX(-50%);
    }
    to {
      opacity: 1;
      transform: translateX(0%);
    }
  }
  /* @keyframes wordsLoop {
    0% {
      -webkit-transform: translateX(60%);
    }
    50% {
      -webkit-transform: translateX(0);
    }
    100% {
      -webkit-transform: translateX(-100%);
    }
  } */
  @keyframes wordsLoop {
    0% {
      transform: translateX(0);
      -webkit-transform: translateX(0);
    }
    100% {
      transform: translateX(-100%);
      -webkit-transform: translateX(-100%);
    }
  }
  @-webkit-keyframes wordsLoop {
    0% {
      transform: translateX(0);
      -webkit-transform: translateX(0);
    }
    100% {
      transform: translateX(-100%);
      -webkit-transform: translateX(-100%);
    }
  }
  @-moz-keyframes wordsLoop {
    0% {
      transform: translateX(0);
      -webkit-transform: translateX(0);
    }
    100% {
      transform: translateX(-100%);
      -webkit-transform: translateX(-100%);
    }
  }
  @keyframes bordertop {
    0% {
      width: 0;
    }
    100% {
      width: 148px;
    }
  }
  @-webkit-keyframes bordertop {
    0% {
      width: 0;
    }
    100% {
      width: 148px;
    }
  }
  @-moz-keyframes bordertop {
    0% {
      width: 0;
    }
    100% {
      width: 148px;
    }
  }
  @keyframes borderbottom {
    0% {
      width: 0;
    }
    100% {
      width: 148px;
    }
  }
  @-webkit-keyframes borderbottom {
    0% {
      width: 0;
    }
    100% {
      width: 148px;
    }
  }
  @-moz-keyframes borderbottom {
    0% {
      width: 0;
    }
    100% {
      width: 148px;
    }
  }
</style>
