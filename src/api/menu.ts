import request from '@/utils/request'
import type { Result, Routers } from './types'

// 获取路由
export function getRouters(): Promise<Result<Routers[]>> {
  return request({
    url: '/getRouters',
    method: 'get',
  })
}
