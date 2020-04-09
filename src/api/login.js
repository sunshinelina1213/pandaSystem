import { post, fetch } from '@/utils/request'

export function validateLogin(params) {
  return post(
    '/login',
    params
  )
}

export function logout(params) {
  return fetch(
    '/sys/logout',
    params
  )
}

export function getInfo(params) {
  return post(
    '/srfx/queryList',
    params
  )
}
