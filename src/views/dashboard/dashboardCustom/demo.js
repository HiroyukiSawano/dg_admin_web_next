import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { random } from 'lodash-es'
import { translate } from '@/locales'
import { useSystemStore } from '@/stores/modules/systemStore'
import { apiScheduleList, apiBookList, apiAppList, apiNewsList } from '@/services/modules/mockService'
const { language } = storeToRefs(useSystemStore())
const locales = {
  'en': {
    'ec.locale.c5wuevcd': 'Schedule',
    'ec.locale.6elurskf': 'Chart Bar',
    'ec.locale.7z1tribl': 'Book Download',
    'ec.locale.4ctt1tap': 'Book Borrow',
    'ec.locale.h94t5zjk': 'Tabs',
    'ec.locale.6q8jns9m': 'Welcome',
    'ec.locale.ps507y8n': 'Data Indicators',
    'ec.locale.kzr07wrz': 'Quick Shortcut',
    'ec.locale.814gonwp': 'List Trend',
  },
  'zh-CN': {
    'ec.locale.c5wuevcd': '日程',
    'ec.locale.6elurskf': '柱状图',
    'ec.locale.7z1tribl': '图书下载量',
    'ec.locale.4ctt1tap': '图书借阅量',
    'ec.locale.h94t5zjk': '页签',
    'ec.locale.6q8jns9m': '欢迎',
    'ec.locale.ps507y8n': '数据指标',
    'ec.locale.kzr07wrz': '便捷入口',
    'ec.locale.814gonwp': '新闻列表',
  },
}
const demoA = [
  {
    id: 'osjciqeg-m4pv-vfnt-lzc9-rh5drlo50t5s',
    title: computed(() => translate('ec.locale.c5wuevcd', locales)),
    type: 'calendar',
    icon: 'ri-calendar-schedule-fill',
    key: 'GridCardSchedule',
    description: '',
    options: {
      data: {
        source: computed(() => {
          const { data: { data = [] } } = apiScheduleList({ locale: language.value }) || {}
          return data
        }),
      },
      option: {}
    },
    i: 'osjciqeg-m4pv-vfnt-lzc9-rh5drlo50t5s',
    x: 16,
    y: 5,
    w: 8,
    h: 3,
    minW: 6,
    minH: 3,
    maxW: 18,
    maxH: 4,
    static: false,
    moved: false,
  },
  {
    id: 'gezsxoff-dses-teq9-bx2z-wwzcmr3iqhm5',
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
        },
        series: [
          { barWidth: 8 },
          { barWidth: 8 },
        ]
      }
    },
    i: 'gezsxoff-dses-teq9-bx2z-wwzcmr3iqhm5',
    x: 0,
    y: 5,
    w: 16,
    h: 3,
    minW: 6,
    minH: 2,
    maxW: 24,
    maxH: 6,
    static: false,
    moved: false,
  },
  {
    id: 'e2b2p8w1-tmcj-kwrq-7o8l-nr47h98g8jc0',
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
    i: 'e2b2p8w1-tmcj-kwrq-7o8l-nr47h98g8jc0',
    x: 0,
    y: 2,
    w: 16,
    h: 3,
    minW: 8,
    minH: 3,
    maxW: 24,
    maxH: 4,
    static: false,
    moved: false,
  },
  {
    id: 'l6p7vpqs-qtpf-27ky-3mwx-h60aeutt085e',
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
    i: 'l6p7vpqs-qtpf-27ky-3mwx-h60aeutt085e',
    x: 0,
    y: 0,
    w: 16,
    h: 2,
    minW: 12,
    minH: 1,
    maxW: 24,
    maxH: 2,
    static: false,
    moved: false,
  },
  {
    id: 'm6bqbmm8-w5ym-1gib-vp4u-vrtbqjtrea6x',
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
    i: 'm6bqbmm8-w5ym-1gib-vp4u-vrtbqjtrea6x',
    x: 16,
    y: 0,
    w: 8,
    h: 2,
    minW: 6,
    minH: 2,
    maxW: 18,
    maxH: 3,
    static: false,
    moved: false,
  },
  {
    id: 'tpeab9g4-qrdv-89yz-0436-8p7puzmfqrgt',
    title: computed(() => translate('ec.locale.814gonwp', locales)),
    type: 'list',
    icon: 'ri-file-copy-2-fill',
    key: 'GridCardList',
    description: '',
    options: {
      data: {
        source: computed(() => {
          const { data: { data = [] } } = apiNewsList({ locale: language.value }) || {}
          return data
        }),
      },
      tags: computed(() => {
        const { data: { tags = [] } } = apiNewsList({ locale: language.value }) || {}
        return tags
      }),
    },
    i: 'tpeab9g4-qrdv-89yz-0436-8p7puzmfqrgt',
    x: 16,
    y: 2,
    w: 8,
    h: 3,
    minW: 6,
    minH: 2,
    maxW: 18,
    maxH: 3,
    static: false,
    moved: false,
  },
]
const demoB = []

export { demoA, demoB }
