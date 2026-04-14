<template>
  <div class="figma-shell" :class="shellClass">
    <header class="figma-shell__header" :class="headerClass">
      <div class="figma-shell__brand">
        <img
          v-if="isPlatformFrameVariant"
          class="figma-shell__brand-image"
          src="@/assets/images/organization/service-platform-logo.svg"
          :alt="t('ec.organization.figma.appTitle')"
        >
        <div v-else class="figma-shell__brand-icon">
          <span></span>
        </div>
        <div class="figma-shell__brand-title">{{ t('ec.organization.figma.appTitle') }}</div>
      </div>

      <nav class="figma-shell__top-nav hidden-sm-and-down">
        <button
          v-for="item in topMenus"
          :key="item.key"
          class="figma-shell__top-link"
          type="button"
        >
          {{ t(item.label) }}
        </button>
      </nav>

      <div class="figma-shell__tools" :class="toolsClass">
        <template v-if="isPlatformFrameVariant">
          <button class="figma-shell__header-action" type="button" aria-label="Search">
            <i class="ri-search-2-line"></i>
          </button>
          <button class="figma-shell__header-action figma-shell__header-action--message" type="button" aria-label="Messages">
            <i class="ri-message-3-line"></i>
          </button>
          <el-dropdown
            class="figma-shell__account-dropdown"
            :show-arrow="false"
            trigger="hover"
            @command="handleAccountCommand"
          >
            <div class="figma-shell__account">
              <el-avatar class="figma-shell__account-avatar" :size="24" :src="accountAvatar">
                {{ accountInitial }}
              </el-avatar>
              <span class="figma-shell__account-name">{{ displayUserName }}</span>
            </div>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="logout">
                  {{ t('ec.user.dropdowm.item.text.logout') }}
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </template>
        <layout-tools v-else />
      </div>
    </header>

    <div class="figma-shell__body">
      <aside class="figma-shell__aside" :class="asideClass">
        <div class="figma-shell__aside-body">
          <button
            v-for="item in sideMenus"
            :key="item.key"
            class="figma-shell__side-link"
            :class="{ 'is-active': item.active, 'is-disabled': item.disabled }"
            type="button"
            :disabled="item.disabled"
            :title="isAsideCollapsed ? t(item.label) : undefined"
            @click="navigate(item)"
          >
            <i :class="item.icon"></i>
            <span>{{ t(item.label) }}</span>
          </button>
        </div>
        <button
          class="figma-shell__aside-toggle hidden-sm-and-down"
          type="button"
          aria-label="Toggle sidebar"
          @click="toggleSidebar"
        >
          <img class="figma-shell__aside-toggle-icon" :src="sidebarCollapseIcon" alt="">
        </button>
      </aside>

      <main class="figma-shell__main" :class="mainClass">
        <section class="figma-shell__panel" :class="panelClass">
          <div v-if="hasPanelHeader" class="figma-shell__panel-header" :class="panelHeaderClass">
            <slot name="panel-header"></slot>
          </div>

          <div v-if="!hideTabs && currentSubTabs.length > 0" class="figma-shell__tabs" :class="tabsClass">
            <button
              v-for="item in currentSubTabs"
              :key="item.key"
              class="figma-shell__tab"
              :class="{ 'is-active': item.key === activeTab }"
              type="button"
              @click="router.push(item.path)"
            >
              {{ t(item.label) }}
            </button>
          </div>

          <div
            v-if="!hideStats && (statsLoading || stats.length > 0)"
            class="figma-shell__stats"
            :class="statsClass"
            :style="statsStyle"
          >
            <template v-if="statsLoading">
              <el-skeleton
                v-for="index in stats.length || 4"
                :key="index"
                animated
                class="figma-shell__stat-skeleton"
              >
                <template #template>
                  <div class="figma-shell__stat-card">
                    <el-skeleton-item variant="text" style="width: 56%;" />
                    <el-skeleton-item variant="text" style="width: 28%; height: 32px; margin-top: 16px;" />
                  </div>
                </template>
              </el-skeleton>
            </template>
            <div
              v-for="card in stats"
              v-else
              :key="card.key"
              class="figma-shell__stat-card"
              :class="card.key ? `is-${card.key}` : null"
            >
              <div
                class="figma-shell__stat-icon"
                :class="[card.key ? `is-${card.key}` : null, `is-${card.tone || 'primary'}`]"
              >
                <img v-if="card.iconUrl" class="figma-shell__stat-icon-image" :src="card.iconUrl" :alt="card.label">
                <i v-else :class="card.icon"></i>
              </div>
              <div class="figma-shell__stat-label">{{ card.label }}</div>
              <div class="figma-shell__stat-value">{{ card.value }}</div>
            </div>
          </div>

          <div class="figma-shell__content" :class="contentClass">
            <div v-if="hasFilters || hasActions" class="figma-shell__toolbar" :class="toolbarClass">
              <div v-if="hasFilters" class="figma-shell__toolbar-main">
                <slot name="filters"></slot>
              </div>
              <div v-if="hasActions" class="figma-shell__toolbar-extra">
                <slot name="actions"></slot>
              </div>
            </div>

            <div class="figma-shell__table">
              <slot></slot>
            </div>

            <div class="figma-shell__pagination" :class="paginationClass">
              <slot name="pagination"></slot>
            </div>
          </div>
        </section>
      </main>
    </div>
    <layout-setting />
  </div>
