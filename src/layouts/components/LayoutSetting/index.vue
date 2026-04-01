<template>
  <el-dialog v-model="settingVisible" :title="$t('ec.setting.drawer.title')" class="el-dialog--layout-setting" :width="640" overflow align-center draggable append-to-body destroy-on-close>
    <template #header>
      <el-segmented v-model="settingClassify" :options="settingClassifys" size="large" />
    </template>
    <div>
      <el-form ref="form" label-width="auto">
        <template v-if="settingClassify === '1'">
          <el-alert :title="$t('ec.setting.form.label.effect.alert')" type="warning" show-icon :closable="false" />
          <el-form-item :label="$t('ec.setting.form.label.theme')">
            <el-select v-model="theme">
              <el-option :label="$t('ec.setting.form.label.theme.type.primary')" value="primary" />
              <el-option :label="$t('ec.setting.form.label.theme.type.simple')" value="simple" />
              <el-option :label="$t('ec.setting.form.label.theme.type.technological')" value="technological" />
              <el-option :label="$t('ec.setting.form.label.theme.type.immersive')" value="immersive" />
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('ec.setting.form.label.layout')">
            <el-select v-model="layout">
              <el-option :label="$t('ec.setting.form.label.layout.type.column')" value="column" />
              <el-option :label="$t('ec.setting.form.label.layout.type.complex')" value="complex" />
              <el-option :label="$t('ec.setting.form.label.layout.type.classic')" value="classic" />
              <el-option :label="$t('ec.setting.form.label.layout.type.mixture')" value="mixture" />
              <el-option :label="$t('ec.setting.form.label.layout.type.dock')" value="dock" />
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('ec.setting.form.label.strategy')">
            <el-select v-model="strategy">
              <el-option :label="$t('ec.setting.form.label.strategy.type.flexbox')" value="flexbox" style="padding: 12px 16px; height: auto; line-height: 1.5;">
                <div>{{ $t('ec.setting.form.label.strategy.type.flexbox') }}</div>
                <small>{{ $t('ec.setting.form.label.strategy.remark.flexbox') }}</small>
              </el-option>
              <el-option :label="$t('ec.setting.form.label.strategy.type.fixed')" value="fixed" style="padding: 12px 16px; height: auto; line-height: 1.5;">
                <div>{{ $t('ec.setting.form.label.strategy.type.fixed') }}</div>
                <small>{{ $t('ec.setting.form.label.strategy.remark.fixed') }}</small>
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item :label="$t('ec.setting.form.label.color')">
            <el-color-picker v-model="color" :predefine="['#2e5ef0', '#427af4', '#69c861', '#efa141', '#e97b77', '#1a94bc', '#207f4c', '#e16723', '#9b1e64', '#2e317c', '#5e616d']" />
          </el-form-item>
          <el-form-item :label="$t('ec.setting.form.label.dark')">
            <el-switch v-model="dark" inline-prompt active-icon="ri-moon-line" inactive-icon="ri-sun-line" />
          </el-form-item>

          <el-form-item :label="$t('ec.setting.form.label.weakness')">
            <el-switch v-model="weakness" />
          </el-form-item>
          <el-form-item :label="$t('ec.setting.form.label.effect')">
            <el-switch v-model="effect" active-value="glass" inactive-value="none" />
          </el-form-item>
        </template>
        <template v-if="settingClassify === '2'">
          <el-alert :title="$t('ec.setting.form.label.autoexit.alert')" type="warning" show-icon :closable="false" />
          <el-form-item :label="$t('ec.setting.form.label.language')">
            <el-select v-model="language" :teleported="false">
              <template #label="{ label, value }">
                <img :src="settingLanguages.find(i => i.value === value)?.icon" width="24" height="24" >
                <span>{{ label }}</span>
              </template>
              <el-option v-for="item in settingLanguages" :key="item.value" :label="item.label" :value="item.value">
                <img :src="item.icon" width="24" height="24" >
                <span>{{ item.label }}</span>
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('ec.setting.form.label.autoexit')">
            <el-select v-model="autoexit">
              <el-option label="-" :value="0" />
              <el-option label="5 min" :value="5" />
              <el-option label="15 min" :value="15" />
              <el-option label="25 min" :value="25" />
              <el-option label="35 min" :value="35" />
              <el-option label="45 min" :value="45" />
              <el-option label="55 min" :value="55" />
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('ec.setting.form.label.collapse')">
            <el-switch v-model="collapse" />
          </el-form-item>
          <el-form-item :label="$t('ec.setting.form.label.breadcrumb')">
            <el-switch v-model="breadcrumb" />
          </el-form-item>
          <el-form-item :label="$t('ec.setting.form.label.watermark')">
            <el-switch v-model="watermark" />
          </el-form-item>
          <el-form-item :label="$t('ec.setting.form.label.tabs')">
            <el-switch v-model="tabs" />
          </el-form-item>
          <el-form-item :label="$t('ec.setting.form.label.tabsPersistence')">
            <el-switch v-model="tabsPersistence" />
          </el-form-item>
        </template>
        <template v-if="settingClassify === '3'">
          <el-alert :title="$t('ec.setting.form.label.css.alert')" type="success" show-icon :closable="false" />
          <el-form-item :label="$t('ec.setting.form.label.radius')">
            <el-input-number v-model="variables.borderRadius" :min="0" controls-position="right" class="width-100" />
          </el-form-item>
          <el-form-item :label="$t('ec.setting.form.label.fontFamily')">
            <el-select v-model="variables.fontFamily">
              <el-option :label="$t('ec.setting.form.label.fontFamily.type.default')" value="GoogleSansFlexVF-Regular, 'Microsoft YaHei', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB', 'Helvetica Neue', Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol'" />
              <el-option :label="$t('ec.setting.form.label.fontFamily.type.AlimamaFangYuanTiVF')" value="AlimamaFangYuanTiVF-Thin, 'GoogleSansFlexVF-Regular', 'Microsoft YaHei', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB', 'Helvetica Neue', Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol'" />
              <el-option :label="$t('ec.setting.form.label.fontFamily.type.DingTalkJinBuTi')" value="DingTalkJinBuTi-Regular, 'GoogleSansFlexVF-Regular', 'Microsoft YaHei', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB', 'Helvetica Neue', Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol'" />
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('ec.setting.form.label.fontSize')">
            <el-select v-model="variables.fontSize">
              <el-option label="12px" :value="12" />
              <el-option label="13px" :value="13" />
              <el-option label="14px" :value="14" />
              <el-option label="15px" :value="15" />
              <el-option label="16px" :value="16" />
              <el-option label="17px" :value="17" />
              <el-option label="18px" :value="18" />
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('ec.setting.form.label.fontWeightPrimary')">
            <el-select v-model="variables.fontWeightPrimary">
              <el-option label="400" :value="400" />
              <el-option label="500" :value="500" />
              <el-option label="600" :value="600" />
              <el-option label="700" :value="700" />
            </el-select>
          </el-form-item>
        </template>
      </el-form>
    </div>
  </el-dialog>
