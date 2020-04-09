import { fetch } from '@/utils/request'

export function getGuideList(params) {
  return fetch(
    '/guideList',
    params
  )
}
