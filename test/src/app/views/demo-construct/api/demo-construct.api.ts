import { get } from '@/app/api'

export const DemoConstructApi = {
  getDemoConstructList () {
    const url = '/xx'
    return get(url)
  }
}
