import axios from 'axios'
import { useAuthorizeStore } from '@/stores/modules/authorizeStore'
import { ElMessageBox, ElNotification } from 'element-plus'

class Http {
  static request(option, origin = false, crypto = false) {
    const instance = axios.create()
    instance.interceptors.request.use(
      (config) => {
        const _config = { ...config }
        const { token } = useAuthorizeStore()
        _config.headers.Authorization =
          token ||
          'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhbm9ueW1vdXMiLCJhdWQiOiIiLCJzZXJ2ZXIiOiJodHRwOi8vbG9jYWxob3N0OjMwMzQiLCJyb2xlIjoiIiwic3RhdHVzIjoiMyIsImlzcyI6Imluc3B1ciIsImp0aSI6ImQzMmViMjE0LWViNjYtNDM2Ni05ZTVlLWI1NWQwMWM5MDJlMiIsImlhdCI6MTYyMDk3MTQ3NCwiZXhwIjoxNjIxMDAwMjc0fQ.M8XAoxEpHX--OnAJaRhmTb8YkhFzO2mKoUUji74VcFpZstUCRnpURAh0WhkFjei98jddk1yvD-DHLxmu0OuvJg'
        return _config
      },
      (error) => Promise.reject(error),
    )
    const _option = {
      method: 'post',
      baseURL: import.meta.env.VITE_APP_API_URL,
      url: option.url,
    }
    let preference = {}
    // if (crypto) {
    // } else {
    // }
    preference = Object.assign(_option, option)
    return new Promise((resolve, reject) => {
      instance(preference)
        .then(async (res) => {
          const { code, msg, data, status } = res.data
          const { Logout } = useAuthorizeStore()
          if (origin) return resolve(res)
          if (code === 1) return resolve(data)
          if (status === 410) {
            ElMessageBox.alert('用户令牌过期，请重新获取!', '令牌过期', {
              type: 'warning',
              confirmButtonText: '确定',
              callback: async () => {
                await Logout()
                window.location.reload()
              },
            })
          } else if (status === 401 || status === 403) {
            ElMessageBox.alert('用户权限有误，请重新登录!', '权限有误', {
              type: 'warning',
              confirmButtonText: '确定',
              callback: async () => {
                await Logout()
                window.location.reload()
              },
            })
          } else if (status === 200) {
            ElMessageBox.alert('服务器配置错误，请联系管理员!', '服务器错误', {
              type: 'warning',
              confirmButtonText: '确定',
              callback: async () => {
                await Logout()
                window.location.reload()
              },
            })
          } else {
            if (data?.msg) ElNotification.error(data?.msg)
            const error = new Error(msg)
            error.name = status
            reject(error)
          }
        })
        .catch((error) => {
          reject(error)
        })
    })
  }
}
export default Http
