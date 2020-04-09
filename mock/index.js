import Mock from 'mockjs'
// import userAPI from './user'
// import userManagementAPI from './user-management'
// Fix an issue with setting withCredentials = true, cross-domain request lost cookies
// https://github.com/nuysoft/Mock/issues/300
Mock.XHR.prototype.proxy_send = Mock.XHR.prototype.send
Mock.XHR.prototype.send = function() {
  if (this.custom.xhr) {
    this.custom.xhr.withCredentials = this.withCredentials || false
  }
  this.proxy_send(...arguments)
}
/**
 * 启用mock接口，在main.js中修改window.baseURL地址 保持真实和mock一致。
 * 如果使用真实接口，把下面开始到export default Mock以上代码注释掉，main.js修改成真实地址。 
 * */
// Mock.setup({
//   timeout: '350-600'
// })
// // User
// Mock.mock(/\/validateLogin/, 'post', userAPI.validateLogin)
// Mock.mock(/\/getInfo/, 'post', userAPI.getInfo)

// // userManagement
// Mock.mock(/\/getUsers/, 'get', userManagementAPI.getUsers)

export default Mock
