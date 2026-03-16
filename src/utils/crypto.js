import CryptoJS from 'crypto-js'

export const Crypto = {
  MD5(data) {
    return CryptoJS.MD5(data).toString()
  },
  BASE64: {
    encrypt(data) {
      return CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(data))
    },
    decrypt(cipher) {
      return CryptoJS.enc.Base64.parse(cipher).toString(CryptoJS.enc.Utf8)
    },
  },
  AES: {
    encrypt(data, key, config = {}) {
      if (key.length % 8 !== 0) {
        console.warn('【key】:秘钥长度需为8的倍数')
      }
      const result = CryptoJS.AES.encrypt(data, CryptoJS.enc.Utf8.parse(key), {
        iv: CryptoJS.enc.Utf8.parse(config.iv || ''),
        mode: CryptoJS.mode[config.mode || 'ECB'],
        padding: CryptoJS.pad[config.padding || 'Pkcs7'],
      })
      return result.toString()
    },
    decrypt(cipher, key, config = {}) {
      const result = CryptoJS.AES.decrypt(cipher, CryptoJS.enc.Utf8.parse(key), {
        iv: CryptoJS.enc.Utf8.parse(config.iv || ''),
        mode: CryptoJS.mode[config.mode || 'ECB'],
        padding: CryptoJS.pad[config.padding || 'Pkcs7'],
      })
      return CryptoJS.enc.Utf8.stringify(result)
    },
  },
}
