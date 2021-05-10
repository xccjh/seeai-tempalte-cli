import { get } from './http'
export const auth = {
  login () {
    get('sys/user/login')
  }
}
