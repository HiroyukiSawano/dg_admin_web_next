<template>
  <div class="el-card__wrapper">
    <el-card>
      <template #header>
        <div class="el-card__title">
          <i :class="props.record.icon"></i>
          <span>{{ props.record.title }}</span>
        </div>
        <div class="el-card__action">
          <el-segmented v-model="dimensionActive" :options="dimensionData" />
        </div>
      </template>
      <ec-chart-line :data="props.record.options.data.data" :name="props.record.options.data.name" :option="props.record.options.option" />
    </el-card>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import EcChartLine from '@/components/EcChartLine'
import config from './config'
import { translate } from '@/locales'
defineOptions({
  name: 'GridCardChartLine',
  config
})

const props = defineProps({
  record: {
    type: Object
  },
})

const dimensionActive = ref('1')
const locales = {
  'en': {
    '6axusr2w': 'Day',
    '34mg4dbk': 'Week',
    'wbkxzgv6': 'Month'
  },
  'zh-CN': {
    '6axusr2w': '日视图',
    '34mg4dbk': '周视图',
    'wbkxzgv6': '月视图'
  }
}

const dimensionData = ref([
  { label: computed(() => translate('6axusr2w', locales)), value: '1' },
  { label: computed(() => translate('34mg4dbk', locales)), value: '2' },
  { label: computed(() => translate('wbkxzgv6', locales)), value: '3' }
])
</script>
<style lang="scss" scoped>
</style>
