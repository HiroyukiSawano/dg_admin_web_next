import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { translate } from '@/locales'
import { useSystemStore } from '@/stores/modules/systemStore'
import { apiBookList } from '@/services/modules/mockService'
const { language } = storeToRefs(useSystemStore())

const locales = {
  'en': {
    'ec.locale.h94t5zjk': 'Tabs',
  },
  'zh-CN': {
    'ec.locale.h94t5zjk': '页签',
  },
}
const config = {
  id: 'f93m5mod-cvdt-15f9-myu5-t9f8toaze40r',
  title: computed(() => translate('ec.locale.h94t5zjk', locales)),
  type: 'tabs',
  icon: 'ri-shadow-fill',
  key: 'GridCardTabs',
  description: '',
  options: {
    data: {
      columns: computed(() => {
        const { data: { columns = [] } } = apiBookList({ locale: language.value }) || {}
        return columns
      }),
      source: computed(() => {
        const { data: { source = [] } } = apiBookList({ locale: language.value }) || {}
        return source
      }),
    },
    default: 1,
    options: computed(() => {
      const { data: { categories = [] } } = apiBookList({ locale: language.value }) || {}
      return categories
    }),
    status: computed(() => {
      const { data: { status = [] } } = apiBookList({ locale: language.value }) || {}
      return status
    }),
  },
  grid: {
    i: 'f93m5mod-cvdt-15f9-myu5-t9f8toaze40r',
    x: 0,
    y: 0,
    w: 16,
    h: 3,
    minW: 8,
    minH: 3,
    maxW: 24,
    maxH: 4,
    static: false,
  }
}
export default config
