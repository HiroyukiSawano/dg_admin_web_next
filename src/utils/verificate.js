/**
 * @description 判读是否为外链
 * @param value
 * @returns {boolean}
 */
export const isExternal = (value) => {
  return /^(https?:|mailto:|tel:|\/\/)/.test(value)
}

/**
 * @description 校验密码是否小于6位
 * @param value
 * @returns {boolean}
 */
export const isPassword = (value) => {
  return value.length >= 6
}

/**
 * @description 判断是否为数字
 * @param value
 * @returns {boolean}
 */
export const isNumber = (value) => {
  const reg = /^-?\d+(\.\d+)?$/
  return reg.test(value)
}

/**
 * @description 判断是否是名称
 * @param value
 * @returns {boolean}
 */
export const isName = (value) => {
  const reg = /^[\dA-Za-z\u4e00-\u9fa5]+$/
  return reg.test(value)
}

/**
 * @description 判断是否为IP
 * @param value
 * @returns {boolean}
 */
export const isIP = (value) => {
  const reg = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/
  return reg.test(value)
}

/**
 * @description 判断是否是为URL
 * @param value
 * @returns {boolean}
 */
export const isUrl = (value) => {
  // const reg = /^https?:\/\/([^/:]+\.)+[^/:]+(:\d+)?(\/.+)$/
  const reg = /^((http|https):\/\/)?(([A-Za-z0-9]+-[A-Za-z0-9]+|[A-Za-z0-9]+)\.)+([A-Za-z]+)[/?:]?.*$/
  return reg.test(value)
}

/**
 * @description 判断是否是小写字母
 * @param value
 * @returns {boolean}
 */
export const isLowerCase = (value) => {
  const reg = /^[a-z]+$/
  return reg.test(value)
}

/**
 * @description 判断是否是大写字母
 * @param value
 * @returns {boolean}
 */
export const isUpperCase = (value) => {
  const reg = /^[A-Z]+$/
  return reg.test(value)
}

/**
 * @description 判断是否是大写字母开头
 * @param value
 * @returns {boolean}
 */
export const isAlphabets = (value) => {
  const reg = /^[A-Za-z]+$/
  return reg.test(value)
}

/**
 * @description 判断是否是字符串
 * @param value
 * @returns {boolean}
 */
export const isString = (value) => {
  return typeof value === 'string' || value
}

/**
 * @description 判断是否是数组
 * @param value
 */
export const isArray = (value) => {
  if (Array.isArray === undefined) return Object.prototype.toString.call(value) === '[object Array]'
  return Array.isArray(value)
}

/**
 * @description 判断是否是端口号
 * @param value
 * @returns {boolean}
 */
export const isPort = (value) => {
  const reg = /^(\d|[1-9]\d|[1-9]\d{2}|[1-9]\d{3}|[1-5]\d{4}|6[0-4]\d{3}|65[0-4]\d{2}|655[0-2]\d|6553[0-5])$/
  return reg.test(value)
}

/**
 * @description 判断是否是手机号
 * @param value
 * @returns {boolean}
 */
export const isPhone = (value) => {
  const reg = /^1[3-9]\d{9}$/
  return reg.test(value)
}
/**
 * @description 判断是否是身份证号
 * @param value
 * @returns {boolean}
 */
export const isIdCard = (value) => {
  const reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}([\dXx])$)/
  return reg.test(value)
}

/**
 * @description 判断是否是邮箱
 * @param value
 * @returns {boolean}
 */
export const isEmail = (value) => {
  const reg = /^\w+([+.-]\w+)*@\w+([.-]\w+)*\.\w+([.-]\w+)*$/
  return reg.test(value)
}

/**
 * @description 判断是否中文
 * @param value
 * @returns {boolean}
 */
export const isChina = (value) => {
  const reg = /^[\u4E00-\u9FA5]{2,4}$/
  return reg.test(value)
}

/**
 * @description 判断是否为空
 * @param value
 * @returns {boolean}
 */
export const isBlank = (value) => {
  return value === null || false || value === '' || value.trim() === '' || value.toLocaleLowerCase().trim() === 'null'
}

/**
 * @description 判断是否为固话
 * @param value
 * @returns {boolean}
 */
export const isTel = (value) => {
  const reg = /^(400|800)([\d\\-]{7,10})|((\d{4}|\d{3})([ -])?)?(\d{7,8})(([ 转-])*(\d{1,4}))?$/
  return reg.test(value)
}

/**
 * @description 判断是否为json
 * @param value
 * @returns {boolean}
 */
export const isJson = (value) => {
  if (typeof value === 'string') {
    const obj = JSON.parse(value)
    return !!(typeof obj === 'object' && obj)
  }
  return false
}

/**
 * @description 判断是否为中文
 * @param value
 * @returns {boolean}
 */
export const isChinese = (value) => {
  const reg = /^[\u4e00-\u9fa5]+$/
  return reg.test(value)
}

/**
 * @description 判断是否为英文
 * @param value
 * @returns {boolean}
 */
export const isEnglish = (value) => {
  const reg = /^[A-Za-z]+$/
  return reg.test(value)
}

/**
 * @description 判断是否为车牌号码
 * @param value
 * @returns {boolean}
 */
export const isCars = (value) => {
  const reg = /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领][A-HJ-NP-Z][A-HJ-NP-Z0-9]{4,5}[A-HJ-NP-Z0-9挂学警港澳]$/
  return reg.test(value)
}
