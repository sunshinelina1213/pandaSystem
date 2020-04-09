import axios from 'axios'
import { Message } from 'element-ui'
// import qs from 'qs'

axios.defaults.timeout = 10000
// axios.defaults.baseURL = process.env.BASE_API
axios.defaults.withCredentials = true

// request拦截器
axios.interceptors.request.use(
  config => {
    return config
  },
  error => {
    // Do something with request error
    console.log(error) // for debug
    Promise.reject(error)
  }
)

// response 拦截器
axios.interceptors.response.use(
  response => {
    const res = response.data
    if (res.retCode && res.retCode !== '0') {
      Message({
        message: res.retMsg,
        type: 'error',
        duration: 5 * 1000
      })
      return
    } else {
      return response.data
    }
  },
  error => {
    console.log('err' + error) // for debug
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)
/**
 * 封装get方法
 * @param url
 * @param data
 * @returns {Promise}
 */

export function fetch(url, params = {}) {
  return new Promise((resolve, reject) => {
    axios.get(window.baseURL + url, {
      params: params
    })
      .then(response => {
        resolve(response)
      })
      .catch(err => {
        reject(err)
      })
  })
}

/**
 * 封装post请求
 * @param url
 * @param data
 * @returns {Promise}
 */

export function post(url, data = {}) {
  return new Promise((resolve, reject) => {
    axios({
      url: window.baseURL + url,
      method: 'post',
      data: data,
      // transformRequest: [function(data) {
      //   let ret = ''
      //   for (const it in data) {
      //     ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
      //     // ret += qs.stringify(it) + '=' + qs.stringify(data[it]) + '&'
      //   }
      //   ret = ret.slice(0, ret.length - 1)
      //   return ret
      // }],
      headers: {
        // 'Content-Type': 'application/x-www-form-urlencoded'
        'Content-Type': 'application/json'
      }
    })
      .then(response => {
        resolve(response)
      }, err => {
        reject(err)
      })
  })
}

/**
 * 封装postForm请求
 * @param url
 * @param data
 * @returns {Promise}
 */

export function postForm(url, data = {}) {
  return new Promise((resolve, reject) => {
    axios({
      url: window.baseURL + url,
      method: 'post',
      data: data,
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
      .then(response => {
        resolve(response)
      }, err => {
        reject(err)
      })
  })
}

/**
 * 封装patch请求
 * @param url
 * @param data
 * @returns {Promise}
 */

export function patch(url, data = {}) {
  return new Promise((resolve, reject) => {
    axios.patch(window.baseURL + url, data)
      .then(response => {
        resolve(response)
      }, err => {
        reject(err)
      })
  })
}

/**
 * 封装put请求
 * @param url
 * @param data
 * @returns {Promise}
 */

export function put(url, data = {}) {
  return new Promise((resolve, reject) => {
    axios.put(window.baseURL + url, data)
      .then(response => {
        resolve(response)
      }, err => {
        reject(err)
      })
  })
}
