import type { RouteRecordRaw } from 'vue-router'

export interface Result<T> {
  msg: string
  code: number
  data: T
}

export type Routers =
  | RouteRecordRaw
  | {
      name: string
      path: string
      hidden: boolean
      redirect?: string
      component: string | RouteRecordRaw['component']
      alwaysShow?: boolean
      meta: RoutersMeta
      children?: Routers[] | RouteRecordRaw['children']
    }

export interface RoutersMeta {
  title: string
  icon: string
  noCache: boolean
  link?: string
}

export interface LoginCaptchaImage {
  msg: string
  img: string
  code: number
  captchaEnabled: boolean
  uuid: string
}

export interface LoginReq {
  username: string
  password: string
  code: string
  uuid: string
}

export interface LoginRes {
  msg: string
  code: number
  token: string
}
