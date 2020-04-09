const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  systembar: state => state.app.systembar,
  fullScreen: state => state.app.fullScreen,
  fullScreenTagview: state => state.app.fullScreenTagview,
  fullScreenSiderbar: state => state.app.fullScreenSiderbar,
  
  visitedViews: state => state.tagsView.visitedViews,
  cachedViews: state => state.tagsView.cachedViews,
  token: state => state.user.token,
  userName: state => state.user.userName,
  roles: state => state.user.roles,
  firsrModuleData: state => state.user.firsrModuleData,
  moduleChildren: state => state.user.moduleChildren,
  moduleChildrenpid: state => state.user.moduleChildrenpid,
  moduleName: state => state.user.moduleName
}
export default getters
