
import { computed } from 'vue'
import { translate } from '@/locales'
import { random } from 'lodash-es'
const locales = {
  'en': {
    'ec.locale.6q8jns9m': 'Welcome',
    'ec.locale.ps507y8n': 'Data Indicators',
  },
  'zh-CN': {
    'ec.locale.6q8jns9m': '欢迎',
    'ec.locale.ps507y8n': '数据指标',
  },
}
const config = {
  id: '86ph6bqq-45ud-yaj4-fool-schpt7ig7nv2',
  title: computed(() => translate('ec.locale.6q8jns9m', locales)),
  type: 'welcome',
  icon: 'ri-moon-fill',
  key: 'GridCardWelcome',
  description: '',
  options: {
    data: {
      source: [
        { name: computed(() => translate('ec.locale.ps507y8n', locales)), value: random(8, 88), icon: 'ri-shopping-bag-2-fill' },
        { name: computed(() => translate('ec.locale.ps507y8n', locales)), value: random(8, 88), icon: 'ri-parent-fill' },
        { name: computed(() => translate('ec.locale.ps507y8n', locales)), value: random(88, 888), icon: 'ri-search-ai-2-fill' },
        { name: computed(() => translate('ec.locale.ps507y8n', locales)), value: random(8, 88), icon: 'ri-pushpin-fill' },
      ],
    },
  },
  grid: {
    i: '86ph6bqq-45ud-yaj4-fool-schpt7ig7nv2',
    x: 0,
    y: 0,
    w: 16,
    h: 2,
    minW: 12,
    minH: 1,
    maxW: 24,
    maxH: 2,
    static: false,
  }
}
export default config
