<template>
  <div class="el-page">
    <el-row :gutter="16">
      <el-col v-for="(item, index) in overviewData" :key="index" :sm="12" :md="6">
        <el-card>
          <div class="el-statistic">
            <div class="el-statistic__icon">
              <i :class="item.icon"></i>
            </div>
            <div class="el-statistic__content">
              <div class="el-statistic__number">
                <em>{{ item.value }}</em>&ensp;<small>{{ item.unit }}</small>
              </div>

              <div class="el-statistic__title">{{ item.name }}</div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-row :gutter="16">
      <el-col :lg="12">
        <el-card style="height: 352px;">
          <template #header>
            <div class="el-card__title">
              <span>{{ $translate('ni7wa3td', { 'en': { 'ni7wa3td': 'Chart Pie' }, 'zh-CN': { 'ni7wa3td': '图表饼图' } }) }}</span>
            </div>
            <div class="el-card__action">
              <el-segmented v-model="chartDimension" :options="chartDimensionData" />
            </div>
          </template>
          <ec-chart-pie :data="chartPieData" :option="chartPieOption" :name="$translate('n6p0alah', { en: { 'n6p0alah': 'Book Category' }, 'zh-CN': { 'n6p0alah': '图书题材类别' } })" />
        </el-card>
      </el-col>
      <el-col :lg="12">
        <el-card style="height: 352px;">
          <template #header>
            <div class="el-card__title">
              <el-tabs>
                <el-tab-pane v-for="item in newsCategories" :key="item.value" :label="item.label">
                  <template #label>
                    <el-badge :value="item.count" :show-zero="false" is-dot>{{ item.label }}</el-badge>
                  </template>
                </el-tab-pane>
              </el-tabs>
            </div>
            <div class="el-card__action">
              <el-link type="info" underline="never">
                {{ $t('ec.global.button.text.more') }}
                <i class="ri-arrow-right-s-line"></i>
              </el-link>
            </div>
          </template>
          <el-scrollbar>
            <div class="el-list">
              <div v-for="(item, index) in newsData" :key="index" class="el-list-item">
                <div class="el-list-item__tag">
                  <el-tag :type="newsTags.find(c => c.value === item.tag)?.type">{{ newsTags.find(c => c.value === item.tag)?.label }}</el-tag>
                </div>
                <div class="el-list-item__title">{{ item.title }}</div>
                <div class="el-list-item__date">{{ item.time }}</div>
              </div>
            </div>
          </el-scrollbar>
        </el-card>
      </el-col>
      <el-col :lg="12">
        <el-card style="height: 352px;">
          <template #header>
            <div class="el-card__title">
              <span>{{ $translate('b7od623x', { 'en': { 'b7od623x': 'Chart Line' }, 'zh-CN': { 'b7od623x': '图表折线图' } }) }}</span>
            </div>
            <div class="el-card__action">
              <el-segmented v-model="chartView" :options="chartViewData" />
            </div>
          </template>
          <ec-chart-line v-if="chartView === '1'" :data="chartLineData" :option="chartLineOption" :name="$translate('umbg2gzq', { en: { 'umbg2gzq': 'Month Trend' }, 'zh-CN': { 'umbg2gzq': '当月变化趋势' } })" />
          <ec-chart-bar v-if="chartView === '2'" :data="chartBarData" :option="chartBarOption" :name="$translate('umbg2gzq', { en: { 'umbg2gzq': 'Month Trend' }, 'zh-CN': { 'umbg2gzq': '当月变化趋势' } })" />
        </el-card>
      </el-col>
      <el-col :lg="12">
        <el-card style="height: 352px;">
          <template #header>
            <div class="el-card__title">
              <span>{{ $translate('gerh35nw', { 'en': { 'gerh35nw': 'Chart Wordcloud' }, 'zh-CN': { 'gerh35nw': '图表词云图' } }) }}</span>
            </div>
            <div class="el-card__action">
            </div>
          </template>
            <ec-chart-wordcloud :data="chartWordcloudData" :option="chartWordcloudOption" :name="$translate('61qkiivh', { en: { '61qkiivh': 'Chart Wordcloud' }, 'zh-CN': { '61qkiivh': '图表词云图' } })" />
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, watch, getCurrentInstance, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { random } from 'lodash-es'
import EcChartLine from '@/components/EcChartLine'
import EcChartPie from '@/components/EcChartPie'
import EcChartBar from '@/components/EcChartBar'
import EcChartWordcloud from '@/components/EcChartWordcloud'

