import request from '@/utils/request'
import type { LoginCaptchaImage, LoginReq, LoginRes } from './types'

// 登录方法
export function login(data: LoginReq): Promise<LoginRes> {
  return request({
    url: '/login',
    headers: {
      isToken: false,
    },
    method: 'post',
    data,
  })
}

// 注册方法
export function register(data: any) {
  return request({
    url: '/register',
    headers: {
      isToken: false,
    },
    method: 'post',
    data,
  })
}

// 获取用户详细信息
export function getInfo() {
  return request({
    url: '/getInfo',
    method: 'get',
  })
}

// 退出方法
export function logout() {
  return request({
    url: '/logout',
    method: 'post',
  })
}

// 获取验证码
export function getCodeImg(): Promise<LoginCaptchaImage> {
  return request({
    url: '/captchaImage',
    headers: {
      isToken: false,
    },
    method: 'get',
    timeout: 20000,
  })
}
