import { computed } from 'vue'
import { random } from 'lodash-es'
import { translate } from '@/locales'

const locales = {
  'en': {
    'ec.dashboard.custom.card.line.title': 'Chart Line',
    'ec.dashboard.custom.card.line.name.download': 'Book Download',
    'ec.dashboard.custom.card.line.name.borrow': 'Book Borrow',
  },
  'zh-CN': {
    'ec.dashboard.custom.card.line.title': '折线图',
    'ec.dashboard.custom.card.line.name.download': '图书下载量',
    'ec.dashboard.custom.card.line.name.borrow': '图书借阅量',
  },
}
const config = {
  id: 'scbtflb2-k5jc-4prm-4jb0-xh0jcyerqtr6',
  title: computed(() => translate('ec.dashboard.custom.card.line.title', locales)),
  type: 'chart',
  icon: 'ri-line-chart-fill',
  key: 'GridCardChartLine',
  description: '',
  options: {
    data: {
      name: computed(() => [
        translate('ec.dashboard.custom.card.line.name.download', locales),
        translate('ec.dashboard.custom.card.line.name.borrow', locales)
      ]),
      data: [
        { name: '4.1', download: random(8, 88), borrow: random(8, 88) },
        { name: '4.2', download: random(8, 88), borrow: random(8, 88) },
        { name: '4.3', download: random(8, 88), borrow: random(8, 88) },
        { name: '4.4', download: random(8, 88), borrow: random(8, 88) },
        { name: '4.5', download: random(8, 88), borrow: random(8, 88) },
        { name: '4.6', download: random(8, 88), borrow: random(8, 88) },
        { name: '4.7', download: random(8, 88), borrow: random(8, 88) },
        { name: '4.8', download: random(8, 88), borrow: random(8, 88) },
        { name: '4.9', download: random(8, 88), borrow: random(8, 88) },
        { name: '4.10', download: random(8, 88), borrow: random(8, 88) },
        { name: '4.11', download: random(8, 88), borrow: random(8, 88) },
        { name: '4.12', download: random(8, 88), borrow: random(8, 88) },
        { name: '4.13', download: random(8, 88), borrow: random(8, 88) },
        { name: '4.14', download: random(8, 88), borrow: random(8, 88) },
        { name: '4.15', download: random(8, 88), borrow: random(8, 88) },
      ]
    },
    option: {
      grid: {
        // left: 0,
        // right: 0,
        // top: 0,
        // bottom: 0,
      },
      series: []
    }
  },
  grid: {
    i: 'scbtflb2-k5jc-4prm-4jb0-xh0jcyerqtr6',
    x: 0,
    y: 1,
    w: 16,
    h: 3,
    minW: 6,
    minH: 2,
    maxW: 24,
    maxH: 6,
    static: false,
  }
}
export default config