import { useSystemStore } from '@/stores/modules/systemStore'
import { useStyleStore } from '@/stores/modules/styleStore'
import { apiNewsList, apiBookList, apiBookGenres, apiAppList, apiBookHot } from '@/services/modules/mockService'
const { proxy } = getCurrentInstance()
const locales = {
  'en': {
    'ec.locale.ouysaf9s': 'China•Nanning',
    'ec.locale.6elurskf': 'Chart Bar',
    'ec.locale.zi2z0o6h': 'Download',
    'ec.locale.jhcczz94': 'Borrow',
    'ec.locale.kzr07wrz': 'Custom Shortcut',
    'ec.locale.814gonwp': 'China News',
    'ec.locale.c5wuevcd': 'Schedule',
    'ec.locale.35x9rbcr': 'Baidu Map',
    'ec.locale.6bqz6c2v': 'Chart Line',
    'ec.locale.a9d1kgap': 'Table',
    'ec.locale.qwdi69hg': 'Chart Pie',
    'ec.locale.n6p0alah': 'Book Genre',
    'ec.locale.7z1tribl': 'Book Store Download',
    'ec.locale.i1duogul': 'Book Author',
    'ec.locale.4ctt1tap': 'Book Borrow',
    'ec.locale.jr93nu2m': 'Book Average Borrow Time',
    'ec.locale.6axusr2w': 'Day',
    'ec.locale.34mg4dbk': 'Week',
    'ec.locale.wbkxzgv6': 'Month',
    'ec.locale.mrfc32ru': 'Year',
  },
  'zh-CN': {
    'ec.locale.ouysaf9s': '中国•南宁',
    'ec.locale.6elurskf': '图表柱状图',
    'ec.locale.zi2z0o6h': '图书下载量',
    'ec.locale.jhcczz94': '图书借阅量',
    'ec.locale.kzr07wrz': '快捷应用',
    'ec.locale.814gonwp': '中国新闻',
    'ec.locale.c5wuevcd': '日程',
    'ec.locale.35x9rbcr': '百度地图',
    'ec.locale.6bqz6c2v': '图表折线图',
    'ec.locale.a9d1kgap': '表格',
    'ec.locale.qwdi69hg': '图表饼图',
    'ec.locale.n6p0alah': '图书题材',
    'ec.locale.7z1tribl': '图书商店下载量',
    'ec.locale.i1duogul': '图书作者数量',
    'ec.locale.4ctt1tap': '图书借阅量',
    'ec.locale.jr93nu2m': '图书平均借阅时间',
    'ec.locale.6axusr2w': '日视图',
    'ec.locale.34mg4dbk': '周视图',
    'ec.locale.wbkxzgv6': '月视图',
    'ec.locale.mrfc32ru': '年视图',
  },
}
const chartDimension = ref('1')
const chartDimensionData = ref([
  { label: computed(() => proxy.$translate('ec.locale.6axusr2w', locales)), value: '1' },
  { label: computed(() => proxy.$translate('ec.locale.34mg4dbk', locales)), value: '2' },
  { label: computed(() => proxy.$translate('ec.locale.wbkxzgv6', locales)), value: '3' },
])
const chartView = ref('1')
const chartViewData = ref([
  { label: computed(() => proxy.$translate('ec.locale.6bqz6c2v', locales)), value: '1' },
  { label: computed(() => proxy.$translate('ec.locale.6elurskf', locales)), value: '2' },
])
const overviewData = ref([
  { name: computed(() => proxy.$translate('ec.locale.7z1tribl', locales)), value: random(8, 88), icon: 'ri-shopping-bag-2-fill', unit: '' },
  { name: computed(() => proxy.$translate('ec.locale.i1duogul', locales)), value: random(8, 888), icon: 'ri-parent-fill', unit: '' },
  { name: computed(() => proxy.$translate('ec.locale.4ctt1tap', locales)), value: random(8, 888), icon: 'ri-search-ai-2-fill', unit: '' },
  { name: computed(() => proxy.$translate('ec.locale.jr93nu2m', locales)), value: random(8, 88), icon: 'ri-calendar-schedule-fill', unit: 'h' },
])

