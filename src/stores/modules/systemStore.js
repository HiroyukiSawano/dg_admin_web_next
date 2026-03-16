import { defineStore } from 'pinia'
import { APP_NAME, APP_LOGO, APP_COPYRIGHT, SYSTEM_LANGUAGE, SYSTEM_DARK, SYSTEM_WEAKNESS, SYSTEM_AUTOEXIT, SYSTEM_WATERMARK, STORAGE_PREFIX } from '@/configs'
import i18n from '@/locales'
const useSystemStore = defineStore('system', {
  state: () => ({
    // 设置语言，优先使用配置中的语言，否则使用浏览器的语言
    language: SYSTEM_LANGUAGE || navigator.language || navigator.browserLanguage,
    // 锁屏
    lock: false,
    // Logo
    logo: APP_LOGO,
    // 应用名称
    name: APP_NAME,
    // 标题
    title: '',
    // 版权信息
    copyright: APP_COPYRIGHT,
    // 深色模式
    dark: SYSTEM_DARK,
    // 色弱模式
    weakness: SYSTEM_WEAKNESS,
    // 账户自动退出，默认不做设置
    autoexit: SYSTEM_AUTOEXIT,
    // 水印
    watermark: SYSTEM_WATERMARK,
    // 设备类型
    device: '',
    // 网格断点
    breakpoint: '',
    // 实时监听窗口尺寸
    viewport: [],
  }),

  getters: {},
  actions: {
    UpdateSystem({ key, value }) {
      // 如果当前 store 中没有这个 key，则直接返回
      if (!Reflect.has(this, key)) return

      // 更新深色模式时，切换 HTML 的 dark 类
      if (key === 'dark') {
        document.documentElement.classList.toggle('dark', value)
        // document.documentElement.setAttribute('class', value ? 'dark' : 'light')
      }
      // 更新色弱模式时，切换 HTML 的 weakness 类
      if (key === 'weakness') document.documentElement.classList.toggle('weakness', value)
      // 更新语言时，同时更新国际化插件和 HTML 的 lang 属性
      if (key === 'language') {
        i18n.global.locale.value = value
        document.documentElement.lang = value
      }
      // 更新对应的属性值
      this[key] = value
    },
    ResetSystem() {
      this.$reset()
    },
  },
  persist: {
    key: `${STORAGE_PREFIX}/SYSTEM_KEY`,
    // 定义不需要存储的属性
    omit: ['device', 'viewport'],
  },
})

export { useSystemStore }
export default useSystemStore
