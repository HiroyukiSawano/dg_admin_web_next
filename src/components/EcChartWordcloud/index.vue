<template>
  <ec-chart v-if="data.length > 0" :option="_option" v-bind="$attrs" />
</template>
<script setup>
import { computed, toRefs } from 'vue'
import { merge } from 'lodash-es'
import EcChart from '@/components/EcChart'
defineOptions({
  name: 'EcChartWordcloud',
})
const props = defineProps({
  name: {
    type: [String, Array],
  },
  data: {
    type: Array,
    default: () => [],
  },
  option: {
    type: Object,
    default: () => {},
  },
})

const { name, data, option } = toRefs(props)

const _option = computed(() => {
  const _colors = ['#427af4', '#91cc75', '#fac858', '#ee6666', '#73c0de', '#3ba272', '#fc8452', '#9a60b4', '#ea7ccc']
  const _series = []
  for (let i = 0; i < data.value.length; i++) {
    _series.push({
      name: data.value[i].name,
      value: data.value[i].value,
      textStyle: {
        color: _colors[i % _colors.length],
      },
    })
  }
  return merge(
    {
      tooltip: {
        trigger: 'item',
      },
      series: [
        {
          name: name.value,
          type: 'wordCloud',
          shape: 'circle',
          left: 'center',
          top: 'center',
          right: null,
          bottom: null,
          sizeRange: [12, 32],
          rotationRange: [0, 0],
          rotationStep: 45,
          gridSize: 12,
          drawOutOfBound: false,
          layoutAnimation: true,
          textStyle: {
            fontWeight: 'bold',
          },
          data: _series,
        },
      ],
    },
    option.value
  )
})
</script>
