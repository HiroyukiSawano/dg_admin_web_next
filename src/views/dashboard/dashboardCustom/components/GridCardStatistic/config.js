
import { translate } from '@/locales'
import { computed } from 'vue'
import { random } from 'lodash-es'
const locales = {
  'en': {
    'ec.locale.f8a9ry7j': 'Data Statistic',
    'ec.locale.ps507y8n': 'Data Indicators',
  },
  'zh-CN': {
    'ec.locale.f8a9ry7j': '数据统计',
    'ec.locale.ps507y8n': '数据指标',
  },
}
const config = {
  id: 'id65775s-rphn-jfbq-pufl-lgoncnza24dx',
  title: computed(() => translate('ec.locale.f8a9ry7j', locales)),
  type: 'statistic',
  icon: 'ri-shapes-fill',
  key: 'GridCardStatistic',
  description: '',
  options: {
    data: {
      icon: 'ri-shapes-fill',
      name: computed(() => translate('ec.locale.ps507y8n', locales)),
      value: random(8, 88),
    },
    option: {}
  },
  grid: {
    i: 'id65775s-rphn-jfbq-pufl-lgoncnza24dx',
    x: 0,
    y: 0,
    w: 6,
    h: 1,
    minW: 4,
    minH: 1,
    maxW: 12,
    maxH: 2,
    static: false,
  }
}
export default config
