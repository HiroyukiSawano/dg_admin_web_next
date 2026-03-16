<template>
  <div class="el-page" :style="pageView === '1' ? `background: var(--el-fill-color-blank); border-radius: calc(var(--el-border-radius-base)*2); padding: 16px;` : ''">
    <el-card class="el-card--welcome">
      <div class="el-welcome">
        <div class="el-welcome__content">
          <div class="el-media">
            <div class="el-media__icon">
              <el-image :src="welcomeWeather" />
            </div>
            <div class="el-media__content">
              <div class="el-media__title">{{ $translate('ec.locale.ouysaf9s', locales) }}</div>
              <div class="el-media__description">{{ welcomeTime }}</div>
            </div>
          </div>
        </div>
        <div class="el-welcome__action">
          <el-form inline>
            <el-form-item>
              <el-segmented v-model="pageView" :options="[{ label: 'ri-rectangle-fill', value: '1' }, { label: 'ri-function-fill', value: '0' }]">
                <template #default="{ item }">
                  <div class="el-segmented__label"><i :class="item.label"></i></div>
                </template>
              </el-segmented>
            </el-form-item>
            <el-form-item>
              <el-color-picker v-model="color" :predefine="['#427af4', '#69c861', '#efa141', '#e97b77', '#1a94bc', '#207f4c', '#e16723', '#9b1e64', '#2e317c', '#5e616d']" />
            </el-form-item>
          </el-form>
        </div>
      </div>
      <el-row :gutter="16" class="el-statistic-group">
        <el-col :lg="6" v-for="item, index in welcomeData" :key="index" class="el-statistic-column">
          <div class="el-statistic">
            <div class="el-statistic__title"><span>{{ item.name }}</span><i :class="item.icon"></i></div>
            <div class="el-statistic__number">
              <em>{{ item.value }}</em>&ensp;<small>{{ item.unit }}</small>
            </div>
          </div>
        </el-col>
      </el-row>
    </el-card>

    <el-row :gutter="16">
      <el-col :lg="12">
        <el-card>
          <template #header>
            <div class="el-card__title">
              <i class="ri-search-ai-2-fill"></i><span>{{ $translate('ec.locale.6elurskf', locales) }}</span>
            </div>
            <div class="el-card__action">
              <el-segmented v-model="dimensionActive" :options="dimensionData" />
            </div>
          </template>

          <div class="el-card__chart">
             <ec-chart-bar :data="chartBarData" :option="chartBarOption" :name="[$translate('ec.locale.zi2z0o6h', locales), $translate('ec.locale.jhcczz94', locales)]" />
          </div>
        </el-card>
      </el-col>
      <el-col :lg="12">
        <el-card class="el-card--shortcut">
          <template #header>
            <div class="el-card__title">
              <i class="ri-function-add-fill"></i><span>{{ $translate('ec.locale.kzr07wrz', locales) }}</span>
            </div>
            <div class="el-card__action">
              <el-link type="info" underline="never">
                {{ $t('ec.global.button.text.more') }}
                <i class="ri-arrow-right-s-line"></i>
              </el-link>
            </div>
          </template>
          <el-scrollbar>
            <el-row :gutter="16" class="el-well-group">
              <el-col :xs="12" :sm="8" :md="8" :lg="6" class="el-well-column" v-for="item, cindex in appData" :key="cindex">
                <div class="el-well">
                  <div class="el-well__icon" :style="`background: linear-gradient(0deg, ${item.background} 0%, color-mix(in srgb, ${item.background} 75%, transparent) 100%); box-shadow: 0 4px 8px 0 color-mix(in srgb, ${item.background} 50%, transparent);`">
                    <i :class="item.icon"></i>
                  </div>
                  <div class="el-well__title">{{ item.name }}</div>
                </div>
              </el-col>
            </el-row>
          </el-scrollbar>
        </el-card>
      </el-col>
      <el-col :lg="12">
        <el-card class="el-card--tabs" style="height: 368px;">
          <template #header>
            <div class="el-card__title">
              <el-tabs>
                <el-tab-pane v-for="item in bookPacket.categories" :key="item.value" :label="item.label">
                  <template #label>
                    <el-badge :value="item.count" :show-zero="false" is-dot>{{ item.label }}</el-badge>
                  </template>
                </el-tab-pane>
              </el-tabs>
            </div>
          </template>
          <el-table :data="bookPacket.data" row-key="id" height="100%">
            <el-table-column type="selection" width="56" align="center" />
            <el-table-column v-for="column in bookPacket.columns" :key="column.prop" :prop="column.prop" :label="column.label" :width="column.width" :min-width="column.minWidth" :show-overflow-tooltip="column.showOverflowTooltip" :align="column.align">
              <template #default="{ row }">
                <template v-if="column.type === 'link'">
                  <el-text type="primary" truncated>{{ row[column.prop] }}</el-text>
                </template>
                <template v-if="column.type === 'rate'">
                  <el-rate v-model="row.star" class="display-flex" :icons="['ri-star-s-fill', 'ri-star-s-fill', 'ri-star-s-fill']" disabled-void-icon="ri-star-s-fill" void-icon="ri-star-s-fill" disabled />
                </template>
                <template v-if="column.type === 'tag'">
                  <el-tag :type="bookPacket.status.find(s => s.value === row[column.prop])?.type">{{ bookPacket.status.find(t => t.value === row[column.prop])?.label }}</el-tag>
                </template>
                <template v-if="column.type === 'text'">{{ row[column.prop] }}</template>
              </template>
            </el-table-column>
            <el-table-column fixed="right" :label="$t('ec.global.button.text.action')" width="128">
              <template #default>
                <el-button type="primary" link>{{ $t('ec.global.button.text.action') }}</el-button>
                <el-dropdown>
                  <el-button type="primary" link>{{ $t('ec.global.button.text.other') }}</el-button>
                  <template #dropdown>
                    <el-dropdown-menu>
                      <el-dropdown-item>{{ $t('ec.global.button.text.action') }}</el-dropdown-item>
                      <el-dropdown-item>{{ $t('ec.global.button.text.action') }}</el-dropdown-item>
                      <el-dropdown-item>{{ $t('ec.global.button.text.action') }}</el-dropdown-item>
                    </el-dropdown-menu>
                  </template>
                </el-dropdown>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>

      <el-col :lg="12">
        <el-card class="el-card--list" style="height: 368px;">
          <template #header>
            <div class="el-card__title">
              <i class="ri-file-copy-2-fill"></i>
              <span>{{ $translate('ec.locale.814gonwp', locales) }}</span>
            </div>
            <div class="el-card__action">
              <el-link type="info" underline="never">{{ $t('ec.global.button.text.more') }}<i class="ri-arrow-right-s-line"></i></el-link>
            </div>
          </template>
          <el-scrollbar>
            <div class="el-list">
              <div v-for="(item, index) in newsPacket.data" :key="index" class="el-list-item">
                <div class="el-list-item__title">
                  <el-text>{{ item.title }}</el-text>
                  <el-tag :type="newsPacket.tags.find(c => c.value === item.tag)?.type">{{ newsPacket.tags.find(c => c.value === item.tag)?.label }}</el-tag>
                </div>
                <div class="el-list-item__date">{{ item.time }}</div>
              </div>
            </div>
          </el-scrollbar>
        </el-card>
      </el-col>
      <el-col :lg="8">
        <el-card class="el-card--pie" style="height: 368px;">
          <template #header>
            <div class="el-card__title">
              <i class="ri-pie-chart-fill"></i>
              <span>{{ $translate('ec.locale.qwdi69hg', locales) }}</span>
            </div>
            <div class="el-card__action">
            </div>
          </template>
          <ec-chart-pie :data="chartPieData" :option="chartPieOption" :name="$translate('ec.locale.n6p0alah', locales)" />
        </el-card>
      </el-col>
      <el-col :lg="8">
        <el-card class="el-card--schedule" style="height: 368px;">
          <template #header>
            <div class="el-card__title">
              <i class="ri-calendar-schedule-fill"></i>
              <span>{{ $translate('ec.locale.c5wuevcd', locales) }}</span>
            </div>
            <div class="el-card__action">
              <el-link type="primary" underline="never" icon="ri-add-large-line" />
            </div>
          </template>
          <el-date-picker-panel v-model="scheduleTime" :border="false">
            <template #default="{ date, type }">
              <div class="el-date-table-cell">
                <span class="el-date-table-cell__text">{{ formatScheduleDay(date) }}</span>
                <span class="el-date-table-cell__dot" v-if="formatScheduleMark(date).length > 0">
                  <i class="ri-checkbox-blank-circle-fill" v-for="item in formatScheduleMark(date)" :key="item.name" :style="{ color: item.color }"></i>
                </span>
              </div>
            </template>
          </el-date-picker-panel>
        </el-card>
      </el-col>
      <el-col :lg="8">
        <el-card class="el-card--map" style="height: 368px;">
          <template #header>
            <div class="el-card__title">
              <i class="ri-pin-distance-fill"></i>
              <span>{{ $translate('ec.locale.35x9rbcr', locales) }}</span>
            </div>
          </template>
          <baidu-map class="BMap_box" :ak="mapConfig.ak" :v="mapConfig.v" :type="mapConfig.type" :center="mapConfig.center" :double-click-zoom="false" :zoom="mapConfig.zoom">
            <bm-navigation anchor="BMAP_ANCHOR_TOP_RIGHT" />
            <bm-traffic :predictDate="{ weekday: 7, hour: 12 }" />
            <bml-heatmap :data="mapData" :max="100" :radius="20" />
          </baidu-map>
        </el-card>
      </el-col>

      <el-col :lg="12">
        <el-card class="el-card--line" style="height: 368px;">
          <template #header>
            <div class="el-card__title">
              <i class="ri-line-chart-fill"></i><span>{{ $translate('ec.locale.6bqz6c2v', locales) }}</span>
            </div>
            <div class="el-card__form">
              <el-form :model="tableForm" inline>
                <el-form-item>
                  <el-date-picker v-model="tableForm.range" type="daterange" range-separator="-" :start-placeholder="$t('ec.global.form.daterange.start.placeholder')" :end-placeholder="$t('ec.global.form.daterange.end.placeholder')" />
                </el-form-item>
              </el-form>
            </div>
          </template>

          <ec-chart-line :data="chartLineData" :option="chartLineOption" :name="$translate('ec.locale.jhcczz94', locales)" />

        </el-card>
      </el-col>
      <el-col :lg="12">
        <el-card class="el-card--table" style="height: 368px;">
          <template #header>
            <div class="el-card__title">
              <i class="ri-checkbox-multiple-fill"></i>
              <span>{{ $translate('ec.locale.a9d1kgap', locales) }}</span>
            </div>
            <div class="el-card__form">
              <el-form inline :model="tableForm">
                <el-form-item label="" prop="keyword">
                  <el-input v-model="tableForm.keyword" prefix-icon="ri-search-2-line" :placeholder="$t('ec.global.form.search.placeholder')" style="width: 192px;" />
                </el-form-item>
              </el-form>
            </div>
          </template>
          <el-table :data="bookPacket.data" row-key="id" height="100%">
            <el-table-column type="selection" width="56" align="center" />
            <el-table-column v-for="column in bookPacket.columns" :key="column.prop" :prop="column.prop" :label="column.label" :width="column.width" :min-width="column.minWidth" :show-overflow-tooltip="column.showOverflowTooltip" :align="column.align">
              <template #default="{ row }">
                <template v-if="column.type === 'link'">
                  <el-text type="primary" truncated>{{ row[column.prop] }}</el-text>
                </template>
                <template v-if="column.type === 'rate'">
                  <el-rate v-model="row.star" class="display-flex" :icons="['ri-star-s-fill', 'ri-star-s-fill', 'ri-star-s-fill']" disabled-void-icon="ri-star-s-fill" void-icon="ri-star-s-fill" disabled />
                </template>
                <template v-if="column.type === 'tag'">
                  <el-tag :type="bookPacket.status.find(s => s.value === row[column.prop])?.type">{{ bookPacket.status.find(t => t.value === row[column.prop])?.label }}</el-tag>
                </template>
                <template v-if="column.type === 'text'">{{ row[column.prop] }}</template>
              </template>
            </el-table-column>
            <el-table-column fixed="right" :label="$t('ec.global.button.text.action')" width="128">
              <template #default>
                <el-button type="primary" link>{{ $t('ec.global.button.text.action') }}</el-button>
                <el-dropdown>
                  <el-button type="primary" link>{{ $t('ec.global.button.text.other') }}</el-button>
                  <template #dropdown>
                    <el-dropdown-menu>
                      <el-dropdown-item>{{ $t('ec.global.button.text.action') }}</el-dropdown-item>
                      <el-dropdown-item>{{ $t('ec.global.button.text.action') }}</el-dropdown-item>
                      <el-dropdown-item>{{ $t('ec.global.button.text.action') }}</el-dropdown-item>
                    </el-dropdown-menu>
                  </template>
                </el-dropdown>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, onMounted, getCurrentInstance, watch, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useDateFormat, useNow, useCssVar } from '@vueuse/core'