const chartPieData = ref([])
const chartPieOption = ref({
  legend: {
    bottom: 8,
  },
  series: [
    {
      center: ['50%', '45%'],
      radius: ['35%', '55%'],
    },
  ],
})
const fetchGenresData = async () => {
  const { data: { data = [] }} = await apiBookGenres({ locale: language.value }) || {}
  chartPieData.value = data
}

const chartWordcloudData = ref([])
const chartWordcloudOption = ref({})
const fetchBookHotData = async () => {
  const { data: { data = [] }} = await apiBookHot({ locale: language.value }) || {}
  chartWordcloudData.value = data
}

const newsData = ref([])
const newsTags = ref([])
const newsCategories = ref([])
const fetchNewsData = async () => {
  const { data: { data = [], categories = [], tags = [] }} = await apiNewsList({ locale: language.value }) || {}
  newsTags.value = tags
  newsCategories.value = categories
  newsData.value = data
}

const chartLineData = ref([
  { name: '4.1', value: random(8, 88) },
  { name: '4.2', value: random(8, 88) },
  { name: '4.3', value: random(8, 88) },
  { name: '4.4', value: random(8, 88) },
  { name: '4.5', value: random(8, 88) },
  { name: '4.6', value: random(8, 88) },
  { name: '4.7', value: random(8, 88) },
  { name: '4.8', value: random(8, 88) },
  { name: '4.9', value: random(8, 88) },
  { name: '4.10', value: random(8, 88) },
  { name: '4.11', value: random(8, 88) },
  { name: '4.12', value: random(8, 88) },
  { name: '4.13', value: random(8, 88) },
  { name: '4.14', value: random(8, 88) },
  { name: '4.15', value: random(8, 88) },
])
const chartLineOption = ref({
  textStyle: {},
  grid: {
  },
  series: [
    {
      areaStyle: {
        opacity: 0.25,
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            { offset: 0, color: 'rgba(65,120,245,1)' },
            { offset: 1, color: 'rgba(255,255,255,.0)' },
          ],
        },
      },
    },
  ],
})

const chartBarData = ref([
  { name: '4.1', value: random(8, 88) },
  { name: '4.2', value: random(8, 88) },
  { name: '4.3', value: random(8, 88) },
  { name: '4.4', value: random(8, 88) },
  { name: '4.5', value: random(8, 88) },
  { name: '4.6', value: random(8, 88) },
  { name: '4.7', value: random(8, 88) },
  { name: '4.8', value: random(8, 88) },
  { name: '4.9', value: random(8, 88) },
  { name: '4.10', value: random(8, 88) },
  { name: '4.11', value: random(8, 88) },
  { name: '4.12', value: random(8, 88) },
  { name: '4.13', value: random(8, 88) },
  { name: '4.14', value: random(8, 88) },
  { name: '4.15', value: random(8, 88) },
])
const chartBarOption = ref({
  textStyle: {},
  grid: {
    top: 8,
    bottom: 8,
    left: 0,
    right: 0,
  },
  series: [
    {
      barWidth: 8,
      itemStyle: {
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            { offset: 0, color: 'rgba(65,120,245,1)' },
            { offset: 1, color: 'rgba(255,255,255,0)' },
          ],
        },
      },
    }
  ],
})

