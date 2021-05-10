import { get } from '@/app/api'

export const DemoChildrenApi = {
  getDemoChildrenList () {
    // 便捷导航配置
    const url = '/xx'
    return get(url)
  }
}
