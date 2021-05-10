
import { service, getHeader } from './requestInstant'
const get = (url: string, params = {}) => {
  return service.get(url, {
    ...params,
    method: 'get',
    headers: getHeader()
  })
}

const post = (url: string, params = {}) => {
  return service.post(url, {
    ...params,
    method: 'post',
    headers: getHeader()
  })
}

const put = (url: string, params = {}) => {
  return service.put(url, {
    ...params,
    method: 'patch',
    headers: getHeader()
  })
}

const patch = (url: string, params = {}) => {
  return service.patch(url, {
    ...params,
    method: 'patch',
    headers: getHeader()
  })
}

export {
  get,
  post,
  put,
  patch
}