import dayjs from 'dayjs'
import { BaiduMap, BmNavigation, BmTraffic, BmlHeatmap } from 'vue-baidu-map-3x'
import { random } from 'lodash-es'
import EcChartLine from '@/components/EcChartLine'
import EcChartBar from '@/components/EcChartBar'
import EcChartPie from '@/components/EcChartPie'

import { useSystemStore } from '@/stores/modules/systemStore'
import { useStyleStore } from '@/stores/modules/styleStore'

import { apiNewsList, apiBookList, apiBookGenres, apiAppList, apiScheduleList } from '@/services/modules/mockService'

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

const mapConfig = ref({
  ak: 'qxMwDOELvGQDLxEYcde9rTY7Gbx8eXzy',
  v: '3.0',
  type: 'API',
  zoom: 11,
  center: { lng: 116.404, lat: 39.915 }
})
const mapData = ref([
  { lng: 116.418261, lat: 39.921984, count: 50 },
  { lng: 116.423332, lat: 39.916532, count: 51 },
  { lng: 116.419787, lat: 39.930658, count: 15 },
  { lng: 116.418455, lat: 39.920921, count: 40 },
  { lng: 116.418843, lat: 39.915516, count: 100 },
  { lng: 116.42546, lat: 39.918503, count: 6 },
  { lng: 116.423289, lat: 39.919989, count: 18 },
  { lng: 116.418162, lat: 39.915051, count: 80 },
  { lng: 116.422039, lat: 39.91782, count: 11 },
  { lng: 116.41387, lat: 39.917253, count: 7 },
  { lng: 116.41773, lat: 39.919426, count: 42 },
  { lng: 116.421107, lat: 39.916445, count: 4 },
  { lng: 116.417521, lat: 39.917943, count: 27 },
  { lng: 116.419812, lat: 39.920836, count: 23 },
  { lng: 116.420682, lat: 39.91463, count: 60 },
  { lng: 116.415424, lat: 39.924675, count: 8 },
  { lng: 116.419242, lat: 39.914509, count: 15 },
  { lng: 116.422766, lat: 39.921408, count: 25 },
  { lng: 116.421674, lat: 39.924396, count: 21 },
  { lng: 116.427268, lat: 39.92267, count: 1 },
  { lng: 116.417721, lat: 39.920034, count: 51 },
  { lng: 116.412456, lat: 39.92667, count: 7 },
  { lng: 116.420432, lat: 39.919114, count: 11 },
  { lng: 116.425013, lat: 39.921611, count: 35 },
  { lng: 116.418733, lat: 39.931037, count: 22 },
  { lng: 116.419336, lat: 39.931134, count: 4 },
  { lng: 116.413557, lat: 39.923254, count: 5 },
  { lng: 116.418367, lat: 39.92943, count: 3 },
  { lng: 116.424312, lat: 39.919621, count: 100 },
  { lng: 116.423874, lat: 39.919447, count: 87 },
  { lng: 116.424225, lat: 39.923091, count: 32 },
  { lng: 116.417801, lat: 39.921854, count: 44 },
  { lng: 116.417129, lat: 39.928227, count: 21 },
  { lng: 116.426426, lat: 39.922286, count: 80 },
  { lng: 116.421597, lat: 39.91948, count: 32 },
  { lng: 116.423895, lat: 39.920787, count: 26 },
  { lng: 116.423563, lat: 39.921197, count: 17 },
  { lng: 116.417982, lat: 39.922547, count: 17 },
  { lng: 116.426126, lat: 39.921938, count: 25 },
  { lng: 116.42326, lat: 39.915782, count: 100 },
  { lng: 116.419239, lat: 39.916759, count: 39 },
  { lng: 116.417185, lat: 39.929123, count: 11 },
  { lng: 116.417237, lat: 39.927518, count: 9 },
  { lng: 116.417784, lat: 39.915754, count: 47 },
  { lng: 116.420193, lat: 39.917061, count: 52 },
  { lng: 116.422735, lat: 39.915619, count: 100 },
  { lng: 116.418495, lat: 39.915958, count: 46 },
  { lng: 116.416292, lat: 39.931166, count: 9 },
  { lng: 116.419916, lat: 39.924055, count: 8 },
  { lng: 116.42189, lat: 39.921308, count: 11 },
  { lng: 116.413765, lat: 39.929376, count: 3 },
  { lng: 116.418232, lat: 39.920348, count: 50 },
  { lng: 116.417554, lat: 39.930511, count: 15 },
  { lng: 116.418568, lat: 39.918161, count: 23 },
  { lng: 116.413461, lat: 39.926306, count: 3 },
  { lng: 116.42232, lat: 39.92161, count: 13 },
  { lng: 116.4174, lat: 39.928616, count: 6 },
  { lng: 116.424679, lat: 39.915499, count: 21 },
  { lng: 116.42171, lat: 39.915738, count: 29 },
  { lng: 116.417836, lat: 39.916998, count: 99 },
  { lng: 116.420755, lat: 39.928001, count: 10 },
  { lng: 116.414077, lat: 39.930655, count: 14 },
  { lng: 116.426092, lat: 39.922995, count: 16 },
  { lng: 116.41535, lat: 39.931054, count: 15 },
  { lng: 116.413022, lat: 39.921895, count: 13 },
  { lng: 116.415551, lat: 39.913373, count: 17 },
  { lng: 116.421191, lat: 39.926572, count: 1 },
  { lng: 116.419612, lat: 39.917119, count: 9 },
  { lng: 116.418237, lat: 39.921337, count: 54 },
  { lng: 116.423776, lat: 39.921919, count: 26 },
  { lng: 116.417694, lat: 39.92536, count: 17 },
  { lng: 116.415377, lat: 39.914137, count: 19 },
  { lng: 116.417434, lat: 39.914394, count: 43 },
  { lng: 116.42588, lat: 39.922622, count: 27 },
  { lng: 116.418345, lat: 39.919467, count: 8 },
  { lng: 116.426883, lat: 39.917171, count: 3 },
  { lng: 116.423877, lat: 39.916659, count: 34 },
  { lng: 116.415712, lat: 39.915613, count: 14 },
  { lng: 116.419869, lat: 39.931416, count: 12 },
  { lng: 116.416956, lat: 39.925377, count: 11 },
  { lng: 116.42066, lat: 39.925017, count: 38 },
  { lng: 116.416244, lat: 39.920215, count: 91 },
  { lng: 116.41929, lat: 39.915908, count: 54 },
  { lng: 116.422116, lat: 39.919658, count: 21 },
  { lng: 116.4183, lat: 39.925015, count: 15 },
  { lng: 116.421969, lat: 39.913527, count: 3 },
  { lng: 116.422936, lat: 39.921854, count: 24 },
  { lng: 116.41905, lat: 39.929217, count: 12 },
  { lng: 116.424579, lat: 39.914987, count: 57 },
  { lng: 116.42076, lat: 39.915251, count: 70 },
  { lng: 116.425867, lat: 39.918989, count: 8 }
])

