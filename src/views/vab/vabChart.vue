<template>
  <el-row :gutter="16">
    <el-col :lg="12">
      <el-card>
        <template #header>
          <div class="el-card__title">
            {{ $translate('ec.vab.chart.bar.title', {
              en: { 'ec.vab.chart.bar.title': 'Chart Bar' }, 'zh-CN': {
                'ec.vab.chart.bar.title': '柱状图' } }) }}
          </div>
          <div class="el-card__action">
          </div>
        </template>
        <ec-chart-bar :data="dataChartBar" :option="optionChartBar"
          :name="[$translate('e82l93xg', { en: { 'e82l93xg': 'Standard Precipitation' }, 'zh-CN': { 'e82l93xg': '国标降水量' } }), $translate('rardgk5g', { en: { 'rardgk5g': 'Standard Evaporation' }, 'zh-CN': { 'rardgk5g': '国标蒸发量' } })]"
          @click="handleChartClick" />
      </el-card>
    </el-col>
    <el-col :lg="12">
      <el-card>
        <template #header>
          <div class="el-card__title">
            {{ $translate('ec.vab.chart.scatter.title', { en: { 'ec.vab.chart.scatter.title': 'Chart Scatter' }, 'zh-CN': { 'ec.vab.chart.scatter.title': '散点图' } }) }}
          </div>
          <div class="el-card__action">
          </div>
        </template>
        <ec-chart-scatter :data="dataChartScatter" :option="optionChartScatter" @click="handleChartClick" />
      </el-card>
    </el-col>
    <el-col :lg="12">
      <el-card>
        <template #header>
          <div class="el-card__title">
            {{ $translate('ec.vab.chart.pie.title', { en: { 'ec.vab.chart.pie.title': 'Chart Pie' }, 'zh-CN': { 'ec.vab.chart.pie.title': '饼图' } }) }}
          </div>
          <div class="el-card__action">
          </div>
        </template>
        <ec-chart-pie :data="dataChartPie"
          :name="$translate('myeei402', { en: { 'myeei402': 'Source Channels Proportion' }, 'zh-CN': { 'myeei402': '来源渠道占比' } })"
          :option="optionChartPie" @click="handleChartClick" />
      </el-card>
    </el-col>
    <el-col :lg="12">
      <el-card>
        <template #header>
          <div class="el-card__title">
            {{ $translate('ec.vab.chart.line.title', { en: { 'ec.vab.chart.line.title': 'Chart Line' }, 'zh-CN': { 'ec.vab.chart.line.title': '折线图' } }) }}
          </div>
          <div class="el-card__action">
          </div>
        </template>
        <ec-chart-line :data="dataChartLine"
          :name="[$translate('e82l93xg', { en: { 'e82l93xg': 'Standard Precipitation' }, 'zh-CN': { 'e82l93xg': '国标降水量' } })]"
          :option="optionChartLine" @click="handleChartClick" />
      </el-card>
    </el-col>
  </el-row>
</template>
<script setup>
import { ref, getCurrentInstance, computed, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { random } from 'lodash-es'
import EcChartBar from '@/components/EcChartBar'
import EcChartLine from '@/components/EcChartLine'
import EcChartPie from '@/components/EcChartPie'
import EcChartScatter from '@/components/EcChartScatter'
import { useStyleStore } from '@/stores/modules/styleStore'
defineOptions({ name: 'vabChart' })
const { proxy } = getCurrentInstance()

const dataChartBar = ref([
  { name: '10.1', value1: random(8, 88), value2: random(8, 88) },
  { name: '10.2', value1: random(8, 88), value2: random(8, 88) },
  { name: '10.3', value1: random(8, 88), value2: random(8, 88) },
  { name: '10.4', value1: random(8, 88), value2: random(8, 88) },
  { name: '10.5', value1: random(8, 88), value2: random(8, 88) },
  { name: '10.6', value1: random(8, 88), value2: random(8, 88) },
  { name: '10.7', value1: random(8, 88), value2: random(8, 88) },
  { name: '10.8', value1: random(8, 88), value2: random(8, 88) },
  { name: '10.9', value1: random(8, 88), value2: random(8, 88) },
  { name: '10.10', value1: random(8, 88), value2: random(8, 88) },
  { name: '10.11', value1: random(8, 88), value2: random(8, 88) },
  { name: '10.12', value1: random(8, 88), value2: random(8, 88) },
  { name: '10.13', value1: random(8, 88), value2: random(8, 88) },
  { name: '10.14', value1: random(8, 88), value2: random(8, 88) },
  { name: '10.15', value1: random(8, 88), value2: random(8, 88) },
])
const optionChartBar = ref({})
const dataChartLine = ref([
  { name: '10.1', value: random(8, 88) },
  { name: '10.2', value: random(8, 88) },
  { name: '10.3', value: random(8, 88) },
  { name: '10.4', value: random(8, 88) },
  { name: '10.5', value: random(8, 88) },
  { name: '10.6', value: random(8, 88) },
  { name: '10.7', value: random(8, 88) },
])
const optionChartLine = ref({})
const dataChartPie = ref([
  { name: computed(() => proxy.$translate('fkh7bvkb', { en: { 'fkh7bvkb': 'Search Engine' }, 'zh-CN': { 'fkh7bvkb': '搜索引擎' } })), value: random(8, 88) },
  { name: computed(() => proxy.$translate('p079gaqc', { en: { 'p079gaqc': 'Direct Access' }, 'zh-CN': { 'p079gaqc': '直接访问' } })), value: random(8, 88) },
  { name: computed(() => proxy.$translate('q63o4cix', { en: { 'q63o4cix': 'Email Market' }, 'zh-CN': { 'q63o4cix': '邮件营销' } })), value: random(8, 88) },
  { name: computed(() => proxy.$translate('qbw48ah2', { en: { 'qbw48ah2': 'Alliance AD' }, 'zh-CN': { 'qbw48ah2': '联盟广告' } })), value: random(8, 88) },
  { name: computed(() => proxy.$translate('4c2848ep', { en: { '4c2848ep': 'Video AD' }, 'zh-CN': { '4c2848ep': '视频广告' } })), value: random(8, 88) },
])
const optionChartPie = ref({})
const dataChartScatter = ref([
  [random(8, 88), random(8, 88)],
  [random(8, 88), random(8, 88)],
  [random(8, 88), random(8, 88)],
  [random(8, 88), random(8, 88)],
  [random(8, 88), random(8, 88)],
  [random(8, 88), random(8, 88)],
  [random(8, 88), random(8, 88)],
  [random(8, 88), random(8, 88)],
  [random(8, 88), random(8, 88)],
  [random(8, 88), random(8, 88)],
  [random(8, 88), random(8, 88)],
  [random(8, 88), random(8, 88)],
  [random(8, 88), random(8, 88)],
  [random(8, 88), random(8, 88)],
  [random(8, 88), random(8, 88)],
  [random(8, 88), random(8, 88)],
  [random(8, 88), random(8, 88)],
  [random(8, 88), random(8, 88)],
  [random(8, 88), random(8, 88)],
])
const optionChartScatter = ref({})
const handleChartClick = (e) => {
  console.log(e)
}
</script>

<style lang="scss" scoped>
:deep(.el-card) {
  display: flex;
  flex-direction: column;
  z-index: 0;
  overflow: hidden;
  height: 384px;
  .el-card__header {
    border: 0;
  }
  .el-card__header + .el-card__body {
    padding-top: 0;
  }
  .el-card__body {
    flex: 1;
    height: 100%;
    min-height: 0;
  }
}
</style>
