<template>
  <el-breadcrumb  separator-icon="ri-subtract-line">
    <!-- <span class="el-breadcrumb__title">{{ $t(route.meta.title || '') }}</span> -->
    <template v-for="(item, index) in breadcrumbs" :key="index">
      <el-breadcrumb-item :to="to(item)">{{ $t(item.meta.title) }}</el-breadcrumb-item>
      <!-- <el-breadcrumb-item v-if="item.path !== '/' && !item.meta.hiddenBreadcrumb" :key="index" @click="go(item)">{{ $t(item.meta.title) }}</el-breadcrumb-item> -->
    </template>
  </el-breadcrumb>
</template>
<script setup>
import { ref, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
const route = useRoute()
const router = useRouter()
const breadcrumbs = ref([])
watch(
  () => route.fullPath,
  () => {
    breadcrumbs.value = route.meta.breadcrumb
  }
)
const to = (route) => {
  if (!route.component && route.children?.length > 0) {
    return route.children[0].path
  }
  return route.path
}
onMounted(async () => {
  breadcrumbs.value = route.meta.breadcrumb
})
</script>

<style lang="scss" scoped>
.el-breadcrumb {
  position: relative;
  display: flex;
  align-items: center;
  flex-shrink: 0;
  height: 32px;
  font-size: var(--el-font-size-extra-small);
  :deep() {
    .el-breadcrumb__separator.el-icon {
      transform: scale(0.75);
      margin: 0 4px;
    }
    .el-breadcrumb__title {
      margin-right: 16px;
      font-size: var(--el-font-size-medium);
    }
    .el-breadcrumb__item {
      cursor: pointer;
      &:last-child {
        pointer-events: none;
      }
    }

    .el-breadcrumb__inner {
      display: flex;
      align-items: center;
      color: var(--el-text-color-secondary);
      font-weight: normal;

      &:hover {
        color: var(--el-color-primary);
      }
    }
  }
}
</style>
