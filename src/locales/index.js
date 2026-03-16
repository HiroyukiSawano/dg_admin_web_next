import { get, merge } from 'lodash-es'
import { createI18n } from 'vue-i18n'
import configs from '@/configs'
import el_en from 'element-plus/es/locale/lang/en'
import el_zh_CN from 'element-plus/es/locale/lang/zh-cn'
import en from './modules/en'
import zh_CN from './modules/zh-CN'
const messages = {
  'zh-CN': {
    el: el_zh_CN,
    ...zh_CN,
  },
  en: {
    el: el_en,
    ...en,
  },
}

const i18n = createI18n({
  locale: configs.SYSTEM_LANGUAGE,
  fallbackLocale: 'zh',
  fallbackWarn: false,
  missingWarn: false,
  legacy: false,
  messages,
})

const setupI18n = (app) => {
  app.use(i18n)
  return i18n
}
// const translate = (text, options = {}) => {
//   if (!text) return ''
//   return get(merge(messages, options), `${i18n.global.locale.value}['${text}']`) || text
// }
const translate = (text, options = {}) => {
  if (!text) return ''
  const path = [i18n.global.locale.value, text]
  return get(options, path) ?? get(messages, path) ?? text
}
const { t } = i18n.global

export { setupI18n, translate, t }
export default i18n
