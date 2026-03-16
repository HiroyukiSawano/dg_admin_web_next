import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { translate } from '@/locales'
import { useSystemStore } from '@/stores/modules/systemStore'
import { apiAppList } from '@/services/modules/mockService'
const { language } = storeToRefs(useSystemStore())
const locales = {
  'en': {
    'ec.locale.kzr07wrz': 'Quick Shortcut',
  },
  'zh-CN': {
    'ec.locale.kzr07wrz': '便捷入口',
  },
}

const config = {
  id: '11kpeahi-ryne-ij33-4du7-63i0h1gnho51',
  title: computed(() => translate('ec.locale.kzr07wrz', locales)),
  type: 'shortcut',
  icon: 'ri-function-add-fill',
  key: 'GridCardShortcut',
  description: '',
  options: {
    data: {
      source: computed(() => {
        const { data: { data = [] } } = apiAppList({ locale: language.value }) || {}
        return data
      }),
    },
    option: {}
  },
  grid: {
    i: '11kpeahi-ryne-ij33-4du7-63i0h1gnho51',
    x: 16,
    y: 1,
    w: 8,
    h: 3,
    minW: 6,
    minH: 2,
    maxW: 18,
    maxH: 3,
    static: false,
  }
}
export default config
