import { post, fetch } from '@/utils/request'
export function getList(params) {
  return fetch(
    '/getOutPutTemplates',
    params
  )
}

export function showQuery(params) {
  return post(
    '/showQuery',
    params
  )
}

export function refreshResponseTemplates(params) {
  return post(
    '/refreshResponseTemplates',
    params
  )
}

export function parsedResponseTemplate(params) {
  return post(
    '/parsedResponseTemplate',
    params
  )
}

export function getParamsOfResponseTemplate(params) {
  return post(
    '/getParamsOfResponseTemplate',
    params
  )
}
