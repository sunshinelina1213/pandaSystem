import Cookies from 'js-cookie'
const TokenKey = 'Admin-Token'

export function getToken() {
  // return sessionStorage.getItem(TokenKey)
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  // return sessionStorage.setItem(TokenKey, token)
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  // return sessionStorage.setItem(TokenKey, '')
  return Cookies.remove(TokenKey)
}
