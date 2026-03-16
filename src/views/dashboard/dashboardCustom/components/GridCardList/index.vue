<template>
  <div class="el-card__wrapper">
    <el-card>
      <template #header>
        <div class="el-card__title">
          <i v-if="props.record.icon !== ''" :class="props.record.icon"></i>
          <span>{{ props.record.title }}</span>
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
          <div class="el-list-item" v-for="item, index in props.record.options.data.source" :key="index">
            <div class="el-list-item__tag">
              <el-tag :type="props.record.options.tags.find(t => t.value === item.tag)?.type">{{ props.record.options.tags.find(t => t.value === item.tag)?.label }}</el-tag>
            </div>
            <div class="el-list-item__title">{{ item.title }}</div>
            <div class="el-list-item__time">{{ item.time }}</div>
          </div>
        </div>
      </el-scrollbar>
    </el-card>
  </div>
</template>
<script setup>

import config from './config'
defineOptions({
  name: 'GridCardList',
  config
})
const props = defineProps({
  record: {
    type: Object,
  },
})

</script>
<style lang="scss" scoped>
.el-list {
  margin-top: -6px;
  .el-list-item {
    display: flex;
    align-items: center;
    height: 44px;
    .el-list-item__tag {
      margin-right: 8px;
    }
    .el-list-item__title {
      flex: 1;
      overflow: hidden;
      min-width: 0;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .el-list-item__time {
      margin-left: 16px;
      text-align: right;
      color: var(--el-text-color-secondary);
    }
  }
}
</style>