</template>

<script setup>
import { computed, getCurrentInstance, useSlots } from 'vue'
import { storeToRefs } from 'pinia'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import { ElMessageBox } from 'element-plus'
import { AUTH_ENABLED } from '@/configs'
import { useAuthorizeStore } from '@/stores/modules/authorizeStore'
import { useStyleStore } from '@/stores/modules/styleStore'
import { useSystemStore } from '@/stores/modules/systemStore'
import defaultUserAvatar from '@/assets/images/common/avatar.png'
import sidebarCollapseIcon from '@/assets/images/organization/service-provider-sidebar-collapse.svg'
import LayoutSetting from '@/layouts/components/LayoutSetting'
import LayoutTools from '@/layouts/components/LayoutTools'

defineOptions({ name: 'FigmaResourceShell' })

const props = defineProps({
  activeTab: {
    type: String,
    default: 'serviceProviders',
  },
  subTabs: {
    type: Array,
    default: () => [],
  },
  stats: {
    type: Array,
    default: () => [],
  },
  statsLoading: {
    type: Boolean,
    default: false,
  },
  hideStats: {
    type: Boolean,
    default: false,
  },
  hideTabs: {
    type: Boolean,
    default: false,
  },
  variant: {
    type: String,
    default: 'default',
  },
  frameVariant: {
    type: String,
    default: 'default',
  },
  statsDecoration: {
    type: String,
    default: '',
  },
  statsDecorationImage: {
    type: String,
    default: '',
  },
})

const { t } = useI18n()
const { proxy } = getCurrentInstance()
const route = useRoute()
const router = useRouter()
const slots = useSlots()
const authorizeStore = useAuthorizeStore()
const styleStore = useStyleStore()
const { user } = storeToRefs(authorizeStore)
const { collapse } = storeToRefs(styleStore)
const { device } = storeToRefs(useSystemStore())
const { UpdateStyle } = styleStore
const authExitPath = AUTH_ENABLED ? '/login' : '/'

const topMenus = [
  { key: 'overview', label: 'ec.organization.figma.top.overview' },
  { key: 'service', label: 'ec.organization.figma.top.service' },
  { key: 'monitor', label: 'ec.organization.figma.top.monitor' },
  { key: 'inspection', label: 'ec.organization.figma.top.inspection' },
  { key: 'board', label: 'ec.organization.figma.top.board' },
  { key: 'config', label: 'ec.organization.figma.top.config' },
]

const displayUserName = computed(() => {
  const rawName = user.value?.name || user.value?.nickname || user.value?.username || t('ec.organization.figma.defaultUser')
  return String(rawName).startsWith('ec.') ? t(rawName) : rawName
})

const accountInitial = computed(() => {
  return String(displayUserName.value || '').trim().charAt(0) || '管'
})

const accountAvatar = computed(() => {
  return user.value?.avatar || defaultUserAvatar
})

const sideMenus = computed(() => {
  return [
    {
      key: 'workbench',
      label: 'ec.organization.figma.side.workbench',
      icon: 'ri-home-4-line',
      disabled: true,
      active: false,
    },
    {
      key: 'organization',
      label: 'ec.menu.name.organization',
      icon: 'ri-team-line',
      path: '/organization/service-providers',
      active: route.path.startsWith('/organization'),
    },
    {
      key: 'project',
      label: 'ec.menu.name.project',
      icon: 'ri-briefcase-4-line',
      path: '/project/projects',
      active: route.path.startsWith('/project'),
    },
    {
      key: 'software',
      label: 'ec.menu.name.software',
      icon: 'ri-apps-2-line',
      path: '/software/informationSystems',
      active: route.path.startsWith('/software'),
    },
    {
      key: 'hardware',
      label: 'ec.menu.name.hardware',
      icon: 'ri-database-2-line',
      path: '/hardware/hardwareAssets',
      active: route.path.startsWith('/hardware'),
    },
    {
      key: 'data',
      label: 'ec.organization.figma.side.data',
      icon: 'ri-stack-line',
      disabled: true,
      active: false,
    },
  ]
})

const defaultOrganizationTabs = [
  {
    key: 'serviceProviders',
    label: 'ec.organization.figma.tab.serviceProviders',
    path: '/organization/service-providers',
  },
  {
    key: 'persons',
    label: 'ec.organization.figma.tab.persons',
    path: '/organization/persons',
  },
]

const currentSubTabs = computed(() => {
  return props.subTabs.length > 0 ? props.subTabs : defaultOrganizationTabs
})

const isPlatformFrameVariant = computed(() => props.frameVariant === 'platform')
const isServiceProviderListVariant = computed(() => props.variant === 'service-provider-list')
const isPersonListVariant = computed(() => props.variant === 'person-list')
const isProjectListVariant = computed(() => props.variant === 'project-list')
const isSoftwareListVariant = computed(() => props.variant === 'software-list')
const isHardwareListVariant = computed(() => props.variant === 'hardware-list')
const isResourceListVariant = computed(() => {
  return isServiceProviderListVariant.value
    || isPersonListVariant.value
    || isProjectListVariant.value
    || isSoftwareListVariant.value
    || isHardwareListVariant.value
})
const isAsideCollapsed = computed(() => device.value === 'desktop' && collapse.value)

