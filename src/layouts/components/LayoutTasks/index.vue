<template>
  <div class="el-block">
    <div class="el-block__header">
      <div class="el-block__title"><el-segmented v-model="dimension" :options="dimensions" /></div>
      <div class="el-block__action">
        <el-link>一键已读</el-link>
      </div>
    </div>
    <div class="el-block__body">
      <div class="el-list">
        <div class="el-list-item" v-for="item, index in messages" :key="index">
          <div class="el-list-item__title">
            <i :class="item.icon" :style="{ background: item.color }"></i>
            <span>{{ item.title }}</span>
            <time>{{ item.time }}</time>
          </div>
          <div v-if="item.description" class="el-list-item__description">
            {{ item.description }}
          </div>
        </div>
      </div>
      <el-button class="width-100">查看所有消息</el-button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useSystemStore } from '@/stores/modules/systemStore'
defineOptions({ name: 'LayoutMessage' })
const { device } = storeToRefs(useSystemStore())
const dimension = ref('2')
const dimensions = ref([
  // { label: '全部', value: '1' },
  { label: '未读', value: '2' },
  { label: '已读', value: '3' },
  { label: '其他', value: '4' }
])
const messages = ref([
  {
    id: '22xx0iet-6i2n-r4g9-rnyu-1edfvy5rj19y',
    type: 'user',
    icon: 'ri-pushpin-fill',
    color: '#57A8FF',
    title: '王国维年假申请审批提报',
    description: '王国维年假申请审批提报王国维年假申请审批提报王国维年假申请审批提报王国维年假申请审批提报',
    time: '8分钟前',
  },
  {
    id: 'w23oe0cn-9yuq-9xli-c2u9-8nuvl3900fl8',
    type: 'user',
    icon: 'ri-eye-close-fill',
    color: '#5CC890',
    title: '王国维年假申请审批提报',
    description: '来自微软中国来自微软中国来自微软中国来自微软中国来自微软中国来自微软中国来自微软中国',
    time: '25分钟前',
  },
  {
    id: 'xe28yhld-skjb-sfkj-l0pc-shwg51xiok8p',
    type: 'system',
    icon: 'ri-aed-electrodes-fill',
    color: '#7F81F3',
    title: '来源未知的匿名信息',
    description: '来自微软中国来自微软中国来自微软中国',
    time: '2025年01月14日',
  },
  {
    id: 'qro4167e-e787-8zqt-k4wu-4ue75z589ktt',
    type: 'system',
    icon: 'ri-drinks-2-fill',
    color: '#BABABA',
    title: '长江口二号古船进舱',
    description: '长江口二号古船进舱长江口二号古船进舱长江口二号古船进舱长江口二号古船进舱',
    time: '2025年01月14日',
  },
  {
    id: '3eb6xc6y-wma1-2z8i-3e41-q3c06ufp4lam',
    type: 'system',
    icon: 'ri-base-station-fill',
    color: '#EB666A',
    title: '长江口二号古船进舱',
    description: '长江口二号古船进舱长江口二号古船进舱长江口二号古船进舱',
    time: '2025年01月14日',
  },
])

</script>

<style lang="scss" scoped>
.el-empty {
  height: 100%;
}
.el-block {
  width: 448px;
  .el-block__header,
  .el-block__body {
    padding: 16px;
  }
  .el-block__header+.el-block__body {
    padding-top: 0;
  }
  .el-block__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
}

.el-list {
  margin-bottom: 8px;
  .el-list-item {
    padding: 12px 0;
    .el-list-item__title {
      display: flex;
      align-items: center;
      font-size: var(--el-font-size-base);
      > i {
        flex-shrink: 0;
        margin-right: 8px;
        width: 20px;
        height: 20px;
        color: var(--el-color-white);
        border-radius: var(--el-border-radius-base);

      }
      > span {
        flex: 1;
        min-width: 0;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
        font-weight: 500;
      }
      > time {
        color: var(--el-text-color-secondary);
      }
    }
    .el-list-item__description {
      margin-top: 8px;
      font-size: var(--el-font-size-extra-small);
      color: var(--el-text-color-secondary);
    }
  }
}
</style>
