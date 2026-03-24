
import axios from 'axios'
import { useAuthorizeStore } from '@/stores/modules/authorizeStore'
import { ElNotification } from 'element-plus'
import {
  APP_API_URL,
  REQUEST_CONTENT_TYPE,
  REQUEST_TIMEOUT,
  REQUEST_CACHE,
  REQUEST_HEADERS,
  REQUEST_TEMPLATE_TOKEN,
} from '@/configs'
const instance = axios.create(
  {
    baseURL: APP_API_URL,
    timeout: REQUEST_TIMEOUT,
    headers: { 'Content-Type': REQUEST_CONTENT_TYPE },
  }
)

instance.interceptors.request.use(
  (config) => {
    const { token } = useAuthorizeStore()
    config.headers['Authorization'] = token || REQUEST_TEMPLATE_TOKEN
    if (!REQUEST_CACHE && config.method === 'GET') {
      config.params = config.params || {}
      config.params['_'] = Date.now()
    }
    Object.assign(config.headers, REQUEST_HEADERS)
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

instance.interceptors.response.use(
  async (response) => {
    const { origin } = response.config ?? {}
    if (origin) return response
    const { code, msg, data, status } = response.data
    if (code === 1) return data
    if ([401, 403, 410].includes(status)) {
      ElNotification.error('Authentication Error !')
      const { Logout } = useAuthorizeStore()
      await Logout()
      window.location.reload()
    }
    if ([200, 300].includes(status)) {
      return { data, msg, status }
    }
    return { data, msg, status, name: String(status ?? 'Unknown') }
  },
  (error) => {
    ElNotification.error('Network Error !')
    return Promise.reject(error)
  }
)

class Http {
  static async request(options = {}, origin = false, crypto = false) {
    return instance({ ...options, method: options.method || 'POST', origin, crypto })
  }
  // static get(url, params, options = {}) {
  //   return this.request({ url, method: 'GET', params, ...options })
  // }
  // static post(url, data, options = {}) {
  //   return this.request({ url, method: 'POST', data, ...options })
  // }
  // static put(url, data, options = {}) {
  //   return this.request({ url, method: 'PUT', data, ...options })
  // }
  // static patch(url, data, options = {}) {
  //   return this.request({ url, method: 'PATCH', data, ...options })
  // }
  // static delete(url, params, options = {}) {
  //   return this.request({ url, method: 'DELETE', params, ...options })
  // }
  // static jsonp(url, params, options = {}) {
  //   return new Promise((resolve, reject) => {
  //   })
  // }
}
export default Http
