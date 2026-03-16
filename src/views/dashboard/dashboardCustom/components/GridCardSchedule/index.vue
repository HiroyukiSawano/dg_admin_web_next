<template>
  <div class="el-card__wrapper">
    <el-card>
      <template #header>
        <div class="el-card__title">
          <i v-if="props.record.icon !== ''" :class="props.record.icon"></i>
          <span>{{ props.record.title }}</span>
        </div>
        <div class="el-card__action">
          <el-link type="info" underline="never" icon="ri-add-line" />
        </div>
      </template>
      <el-date-picker-panel v-model="currentDate" :border="false">
        <template #default="{ date, type }">
          <el-popover v-if="matter(date).length > 0" :width="240" trigger="hover" placement="top" :title="matter(date)[0].title" :content="matter(date)[0].content">
            <template #reference>
              <div class="el-date-table-cell">
                <span class="el-date-table-cell__text">{{ day(date) }}</span>
                <span class="el-date-table-cell__dot" v-if="matter(date).length > 0">
                  <i class="ri-checkbox-blank-circle-fill" v-for="item in matter(date)" :key="item.name" :style="{ color: item.color }"></i>
                </span>
              </div>
            </template>
          </el-popover>
        </template>
      </el-date-picker-panel>
    </el-card>
  </div>
</template>
<script setup>
import { computed, ref, watch } from 'vue'
import dayjs from 'dayjs'
import config from './config'
defineOptions({
  name: 'GridCardSchedule',
  config
})
const props = defineProps({
  record: {
    type: Object,
  },
})
const matter = (date) => {
  const day = dayjs(date).format('YYYY-MM-DD')
  return props.record.options.data.source.filter(item => item.date === day)
}
const day = (date) => {
  const day = dayjs(date).format('YYYY-MM-DD')
  return parseInt(day.split('-')[2], 10)
}
const currentDate = ref()

</script>
<style lang="scss" scoped>
.el-card {

}
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
    .today.current .el-date-table-cell__text {
      background-color: var(--el-color-primary);
    }
  }
}
</style>
