<template>
  <el-tabs
    v-if="tags.length > 0"
    v-model="active"
    class="hidden-sm-and-down"
    addable
    @tab-click="tabClick"
    @tab-remove="tabRemove"
    @contextmenu="tabContextmenu"
  >
    <el-tab-pane
      v-for="item in tags"
      :key="item.fullPath"
      :label="item.meta.title"
      :name="item.fullPath"
      :closable="!item.meta.affix && item.fullPath !== homepage"
    >
      <template #label>{{ $t(item.meta?.title) }}</template>
    </el-tab-pane>
    <template #add-icon>
      <el-dropdown
        trigger="click"
        size="small"
        :show-arrow="false"
        :popper-options="{ modifiers: [{ name: 'offset', options: { offset: [0, 8] } }] }"
      >
        <el-icon class="ri-microsoft-fill" color="var(--el-text-color-regular)" />
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item icon="ri-refresh-line" @click="tagRefresh(route)">{{ $t('ec.lyt.tabs.ctxmenu.refresh') }}</el-dropdown-item>
            <el-dropdown-item
              icon="ri-close-line"
              :disabled="route.meta.affix || route.fullPath === homepage"
              @click="tagClose(route)"
              >{{ $t('ec.lyt.tabs.ctxmenu.close') }}</el-dropdown-item
            >
            <el-dropdown-item icon="ri-arrow-left-line" divided @click="tagCloseLeft(route)">{{ $t('ec.lyt.tabs.ctxmenu.closeL') }}</el-dropdown-item>
            <el-dropdown-item icon="ri-arrow-right-line" @click="tagCloseRight(route)">{{ $t('ec.lyt.tabs.ctxmenu.closeR') }}</el-dropdown-item>
            <el-dropdown-item icon="ri-close-line" @click="tagCloseOthers(route)">{{ $t('ec.lyt.tabs.ctxmenu.closeO') }}</el-dropdown-item>
            <el-dropdown-item icon="ri-arrow-right-up-line" divided @click="tagWindowOpen(route)">{{ $t('ec.lyt.tabs.ctxmenu.window') }}</el-dropdown-item>
            <el-dropdown-item icon="ri-expand-diagonal-s-line" @click="tagMaximize(route)">{{ $t('ec.lyt.tabs.ctxmenu.maximize') }}</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </template>
  </el-tabs>
  <el-dropdown
    ref="ctxmenuRef"
    :virtual-ref="ctxmenuTriggerRef"
    :show-arrow="false"
    :popper-options="{ modifiers: [{ name: 'offset', options: { offset: [0, 0] } }] }"
    virtual-triggering
    trigger="contextmenu"
    placement="bottom-start"
    size="small"
  >
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item icon="ri-refresh-line" @click="tagRefresh(ctxmenuActive)">{{ $t('ec.lyt.tabs.ctxmenu.refresh') }}</el-dropdown-item>
        <el-dropdown-item
          icon="ri-close-line"
          :disabled="ctxmenuActive.meta.affix || ctxmenuActive.fullPath === homepage"
          @click="tagClose(ctxmenuActive)"
          >{{ $t('ec.lyt.tabs.ctxmenu.close') }}</el-dropdown-item
        >
        <el-dropdown-item icon="ri-arrow-left-line" divided @click="tagCloseLeft(ctxmenuActive)">{{ $t('ec.lyt.tabs.ctxmenu.closeL') }}</el-dropdown-item>
        <el-dropdown-item icon="ri-arrow-right-line" @click="tagCloseRight(ctxmenuActive)">{{ $t('ec.lyt.tabs.ctxmenu.closeR') }}</el-dropdown-item>
        <el-dropdown-item icon="ri-close-line" @click="tagCloseOthers(ctxmenuActive)">{{ $t('ec.lyt.tabs.ctxmenu.closeO') }}</el-dropdown-item>
        <el-dropdown-item icon="ri-arrow-right-up-line" divided @click="tagWindowOpen(ctxmenuActive)">{{ $t('ec.lyt.tabs.ctxmenu.window') }}</el-dropdown-item>
        <el-dropdown-item icon="ri-expand-diagonal-s-line" @click="tagMaximize(ctxmenuActive)">{{ $t('ec.lyt.tabs.ctxmenu.maximize') }}</el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>
<script setup>
import { ref, watch, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useRoute, useRouter } from 'vue-router'
import { useTabsStore } from '@/stores/modules/tabsStore'
import { usePermissionStore } from '@/stores/modules/permissionStore'
import NProgress from 'nprogress'

const route = useRoute()
const router = useRouter()

const active = ref(route.fullPath)

