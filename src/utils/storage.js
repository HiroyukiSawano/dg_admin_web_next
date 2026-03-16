import configs from '@/configs'
import { Crypto } from './crypto'
// import localForage from 'localforage'
import jsCookie from 'js-cookie'

export const Storage = {
  setItem(k, v, expires = 0) {
    try {
      if (configs.STORAGE_ENCRYPTION === 'AES') {
        v = Crypto.AES.encrypt(JSON.stringify(v), configs.STORAGE_ENCRYPTION_KEY)
      }
      const cache = {
        content: v,
        datetime: expires === 0 ? 0 : Date.now() + expires * 1000,
      }
      return localStorage.setItem(k, JSON.stringify(cache))
    } catch (error) {
      console.error(`Error getting item ${k}:`, error)
      return null
    }
  },
  getItem(k) {
    try {
      const v = localStorage.getItem(k)
      if (!v) return null
      const cache = JSON.parse(v)
      if (cache.datetime !== 0 && Date.now() > cache.datetime) {
        localStorage.removeItem(k)
        return null
      }

      let content = cache.content
      if (configs.STORAGE_ENCRYPTION === 'AES') {
        content = JSON.parse(Crypto.AES.decrypt(content, configs.STORAGE_ENCRYPTION_KEY))
      }
      return content
    } catch (error) {
      console.error(`Error getting item ${k}:`, error)
      return null
    }
  },

  removeItem(key) {
    return localStorage.removeItem(key)
  },
  clear() {
    return localStorage.clear()
  },
}

export const Cookie = {
  setItem(k, v, options = { expires: null }) {
    if (configs.COOKIE_ENCRYPTION === 'AES') {
      v = Crypto.AES.encrypt(JSON.stringify(v), configs.COOKIE_ENCRYPTION_KEY)
    }
    jsCookie.set(k, v, options)
  },

  getItem(k) {
    let v = jsCookie.get(k)
    if (!v) return null
    if (configs.COOKIE_ENCRYPTION === 'AES') {
      v = JSON.parse(Crypto.AES.decrypt(v, configs.COOKIE_ENCRYPTION_KEY))
    }
    return v
  },

  removeItem(k) {
    jsCookie.remove(k)
  },
}

export const Session = {
  setItem(table, options) {
    const settings = JSON.stringify(options)
    return sessionStorage.setItem(table, settings)
  },
  getItem(table) {
    let data = sessionStorage.getItem(table)
    try {
      data = JSON.parse(data)
    } catch (error) {
      console.error(`Error getting item ${table}:`, error)
      return null
    }
    return data
  },
  removeItem(table) {
    return sessionStorage.removeItem(table)
  },
  clear() {
    return sessionStorage.clear()
  },
}
// 大容量存储localForage需要可以自行去掉注释开启使用
// localForage.configs({
//   driver: [localForage.LOCALSTORAGE, localForage.INDEXEDDB, localForage.WEBSQL],
//   name: configs.APP_CODE,
//   version: configs.APP_VERSION,
// })
// export const Forage = {
//   async setItem(k, v, expired = 0) {
//     try {
//       const cache = {
//         content: v,
//         datetime: expired === 0 ? 0 : Date.now() + expired * 1000,
//       }
//       await localForage.setItem(k, JSON.stringify(cache))
//     } catch (error) {
//       console.error(`Error setting item ${k}:`, error)
//     }
//   },

//   async getItem(k) {
//     try {
//       const v = await localForage.getItem(k)
//       if (!v) return null
//       const cache = JSON.parse(v)
//       if (cache.datetime !== 0 && Date.now() > cache.datetime) {
//         localForage.removeItem(k)
//         return null
//       }
//       let content = cache.content
//       return content
//     } catch (error) {
//       console.error(`Error getting item ${k}:`, error)
//       return null
//     }
//   },
//   removeItem(k) {
//     return localForage.removeItem(k)
//   },
//   clear() {
//     return localForage.clear()
//   },
// }
