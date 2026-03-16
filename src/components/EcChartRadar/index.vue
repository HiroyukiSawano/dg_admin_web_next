<template>
  <ec-chart v-if="data.length > 0" :option="_option" v-bind="$attrs" />
</template>
<script setup>
import { computed, toRefs } from 'vue'
import { merge } from 'lodash-es'
import EcChart from '@/components/EcChart'

const props = defineProps({
  name: {
    type: [String, Array],
  },
  data: {
    type: Array,
    default: () => [],
  },
  axisData: {
    type: Array,
    default: () => [],
  },
  option: {
    type: Object,
    default: () => {},
  },
})

const { name, data, axisData, option } = toRefs(props)

const _option = computed(() => {
  return merge(
    {
      radar: [
        {
          indicator: axisData.value,
          center: ['50%', '50%'],
          radius: 70,
        },
      ],
      tooltip: {
        trigger: 'axis',
        confine: true,
      },
      legend: {
      },
      series: [
        {
          name: name.value,
          type: 'radar',
          tooltip: {
            trigger: 'item',
          },
          data: data.value,
        },
      ],
    },
    option.value
  )
})
</script>
