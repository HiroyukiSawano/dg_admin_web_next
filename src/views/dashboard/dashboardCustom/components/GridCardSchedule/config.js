import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { translate } from '@/locales'
import { useSystemStore } from '@/stores/modules/systemStore'
import { apiScheduleList } from '@/services/modules/mockService'
const { language } = storeToRefs(useSystemStore())
const locales = {
  'en': {
    'ec.locale.c5wuevcd': 'Schedule',
  },
  'zh-CN': {
    'ec.locale.c5wuevcd': '日程',
  },
}
const config = {
  id: '9el1qrn2-ae4u-anqs-fno4-09ulutsl36xp',
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
  grid: {
    i: '9el1qrn2-ae4u-anqs-fno4-09ulutsl36xp',
    x: 16,
    y: 1,
    w: 8,
    h: 3,
    minW: 6,
    minH: 3,
    maxW: 18,
    maxH: 4,
    static: false,
  }
}
export default config