const hasPanelHeader = computed(() => Boolean(slots['panel-header']))
const hasFilters = computed(() => Boolean(slots.filters))
const hasActions = computed(() => Boolean(slots.actions))

const panelClass = computed(() => ({
  'figma-shell__panel--platform': isPlatformFrameVariant.value,
}))

const shellClass = computed(() => ({
  'figma-shell--platform': isPlatformFrameVariant.value,
  'figma-shell--service-provider-list': isServiceProviderListVariant.value,
  'figma-shell--person-list': isPersonListVariant.value,
  'figma-shell--project-list': isProjectListVariant.value,
  'figma-shell--software-list': isSoftwareListVariant.value,
  'figma-shell--hardware-list': isHardwareListVariant.value,
  'figma-shell--aside-collapsed': isAsideCollapsed.value,
}))

const headerClass = computed(() => ({
  'figma-shell__header--platform': isPlatformFrameVariant.value,
}))

const asideClass = computed(() => ({
  'figma-shell__aside--platform': isPlatformFrameVariant.value,
  'figma-shell__aside--collapsed': isAsideCollapsed.value,
}))

const mainClass = computed(() => ({
  'figma-shell__main--platform': isPlatformFrameVariant.value,
}))

const panelHeaderClass = computed(() => ({
  'figma-shell__panel-header--platform': isPlatformFrameVariant.value,
}))

const tabsClass = computed(() => ({
  'figma-shell__tabs--platform': isPlatformFrameVariant.value,
}))

const statsClass = computed(() => ({
  'figma-shell__stats--resource-list': isResourceListVariant.value,
  'figma-shell__stats--service-provider-list': isServiceProviderListVariant.value,
  'figma-shell__stats--person-list': isPersonListVariant.value,
  'figma-shell__stats--project-list': isProjectListVariant.value,
  'figma-shell__stats--software-list': isSoftwareListVariant.value,
  'figma-shell__stats--hardware-list': isHardwareListVariant.value,
}))

const contentClass = computed(() => ({
  'figma-shell__content--resource-list': isResourceListVariant.value,
  'figma-shell__content--service-provider-list': isServiceProviderListVariant.value,
  'figma-shell__content--person-list': isPersonListVariant.value,
  'figma-shell__content--project-list': isProjectListVariant.value,
  'figma-shell__content--software-list': isSoftwareListVariant.value,
  'figma-shell__content--hardware-list': isHardwareListVariant.value,
}))

const toolbarClass = computed(() => ({
  'figma-shell__toolbar--resource-list': isResourceListVariant.value,
  'figma-shell__toolbar--service-provider-list': isServiceProviderListVariant.value,
  'figma-shell__toolbar--person-list': isPersonListVariant.value,
  'figma-shell__toolbar--project-list': isProjectListVariant.value,
  'figma-shell__toolbar--software-list': isSoftwareListVariant.value,
  'figma-shell__toolbar--hardware-list': isHardwareListVariant.value,
}))

const paginationClass = computed(() => ({
  'figma-shell__pagination--resource-list': isResourceListVariant.value,
  'figma-shell__pagination--service-provider-list': isServiceProviderListVariant.value,
  'figma-shell__pagination--person-list': isPersonListVariant.value,
  'figma-shell__pagination--project-list': isProjectListVariant.value,
  'figma-shell__pagination--software-list': isSoftwareListVariant.value,
  'figma-shell__pagination--hardware-list': isHardwareListVariant.value,
}))

const toolsClass = computed(() => ({
  'figma-shell__tools--platform': isPlatformFrameVariant.value,
}))

const statsStyle = computed(() => {
  if (!props.statsDecoration && !props.statsDecorationImage) {
    return undefined
  }

  return {
    '--figma-shell-stats-decoration': props.statsDecoration ? `url("${props.statsDecoration}")` : 'none',
    '--figma-shell-stats-decoration-image': props.statsDecorationImage ? `url("${props.statsDecorationImage}")` : 'none',
  }
})

const handleAccountCommand = async (command) => {
  if (command !== 'logout') return
  try {
    await ElMessageBox.confirm(
      t('ec.user.logout.confirm.content.text'),
      t('ec.user.logout.confirm.title.text'),
      {
        type: 'warning',
        confirmButtonText: t('ec.user.logout.confirm.button.confirm.text'),
        cancelButtonText: t('ec.user.logout.confirm.button.cancel.text'),
      },
    )
    await authorizeStore.Logout()
    router.replace({ path: authExitPath })
  } catch (error) {
    if (error === 'cancel' || error === 'close') return
    proxy?.$message?.error?.(error?.message || t('ec.user.logout.confirm.title.text'))
  }
}

const navigate = (item) => {
  if (!item.path || item.disabled || item.path === route.path) return
  router.push(item.path)
}

const toggleSidebar = () => {
  UpdateStyle({ key: 'collapse', value: !collapse.value })
}

</script>

