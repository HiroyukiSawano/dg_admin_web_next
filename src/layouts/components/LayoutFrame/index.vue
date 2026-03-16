<template>
  <div v-if="route.meta.type === 'iframe'" class="el-embed">
    <iframe
      v-for="item in pages"
      v-show="route.meta.url === item.meta.url"
      :key="item.meta.url" :src="item.meta.url"
      class="el-embed-item"
    >
    </iframe>
  </div>
</template>
<script setup>
import { watch, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useStyleStore } from '@/stores/modules/styleStore'
import { useSystemStore } from '@/stores/modules/systemStore'
import { useFrameStore } from '@/stores/modules/frameStore'
import { useRoute } from 'vue-router'
const route = useRoute()

const { pages } = storeToRefs(useFrameStore())
const { device } = storeToRefs(useSystemStore())
const { tabs } = storeToRefs(useStyleStore())
const { SetFramePages, AddFramePages, ClearFramePages } = useFrameStore()

const embedPush = (tag) => {
  const { path, name, meta, params, query, fullPath } = tag
  const { breadcrumb, ...m } = meta
  if (!(name && meta)) return
  const route = { path, fullPath: fullPath || path, query, params, name, meta: m }

  if (route.meta.type === 'iframe') {
    if (device.value === 'mobile' || device.value === 'tablet' || !tabs.value) {
      SetFramePages(route)
    } else {
      AddFramePages(route)
    }
  } else if (device.value === 'mobile' || device.value === 'tablet' || !tabs.value) {
    ClearFramePages()
  }
}
watch(() => route.fullPath, () => {
  embedPush(route)
}, { immediate: true })
</script>

<style lang="scss" scoped>
.el-embed {
  width: 100%;
  height: calc(100% - var(--el-layout-breadcrumb-height));
  background: var(--el-fill-color-blank);
  border-radius: var(--el-border-radius-base);
  overflow: hidden;
  .el-embed-item {
    border: 0;
    width: 100%;
    height: 100%;
    display: block;
  }
}
</style>
