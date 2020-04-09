import { post } from '@/utils/request'

/**
 * 获取列表
 * @param dataID 
 * @param queryParams json对象 包含属性有 operator(操作者) sort排序字段 dir排序方向
 */
export function getList(params) {
  return post(
    // '/role/srfx/queryList',
    '/srfx/queryList',
    params
  )
}

/**
 * 删除
 * @param dataID
 * @param delParams json对象 包含要删除的键值，可以一次删除多个，用 | 分割
 */
export function deleteItem(params) {
  return post(
    '/srfx/delete',
    params
  )
}
/**
 * 保存岗位
 * @param dataID 'post'为岗位新增/修改 'postModules'为岗位模块
 * @param updateParams json对象 包含 类型（新增/修改/岗位模块菜单保存） id 名称 说明
 */
export function saveItem(params) {
  return post(
    '/srfx/save',
    params
  )
}

/**
 * 获取岗位 菜单模块 选择框 树形结构
 * @param dataID
 * @param queryParams json对象 
 */
export function getQueryCheckedTree(params) {
  return post(
    '/srfx/queryCheckedTree',
    params
  )
}
