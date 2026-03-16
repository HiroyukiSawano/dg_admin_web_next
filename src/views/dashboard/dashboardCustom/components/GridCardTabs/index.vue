<template>
  <div class="el-card__wrapper">
    <el-card>
      <template #header>
        <div class="el-card__title">
          <el-tabs v-model="tabsActive">
            <el-tab-pane v-for="item in props.record.options.options" :key="item.value" :label="item.label" :name="item.value">
              <template #label>
                <el-badge :value="item.count" :show-zero="false" is-dot>{{ item.label }}</el-badge>
              </template>
            </el-tab-pane>
          </el-tabs>
        </div>
        <div class="el-card__form">
        </div>
      </template>

      <el-table :data="props.record.options.data.source" row-key="id" height="100%">
        <el-table-column type="selection" width="56" align="center" />
        <el-table-column v-for="column in props.record.options.data.columns" :key="column.prop" :prop="column.prop" :label="column.label" :width="column.width" :min-width="column.minWidth" :show-overflow-tooltip="column.showOverflowTooltip" :align="column.align">
          <template #default="{ row }">
            <template v-if="column.type === 'link'">
              <el-text type="primary" truncated>{{ row[column.prop] }}</el-text>
            </template>
            <template v-if="column.type === 'rate'">
              <el-rate v-model="row.star" class="display-flex" :icons="['ri-star-s-fill', 'ri-star-s-fill', 'ri-star-s-fill']" disabled-void-icon="ri-star-s-fill" void-icon="ri-star-s-fill" disabled />
            </template>
            <template v-if="column.type === 'tag'">
              <el-tag :type="props.record.options.status.find(s => s.value === row[column.prop])?.type">{{ props.record.options.status.find(t => t.value === row[column.prop])?.label }}</el-tag>
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
  </div>
</template>
<script setup>
import { ref } from 'vue'
import config from './config'
defineOptions({
  name: 'GridCardTabs',
  config
})
const props = defineProps({
  record: {
    type: Object,
  },
})

const tabsActive = ref(props.record?.options?.default || '')

const formaterColumn = (script, row, value) => {
  if (script) {
    try {
      const fn = eval(script)
      return fn(row, undefined, value, undefined)
    } catch (error) {
      console.error('Formatter execution error:', error)
      return value
    }
  }
  return value
}
</script>
<style lang="scss" scoped>
:deep(.el-card) {
  .el-card__title {
    // overflow: hidden;
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
    // display: none;
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
    padding: 0 16px;
    font-size: var(--el-font-size-medium);
    .el-badge {
      .el-badge__content.is-fixed.is-dot {
        right: -4px;
        top: 4px;
      }
    }
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

</style>