<style lang="scss" scoped>
.figma-shell {
  min-height: 100vh;
  background:
    radial-gradient(circle at left bottom, rgba(145, 202, 255, 0.18), transparent 28%),
    linear-gradient(180deg, #f8f9fe 0%, #f4f6fc 100%);
  color: #151b26;
}

.figma-shell__header {
  position: sticky;
  top: 0;
  z-index: 20;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  height: 56px;
  padding: 0 24px;
  background: rgba(255, 255, 255, 0.92);
  border-bottom: 1px solid #edf0f6;
  backdrop-filter: blur(12px);
}

.figma-shell__header--platform {
  background: rgba(255, 255, 255, 0.96);
  border-bottom-color: #f3f3f6;
  backdrop-filter: none;
}

.figma-shell__brand {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
}

.figma-shell__brand-image {
  display: block;
  width: 36px;
  height: 28px;
  object-fit: contain;
}

.figma-shell__brand-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 8px;
  background: linear-gradient(135deg, #8fc7ff 0%, #2e5ef0 72%);

  span {
    width: 14px;
    height: 14px;
    border: 2px solid rgba(255, 255, 255, 0.95);
    border-radius: 4px;
    transform: rotate(45deg);
  }
}

.figma-shell__brand-title {
  font-size: 20px;
  font-weight: 600;
  white-space: nowrap;
}

.figma-shell__top-nav {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
}

.figma-shell__top-link {
  padding: 5px 12px;
  border: 0;
  border-radius: 8px;
  background: transparent;
  color: #444a57;
  cursor: default;
  font-size: 14px;
}

.figma-shell__tools {
  display: flex;
  align-items: center;
  margin-left: auto;
}

.figma-shell__tools--platform {
  gap: 8px;
}

.figma-shell__header-action {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  padding: 0;
  border: 0;
  background: transparent;
  color: #444a57;
  cursor: default;

  i {
    font-size: 16px;
    line-height: 1;
  }
}

.figma-shell__header-action--message::after {
  content: '';
  position: absolute;
  top: 7px;
  right: 7px;
  width: 6px;
  height: 6px;
  background: #f56c6c;
  border-radius: 999px;
}

.figma-shell__account {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin-left: 2px;
  color: #444a57;
  font-size: 14px;
  line-height: 22px;
  cursor: pointer;
}

.figma-shell__account-avatar {
  flex-shrink: 0;
}

.figma-shell__account-dropdown {
  display: inline-flex;
}

.figma-shell__account-dropdown:deep(.el-tooltip__trigger) {
  outline: 0;
}

.figma-shell__account-name {
  white-space: nowrap;
}

.figma-shell__body {
  display: flex;
  min-height: calc(100vh - 56px);
}

.figma-shell__aside {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 220px;
  padding: 16px 10px;
  border-right: 1px solid #edf0f6;
  background: rgba(255, 255, 255, 0.42);
  transition: width 0.2s ease, padding 0.2s ease;
}

.figma-shell__aside--platform {
  padding-top: 8px;
  padding-bottom: 16px;
}

.figma-shell__aside-body {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 4px;
  min-height: 0;
}

.figma-shell__side-link {
  display: flex;
  align-items: center;
  gap: 14px;
  height: 40px;
  padding: 0 14px;
  border: 0;
  border-radius: 10px;
  background: transparent;
  color: #151b26;
  font-size: 14px;
  text-align: left;
  transition: all 0.2s ease;
  cursor: pointer;

  i {
    font-size: 16px;
  }

  &.is-active {
    background: #ebf0ff;
    color: #2e5ef0;
  }

  &.is-disabled {
    opacity: 0.45;
    cursor: not-allowed;
  }
}

.figma-shell__aside--platform .figma-shell__side-link {
  border-radius: 4px;
}

.figma-shell__aside-toggle {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  align-self: flex-end;
  width: 24px;
  height: 24px;
  margin-top: 16px;
  padding: 4px;
  border: 0;
  border-radius: 4px;
  background: #f5f6f9;
  cursor: pointer;
}

.figma-shell__aside-toggle-icon {
  display: block;
  width: 16px;
  height: 16px;
  transition: transform 0.2s ease;
}

.figma-shell--aside-collapsed .figma-shell__aside {
  width: 64px;
}

.figma-shell--aside-collapsed .figma-shell__aside-body {
  align-items: center;
}

.figma-shell--aside-collapsed .figma-shell__side-link {
  justify-content: center;
  width: 44px;
  gap: 0;
  padding: 0;
}

.figma-shell--aside-collapsed .figma-shell__side-link span {
  display: none;
}

.figma-shell--aside-collapsed .figma-shell__aside-toggle-icon {
  transform: scaleX(-1);
}

.figma-shell__main {
  flex: 1;
  min-width: 0;
  padding: 24px 16px 16px;
}

.figma-shell__main--platform {
  display: flex;
  padding: 0 16px 16px 0;
  min-height: calc(100vh - 56px);
}

.figma-shell__panel {
  display: flex;
  flex-direction: column;
  gap: 12px;
  min-height: calc(100vh - 96px);
  padding: 0 14px 14px;
  background: rgba(255, 255, 255, 0.62);
  border: 1px solid rgba(237, 240, 246, 0.88);
  border-radius: 18px;
  box-shadow: 0 12px 40px rgba(28, 53, 91, 0.06);
}

.figma-shell__panel-header {
  display: flex;
  align-items: center;
  min-width: 0;
}

.figma-shell__panel--platform {
  flex: 1;
  gap: 0;
  box-sizing: border-box;
  width: 100%;
  min-height: 100%;
  padding: 0 16px 16px;
  background: #ffffff;
  border: 0;
  border-radius: 8px;
  box-shadow: 0 2px 9px rgba(176, 179, 214, 0.1);
}

.figma-shell__panel-header--platform {
  min-height: 40px;
  padding: 0 16px;
  border-bottom: 1px solid #e6e8ed;
}

.figma-shell__tabs {
  display: flex;
  align-items: center;
  gap: 24px;
  min-height: 36px;
  padding: 4px 0 0;
  border-bottom: 1px solid #e6e8ed;
}

.figma-shell__tab {
  position: relative;
  padding: 8px 0 10px;
  border: 0;
  background: transparent;
  color: #444a57;
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;

  &.is-active {
    color: #2e5ef0;
  }

  &.is-active::after {
    content: '';
    position: absolute;
    right: 0;
    bottom: -1px;
    left: 0;
    height: 2px;
    background: #2e5ef0;
    border-radius: 999px;
  }
}

.figma-shell__stats {
  position: relative;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 12px;
  padding: 14px 16px 12px;
  overflow: hidden;
  background:
    radial-gradient(circle at 18% 0%, rgba(220, 231, 255, 0.95), transparent 32%),
    radial-gradient(circle at 82% 0%, rgba(214, 239, 255, 0.72), transparent 28%),
    linear-gradient(180deg, rgba(243, 247, 255, 0.98) 0%, rgba(247, 249, 254, 0.92) 100%);
  border: 1px solid #eef2fb;
  border-radius: 14px;
}

.figma-shell__stats::before {
  content: '';
  position: absolute;
  inset: 0;
  background-image: var(--figma-shell-stats-decoration, none);
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  opacity: 0.5;
  pointer-events: none;
}

.figma-shell__stats::after {
  content: '';
  position: absolute;
  inset: 0;
  background:
    radial-gradient(circle at 35% 45%, rgba(102, 148, 255, 0.08), transparent 20%),
    radial-gradient(circle at 70% 30%, rgba(84, 196, 255, 0.08), transparent 18%);
  pointer-events: none;
}

.figma-shell__stats > * {
  position: relative;
  z-index: 1;
}

.figma-shell__stats--resource-list {
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 16px;
  width: 100%;
  min-height: 120px;
  margin: 16px 0 0;
  padding: 13px 17px 19px;
  border: 0;
  border-radius: 0;
  background: linear-gradient(86.78deg, rgba(110, 161, 255, 0.15) 0%, rgba(204, 231, 245, 0.15) 50.63%, rgba(174, 121, 255, 0.053) 99.92%);
}

.figma-shell__stats--resource-list::before {
  background-image: var(--figma-shell-stats-decoration-image, none);
  opacity: 0.3;
  filter: blur(1px);
  background-position: -3px -431px;
  background-repeat: no-repeat;
  background-size: 1017px 550px;
  -webkit-mask-image: var(--figma-shell-stats-decoration, none);
  -webkit-mask-position: center center;
  -webkit-mask-repeat: no-repeat;
  -webkit-mask-size: 1010px 120px;
  mask-image: var(--figma-shell-stats-decoration, none);
  mask-position: center center;
  mask-repeat: no-repeat;
  mask-size: 1010px 120px;
}

.figma-shell__stats--resource-list::after {
  display: none;
}

.figma-shell__stats--service-provider-list {
  grid-template-columns: repeat(5, minmax(0, 1fr));
}

.figma-shell__stats--person-list {
  grid-template-columns: repeat(4, minmax(0, 1fr));
}

.figma-shell__stats--project-list {
  grid-template-columns: repeat(7, minmax(0, 1fr));
}

.figma-shell__stats--software-list {
  grid-template-columns: repeat(6, minmax(0, 1fr));
}

.figma-shell__stats--hardware-list {
  grid-template-columns: repeat(5, minmax(0, 1fr));
}

.figma-shell__stat-card {
  position: relative;
  min-height: 74px;
  padding: 16px 18px 14px;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.82);
  border: 1px solid rgba(232, 238, 250, 0.96);
  border-radius: 10px;
  box-shadow: 0 8px 24px rgba(69, 104, 173, 0.05);

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(120deg, rgba(255, 255, 255, 0.35), transparent 56%);
    pointer-events: none;
  }
}

