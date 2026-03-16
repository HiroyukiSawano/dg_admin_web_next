<template>
  <ec-chart v-if="_data.length > 0" :option="_option" v-bind="$attrs" />
</template>

<script setup>
import { computed, toRefs } from 'vue'
import { merge, isArray, isPlainObject } from 'lodash-es'
import EcChart from '@/components/EcChart'

defineOptions({
  name: 'EcChartBar',
})

const props = defineProps({
  name: {
    type: [Array, String],
    default: () => [],
  },
  data: {
    type: Array,
    default: () => [],
  },
  option: {
    type: Object,
    default: () => ({})
  },
  dataset: {
    type: Object,
    default: null,
  },
  loading: {
    type: Boolean,
    default: true
  }
})

const { name, data, dataset, option } = toRefs(props)

const _data = computed(() => {
  if (dataset.value?.source) return dataset.value.source
  return data.value
})
const _series = computed(() => {
  if (dataset.value) {
    const { dimensions, source } = dataset.value
    if(dimensions) {
      return dimensions.slice(1).map(() => ({ type: 'line' }))
    }
    if(isArray(source[0])) {
      return source[0].slice(1).map(() => ({ type: 'line' }))
    }
    if(isPlainObject(source[0])) {
      return Object.keys(source[0]).slice(1).map(() => ({ type: 'line' }))
    }
  }
  if (data.value?.length > 0) {
    return Object.keys(data.value[0]).slice(1).map((_, index) => ({
      name: isArray(name.value) ? name.value[index] : name.value,
      type: 'line',
    }))
  }
  return []
})

const _dataset = computed(() => dataset.value ?? { source: data.value })
const _option = computed(() => {
  return merge(
    {
      dataset: _dataset.value,
      tooltip: {
        trigger: 'axis',
      },
      legend: {
      },
      grid: {
        top: option.value?.legend?.show ? 32 : 0,
      },
      xAxis: {
        type: 'category',
      },
      yAxis: {
        type: 'value',
      },
      series: _series.value
    },
    option.value
  )
})
</script>