const { language } = storeToRefs(useSystemStore())
watch(language, async () => {
  fetchGenresData()
  fetchNewsData()
  fetchBookHotData()
}, { immediate: true })
const { color } = storeToRefs(useStyleStore())
watch(color, (val) => {
  chartLineOption.value.series[0].areaStyle.color.colorStops = [
    { offset: 0, color: val },
    { offset: 1, color: 'rgba(255,255,255,.0)' },
  ]
  chartBarOption.value.series[0].itemStyle.color.colorStops = [
    { offset: 0, color: val },
    { offset: 1, color: 'rgba(255,255,255,.0)' },
  ]
}, { immediate: true })

</script>

<style lang="scss" scoped>
:deep(.el-card) {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  .el-card__header {
    border-bottom-width: 0;
  }
  .el-card__body{
    flex: 1;
    height: 100%;
    min-height: 0;
  }
  .el-card__header+.el-card__body {
    padding-top: 0;
  }
  .el-card__action {
    display: flex;
    align-items: center;
    .el-link {
      .ri-arrow-right-s-line {
        margin-right: -6px;
        font-size: var(--el-font-size-medium);
      }
    }
  }
}
:deep(.el-tabs) {
  --el-tabs-header-height: 56px;
  margin: -12px 0;
  width: 100%;
  .el-tabs__nav-wrap::after {
    content: none;
  }
  .el-tabs__header {
    margin-bottom: 0;
  }
  .el-tabs__active-bar {
    background-color: transparent;
    &::after {
      content: "";
      position: absolute;
      bottom: 8px;
      left: 50%;
      transform: translateX(-50%);
      width: 16px;
      height: 4px;
      background: linear-gradient(90deg, var(--el-color-primary) 0%, transparent 100%);
    }
  }
  .el-tabs__item {
    font-size: var(--el-font-size-medium);
    .el-badge {
      .el-badge__content.is-fixed.is-dot {
        right: -4px;
        top: 4px;
      }
    }
  }
}
.el-statistic {
  display: flex;
  align-items: center;
  padding: 8px;

  .el-statistic__icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    margin-right: 16px;
    width: 48px;
    height: 48px;
    font-size: 26px;
    border-radius: var(--el-border-radius-base);
    background-color: var(--el-color-primary-light-9);
    color: var(--el-color-primary);
    > i {
      background-clip: text;
      background-image: linear-gradient(180deg, var(--el-color-primary) 0%, var(--el-color-primary-light-5) 100%);
      color: transparent;
      text-shadow: 0px 4px 8px color-mix(in srgb, var(--el-color-primary) 25%, transparent);
    }
  }

  .el-statistic__content {
    flex: 1;
    min-width: 0;
    overflow: hidden;
  }

  .el-statistic__number {
    margin-bottom: 4px;
    line-height: 1;
    color: var(--el-color-primary);
    font-weight: 700;
     > em {
      font-style: normal;
      font-size: calc(var(--el-font-size-base) * 1.5);
      font-weight: 700;
    }
    > small {
      font-weight: normal;
    }
  }

  .el-statistic__title {
    font-size: var(--el-font-size-base);
    font-weight: var(--el-font-weight-primary);
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }
}

.el-list {
  margin: -8px 0;
  .el-list-item {
    display: flex;
    align-items: center;
    height: 48px;

    .el-list-item__tag {
      margin-right: 8px;
    }

    .el-list-item__date {
      margin-left: 8px;
      font-size: var(--el-font-size-extra-small);
      color: var(--el-text-color-secondary);
    }

    .el-list-item__title {
      flex: 1;
      min-width: 0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
}
</style>
