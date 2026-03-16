import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { translate } from '@/locales'
import { useSystemStore } from '@/stores/modules/systemStore'
import { apiBookList } from '@/services/modules/mockService'
const { language } = storeToRefs(useSystemStore())
const locales = {
  'en': {
    'ec.locale.a9d1kgap': 'Table',
  },
  'zh-CN': {
    'ec.locale.a9d1kgap': '表格',
  },
}

const config = {
  id: 'ahlun0ma-y4vu-qtl3-y4jw-1x87nc6z1343',
  title: computed(() => translate('ec.locale.a9d1kgap', locales)),
  type: 'table',
  icon: 'ri-table-fill',
  key: 'GridCardTable',
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
    status: computed(() => {
      const { data: { status = [] } } = apiBookList({ locale: language.value }) || {}
      return status
    }),
  },
  grid: {
    i: 'ahlun0ma-y4vu-qtl3-y4jw-1x87nc6z1343',
    x: 0,
    y: 0,
    w: 16,
    h: 3,
    minW: 12,
    minH: 3,
    maxW: 24,
    maxH: 6,
    static: false,
  }
}
export default config
