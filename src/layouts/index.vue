<template>

  <component :is="layouts[layout]" :device="device" :collapse="collapse" :strategy="strategy" :tabs="tabs" />
  <layout-menu-mobile class="hidden-md-and-up" />
  <layout-setting />
  <el-watermark class="el-watermark" :font="patterns.font" :z-index="patterns.zIndex" :rotate="patterns.rotate" :content="watermark ? patterns.content : ''" />
  <div class="app-maximize-exit" @click="exitMaximize"><el-icon class="ri-close-line" /></div>

</template>
<script setup>
import { ref, watch, computed, getCurrentInstance } from 'vue'
import { storeToRefs } from 'pinia'
import { APP_COPYRIGHT, APP_VERSION, AUTH_ENABLED } from '@/configs'

import { useSystemStore } from '@/stores/modules/systemStore'
import { useStyleStore } from '@/stores/modules/styleStore'
import { useAuthorizeStore } from '@/stores/modules/authorizeStore'

import { useAutoexitHook } from '@/hooks/autoexitHook'
import { useRouter, useRoute } from 'vue-router'
import { ElMessageBox, ElNotification } from 'element-plus'
import { useDocumentVisibility, useCssVar } from '@vueuse/core'

import LayoutMenuMobile from './components/LayoutMenuMobile'
import LayoutSetting from './components/LayoutSetting'

import complexLayout from './complexLayout.vue'
import classicLayout from './classicLayout.vue'
import dockLayout from './dockLayout.vue'
import columnLayout from './columnLayout.vue'
import mixtureLayout from './mixtureLayout.vue'

defineOptions({ name: 'indexLayout' })

const { proxy } = getCurrentInstance()

const router = useRouter()
const route = useRoute()

// 布局方式
const layouts = { complex: complexLayout, classic: classicLayout, dock: dockLayout, column: columnLayout, mixture: mixtureLayout }

// 水印配置
const patterns = ref({
  font: {
    fontSize: 16,
    color: 'rgba(0,0,0,.1)',
    fontFamily: useCssVar('--el-font-family').value,
    zIndex: 88888888
  },
  rotate: -30,
  content: APP_COPYRIGHT + ' ' + APP_VERSION,
})

// 系统配置
const { watermark, autoexit, device } = storeToRefs(useSystemStore())

// 自动退出（如果设置的话）
useAutoexitHook(autoexit.value, async () => {
  const { Logout } = useAuthorizeStore()
  await Logout()
  router.replace({ path: AUTH_ENABLED ? '/login' : '/' })
  ElMessageBox.alert(proxy.$t('ec.system.message.autoexit.content'), proxy.$t('ec.system.message.autoexit.title'), {
    type: 'warning',
    center: true,
    callback: () => window.location.reload(),
  })
})

// 更新布局主题相关
const { layout, collapse, strategy, tabs } = storeToRefs(useStyleStore())
const { UpdateStyle } = useStyleStore()
const styles = ['layout', 'theme', 'effect', 'strategy']
styles.forEach((key) => {
  UpdateStyle({ key, value: useStyleStore()[key] })
})

// 根据当前时间计算并返回欢迎消息
const welcome = computed(() => {
  const h = new Date().getHours()
  return h < 8 ? proxy.$t('ec.system.notification.welcome.morning.text')
    : h < 12 ? proxy.$t('ec.system.notification.welcome.forenoon.text')
    : h < 18 ? proxy.$t('ec.system.notification.welcome.afternoon.text')
    : proxy.$t('ec.system.notification.welcome.evening.text')
})

// 监控页面的可见性变化，显示欢迎消息通知
const visibility = useDocumentVisibility()
watch(visibility, (current, previous) => {
  if (current === 'visible' && previous === 'hidden') {
    ElNotification({ message: welcome.value, type: 'success', position: 'bottom-right' })
  }
})

// 退出最大化模式
const exitMaximize = () => document.getElementById('app').classList.remove('app-maximize')


</script>

<style lang="scss" scoped>
.el-watermark {
  position: fixed !important;
  inset: 0;
  z-index: 888888;
  pointer-events: none;
}
</style>
<style lang="scss">
[data-effect='glass'] {
  --el-effect-glass-opacity: 80%;
  .el-popper,
  .el-overlay {
    --el-effect-glass-opacity: 25%;
    backdrop-filter: saturate(180%) blur(16px);
  }
  .el-popper.is-light {
    background-color: color-mix(in srgb, var(--el-fill-color-blank) var(--el-effect-glass-opacity), transparent);
    .el-dropdown-menu {
      background-color: transparent;
    }
  }
  .el-overlay {
    background-color: color-mix(in srgb, var(--el-mask-color-extra-light) var(--el-effect-glass-opacity), transparent);
  }
}
</style>

