import { getRouters } from '@/api/menu'
import type { Routers } from '@/api/types'
import ParentView from '@/components/ParentView/index.vue'
import InnerLink from '@/layout/components/InnerLink/index.vue'
import Layout from '@/layout/index.vue'
import auth from '@/plugins/auth'
import router, { constantRoutes, dynamicRoutes } from '@/router'
import { cloneDeep } from 'es-toolkit/object'
import { defineStore } from 'pinia'
import type { RouteRecordRaw } from 'vue-router'

// 匹配views里面所有的.vue文件
const modules = import.meta.glob('./../../views/**/*.vue')

const usePermissionStore = defineStore('permission', {
  state: (): {
    routes: RouteRecordRaw[]
    addRoutes: RouteRecordRaw[]
    defaultRoutes: RouteRecordRaw[]
    topbarRouters: RouteRecordRaw[]
    sidebarRouters: RouteRecordRaw[]
  } => ({
    routes: [],
    addRoutes: [],
    defaultRoutes: [],
    topbarRouters: [],
    sidebarRouters: [],
  }),
  actions: {
    setRoutes(routes: RouteRecordRaw[]) {
      this.addRoutes = routes
      this.routes = constantRoutes.concat(routes)
    },
    setDefaultRoutes(routes: RouteRecordRaw[]) {
      this.defaultRoutes = constantRoutes.concat(routes)
    },
    setTopbarRoutes(routes: RouteRecordRaw[]) {
      this.topbarRouters = routes
    },
    setSidebarRouters(routes: RouteRecordRaw[]) {
      this.sidebarRouters = routes
    },
    generateRoutes() {
      return new Promise<RouteRecordRaw[]>((resolve) => {
        // 向后端请求路由数据
        getRouters().then((res) => {
          const sdata = cloneDeep(res.data)
          const rdata = cloneDeep(res.data)
          const defaultData = cloneDeep(res.data)
          const sidebarRoutes = filterAsyncRouter(sdata)
          const rewriteRoutes = filterAsyncRouter(rdata, true)
          const defaultRoutes = filterAsyncRouter(defaultData)
          const asyncRoutes = filterDynamicRoutes(dynamicRoutes)
          asyncRoutes.forEach((route) => {
            router.addRoute(route)
          })
          this.setRoutes(rewriteRoutes)
          this.setSidebarRouters(constantRoutes.concat(sidebarRoutes))
          this.setDefaultRoutes(sidebarRoutes)
          this.setTopbarRoutes(defaultRoutes)
          resolve(rewriteRoutes)
        })
      })
    },
  },
})

// 遍历后台传来的路由字符串，转换为组件对象
function filterAsyncRouter(
  asyncRouterMap: Routers[],
  type = false,
): RouteRecordRaw[] {
  return asyncRouterMap.map((route) => {
    if (type && route.children) {
      route.children = filterChildren(route.children)
    }
    if (route.component) {
      // Layout ParentView 组件特殊处理
      if (route.component === 'Layout') {
        route.component = Layout
      } else if (route.component === 'ParentView') {
        route.component = ParentView
      } else if (route.component === 'InnerLink') {
        route.component = InnerLink
      } else {
        route.component = loadView(route.component as string)
      }
    }
    if (route.children != null && route.children && route.children.length) {
      route.children = filterAsyncRouter(route.children, type)
    } else {
      delete route.children
      delete route.redirect
    }
    return route as RouteRecordRaw
  })
}

function filterChildren(childrenMap: any[], lastRouter: any = false) {
  let children: any[] = []
  childrenMap.forEach((el) => {
    if (
      el.children &&
      el.children.length &&
      el.component === 'ParentView' &&
      !lastRouter
    ) {
      el.children.forEach((c: any) => {
        c.path = `${el.path}/${c.path}`
        if (c.children && c.children.length) {
          children = children.concat(filterChildren(c.children, c))
          return
        }
        children.push(c)
      })
      return
    }
    if (lastRouter) {
      el.path = `${lastRouter.path}/${el.path}`
    }
    children = children.concat(el)
  })
  return children
}

// 动态路由遍历，验证是否具备权限
export function filterDynamicRoutes(routes: any[]) {
  const res: any[] = []
  routes.forEach((route) => {
    if (route.permissions) {
      if (auth.hasPermiOr(route.permissions)) {
        res.push(route)
      }
    } else if (route.roles && auth.hasRoleOr(route.roles)) {
      res.push(route)
    }
  })
  return res
}

export function loadView(view: string) {
  const path = Object.keys(modules).find((path) => {
    const dir = path.split('views/')[1].split('.vue')[0]
    return dir === view
  })
  if (path) {
    return () => modules[path]()
  }
}

export { usePermissionStore }
