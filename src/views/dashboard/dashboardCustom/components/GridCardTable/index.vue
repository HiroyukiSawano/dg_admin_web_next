<template>
  <div class="el-card__wrapper">
    <el-card>
      <template #header>
        <div class="el-card__title">
          <i v-if="props.record.icon !== ''" :class="props.record.icon"></i>
          <span>{{ props.record.title }}</span>
        </div>
        <div class="el-card__form">

        </div>
      </template>
      <el-form inline :model="tableForm">
        <el-form-item label="" prop="keyword">
          <el-input v-model="tableForm.keyword" prefix-icon="el-icon-search" :placeholder="$t('ec.global.form.search.placeholder')" style="width: 192px;" />
        </el-form-item>
        <el-form-item label="" prop="type">
          <el-select v-model="tableForm.type" :placeholder="$t('ec.global.form.select.placeholder')+$translate('ec.mock.2w3tgxvm', locales)" style="width: 192px;">
            <el-option v-for="item in props.record.options.status" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
          <!-- <el-date-picker v-model="tableForm.range" type="daterange" prefix-icon="ri-calendar-line" range-separator="至" start-placeholder="请选择开始日期" end-placeholder="请选择结束日期" style="width: 352px;" /> -->
        </el-form-item>
        <el-form-item class="margin-right-auto">
          <el-button type="primary">{{ $t('ec.global.button.text.search') }}</el-button>
          <el-button>{{ $t('ec.global.button.text.reset') }}</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary">{{ $t('ec.global.button.text.primary') }}{{ $t('ec.global.button.text.action') }}</el-button>
          <el-dropdown>
            <el-button>{{ $t('ec.global.button.text.action') }}</el-button>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item>{{ $t('ec.global.button.text.action') }}</el-dropdown-item>
                <el-dropdown-item>{{ $t('ec.global.button.text.action') }}</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </el-form-item>
      </el-form>
      <el-table :data="props.record.options.data.source" row-key="id" height="100%">
        <el-table-column type="selection" width="56" align="center" />
        <el-table-column v-for="column in props.record.options.data.columns" :key="column.prop" :prop="column.prop" :label="column.label" :width="column.width" :min-width="column.minWidth" :show-overflow-tooltip="column.showOverflowTooltip" :align="column.align">
          <template #default="{ row }">
            <template v-if="column.type === 'link'">
              <el-text type="primary" truncated>{{ row[column.prop] }}</el-text>
            </template>
            <span v-if="column.type === 'rate'">
              <el-rate v-model="row.star" class="display-flex" :icons="['ri-star-s-fill', 'ri-star-s-fill', 'ri-star-s-fill']" disabled-void-icon="ri-star-s-fill" void-icon="ri-star-s-fill" disabled />
            </span>
            <span v-if="column.type === 'tag'">
              <el-tag :type="props.record.options.status.find(t => t.value === row[column.prop])?.type">{{ props.record.options.status.find(s => s.value === row[column.prop])?.label }}</el-tag>
            </span>
            <span v-if="column.type === 'text'">{{ row[column.prop] }}</span>
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
  </div>
</template>
<script setup>
import { ref } from 'vue'
import config from './config'
defineOptions({
  name: 'GridCardTable',
  config
})
const props = defineProps({
  record: {
    type: Object,
  },
})
const locales = {
  'en': {
    'ec.mock.im4o3co2': 'Book',
    'ec.mock.nx5mgkhs': 'Book Summary',
    'ec.mock.uh5iiqal': 'Book Author',
    'ec.mock.msblp9jw': 'Book Level',
    'ec.mock.2w3tgxvm': 'Book Status',
    'ec.mock.t5z17gmq': 'Book Publish Date',
  },
  'zh-CN': {
    'ec.mock.im4o3co2': '图书',
    'ec.mock.nx5mgkhs': '图书摘要',
    'ec.mock.uh5iiqal': '图书作者',
    'ec.mock.msblp9jw': '图书等级',
    'ec.mock.2w3tgxvm': '图书状态',
    'ec.mock.t5z17gmq': '图书出版日期',
  },
}
const tableForm = ref({
  keyword: '',
  type: '',
  range: []
})

</script>
<style lang="scss" scoped>
:deep(.el-card) {
  .el-card__body {
    display: flex;
    flex-direction: column;
  }
}
:deep(.el-table) {
  .cell {
    line-height: 31px;
    .el-text {
      display: initial;
    }
  }
}
:deep(.el-form.el-form--inline) {
  padding-bottom: 16px;
}
</style>
