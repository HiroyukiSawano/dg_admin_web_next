import { computed, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { translate } from '@/locales'
import { useSystemStore } from '@/stores/modules/systemStore'
import { apiNewsList } from '@/services/modules/mockService'

const { language } = storeToRefs(useSystemStore())
// 1. 定义 source 为 ref（初始为空数组）
// const bookSource = ref([])


// watch(language, async(val) => {
//     const { data: { list = [] } } = await getBookList({ locale: val })
//     bookSource.value = list
//     console.log(bookSource.value, 'bookSource.value')
//   },
//   { immediate: true } // 立即执行一次
// )
const locales = {
  'en': {
    'ec.locale.814gonwp': 'List Trend',
  },
  'zh-CN': {
    'ec.locale.814gonwp': '新闻列表',
  },
}
const config = {
  id: 'pbbg4xf5-fxmn-2bcp-0wxx-ardla715exgm',
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
      // source: bookSource,
    },
    tags: computed(() => {
      const { data: { tags = [] } } = apiNewsList({ locale: language.value }) || {}
      return tags
    }),
  },
  grid: {
    i: 'pbbg4xf5-fxmn-2bcp-0wxx-ardla715exgm',
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
