import { defineStore } from 'pinia'
import { STYLE_LAYOUT, STYLE_STRATEGY, STYLE_COLLAPSE, STYLE_TABS, STYLE_TABS_PERSISTENCE, STYLE_THEME, STYLE_EFFECT, STYLE_COLOR, STYLE_UNIQUE, STORAGE_PREFIX, STYLE_BREADCRUMB, STYLE_VARIABLES } from '@/configs'
import { colorLighten, colorDarken } from '@/utils/color'
import { useCssVar } from '@vueuse/core'

const LEGACY_DEFAULT_COLOR = '#207f4c'
const STYLE_COMPAT_VERSION = 1

const normalizeColor = (value) => {
  return String(value || '').trim().toLowerCase()
}

const useStyleStore = defineStore('style', {
  state: () => ({
    // 布局
    layout: STYLE_LAYOUT,
    // 布局策略
    strategy: STYLE_STRATEGY,
    // 主题
    theme: STYLE_THEME,
    // 颜色
    color: STYLE_COLOR,
    // 主题兼容版本
    compatVersion: 0,
    // 视觉特效
    effect: STYLE_EFFECT,
    // 是否显示顶部TABS
    tabs: STYLE_TABS,
    // 顶部TABS持久化
    tabsPersistence: STYLE_TABS_PERSISTENCE,
    // 开启菜单手风琴
    unique: STYLE_UNIQUE,
    // 是否菜单折叠
    collapse: STYLE_COLLAPSE,
    // 是否显示面包屑
    breadcrumb: STYLE_BREADCRUMB,
    // CSS 变量
    variables: STYLE_VARIABLES,
  }),

  getters: {},
  actions: {
    EnsureStyleCompatibility() {
      if (this.compatVersion >= STYLE_COMPAT_VERSION) return

      if (normalizeColor(this.color) === normalizeColor(LEGACY_DEFAULT_COLOR) && normalizeColor(STYLE_COLOR) !== normalizeColor(LEGACY_DEFAULT_COLOR)) {
        this.color = STYLE_COLOR
      }

      this.compatVersion = STYLE_COMPAT_VERSION
    },
    // 更新主颜色并设置相关 CSS 变量
    UpdateStyleColor() {
      this.EnsureStyleCompatibility()
      // 如果没有颜色设置初始颜色
      if (!this.color) this.color = STYLE_COLOR
      const el = document.documentElement
      // 给HTML增加默认主题CSS变量
      useCssVar('--el-color-primary', el).value = this.color
      // 给HTML增加相应LIGHT与DARKEN主题CSS变量
      for (let i = 1; i < 10; i++) {
        const lightColor = colorLighten(this.color, i / 10)
        const darkColor = colorDarken(this.color, i / 10)
        useCssVar(`--el-color-primary-light-${i}`, el).value = lightColor
        useCssVar(`--el-color-primary-dark-${i}`, el).value = darkColor
      }
    },
    UpdateStyleVariables() {
      if (!this.variables) this.variables = STYLE_VARIABLES
      const el = document.documentElement
      useCssVar('--el-border-radius-base', el).value = `${this.variables.borderRadius}px`
      useCssVar('--el-font-weight-primary', el).value = `${this.variables.fontWeightPrimary}`
      useCssVar('--el-font-family', el).value = this.variables.fontFamily
      useCssVar('--el-font-size-extra-large', el).value = `${this.variables.fontSize * 1.42857143}px`
      useCssVar('--el-font-size-large', el).value = `${this.variables.fontSize * 1.28571429}px`
      useCssVar('--el-font-size-medium', el).value = `${this.variables.fontSize * 1.14285714}px`
      useCssVar('--el-font-size-base', el).value = `${this.variables.fontSize * 1}px`
      useCssVar('--el-font-size-small', el).value = `${this.variables.fontSize * 0.92857143}px`
      useCssVar('--el-font-size-extra-small', el).value = `${this.variables.fontSize * 0.85714286}px`
    },
    UpdateStyleAttribute( key, value) {
      document.body.setAttribute(`data-${key}`, value)
    },
    // 更新样式设置
    UpdateStyle({ key, value }) {
      if (!Reflect.has(this, key)) return
      this[key] = value
      if (key === 'color') this.UpdateStyleColor()
      if (key === 'variables') this.UpdateStyleVariables()
      if (key === 'layout' || key === 'effect' || key === 'theme') this.UpdateStyleAttribute(key, value)
    },
    // 重置样式
    ResetStyle() {
      this.$reset()
    },
  },
  persist: {
    key: `${STORAGE_PREFIX}/STYLE_KEY`,
  },
})

export { useStyleStore }
export default useStyleStore
