<template>
  <div class="figma-shell">
    <header class="figma-shell__header">
      <div class="figma-shell__brand">
        <div class="figma-shell__brand-icon">
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

      <div class="figma-shell__tools">
        <layout-tools />
      </div>
    </header>

    <div class="figma-shell__body">
      <aside class="figma-shell__aside">
        <button
          v-for="item in sideMenus"
          :key="item.key"
          class="figma-shell__side-link"
          :class="{ 'is-active': item.active, 'is-disabled': item.disabled }"
          type="button"
          :disabled="item.disabled"
          @click="navigate(item)"
        >
          <i :class="item.icon"></i>
          <span>{{ t(item.label) }}</span>
        </button>
      </aside>

      <main class="figma-shell__main">
        <section class="figma-shell__panel">
          <div v-if="!hideTabs && currentSubTabs.length > 0" class="figma-shell__tabs">
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

          <div v-if="!hideStats && (statsLoading || stats.length > 0)" class="figma-shell__stats">
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
            >
              <div class="figma-shell__stat-icon" :class="`is-${card.tone || 'primary'}`">
                <i :class="card.icon"></i>
              </div>
              <div class="figma-shell__stat-label">{{ card.label }}</div>
              <div class="figma-shell__stat-value">{{ card.value }}</div>
            </div>
          </div>

          <div class="figma-shell__content">
            <div class="figma-shell__toolbar">
              <div class="figma-shell__toolbar-main">
                <slot name="filters"></slot>
              </div>
              <div class="figma-shell__toolbar-extra">
                <slot name="actions"></slot>
              </div>
            </div>

            <div class="figma-shell__table">
              <slot></slot>
            </div>

            <div class="figma-shell__pagination">
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
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import { useAuthorizeStore } from '@/stores/modules/authorizeStore'
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
})

const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const { user } = storeToRefs(useAuthorizeStore())

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

const navigate = (item) => {
  if (!item.path || item.disabled || item.path === route.path) return
  router.push(item.path)
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

.figma-shell__brand {
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
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

.figma-shell__body {
  display: flex;
  min-height: calc(100vh - 56px);
}

.figma-shell__aside {
  display: flex;
  flex-direction: column;
  gap: 4px;
  width: 220px;
  padding: 16px 10px;
  border-right: 1px solid #edf0f6;
  background: rgba(255, 255, 255, 0.42);
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

.figma-shell__main {
  flex: 1;
  min-width: 0;
  padding: 24px 16px 16px;
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

.figma-shell__stats::after {
  content: '';
  position: absolute;
  inset: 0;
  background:
    radial-gradient(circle at 35% 45%, rgba(102, 148, 255, 0.08), transparent 20%),
    radial-gradient(circle at 70% 30%, rgba(84, 196, 255, 0.08), transparent 18%);
  pointer-events: none;
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

.figma-shell__stat-label {
  color: #858a99;
  font-size: 13px;
  line-height: 20px;
}

.figma-shell__stat-value {
  margin-top: 8px;
  color: #151b26;
  font-size: 18px;
  font-weight: 700;
  line-height: 1.1;
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

.figma-shell__toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 12px 0;
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

.figma-shell__pagination {
  padding-top: 12px;
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
    overflow-x: auto;
    padding-bottom: 8px;
    border-right: 0;
    border-bottom: 1px solid #edf0f6;
  }

  .figma-shell__main {
    padding: 16px 12px 12px;
  }

  .figma-shell__panel {
    min-height: auto;
    padding: 0 12px 12px;
    border-radius: 16px;
  }

  .figma-shell__stats {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    padding-inline: 0;
  }

  .figma-shell__content {
    padding-inline: 0;
    background: transparent;
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
}
</style>