.figma-shell__tabs--platform {
  gap: 32px;
  min-height: 40px;
  padding: 0 16px;
  border-bottom: 1px solid #e6e8ed;
}

.figma-shell__tabs--platform .figma-shell__tab {
  padding: 9px 0;
  color: #444a57;
  font-size: 14px;
  font-weight: 400;
  line-height: 22px;
}

.figma-shell__tabs--platform .figma-shell__tab.is-active {
  color: #2e5ef0;
}

.figma-shell__tabs--platform .figma-shell__tab.is-active::after {
  bottom: -1px;
}

.figma-shell__stats--resource-list .figma-shell__stat-card {
  min-height: 88px;
  padding: 16px 17px 10px;
  background: rgba(255, 255, 255, 0.7);
  border: 0;
  border-radius: 0;
  box-shadow: none;
}

.figma-shell__stats--resource-list .figma-shell__stat-card::before {
  display: none;
}

.figma-shell__stat-skeleton {
  width: 100%;
}

.figma-shell__stat-icon {
  position: absolute;
  top: 16px;
  right: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  border-radius: 6px;
  font-size: 12px;
  box-shadow: 0 6px 14px rgba(46, 94, 240, 0.16);

  &.is-primary {
    background: linear-gradient(180deg, #6f92ff 0%, #3f68f4 100%);
    color: #fff;
  }

  &.is-cyan {
    background: linear-gradient(180deg, #6f92ff 0%, #3f68f4 100%);
    color: #fff;
  }

  &.is-green {
    background: linear-gradient(180deg, #6f92ff 0%, #3f68f4 100%);
    color: #fff;
  }

  &.is-orange {
    background: linear-gradient(180deg, #6f92ff 0%, #3f68f4 100%);
    color: #fff;
  }

  &.is-violet {
    background: linear-gradient(180deg, #6f92ff 0%, #3f68f4 100%);
    color: #fff;
  }
}

.figma-shell__stats--resource-list .figma-shell__stat-icon {
  top: 15px;
  right: 18px;
  width: 20px;
  height: 20px;
  border-radius: 0;
  background: transparent;
  box-shadow: none;
  overflow: visible;
}

.figma-shell__stat-icon-image {
  display: block;
  width: 100%;
  height: 100%;
}

.figma-shell__stats--resource-list .figma-shell__stat-icon-image {
  position: absolute;
  max-width: none;
  max-height: none;
}

.figma-shell__stats--service-provider-list .figma-shell__stat-card.is-total .figma-shell__stat-icon {
  top: 15px;
  right: 24px;
  width: 22.63px;
  height: 20.02px;
}

.figma-shell__stats--service-provider-list .figma-shell__stat-card.is-development .figma-shell__stat-icon {
  top: 16px;
  right: 24px;
  width: 22.38px;
  height: 20.02px;
}

.figma-shell__stats--service-provider-list .figma-shell__stat-card.is-ops .figma-shell__stat-icon {
  top: 15px;
  right: 24px;
  width: 20.04px;
  height: 20px;
}

.figma-shell__stats--service-provider-list .figma-shell__stat-card.is-hardware .figma-shell__stat-icon {
  top: 15px;
  right: 16px;
  width: 20.04px;
  height: 20px;
}

.figma-shell__stats--service-provider-list .figma-shell__stat-card.is-integration .figma-shell__stat-icon {
  top: 15px;
  right: 18px;
  width: 20px;
  height: 20px;
}

.figma-shell__stats--person-list .figma-shell__stat-card.is-total .figma-shell__stat-icon {
  top: 14px;
  right: 24px;
  width: 22.61px;
  height: 20px;
}

.figma-shell__stats--person-list .figma-shell__stat-card.is-development .figma-shell__stat-icon {
  top: 15px;
  right: 24px;
  width: 22.35px;
  height: 20px;
}

.figma-shell__stats--person-list .figma-shell__stat-card.is-ops .figma-shell__stat-icon,
.figma-shell__stats--person-list .figma-shell__stat-card.is-hardware-owner .figma-shell__stat-icon {
  top: 15px;
  right: 24px;
  width: 20px;
  height: 20px;
}

.figma-shell__stats--project-list .figma-shell__stat-card.is-total .figma-shell__stat-icon {
  top: 16.63px;
  right: 16.3px;
  width: 18.35px;
  height: 16.23px;
}

.figma-shell__stats--project-list .figma-shell__stat-card.is-new-build .figma-shell__stat-icon {
  top: 17.78px;
  right: 15.97px;
  width: 18.35px;
  height: 16.42px;
}

.figma-shell__stats--project-list .figma-shell__stat-card.is-software-upgrade .figma-shell__stat-icon {
  top: 15px;
  right: 13.82px;
  width: 16.84px;
  height: 20px;
}

.figma-shell__stats--project-list .figma-shell__stat-card.is-ops-project .figma-shell__stat-icon,
.figma-shell__stats--project-list .figma-shell__stat-card.is-service-purchase .figma-shell__stat-icon,
.figma-shell__stats--project-list .figma-shell__stat-card.is-hardware-purchase .figma-shell__stat-icon,
.figma-shell__stats--project-list .figma-shell__stat-card.is-integration-project .figma-shell__stat-icon {
  top: 15px;
  right: 15.12px;
  width: 16.84px;
  height: 20px;
}

.figma-shell__stats--software-list .figma-shell__stat-card.is-total .figma-shell__stat-icon {
  top: 15px;
  right: 24px;
  width: 22.61px;
  height: 20px;
}

.figma-shell__stats--software-list .figma-shell__stat-card.is-external-service .figma-shell__stat-icon {
  top: 15px;
  right: 24px;
  width: 22.35px;
  height: 20px;
}

.figma-shell__stats--software-list .figma-shell__stat-card.is-internal-office .figma-shell__stat-icon {
  top: 15px;
  right: 24px;
  width: 20px;
  height: 20px;
}

.figma-shell__stats--software-list .figma-shell__stat-card.is-database-software .figma-shell__stat-icon {
  top: 15px;
  right: 18px;
  width: 20px;
  height: 20px;
}

.figma-shell__stats--software-list .figma-shell__stat-card.is-basic-support .figma-shell__stat-icon,
.figma-shell__stats--software-list .figma-shell__stat-card.is-security-software .figma-shell__stat-icon {
  top: 15px;
  right: 19px;
  width: 20px;
  height: 20px;
}

.figma-shell__stats--hardware-list .figma-shell__stat-card.is-total .figma-shell__stat-icon {
  top: 15px;
  right: 24px;
  width: 22.63px;
  height: 20.02px;
}

.figma-shell__stats--hardware-list .figma-shell__stat-card.is-server .figma-shell__stat-icon {
  top: 16px;
  right: 24px;
  width: 22.38px;
  height: 20.02px;
}

.figma-shell__stats--hardware-list .figma-shell__stat-card.is-network-device .figma-shell__stat-icon {
  top: 15px;
  right: 24px;
  width: 20.04px;
  height: 20px;
}

.figma-shell__stats--hardware-list .figma-shell__stat-card.is-terminal-device .figma-shell__stat-icon {
  top: 15px;
  right: 16px;
  width: 20.04px;
  height: 20px;
}

.figma-shell__stats--hardware-list .figma-shell__stat-card.is-peripheral .figma-shell__stat-icon {
  top: 15px;
  right: 18px;
  width: 20px;
  height: 20px;
}

.figma-shell__stats--service-provider-list .figma-shell__stat-card.is-total .figma-shell__stat-icon-image {
  top: -19.98%;
  left: -35.35%;
  width: 170.7%;
  height: 179.91%;
}

.figma-shell__stats--service-provider-list .figma-shell__stat-card.is-development .figma-shell__stat-icon-image {
  top: -19.98%;
  left: -35.75%;
  width: 171.5%;
  height: 179.92%;
}

.figma-shell__stats--service-provider-list .figma-shell__stat-card.is-ops .figma-shell__stat-icon-image,
.figma-shell__stats--service-provider-list .figma-shell__stat-card.is-hardware .figma-shell__stat-icon-image {
  top: -20%;
  left: -39.91%;
  width: 179.82%;
  height: 180%;
}

.figma-shell__stats--service-provider-list .figma-shell__stat-card.is-integration .figma-shell__stat-icon-image {
  top: -20%;
  left: -40%;
  width: 180%;
  height: 180%;
}

.figma-shell__stats--person-list .figma-shell__stat-card.is-total .figma-shell__stat-icon-image {
  top: -20%;
  left: -35.38%;
  width: 170.76%;
  height: 180%;
}

.figma-shell__stats--person-list .figma-shell__stat-card.is-development .figma-shell__stat-icon-image {
  top: -20%;
  left: -35.79%;
  width: 171.58%;
  height: 180%;
}

.figma-shell__stats--person-list .figma-shell__stat-card.is-ops .figma-shell__stat-icon-image,
.figma-shell__stats--person-list .figma-shell__stat-card.is-hardware-owner .figma-shell__stat-icon-image {
  top: -20%;
  left: -40%;
  width: 180%;
  height: 180%;
}

.figma-shell__stats--project-list .figma-shell__stat-card.is-total .figma-shell__stat-icon-image {
  top: -24.64%;
  left: -43.59%;
  width: 187.18%;
  height: 198.56%;
}

.figma-shell__stats--project-list .figma-shell__stat-card.is-new-build .figma-shell__stat-icon-image {
  top: -24.36%;
  left: -43.59%;
  width: 187.18%;
  height: 197.44%;
}

.figma-shell__stats--project-list .figma-shell__stat-card.is-software-upgrade .figma-shell__stat-icon-image,
.figma-shell__stats--project-list .figma-shell__stat-card.is-ops-project .figma-shell__stat-icon-image,
.figma-shell__stats--project-list .figma-shell__stat-card.is-service-purchase .figma-shell__stat-icon-image,
.figma-shell__stats--project-list .figma-shell__stat-card.is-hardware-purchase .figma-shell__stat-icon-image,
.figma-shell__stats--project-list .figma-shell__stat-card.is-integration-project .figma-shell__stat-icon-image {
  top: -20%;
  left: -47.51%;
  width: 195.02%;
  height: 180%;
}

.figma-shell__stats--software-list .figma-shell__stat-card.is-total .figma-shell__stat-icon-image {
  top: -20%;
  left: -35.38%;
  width: 170.76%;
  height: 180%;
}

.figma-shell__stats--software-list .figma-shell__stat-card.is-external-service .figma-shell__stat-icon-image {
  top: -20%;
  left: -35.79%;
  width: 171.58%;
  height: 180%;
}

.figma-shell__stats--software-list .figma-shell__stat-card.is-internal-office .figma-shell__stat-icon-image,
.figma-shell__stats--software-list .figma-shell__stat-card.is-database-software .figma-shell__stat-icon-image,
.figma-shell__stats--software-list .figma-shell__stat-card.is-basic-support .figma-shell__stat-icon-image,
.figma-shell__stats--software-list .figma-shell__stat-card.is-security-software .figma-shell__stat-icon-image {
  top: -20%;
  left: -40%;
  width: 180%;
  height: 180%;
}

.figma-shell__stats--hardware-list .figma-shell__stat-card.is-total .figma-shell__stat-icon-image {
  top: -19.98%;
  left: -35.35%;
  width: 170.7%;
  height: 179.93%;
}

.figma-shell__stats--hardware-list .figma-shell__stat-card.is-server .figma-shell__stat-icon-image {
  top: -19.98%;
  left: -35.75%;
  width: 171.5%;
  height: 179.94%;
}

.figma-shell__stats--hardware-list .figma-shell__stat-card.is-network-device .figma-shell__stat-icon-image,
.figma-shell__stats--hardware-list .figma-shell__stat-card.is-terminal-device .figma-shell__stat-icon-image {
  top: -20%;
  left: -39.91%;
  width: 179.82%;
  height: 180%;
}

.figma-shell__stats--hardware-list .figma-shell__stat-card.is-peripheral .figma-shell__stat-icon-image {
  top: -20%;
  left: -40%;
  width: 180%;
  height: 180%;
}

.figma-shell__stat-label {
  color: #858a99;
  font-size: 13px;
  line-height: 20px;
}

.figma-shell__stats--resource-list .figma-shell__stat-label {
  font-size: 14px;
  font-weight: 400;
  line-height: 22px;
}

.figma-shell__stat-value {
  margin-top: 8px;
  color: #151b26;
  font-size: 18px;
  font-weight: 700;
  line-height: 1.1;
}

.figma-shell__stats--resource-list .figma-shell__stat-value {
  margin-top: 0;
  font-family: 'DIN Alternate', 'Arial Narrow', sans-serif;
  font-size: 22px;
  font-weight: 700;
  line-height: 40px;
}

.figma-shell__content {
  display: flex;
  flex: 1;
  flex-direction: column;
  min-height: 0;
  padding: 0 14px 14px;
  background: rgba(255, 255, 255, 0.92);
  border-radius: 14px;
}

.figma-shell__content--resource-list {
  width: 100%;
  min-height: clamp(300px, calc(100vh - 660px), 360px);
  padding: 0;
  background: #ffffff;
  border-radius: 0 0 12px 12px;
}

.figma-shell__toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 12px 0;
}

.figma-shell__toolbar--resource-list {
  width: 100%;
  padding: 16px 0;
  align-items: center;
}

.figma-shell__toolbar-main,
.figma-shell__toolbar-extra {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
}

.figma-shell__toolbar-main {
  flex: 1;
  overflow: auto hidden;
}

.figma-shell__toolbar-extra {
  flex-shrink: 0;
}

.figma-shell__table {
  flex: 1;
  min-height: 0;
}

.figma-shell__content--resource-list .figma-shell__table,
.figma-shell__content--resource-list .figma-shell__pagination {
  width: 100%;
}

.figma-shell__content--resource-list .figma-shell__table {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  min-height: 160px;
}

.figma-shell__pagination {
  padding-top: 12px;
}

.figma-shell__pagination--resource-list {
  padding-top: 14px;
}

@media only screen and (max-width: 991px) {
  .figma-shell__header {
    padding: 0 16px;
  }

  .figma-shell__body {
    flex-direction: column;
  }

  .figma-shell__aside {
    width: auto;
    flex-direction: row;
    justify-content: flex-start;
    overflow-x: auto;
    padding-bottom: 8px;
    border-right: 0;
    border-bottom: 1px solid #edf0f6;
  }

  .figma-shell__aside-body {
    flex-direction: row;
  }

  .figma-shell__aside-toggle {
    display: none;
  }

  .figma-shell__main {
    padding: 16px 12px 12px;
  }

  .figma-shell__main--platform {
    display: block;
    padding: 0 12px 12px;
    min-height: auto;
  }

  .figma-shell__panel {
    min-height: auto;
    padding: 0 12px 12px;
    border-radius: 16px;
  }

  .figma-shell__panel--platform {
    flex: initial;
    width: auto;
    min-height: auto;
    padding: 0 12px 12px;
    border-radius: 12px;
  }

  .figma-shell__panel-header--platform {
    padding: 12px 0;
  }

  .figma-shell__stats {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    padding-inline: 0;
  }

  .figma-shell__stats--resource-list {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    width: 100%;
    margin-top: 8px;
    padding: 12px;
  }

  .figma-shell__content {
    padding-inline: 0;
    background: transparent;
  }

  .figma-shell__content--resource-list {
    width: auto;
    min-height: auto;
    padding: 0;
    background: #ffffff;
  }

  .figma-shell__tabs--platform {
    padding: 0;
    gap: 24px;
  }

  .figma-shell__toolbar {
    flex-direction: column;
    align-items: stretch;
  }

  .figma-shell__toolbar-main,
  .figma-shell__toolbar-extra {
    flex-wrap: wrap;
  }

  .figma-shell__toolbar-extra {
    justify-content: flex-end;
  }

  .figma-shell__tools {
    margin-left: 0;
  }

  .figma-shell__tools--platform {
    gap: 4px;
  }

  .figma-shell__account-name {
    display: none;
  }
}
</style>
