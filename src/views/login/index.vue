<template>
  <div class="login-container">
    <div class="login-main">
      <div class="main-left">
        <img src="../../assets/login_bg2.png" />
        <img class="img-text" src="../../assets/login_text.png" />
        <p class="copyright">技术支持：无限才华公司</p>
      </div>
      <div class="main-right">
        <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form" auto-complete="on" label-position="left">
          <h3 class="system-title">panda管理系统</h3>
          <el-form-item prop="username">
            <span class="svg-container">
              <svg-icon icon-class="user" />
            </span>
            <el-input v-model="loginForm.username" name="username" type="text" auto-complete="on" placeholder="请输入账户名" />
          </el-form-item>
          <el-form-item prop="password" class="password-form">
            <span class="svg-container">
              <svg-icon icon-class="lock" />
            </span>
            <el-input :type="pwdType" v-model="loginForm.password" name="password" auto-complete="on" placeholder="请输入密码" @keyup.enter.native="handleLogin" />
          </el-form-item>
          <el-checkbox class="rember-status">自动登录</el-checkbox>
          <el-form-item class="btn-login">
            <el-button :loading="loading" type="primary" class="login-btn" @click.native.prevent="handleLogin">
              登 录
            </el-button>
          </el-form-item>
          <p class="browser-tips">使用IE内核浏览器时，仅支持9.0及以上版本</p>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
  // import { isvalidUsername } from '@/utils/validate'
  import { Message } from 'element-ui'
  // import { getInfo } from '@/api/login'

  export default {
    name: 'Login',
    data() {
      const validateUsername = (rule, value, callback) => {
        // if (!isvalidUsername(value)) {
        if (!value) {
          callback(new Error('请输入正确的用户名'))
        } else {
          callback()
        }
      }
      // const validatePass = (rule, value, callback) => {
      //   if (value.length < 1) {
      //     callback(new Error('密码不能小于1位'))
      //   } else {
      //     callback()
      //   }
      // }
      return {
        loginForm: {
          username: '',
          password: ''
        },
        loginRules: {
          username: [{ required: true, trigger: 'blur', validator: validateUsername }]
          // password: [{ required: true, trigger: 'blur', validator: validatePass }]
        },
        loading: false,
        pwdType: 'password',
        redirect: undefined
      }
    },
    watch: {
      $route: {
        handler: function(route) {
          this.redirect = route.query && route.query.redirect
        },
        immediate: true
      }
    },
    created() {
      this.checkIE()
    },
    methods: {
      checkIE() {
        if (window.navigator.userAgent.indexOf('IE') !== -1) {
          Message({
            message: '为了您的浏览体验,请使用chrome浏览器获得最佳效果,下载地址http://www.google.com',
            duration: 0
          })
        }
      },
      getQueryString(name) {
        var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i')
        var r = window.location.href.substr(1).match(reg)
        if (r != null) {
          return unescape(r[2])
        }
        return null
      },
      showPwd() {
        if (this.pwdType === 'password') {
          this.pwdType = ''
        } else {
          this.pwdType = 'password'
        }
      },
      // 登录按钮
      handleLogin() {
        this.$refs.loginForm.validate(valid => {
          if (valid) {
            this.loading = true
            this.$store.dispatch('Login', this.loginForm).then(() => {
              this.loading = false
              this.$router.push({ path: this.redirect || '/' })
            }).catch(() => {
              this.loading = false
            })
          } else {
            console.log('error submit!!')
            return false
          }
        })
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss">
  /* reset element-ui css */
  .login-container {
    .el-input {
      display: inline-block;
      width: 85%;
      input {
        background: transparent;
        border: 0px;
        -webkit-appearance: none;
        border-radius: 0px;
        color: #606266;
        height: 36px;
        &:-webkit-autofill {
          -webkit-box-shadow: 0 0 0px 1000px #fff inset !important;
          -webkit-text-fill-color: #606266 !important;
        }
      }
    }

    .el-form-item {
      border: 1px solid #D9D9D9;
      color: #000000 45%;
      height: 40px;
      margin-bottom: 26px;
    }

    .el-form-item__content {
      line-height: 26px;
    }
  }
</style>

<style rel="stylesheet/scss" lang="scss" scoped>
  .login-container {
    position: fixed;
    height: 100%;
    width: 100%;
    background: url('../../assets/login_bg.png') center no-repeat;
    background-size: cover;
  }

  .login-form {
    padding: 63px 50px 0;
    background: #ffffff;
    height: 100%;
    .password-form{
      margin-bottom: 10px;
    }
  }

  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 6px 0 6px 8px;
    color: #889aa4;
    vertical-align: middle;
    display: inline-block;
  }

  .system-title {
    font-size: 20px;
    font-weight: 400;
    color: #000000 85%;
    margin: 0px auto 30px auto;
    font-weight: bold;
    span{
      font-size: 16px;
      margin-left: 5px;
    }
  }

  .login-left {
    width: 50%;
    float: left;

    .img-con {
      position: relative;
      margin-top: 60px;
    }

    .phone-img-con {
      width: 130px;
      position: absolute;
      top: 36%;
      margin-left: 513px;
    }
  }

  .main-left {
    width: 344px;
    height: 100%;
    float: left;
  }

  .main-right {
    width: calc(100% - 344px);
    height: 100%;
    float: left;
    box-shadow: 4px 0px 7px #e9e9e9;
  }

  .login-main {
    width: 700px;
    height: 428px;
    position: relative;
    top: 50%;
    left: 50%;
    transform: translateX(-50%) translateY(-50%);
  }
  .btn-login{
    border: none;
    margin-bottom: 26px;
  }
  .login-btn{
    width: 100%;
    background-color: #0885F5;
    border-radius: 6px;
    /* box-shadow: 4px 0px 7px #e9e9e9; */
    box-shadow: 0px 5px 18px 0px rgba(8, 133, 245, 0.4);
    font-size: 16px;
    letter-spacing: 18px;
    text-align: center;
    /deep/ span{
      width: 73px;
      display: inline-block;
    }
  }
  .rember-status{
    /* margin-left: 10px; */
    margin-bottom: 36px;
    font-size: 14px;
  }
  .rember-status /deep/ .el-checkbox__label{
    color: rgba(0, 0, 0, 0.45);
  }
  .browser-tips{
    font-size: 12px;
    color: rgba(0, 0, 0, 0.45);
  }
  .user-pwd-img{
    width: 12px;
    height: 16px;
  }
  .img-text{
    width: 240px;
    height: 90px;
    position: absolute;
    left: 50px;
    top: 130px;
  }
  .copyright{
    margin: 0;
    color: #fff;
    font-size: 12px;
    color: rgba(255, 255, 255, 0.85);
    font-size: 12px;
    position: absolute;
    left: 50px;
    bottom: 30px;
  }
</style>
