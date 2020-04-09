import { post, fetch } from '@/utils/request'

/** 
 * 用户列表（带分页）
 */
export function getPageList(params) {
  return post(
    '/srfx/queryListPaging',
    params
  )
}

/**
 * 检测用户ID是否重复
 * @param {*} params 
 */
export function checkUseridRepeat(params) {
  return post(
    '/srfx/checkDuplicate',
    params
  )
}

/**
 * 获取外部资源用户列表
 * @param {*} params 
 */
export function optionSystemList(params) {
  return fetch(
    '/sys/getExternalUsers',
    params
  )
}

export function getAddUserList(params) {
  return fetch(
    '/getUsersFromDingTalk',
    params
  )
}

export function AddUsers(params) {
  return post(
    '/addUserFromDingTalk',
    params
  )
}

export function removeUsers(params) {
  return post(
    '/removeUsers',
    params
  )
}

export function getAddRoleList(params) {
  return fetch(
    '/getPosts',
    params
  )
}

export function getRemoteServices(params) {
  return fetch(
    '/getRemoteServices',
    params
  )
}

export function getRemoteServiceUsers(params) {
  return fetch(
    '/getRemoteServiceUsers',
    params
  )
}

export function saveUserPosts(params) {
  return post(
    '/saveUserPosts',
    params
  )
}

export function removeUserPosts(params) {
  return post(
    '/removeUserPosts',
    params
  )
}

export function getCzfps(params) {
  return fetch(
    '/getCzfps',
    params
  )
}

export function saveCzfps(params) {
  return post(
    '/saveCzfps',
    params
  )
}

export function removeCzfp(params) {
  return post(
    '/removeCzfp',
    params
  )
}

export function getUsersDfMenus(params) {
  return fetch(
    '/getUsersAllMenus',
    params
  )
}

export function saveDfUserMenu(params) {
  return post(
    '/saveDfUserMenu',
    params
  )
}

export function getModules(params) {
  return fetch(
    '/getModules',
    params
  )
}

export function savePost(params) {
  return post(
    '/savePost',
    params
  )
}

export function removePosts(params) {
  return post(
    '/removePosts',
    params
  )
}

export function setPostModules(params) {
  return post(
    '/setPostModules',
    params
  )
}

export function toggleMapUser(params) {
  return post(
    '/toggleMapUser',
    params
  )
}
