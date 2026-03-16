<template>
  <div class="el-page">
    <div class="el-anchor__container" ref="containerRef">
      <div class="el-card__wrapper" :id="item.id" v-for="item in anchorData" :key="item.id" :style="{ height: random(400, 1600) + 'px' }">
        <el-card shadow="never">
          <template #header>
            <div class="el-card__title">{{ item.title }}</div>
          </template>
        </el-card>
      </div>
    </div>
    <el-anchor :container="containerRef" direction="vertical" type="default" :offset="0" :marker="false" select-scroll-top @click.stop.prevent="">
      <el-tooltip :content="item.title" placement="left" v-for="item in anchorData" :key="item.id" :show-arrow="false" :offset="8">
        <el-anchor-link :href="`#${item.id}`">
          <i :class="item.icon"></i>
        </el-anchor-link>
       </el-tooltip>
    </el-anchor>
  </div>
</template>
<script setup>
import { ref } from 'vue'
import { random } from 'lodash-es'

defineOptions({
  value: 'vabAnchor',
})

const containerRef = ref(null)
const anchorData = ref([
  { id: 'part1', title: '图书下载量', icon: 'ri-pushpin-fill' },
  { id: 'part2', title: '图书借阅量', icon: 'ri-pushpin-fill' },
  { id: 'part3', title: '图书作者', icon: 'ri-pushpin-fill' },
  { id: 'part4', title: '第三方销售量', icon: 'ri-pushpin-fill' },
  { id: 'part5', title: '图书出版社', icon: 'ri-pushpin-fill' },
])
const handleClick = (e) => {
  e.preventDefault()
}
</script>

<style lang="scss" scoped>
.el-page {
  height: 100%;
}
:deep(.el-card) {
  height: 100%;
  .el-card__header {
    border: 0;
  }
  .el-card__header+.el-card__body {
    padding-top: 0;
  }
}
.el-card__wrapper {
  margin-bottom: 16px;
}
.el-anchor__container {
  position: relative;
  height: calc(100vh - 128px);
  height: 100%;
  overflow-y: auto;
  border-radius: var(--el-border-radius-base);
  &::-webkit-scrollbar {
    width: 0;
    height: 0;
  }
}
:deep(.el-anchor) {
  --el-anchor-bg-color: transparent;
  --el-anchor-padding-indent: 0;
  --el-anchor-line-height: 1;
  --el-anchor-font-size: var(--el-font-size-base);
  --el-anchor-color: var(--el-text-color-placeholder);
  position: fixed;
  top: 50%;
  transform: translateY(-50%);
  right: 32px;
  .el-anchor__item {
    overflow: initial;
  }
  .el-anchor__link {
    margin: 6px 0;
    display: inline-flex !important;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    width: 32px;
    height: 32px;
    border-radius: 100%;
    background-color: var(--el-fill-color-blank);
    box-shadow: 0px 8px 16px 0 rgba(0, 0, 0, 0.1);
  }
}
</style>
