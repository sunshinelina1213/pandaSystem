<template>
  <ul v-show="isShow" class="system-con">
    <li v-for="item in firsrModuleData" :key="item.id" :class="{isselect: item.id === isSelectedId}" @click="gotoSystem(item)">
      <el-tooltip :content="item.mc" class="item" effect="dark" placement="right">
        <i :class="item.icon"/>
      </el-tooltip>
    </li>
  </ul>
</template>

<script>
  import { mapGetters } from 'vuex'
  // import { getInfo } from '@/api/login'

  export default {
    data: () => {
      return {
        isSelectedId: '',
        iconBanner: [
          {
            name: 'el-icon-sold-out'
          },
          {
            name: 'el-icon-sort'
          },
          {
            name: 'el-icon-service'
          },
          {
            name: 'el-icon-tickets'
          },
          {
            name: 'el-icon-star-off'
          },
          {
            name: 'el-icon-circle-check-outline'
          },
          {
            name: 'el-icon-date'
          },
          {
            name: 'el-icon-mobile-phone'
          },
          {
            name: 'el-icon-location-outline'
          }
        ]
      }
    },
    computed: {
      ...mapGetters([
        'systembar'
      ]),
      firsrModuleData() {
        return this.$store.getters.firsrModuleData
      },
      isShow() {
        return this.systembar.systemOpened
      },
      moduleId() {
        return localStorage.getItem('moduleId')
      }
    },
    created() {
      this.addfirstDataIcon()
      this.confirmSelect() // 确认选中的顶级节点
    },
    methods: {
      confirmSelect() {
        this.firsrModuleData.map(item => {
          if (item.id === this.moduleId) {
            this.isSelectedId = item.id
          }
        })
      },
      // 为顶级模块加上图标
      addfirstDataIcon() {
        this.$store.getters.firsrModuleData.map((item, index) => {
          this.iconBanner.map((sub, ind) => {
            if (index === ind) {
              this.$store.getters.firsrModuleData[index].icon = this.iconBanner[ind].name
            }
          })
        })
      },
      // 点击顶级模块 切换
      gotoSystem(e) {
        // console.log(e)
        localStorage.setItem('moduleId', e.id) // 设置子节点的pid
        localStorage.setItem('moduleName', e.mc) // 设置子系统父级名称标题
        this.firsrModuleData.map(item => {
          if (item.id === localStorage.getItem('moduleId')) {
            this.isSelectedId = item.id
          }
        })
        const params = {
          qParams: {
            pid: e.id
          }
        }
        this.$store.dispatch('getSystemChildren', { dataID: 'authModules', queryParams: params, mc: e.mc }).then((response) => {
          const firstHerf = response[0].href
          this.$router.push({ path: firstHerf })
        })
        // getInfo({ dataID: 'authModules', queryParams: params }).then((response) => {
        //   const firstHerf = response.retData.rows[0].href
        //   this.$router.push({ path: firstHerf })
        // })
      }
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
  .system-con{
    width: 50px;
    /* margin-left: 200px; */
    background: #284062;
    text-align: center;
    padding-left: 0;
    position: absolute;
    z-index: 1002;
    top: 0px;
    left: 0px;
    height: 100%;
    margin-top: 0;
    margin-bottom: 0;
    li {
      color: #9aa8ba;
      list-style: none;
      line-height: 50px;
      cursor: pointer;
      &:hover{
        background: #101f33;
      }
      i{
        color: #fff;
      }
    }
    .isselect{
      background: #101f33;
    }
  }
</style>