</template>
<script setup>
import { watch, ref, getCurrentInstance, computed, onMounted, onUnmounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useStyleStore } from '@/stores/modules/styleStore'
import { useSystemStore } from '@/stores/modules/systemStore'
// import { useRouter, useRoute } from 'vue-router'
import { $sub, $unsub } from '@/plugins/mitt'
defineOptions({ name: 'LayoutSetting' })
const { proxy } = getCurrentInstance()
// const router = useRouter()
// const route = useRoute()
const settingClassify = ref('1')
const settingClassifys = ref([
  { label: computed(() => proxy.$t('ec.setting.drawer.title.theme')), value: '1' },
  { label: computed(() => proxy.$t('ec.setting.drawer.title.function')), value: '2' },
  { label: computed(() => proxy.$t('ec.setting.drawer.title.css')), value: '3' }
])
const settingLanguages = ref([
  { label: '简体中文', value: 'zh-CN', icon: new URL('@/assets/images/common/flag-china.svg', import.meta.url).href },
  { label: 'English', value: 'en', icon: new URL('@/assets/images/common/flag-united-states.svg', import.meta.url).href }
])
// 从 store 中解构出需要的响应式状态（使用 storeToRefs 确保解构后仍为响应式）
// 解构出 store 中的更新方法，用于提交状态变更
const { dark, weakness, language, watermark, autoexit } = storeToRefs(useSystemStore())
const { UpdateSystem } = useSystemStore()

const { theme, color, layout, strategy, tabs, tabsPersistence, effect, variables, collapse, breadcrumb } = storeToRefs(useStyleStore())
const { UpdateStyle } = useStyleStore()

// 遍历需要监听的设置项，为其添加监听器
const settingSystems = ['dark', 'weakness', 'autoexit']
settingSystems.forEach((key) => {
  watch(() => useSystemStore()[key], (val) => UpdateSystem({ key, value: val }))
})

// 遍历需要监听的设置项，为其添加监听器
const settingStyles = ['color', 'layout', 'theme', 'effect']
settingStyles.forEach((key) => {
  watch(() => useStyleStore()[key], (val) => UpdateStyle({ key, value: val }))
})

// 深度监听 css variables 变化
watch(variables, (val) => UpdateStyle({ key: 'variables', value: val }), { deep: true })

// 语言切换
watch(language, (n) => {
  UpdateSystem({ key: 'language', value: n })
  // 使用 '/redirect' + 当前完整路径 进行重定向，强制触发语言环境刷新
  // router.replace('/redirect' + route.fullPath)
})
const settingVisible = ref(false)

onMounted(() => {
  $sub('layoutSetting:visible', () => settingVisible.value = true)
})

onUnmounted(() => {
  $unsub('layoutSetting:visible')
})
</script>

<style lang="scss" scoped>
:deep(.el-alert) {
  margin-bottom: 16px;
}
:deep(.el-form) {
  .el-select {
    .el-select__placeholder {
      display: flex;
      align-items: center;
      > img {
        margin-right: 8px;
      }
    }
  }
  .el-select-dropdown {
    .el-select-dropdown__item {
      display: flex;
      align-items: center;
      > img {
        margin-right: 8px;
      }
    }
  }
}
</style>
<style lang="scss" >
.el-dialog.el-dialog--layout-setting {
  padding: 16px;
  .el-dialog__header {
    border: 0;
    justify-content: center;
  }
}
</style>
