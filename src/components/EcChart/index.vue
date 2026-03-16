<template>
  <v-chart ref="VChartRef" v-bind="$attrs" :autoresize="props.autoresize" :option="_option"
    class="x-vue-echarts" />
</template>

<script setup>
import { computed, provide } from 'vue'
import { storeToRefs } from 'pinia'
import { useSystemStore } from '@/stores/modules/systemStore'
import { useStyleStore } from '@/stores/modules/styleStore'
import { cloneDeep, set, merge } from 'lodash-es'
import * as echarts from 'echarts'

import 'echarts-wordcloud'
import VChart, { THEME_KEY } from 'vue-echarts'
import themeLight from './theme/themeLight'
import themeDark from './theme/themeDark'
defineOptions({
  name: 'EcChart',
})
const props = defineProps({
  option: {
    type: Object,
    default: () => { },
  },
  autoresize: {
    type: Boolean,
    default: true,
  },
  renderer: {
    type: String,
    default: () => {
      return 'CanvasRenderer'
    },
  },
})

const { dark } = storeToRefs(useSystemStore())
const { color, variables } = storeToRefs(useStyleStore())

const _option = computed(() => {
  const option = {
    color: [color.value, ...(dark.value ? themeDark.color : themeLight.color)],
    tooltip: {
      borderRadius: variables.value.borderRadius,
    },
    textStyle: {
      fontFamily: variables.value.fontFamily,
      fontSize: variables.value.fontSize,
    },
  }
  return merge(cloneDeep(option), cloneDeep(props.option))
})
provide(THEME_KEY, () => (dark.value ? themeDark : themeLight));


</script>

<style lang="scss" scoped>
.x-vue-echarts {
  min-height: 1px;
}
</style>