const pageView = ref('0')

const dimensionActive = ref('1')
const dimensionData = ref([
  { label: computed(() => proxy.$translate('ec.locale.6axusr2w', locales)), value: '1' },
  { label: computed(() => proxy.$translate('ec.locale.34mg4dbk', locales)), value: '2' },
  { label: computed(() => proxy.$translate('ec.locale.wbkxzgv6', locales)), value: '3' },
])


const welcomeWeather = new URL('@/assets/images/weather/weather-drizzle-rain.png', import.meta.url).href
const welcomeTime = useDateFormat(useNow(), 'YYYY-MM-DD HH:mm:ss dddd', { locales: 'zh-CN' })
const welcomeData = ref([
  { name: computed(() => proxy.$translate('ec.locale.7z1tribl', locales)), value: random(8, 88), icon: 'ri-shopping-bag-2-fill', unit: '' },
  { name: computed(() => proxy.$translate('ec.locale.i1duogul', locales)), value: random(8, 888), icon: 'ri-parent-fill', unit: '' },
  { name: computed(() => proxy.$translate('ec.locale.4ctt1tap', locales)), value: random(8, 888), icon: 'ri-search-ai-2-fill', unit: '' },
  { name: computed(() => proxy.$translate('ec.locale.jr93nu2m', locales)), value: random(8, 88), icon: 'ri-calendar-schedule-fill', unit: 'h' },
])



