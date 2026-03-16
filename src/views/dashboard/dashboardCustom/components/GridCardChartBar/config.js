import { computed } from 'vue'
import { random } from 'lodash-es'
import { translate } from '@/locales'

const locales = {
  'en': {
    'ec.locale.6elurskf': 'Chart Bar',
    'ec.locale.7z1tribl': 'Book Download',
    'ec.locale.4ctt1tap': 'Book Borrow',
  },
  'zh-CN': {
    'ec.locale.6elurskf': '柱状图',
    'ec.locale.7z1tribl': '图书下载量',
    'ec.locale.4ctt1tap': '图书借阅量',
  },
}
const config = {
  id: 'hhi30pxw-vdy4-94tj-s90m-t75iekf0mq1g',
  title: computed(() => translate('ec.locale.6elurskf', locales)),
  type: 'chart',
  icon: 'ri-bar-chart-fill',
  key: 'GridCardChartBar',
  description: '',
  options: {
    data: {
      name: computed(() => [
        translate('ec.locale.7z1tribl', locales),
        translate('ec.locale.4ctt1tap', locales)
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
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
      },
      series: [
        { barWidth: 8 },
        { barWidth: 8 },
      ]
    }
  },
  grid: {
    i: 'hhi30pxw-vdy4-94tj-s90m-t75iekf0mq1g',
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
