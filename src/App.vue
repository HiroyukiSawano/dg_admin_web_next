<template>
  <el-config-provider :locale="config.locale" :size="config.size" :zIndex="config.zIndex" :button="config.button">
    <router-view></router-view>
  </el-config-provider>
</template>

<script setup>

import { ref, computed, onMounted, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useWindowSize, useBreakpoints, breakpointsElement, useDebounceFn } from '@vueuse/core'
import { useSystemStore } from '@/stores/modules/systemStore'
import { useStyleStore } from '@/stores/modules/styleStore'

const { locale, messages } = useI18n()
const config = ref({
  size: 'default',
  zIndex: 2000,
  button: { autoInsertSpace: false },
  locale: computed(() => messages.value[locale.value].el)
})

const { UpdateSystem } = useSystemStore()
const { UpdateStyle } = useStyleStore()

// 更新断点、设备、视窗
const { width, height } = useWindowSize()
const devicesElement = { mobile: 0, tablet: 768, laptop: 992, desktop: 1200, ultrawide: 1920 }

const windowBreakpoint = useBreakpoints(breakpointsElement).active()
const deviceBreakpoint = useBreakpoints(devicesElement).active()

// const viewporting = computed(() => [width.value, height.value])

watch([width, height], useDebounceFn(() => {
  UpdateSystem({ key: 'breakpoint', value: windowBreakpoint.value })
  UpdateSystem({ key: 'device', value: deviceBreakpoint.value })
  // UpdateSystem({ key: 'viewport', value: viewporting.value })
}, 100),
{ immediate: true })
onMounted(() => {
  const styles = ['variables', 'color']
  styles.forEach((key) => {
    UpdateStyle({ key, value: useStyleStore()[key] })
  })
  const systems = ['dark', 'weakness', 'language']
  systems.forEach((key) => {
    UpdateSystem({ key, value: useSystemStore()[key] })
  })
})
</script>

<style lang="scss"></style>