const tableForm = ref({
  keyword: '',
  type: '',
  range: []
})

const chartBarData = ref([
  { name: '10.1', download: random(8, 88), borrow: random(8, 88) },
  { name: '10.2', download: random(8, 88), borrow: random(8, 88) },
  { name: '10.3', download: random(8, 88), borrow: random(8, 88) },
  { name: '10.4', download: random(8, 88), borrow: random(8, 88) },
  { name: '10.5', download: random(8, 88), borrow: random(8, 88) },
  { name: '10.6', download: random(8, 88), borrow: random(8, 88) },
  { name: '10.7', download: random(8, 88), borrow: random(8, 88) },
])
const chartBarOption = ref({
  legend: {
    show: true,
    top: 0,
  },
  grid: {
  },
  series: [
    { barWidth: 8 },
    { barWidth: 8 },
  ],
})
const chartLineData = ref([
  { name: '10.1', value: random(8, 88) },
  { name: '10.2', value: random(8, 88) },
  { name: '10.3', value: random(8, 88) },
  { name: '10.4', value: random(8, 88) },
  { name: '10.5', value: random(8, 88) },
  { name: '10.6', value: random(8, 88) },
  { name: '10.7', value: random(8, 88) },
  { name: '10.8', value: random(8, 88) },
  { name: '10.9', value: random(8, 88) },
  { name: '10.10', value: random(8, 88) },
  { name: '10.11', value: random(8, 88) },
  { name: '10.12', value: random(8, 88) },
  { name: '10.13', value: random(8, 88) },
  { name: '10.14', value: random(8, 88) },
  { name: '10.15', value: random(8, 88) },
])
const chartLineOption = ref({
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

const { color } = storeToRefs(useStyleStore())
const { language } = storeToRefs(useSystemStore())
watch(color, (val) => {
  chartLineOption.value.series[0].areaStyle.color.colorStops = [
    { offset: 0, color: val },
    { offset: 1, color: 'rgba(255,255,255,.0)' },
  ]
}, { immediate: true })


const newsPacket = ref({
  data: [],
  tags: [],
  categories: []
})
const fetchNewsData = async () => {
  const { data: { data = [], categories = [], tags = [] }} = await apiNewsList({ locale: language.value }) || {}
  newsPacket.value.tags = tags
  newsPacket.value.categories = categories
  newsPacket.value.data = data
}

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

const appData = ref([])
const fetchAppData = async () => {
  const { data: { data = [] }} = await apiAppList({ locale: language.value }) || {}
  appData.value = data
}

const scheduleData = ref([])
const scheduleTime = ref()
const formatScheduleMark = (date) => {
  const day = dayjs(date).format('YYYY-MM-DD')
  return scheduleData.value.filter(item => item.date === day)
}
const formatScheduleDay = (date) => {
  const day = dayjs(date).format('YYYY-MM-DD')
  return parseInt(day.split('-')[2], 10)
}
const fetchScheduleData = async () => {
  const { data: { data = [] }} = await apiScheduleList({ locale: language.value }) || {}
  scheduleData.value = data
}

const bookPacket = ref({
  data: [],
  status: [],
  columns: [],
  categories: [],
})
const fetchBookData = async () => {
  const { data: { source = [], columns = [], categories = [], status = [] } } = apiBookList({ locale: language.value }) || {}
  bookPacket.value.status = status
  bookPacket.value.data = source
  bookPacket.value.columns = columns
  bookPacket.value.categories = categories
}
watch(language, async () => {
  fetchNewsData()
  fetchBookData()
  fetchAppData()
  fetchGenresData()
  fetchScheduleData()
}, { immediate: true })
</script>

<style lang="scss" scoped>

:deep(.el-table) {
  .cell {
    line-height: 31px;
    .el-text {
      display: initial;
    }
  }
}
:deep(.el-card) {
  display: flex;
  flex-direction: column;
  z-index: 0;
  overflow: hidden;
  .el-card__header {
    border-bottom: 0;
  }
  .el-card__header+.el-card__body {
    padding-top: 0;
  }
  .el-card__body {
    flex: 1;
    height: 100%;
    min-height: 0;
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
  .el-card__title {
    display: flex;
    align-items: center;
    > i {
      margin-right: 8px;
      height: 22px;
      width: 22px;
      flex-shrink: 0;
      font-size: var(--el-font-size-base);
      background: linear-gradient(180deg, var(--el-color-primary-light-3) 0%, var(--el-color-primary) 100%);
      box-shadow: 0px 4px 4px color-mix(in srgb, var(--el-color-primary) 15%, transparent);
      color: var(--el-color-white);
      border-radius: var(--el-border-radius-base);
    }
  }
  .el-card__chart {
    height: 296px;
  }
}
.el-card.el-card--tabs {
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
}
.el-card.el-card--welcome {
  background: var(--el-fill-color-blank) url('@/assets/images/dashboard/dashboard-card-welcome-background.png') left bottom / cover no-repeat;
  .el-card__body {
  }
  &::before {
    content: '';
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background: linear-gradient(180deg, transparent 0%, color-mix(in srgb, var(--el-color-primary) 20%, transparent) 100%);
    z-index: -1;
  }
  .el-statistic-group {

    .el-statistic {
      display: flex;
      flex-direction: column;
      justify-content: center;
      height: 112px;
      margin-top: 16px;
      padding: 0 24px;
      background: color-mix(in srgb, var(--el-fill-color-blank) 65%, transparent);
      // backdrop-filter: blur(4px);
      border-radius: var(--el-border-radius-base);
      .el-statistic__number {
        // line-height: 1;
        > em {
          font-style: normal;
          font-size: calc(var(--el-font-size-medium) * 1.5);
          font-weight: 700;
        }
      }
      .el-statistic__title {
        display: flex;
        align-items: center;
        font-size: var(--el-font-size-base);
        font-weight: var(--el-font-weight-primary);
        > span {
          flex: 1;
          min-width: 0;
          color: var(--el-text-color-regular);
          white-space: nowrap;
          text-overflow: ellipsis;
          overflow: hidden;
        }
        > i {
          font-size: 28px;
          -webkit-background-clip: text;
          background-clip: text;
          background-image: linear-gradient(180deg, var(--el-color-primary) 0%, var(--el-color-primary-light-5) 100%);
          color: transparent;
          text-shadow: 0px 4px 8px color-mix(in srgb, var(--el-color-primary) 25%, transparent);
        }
      }
    }
  }
  .el-welcome {
    display: flex;
    align-items: center;
    height: 64px;
    .el-welcome__avatar {
      display: flex;
      margin-right: 16px;
      .el-avatar {
        background-color: var(--el-text-color-disabled);
      }
    }
    .el-welcome__title {
      font-size: var(--el-font-size-extra-large);
      font-weight: 600;
    }
    .el-welcome__descriotion {
      color: var(--el-text-color-secondary);
    }
    .el-welcome__content {
      flex: 1;
    }
    .el-welcome__action {
      flex-shrink: 0;
      :deep(.el-segmented) {
        .el-segmented__item {
          padding: 0 8px;
        }
      }
      :deep(.el-color-picker) {
        .el-color-picker__trigger {
          padding: 2px;
        }
      }
    }
  }
  .el-media {
    display: flex;
    align-items: center;
    .el-media__title {
      font-size: var(--el-font-size-extra-large);
      font-weight: 600;
    }
    .el-media__description {
      color: var(--el-text-color-secondary);
    }
    .el-media__icon {
      margin-right: 8px;
      width: 64px;
      height: 64px;
      flex-shrink: 0;
      .el-image {
        width: 64px;
        height: 64px;
        transform: scale(1.5);
      }
    }
  }
  .el-form.el-form--inline {
    .el-button.is-circle {
      border-radius: var(--el-border-radius-base);
    }
  }
}
.el-card.el-card--list {
  .el-list {
    padding-left: 16px;
    .el-list-item {
      position: relative;
      padding: 8px 0;
      cursor: pointer;
      &:hover {
        color: var(--el-color-primary);
        .el-list-item__title {
          .el-text {
            color: inherit;
          }
        }
      }

      .el-list-item__date {
        font-size: var(--el-font-size-extra-small);
        color: var(--el-text-color-secondary);
        line-height: 1.65;
      }

      .el-list-item__title {
        position: relative;
        display: flex;
        align-items: center;
        .el-text {
          min-width: 0;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .el-tag {
          margin-left: 8px;
        }
        &::before {
          content: "";
          width: 6px;
          height: 6px;
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          left: -14px;
          background-color: var(--el-color-primary);
          border-radius: 100%;
        }
      }
    }
  }
}
.el-card.el-card--shortcut {
  min-height: 368px;
  :deep(.el-scrollbar) {
    .el-scrollbar__view {
      height: 100%;
    }
  }
  .el-well-group {
    height: 100%;
    width: 100%;
    .el-well {
      height: 100%;
      width: 100%;
      min-height: 96px;
      padding: 12px 0;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      line-height: 1;
      text-align: center;
      .el-well__icon {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        height: 32px;
        width: 32px;
        color: var(--el-color-white);
        font-size: var(--el-font-size-extra-large);
        border-radius: var(--el-border-radius-base);
      }
      .el-well__title {
        margin-top: 12px;
        width: 100%;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;

      }
    }
  }
}
.el-card.el-card--schedule {
  height: 368px;
  overflow: hidden;
  :deep(.el-date-picker) {
    width: 100%;
    height: 100%;
    background: linear-gradient(180deg, var(--el-color-primary-light-9) 0%, rgba(255, 255, 255, 1) 15%);
    .el-picker-panel__content {
      width: 100%;
    }
    .el-picker-panel__body-wrapper {
      height: 100%;
      width: 100%;
    }
    .el-picker-panel__body {
      display: flex;
      flex-direction: column;
      height: 100%;
      width: 100%;
    }
    .el-picker-panel__content {
      flex: 1;
      min-width: 0;
      margin: 0;
    }
    .el-date-picker__header {
      padding: 6px 12px 0 12px;
      // background-color: var(--el-color-primary-light-9);
    }
    .el-date-table {
      height: 100%;
      font-size: var(--el-font-size-extra-small);
      th,
      td {
        height: initial;
        width: initial;
        padding: 2px;
      }
      th {
        border-bottom-color: var(--el-border-color-extra-light);
      }
      .el-date-table-cell {
        position: relative;
        height: 32px;
        padding: 0;
        // height: initial;
      }
      .el-date-table-cell__text {
        height: 32px;
        width: 32px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
        border-radius: 0;
        border-radius: 100%;
      }
      .el-date-table-cell__dot {
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
        bottom: 2px;
        display: flex;
        justify-content: center;
        align-items: center;
        > i + i {
          margin-left: 2px;
        }
        > i {
          font-size: 6px;
        }
      }
      .current .el-date-table-cell__dot {
        > i {
          // color: var(--el-color-white) !important;
        }
      }
      .today .el-date-table-cell__text {
        background-color: var(--el-color-primary-light-8);
      }
    }
  }
}
.el-card.el-card--map {
  :deep(.BMap_box) {
    height: 100%;
    border-radius: var(--el-border-radius-base);
    overflow: hidden;
    .anchorBL {
      display: none;
    }
  }
}

</style>
