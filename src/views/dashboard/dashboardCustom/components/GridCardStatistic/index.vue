<template>
  <div class="el-card__wrapper">
    <el-card>
      <div class="el-statistic">
        <div class="el-statistic__icon">
          <i :class="props.record.options.data.icon"></i>
        </div>
        <div class="el-statistic__content">
          <div class="el-statistic__number">
            <em>{{ props.record.options.data.value }}</em>
          </div>
          <div class="el-statistic__title">{{ props.record.options.data.name }}</div>
        </div>
      </div>
    </el-card>
  </div>
</template>
<script setup>
import { ref } from 'vue'
import config from './config'
defineOptions({
  name: 'GridCardStatistic',
  config
})
const props = defineProps({
  record: {
    type: Object
  },
})
</script>
<style lang="scss" scoped>

:deep(.el-card) {
  .el-card__body {
    padding: 24px;
  }
}
.el-statistic {
  display: flex;
  align-items: center;
  height: 100%;
  width: 100%;
  .el-statistic__icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    margin-right: 16px;
    width: 48px;
    height: 48px;
    border-radius: var(--el-border-radius-base);
    background-color: var(--el-color-primary-light-9);
    color: var(--el-color-primary);
    > i {
      font-size: 28px;
      -webkit-background-clip: text;
      background-clip: text;
      background-image: linear-gradient(180deg, var(--el-color-primary) 0%, var(--el-color-primary-light-5) 100%);
      color: transparent;
      text-shadow: 0px 4px 8px color-mix(in srgb, var(--el-color-primary) 25%, transparent);
    }
  }
  .el-statistic__content {
    min-width: 0;
    flex: 1;
    overflow: hidden;
  }
  .el-statistic__number {
    margin-bottom: 4px;
    line-height: 1;
    > em {
      margin-bottom: 4px;
      line-height: 1;
      color: var(--el-color-primary);
      font-style: normal;
      font-size: calc(var(--el-font-size-base) * 1.5);
      font-weight: 600;
    }
  }
  .el-statistic__title {
    font-size: var(--el-font-size-base);
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }
}
</style>
