<template>
  <div>
    <div ref="buttonRef" :style="style" style="position: fixed; z-index: 1000; touch-action: none;">
      <el-button type="primary" circle size="large" icon="ri-menu-line" @click="handleClick" />
    </div>
    <el-drawer v-model="drawer.visible" title="" :size="256" direction="ltr" append-to-body destroy-on-close>
      <template #header="{ close, titleId, titleClass }">
        <layout-logo />
      </template>
      <el-scrollbar>
        <el-menu :default-active="route.fullPath" router @select="drawer.visible = false">
          <layout-menu :data="menus" />
        </el-menu>
      </el-scrollbar>
    </el-drawer>
  </div>
</template>

<script setup>
import { ref, useTemplateRef } from 'vue'
import { useDraggable, useWindowSize } from '@vueuse/core'
import { storeToRefs } from 'pinia'
import LayoutMenu from '../LayoutMenu'
import LayoutLogo from '../LayoutLogo'
import { usePermissionStore } from '@/stores/modules/permissionStore'
import { useRoute } from 'vue-router'

const route = useRoute()
const drawer = ref({ visible: false })
const { menus } = storeToRefs(usePermissionStore())
const buttonRef = useTemplateRef('buttonRef')

let isDragging = false
const { height } = useWindowSize()
const { style } = useDraggable(buttonRef, {
  initialValue: { x: 16, y: height.value - 64 },
  onStart: () => {
    isDragging = false
  },
  onMove: () => {
    requestAnimationFrame(() => {
      isDragging = true
    })
  },
  onEnd: () => {
    setTimeout(() => isDragging = false, 50)
  }
})

const handleClick = () => {
  if (!isDragging) {
    drawer.value.visible = !drawer.value.visible
  }
}
</script>

<style lang="scss" scoped>
.el-button.el-button--primary.is-circle {
  --el-button-size: 48px;
  box-shadow: 0 2px 12px 0 var(--el-color-primary);
  font-size: var(--el-font-size-medium);
  cursor: move;
}
:deep(.el-drawer) {
  .el-drawer__body {
    padding: 0;
  }
}
:deep(.el-menu) {
  --el-menu-item-height: 48px;
  --el-menu-sub-item-height: 48px;
  --el-menu-level-padding: 24px;
  --el-menu-base-level-padding: 16px;
  --el-menu-bg-color: transparent;
  --el-menu-active-bg-color: var(--el-color-primary-light-9);
  border: 0;

  .el-menu-item,
  .el-sub-menu>.el-sub-menu__title {
    border: 0 !important;

    .el-menu-item__icon,
    .el-sub-menu__icon {
      margin-right: 0;
      justify-content: flex-start;
      align-items: center;
      font-size: var(--el-font-size-medium);
    }

    .el-menu-item__label,
    .el-sub-menu__label {
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
      word-break: break-all;
    }
  }

  .el-menu-item:hover,
  .el-sub-menu>.el-sub-menu__title:hover {
    background-color: var(--el-menu-hover-bg-color);
    color: var(--el-menu-hover-text-color);
  }

  .el-menu-item.is-active,
  .el-sub-menu.is-active>.el-sub-menu__title {
    color: var(--el-menu-active-color);
  }

  .el-menu-item.is-active {
    background-color: var(--el-menu-active-bg-color);
  }

  .el-sub-menu__hide-arrow .el-sub-menu__title {
    padding: 0 16px;
  }
}
</style>
