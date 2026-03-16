import { computed } from 'vue'
import { translate } from '@/locales'
const locales = {
  'en': {
    'ec.dashboard.custom.card.map.title': 'Map',
  },
  'zh-CN': {
    'ec.dashboard.custom.card.map.title': '地图',
  },
}
const config = {
  id: '8p2qtxug-cgc6-dmbf-1ixs-k36860atyhsy',
  title: computed(() => translate('ec.dashboard.custom.card.map.title', locales)),
  type: 'map',
  icon: 'ri-map-pin-fill',
  key: 'GridCardMap',
  description: '',
  options: {
    data: {
      source: [
      ],
    },
  },
  grid: {
    i: '8p2qtxug-cgc6-dmbf-1ixs-k36860atyhsy',
    x: 0,
    y: 0,
    w: 8,
    h: 2,
    minW: 6,
    minH: 2,
    maxW: 24,
    maxH: 4,
    static: false,
  }
}
export default config
