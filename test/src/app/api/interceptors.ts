import store from '../store/index'
import router from '../router'
import { LocalStorageUtil } from '@/common/utils'
import { errorCodeMap } from './error-code'
import { notification, message } from 'ant-design-vue'

import { AxiosInstance } from 'axios'

export default (service: AxiosInstance) => {
  const toggleLoading = (flag: boolean) => {
    if (axiosNum === 0) {
      store.dispatch('setActionsLoading', flag)
    }
  }

  // 设置默认请求头信息
  service.defaults.headers.post['Content-Type'] = 'application/json;charset=UTF-8'
  service.defaults.headers.delete['Content-Type'] = 'application/json;charset=UTF-8'
  service.defaults.headers.put['Content-Type'] = 'application/json;charset=UTF-8'
  service.defaults.headers.delete['Content-Type'] = 'application/json;charSet=UTF-8'
  service.defaults.headers.patch['Content-Type'] = 'application/json;charSet=UTF-8'
  service.defaults.withCredentials = true // 让ajax携带cookie

  let axiosNum = 0

  // 新建请求拦截器
  service.interceptors.request.use(
    // 正常请求拦截
    (requestConfig) => {
      toggleLoading(true)
      axiosNum++
      return requestConfig
    },
    // 错误请求拦截
    (error) => {
      axiosNum--
      toggleLoading(false)
      notification.error('未知错误！')
      console.warn('未可知错误，大部分是由于后端不支持CORS或无效配置引起')
      return Promise.reject(error)
    }
  )

  // 新建响应拦截器
  service.interceptors.response.use(
    // 正常响应拦截
    (response) => {
      axiosNum--
      toggleLoading(false)
      const status: number = response.status

      if (status >= 200 && status < 300) {
        const body = response.data
        if (body) {
          if (body.status === 401) {
            message.error('未登录或登录已过期，请重新登录。')
            LocalStorageUtil.removeUser()
            goTo('/login')
          } else if (body.status === 1024) {
            message.error(body.message)
          } else if (body.status === 1025) {
            message.error('参数为空。')
          } else if (body.status === 503) {
            message.error(body.message)
          } else if (body.status === 204) {
            message.success(body.message)
          } else if (body.status === 201) {
            message.success(body.message)
          }
          return response
        } else {
          return response
        }
      }
      switch (response.status) {
        case 401: // 未登录
        case 403: // token过期
          notification.error({
            message: '未登录或登录过期，请重新登录'
          })
          LocalStorageUtil.removeLogin() // 清除token
          // store.commit("loginSuccess", ""); //全局通知loginSuccess为空
          goTo('/login')
          break
        case 404:
          notification.error({
            message: '网络请求不存在'
          })
          break
        case 500:
        case 501:
        case 503: // 服务端错误
          notification.error({
            message: '服务端异常，请您稍后重试！'
          })
          break
        default:
          if (errorCodeMap[response.status]) {
            notification.error(errorCodeMap[response.status])
          } else {
            notification.error('未知错误！')
          }
          break
      }
      return Promise.reject(response)
    },
    // 错误响应拦截
    (error) => {
      axiosNum--
      toggleLoading(false)
      notification.error('未知错误！')
      console.warn('未可知错误，大部分是由于后端不支持CORS或无效配置引起')
      return Promise.reject(error)
    }
  )
  return service
}

function goTo (path: string) {
  router.replace({
    path: path
    // query: {redirect: router.currentRoute.fullPath}//登录成功后跳入浏览的当前页面
  })
}