const { homepage, menus } = storeToRefs(usePermissionStore())
const { visits: tags } = storeToRefs(useTabsStore())
const {
  AddTabsVisits,
  RefreshTabsVisits,
  DeleteTabsVisitsLeft,
  DeleteTabsVisitsRight,
  DeleteTabsVisits,
  DeleteTabsVisitsOthers,
} = useTabsStore()
const tagPush = (tag) => {
  const { path, name, meta, params, query, fullPath } = tag
  // Exclude breadcrumbs, as circular references may cause storage errors
  const { breadcrumb, ...m } = meta
  if (!(name && meta)) return
  const route = { path, fullPath: fullPath || path, query, params, name, meta: m }

  AddTabsVisits(route)
  active.value = route.fullPath
}
const tagRefresh = async (tag) => {
  NProgress.start()
  if (tag) await router.push(tag)
  RefreshTabsVisits(tag)
  NProgress.done()
}
const tabClick = (pane) => {
  const name = pane.props.name
  const tag = tags.value.find((t) => t.fullPath === name)
  router.push(tag)
}
const tabRemove = async (name) => {
  const tag = tags.value.find((t) => t.fullPath === name)
  tagClose(tag)
}
const tagCloseLeft = async (tag) => {
  DeleteTabsVisitsLeft(tag)
}
const tagCloseRight = async (tag) => {
  DeleteTabsVisitsRight(tag)
}
const tagClose = async (tag) => {
  const index = tags.value.findIndex((t) => t.fullPath === tag.fullPath)
  if (index > 0) {
    router.push(tags.value[index - 1])
  } else {
    router.push('/')
  }
  DeleteTabsVisits(tag)
}

const tagCloseOthers = async (tag) => {
  if (tag.fullPath !== route.fullPath) router.push(tag)
  DeleteTabsVisitsOthers(tag)
}
const tagMaximize = (tag) => {
  if (route.fullPath !== tag.fullPath) router.push(tag)
  document.getElementById('app').classList.add('app-maximize')
}
const tagWindowOpen = async (tag) => {
  const url = '#' + tag.fullPath || '/'
  window.open(url)
}

const ctxmenuActive = ref({path: '', fullPath: '', name: '', query: {}, params: {}, meta: {} })
const ctxmenuRef = ref(null)
const ctxmenuPosition = ref({ top: 0, left: 0, bottom: 0, right: 0 })
const ctxmenuTriggerRef = ref({ getBoundingClientRect: () => ctxmenuPosition.value })

const tabContextmenu = (e) => {
  const id = e.target.id || e.target.parentNode.id
  if (!id) return
  const name = id.replace('tab-', '')
  const tag = tags.value.find((route) => route.fullPath === name)
  if (!tag) return
  ctxmenuActive.value = tag
  ctxmenuPosition.value = DOMRect.fromRect({ x: e.clientX, y: e.clientY })
  e.preventDefault()
  ctxmenuRef.value?.handleOpen()
}

watch(
  () => route.fullPath,
  () => {
    tagPush(route)
  },
)

const tabInit = (tags) => {
  for (const t of tags) {
    if (t.meta?.affix) {
      tagPush(t)
    }
    if (t.children?.length > 0) {
      tabInit(t.children)
    }
  }
}
onMounted(async () => {
  tabInit(menus.value)
  tagPush(route)
})
</script>
<style lang="scss" scoped>
.el-tabs {
  --el-tabs-header-height: 32px;
  background-color: var(--el-fill-color-blank);
  box-shadow: var(--el-box-shadow-lighter);

  :deep() {
    .el-tabs__content {
      display: none;
    }
    .el-tabs__nav,
    .el-tabs__nav-wrap,
    .el-tabs__item,
    .el-tabs__header {
      margin: 0;
      border: 0;
    }

    .el-tabs__nav-wrap {
      &.is-scrollable {
        padding: 0 16px;
      }

      &::after {
        content: none;
      }
    }

    .el-tabs__nav {
      display: flex;
      align-items: center;
    }

    .el-tabs__active-bar {
      display: none;
    }

    .el-tabs__item + .el-tabs__item {
      &::before {
        content: '';
        position: absolute;
        left: 0;
        height: 14px;
        width: 1px;
        background-color: var(--el-border-color-light);
      }
    }

    .el-tabs__item {
      display: inline-flex;
      align-items: center;
      padding: 0 16px !important;
      font-size: var(--el-font-size-small);
      font-weight: normal;
      outline: 0 !important;
      box-shadow: none !important;
      .el-icon {
        margin-right: 4px;
        font-size: var(--el-font-size-medium);
      }

      .el-icon.is-icon-close {
        width: 0;
        height: 14px;
        margin-left: 4px;
        margin-right: -2px;
        font-size: var(--el-font-size-base);
        // opacity: 0.5;
        overflow: hidden;
        transition: width 0.3s;
        border-radius: var(--el-border-radius-base);
      }

      &::after {
        content: '';
        position: absolute;
        bottom: 0;
        width: 0;
        height: 2px;
        background-color: var(--el-color-primary);
        transition: width var(--el-transition-duration);
        border-radius: var(--el-border-radius-base);
      }

      .el-icon.is-icon-close {
        &:hover {
          background-color: var(--el-color-primary);
          color: var(--el-color-white);
        }
      }

      &:hover,
      &.is-active {
        .el-icon.is-icon-close {
          width: 14px;
        }
        &::after {
          width: 100%;
        }
      }
    }

    .el-tabs__new-tab {
      height: var(--el-tabs-header-height);
      width: 16px;
      margin: 0 16px;
      border: 0;
      border-radius: var(--el-border-radius-base);
    }
  }
}
</style>

