import { post, fetch } from '@/utils/request'

/** 
 * 获取链接模板
 */
// export function getLinkTemplate(params) {
//   return post(
//     '/srfx/queryList',
//     params
//   )
// }

/**
 * 获取外部资源列表
 * @param {*} params 
 */
export function getMenuOutSource(params) {
  return fetch(
    '/sys/getExternalCatalog',
    params
  )
}

/**
 * 生成链接
 */
export function generateLink(params) {
  return post(
    '/sys/generateModuleLink',
    params
  )
}
