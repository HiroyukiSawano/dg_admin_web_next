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
        <el-row :gutter="16" class="el-well-group">
          <el-col :xs="12" :sm="8" :md="8" :lg="6" class="el-well-column" v-for="item, cindex in props.record.options.data.source" :key="cindex">
            <div class="el-well">
              <div class="el-well__icon" :style="`background: linear-gradient(0deg, ${item.background} 0%, color-mix(in srgb, ${item.background} 75%, transparent) 100%); box-shadow: 0 4px 8px 0 color-mix(in srgb, ${item.background} 50%, transparent);`">
                <i :class="item.icon"></i>
              </div>
              <div class="el-well__title">{{ item.name }}</div>
            </div>
          </el-col>
        </el-row>
      </el-scrollbar>
      <!-- <el-carousel trigger="click" arrow="never" height="100%" :autoplay="false" :indicator-position="shortcuts.length > 1 ? '' : 'none'">
        <el-carousel-item v-for="item, index in shortcuts" :key="index">
          <el-row class="el-well-group">
            <el-col :span="6" class="el-well-column" v-for="citem, cindex in item" :key="cindex">
              <div class="el-well">
                <div class="el-well__icon" :style="`background: ${citem.background};`">
                  <i :class="citem.icon"></i>
                </div>
                <div class="el-well__title">{{ citem.name }}</div>
              </div>
            </el-col>
          </el-row>
        </el-carousel-item>
      </el-carousel> -->
    </el-card>
  </div>
</template>
<script setup>
import { computed, ref, watch } from 'vue'
import { cloneDeep, chunk } from 'lodash-es'
import config from './config'
defineOptions({
  name: 'GridCardShortcut',
  config
})
const props = defineProps({
  record: {
    type: Object,
  },
})
const shortcuts = computed(() => {
  const data = cloneDeep(props.record.options.data.source)
  return chunk(data, props.record.h * 4)
})
console.log(shortcuts.value)
</script>
<style lang="scss" scoped>
:deep(.el-scrollbar) {
  .el-scrollbar__view {
    height: 100%;
  }
}

:deep(.el-carousel) {
  height: 100%;
  width: 100%;
  --el-carousel-indicator-padding-vertical: 0;
  .el-carousel__indicators {
    display: flex;
    align-items: center;
    --el-carousel-indicator-width: 6px;
    --el-carousel-indicator-height: 6px;
  }
  .el-carousel__item {
    // border: 1px solid red;
  }
  .el-carousel__button {
    background-color: var(--el-color-primary-light-3);
  }
  .el-carousel__indicator {
    &.is-active {
      .el-carousel__button {
        background-color: var(--el-color-primary);
      }
    }
  }
}
.el-well-group {
  height: 100%;
  width: 100%;
  .el-well {
    height: 100%;
    width: 100%;
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
      font-size: 18px;
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

</style>
