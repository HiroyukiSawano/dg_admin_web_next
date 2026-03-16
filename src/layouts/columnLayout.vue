<template>
  <div
    class="el-layout el-layout--column"
    :class="`is-${strategy} ${collapse ? 'is-collapse' : ''} on-${device} ${tabs ? '' : 'no-tabs'} ${breadcrumb ? '' : 'no-breadcrumb'}`"
  >
    <el-container>
      <div class="el-splite hidden-sm-and-down">
        <div class="el-splite__header">
          <el-tooltip effect="dark" :content="$t('ec.app.name')" placement="right">
            <layout-logo />
          </el-tooltip>
        </div>
        <div class="el-splite__body">
          <el-scrollbar>
            <el-menu :default-active="prevs.meta?.active || prevs.path" router collapse>
              <el-menu-item v-for="item in menus" :key="item" :index="item.path">
                <el-icon v-if="item.meta?.icon" class="el-menu-item__icon">
                  <component :is="item.meta?.icon" />
                </el-icon>
                <span class="el-menu-item__label">{{ $t(item.meta?.title) }}</span>
                <em v-if="item.meta?.tag" class="el-menu-item__tag"></em>
              </el-menu-item>
            </el-menu>
          </el-scrollbar>
        </div>
        <div v-if="nexts.length > 0" class="el-splite__footer" @click="UpdateStyle({ key: 'collapse', value: !collapse })">
          <el-icon size="var(--el-font-size-medium)">
            <component :is="`${collapse ? 'ri-menu-line' : 'ri-close-line'}`" />
          </el-icon>
        </div>
      </div>
      <el-aside class="hidden-sm-and-down" :class="collapse ? 'el-aside--collapse' : ''">

        <div class="el-aside__header" v-if="prevs.meta?.title">
          <div class="el-aside__title">
            <span>{{ $t(prevs.meta?.title) }}</span>
          </div>
        </div>
        <div class="el-aside__body">
          <el-scrollbar>
            <transition name="el-fade-in">
              <el-menu :default-active="route.meta?.active || route.path" router :collapse="collapse" :unique-opened="unique">
                <layout-menu :data="nexts" />
              </el-menu>
            </transition>
          </el-scrollbar>
        </div>
      </el-aside>
      <el-container>
        <el-header>
          <layout-logo class="hidden-md-and-up" />
          <layout-breadcrumb v-if="breadcrumb && !route.meta.hiddenBreadcrumb" class="hidden-sm-and-down" />
          <layout-tools class="margin-left-auto" />
        </el-header>

        <layout-tabs v-if="tabs" />
        <el-main id="app-main">
          <router-view v-slot="{ Component }">
            <keep-alive :include="caches">
              <component :is="Component" v-if="visible" :key="route.fullPath" />
            </keep-alive>
          </router-view>
          <layout-frame />
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>
<script setup>
import { ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import LayoutBreadcrumb from './components/LayoutBreadcrumb'
import LayoutLogo from './components/LayoutLogo'
import LayoutTools from './components/LayoutTools'
import LayoutTabs from './components/LayoutTabs'
import LayoutMenu from './components/LayoutMenu'
import LayoutFrame from './components/LayoutFrame'
import { useStyleStore } from '@/stores/modules/styleStore'
import { useSystemStore } from '@/stores/modules/systemStore'

import { usePermissionStore } from '@/stores/modules/permissionStore'
import { useAliveStore } from '@/stores/modules/aliveStore'
import { useRoute } from 'vue-router'
defineOptions({ name: 'LayoutColumn' })

const route = useRoute()
// 获取菜单数据
const { menus } = storeToRefs(usePermissionStore())
// 上级菜单对象
const prevs = ref({})
// 下级菜单数据
const nexts = ref([])

// 获取样式状态
const { unique, tabs, collapse, breadcrumb, strategy } = storeToRefs(useStyleStore())
const { device } = storeToRefs(useSystemStore())
const { UpdateStyle } = useStyleStore()

// 获取保活状态
const { caches, visible } = storeToRefs(useAliveStore())
// 更新菜单数据
const updateMenus = () => {
  // 获取当前路由的面包屑导航数据
  const { meta: { breadcrumb = [] } = {} } = route
  // 更新上级菜单对象，如果有面包屑则取第一个，否则为空对象
  prevs.value = breadcrumb.length > 0 ? breadcrumb[0] : {}
  // 根据上级菜单的路径查找对应的子菜单数据
  nexts.value = menus.value.find(m => m.path === prevs.value.path)?.children || []
  UpdateStyle({ key: 'collapse', value: nexts.value.length === 0 })
}
// 监听路径变化，更新菜单数据
watch(() => route, () => updateMenus(), { deep: true, immediate: true })

</script>

<style lang="scss">
.el-layout.el-layout--column {
  --el-layout-header-height: 56px;
  --el-layout-tabs-height: 32px;
  --el-layout-breadcrumb-height: 32px;
  --el-layout-splite-width: 72px;
  --el-layout-aside-width: 224px;
  --el-layout-menu-width: 224px;
  height: 100%;
  width: 100%;
  transition: var(--el-transition-all);
  &.is-collapse {
    --el-layout-aside-width: 0px;
    --el-layout-menu-width: 0px;
  }
  &.no-tabs {
    --el-layout-tabs-height: 0px;
  }
  &.no-breadcrumb {
    --el-layout-breadcrumb-height: 0px;
  }
  &.on-tablet,
  &.on-mobile {
    --el-layout-tabs-height: 0px;
    --el-layout-splite-width: 0px;
    --el-layout-aside-width: 0px;
    --el-layout-menu-width: 0px;
  }
  >.el-container,
  >.el-container>.el-container {
    width: 100%;
    height: 100%;
    min-height: 0;
    min-width: 0;
  }
  >.el-container>.el-container>.el-header,
  >.el-container>.el-splite,
  >.el-container>.el-aside,
  >.el-container>.el-container>.el-tabs {
    position: relative;
    background-color: var(--el-fill-color-blank);
    box-shadow: var(--el-box-shadow-lighter);
    transition: var(--el-transition-all);
  }
  >.el-container>.el-container>.el-header {
    --el-header-padding: 0 16px;
    --el-header-height: var(--el-layout-header-height);
    display: flex;
    align-items: center;
  }
  >.el-container>.el-splite {
    --el-splite-width: var(--el-layout-splite-width);
    width: var(--el-splite-width);
    display: flex;
    flex-direction: column;
    flex-shrink: 0;
    .el-splite__header {
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      height: 56px;

      .el-logo {
        > :not(svg) {
          display: none;
        }
      }
    }

    .el-splite__body {
      flex: 1;
      min-height: 0;
      .el-scrollbar {
        --el-scrollbar-bg-color: transparent;
      }
    }

    .el-splite__footer {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 48px;
      flex-shrink: 0;
      border-top: 1px solid var(--el-border-color-lighter);
      cursor: pointer;
    }

    .el-menu {
      --el-menu-item-height: 64px;
      --el-menu-base-level-padding: 0;
      --el-menu-bg-color: transparent;
      --el-menu-active-bg-color: var(--el-color-primary-light-9);
      --el-menu-active-text-color: var(--el-color-primary);
      width: var(--el-layout-splite-width);
      border: 0;
      transition: var(--el-transition-all);

      .el-menu-item {
        flex-direction: column;
        justify-content: center;
        align-items: center;
        font-size: var(--el-font-size-small);

        .el-menu-item__icon {
          justify-content: center;
          font-size: var(--el-font-size-medium);
        }

        .el-menu-item__label {
          height: initial;
          width: initial;
          visibility: initial;
          line-height: 1;
          margin-top: 8px;
        }
      }

      .el-menu-item.is-active,
      .el-sub-menu.is-active>.el-sub-menu__title,
      .el-menu-item.is-active:hover,
      .el-sub-menu.is-active>.el-sub-menu__title:hover {
        background-color: var(--el-menu-active-bg-color);
        color: var(--el-menu-active-text-color);
      }

      .el-menu-item:hover,
      .el-sub-menu>.el-sub-menu__title:hover {
        background-color: var(--el-menu-hover-bg-color);
        color: var(--el-menu-hover-text-color);
      }
    }
  }

  >.el-container>.el-aside {
    --el-aside-width: var(--el-layout-aside-width);
    width: var(--el-aside-width);
    display: flex;
    flex-direction: column;
    flex-shrink: 0;
    .el-aside__body {
      flex: 1;
      min-height: 0;
      .el-scrollbar {
        --el-scrollbar-bg-color: transparent;
      }
    }

    .el-aside__header {
      display: flex;
      align-items: center;
      justify-content: center;
      height: var(--el-layout-header-height);
    }
    .el-aside__title {
      display: flex;
      align-items: center;
      color: var(--el-color-primary);
      flex: 1;
      min-width: 0;
      padding: 0 16px;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
      word-break: break-all;
      font-weight: var(--el-font-weight-primary);

      >i {
        display: inline-flex;
        justify-content: flex-start;
        align-items: center;
        width: var(--el-menu-icon-width);
        font-size: var(--el-font-size-medium);
      }
    }

    .el-aside__footer {
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      height: 48px;
    }

    &.el-aside--collapse {
      .el-aside__title {
        justify-content: center;
        >i {
          justify-content: center;
        }
      }
    }

    .el-menu {
      --el-menu-item-height: 48px;
      --el-menu-sub-item-height: 48px;
      --el-menu-level-padding: 24px;
      --el-menu-base-level-padding: 16px;
      --el-menu-bg-color: transparent;
      --el-menu-hover-bg-color: var(--el-color-primary-light-9);
      --el-menu-active-bg-color: var(--el-color-primary-light-9);
      --el-menu-active-text-color: var(--el-color-primary);
      width: var(--el-layout-menu-width);
      transition: var(--el-transition-all);
      border: 0;

      .el-menu-item,
      .el-sub-menu>.el-sub-menu__title {

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
        color: var(--el-menu-active-text-color);
      }

      .el-menu-item.is-active {
        background-color: var(--el-menu-active-bg-color);
      }

      &.el-menu--collapse {
        .el-menu-item,
        .el-sub-menu>.el-sub-menu__title {
          flex-direction: column;
          justify-content: center;
          align-items: center;

          .el-menu-tooltip__trigger {
            justify-content: center;
          }

          .el-menu-item__icon,
          .el-sub-menu__icon {
            justify-content: center;
          }
        }
        .el-menu-item.is-active,
        .el-sub-menu.is-active>.el-sub-menu__title {
          color: var(--el-menu-active-text-color);
          background-color: var(--el-menu-active-bg-color);
        }
      }
    }
  }
  >.el-container>.el-container>.el-tabs {
    --el-tabs-header-height: var(--el-layout-tabs-height);
  }
  >.el-container>.el-container>.el-main {
    --el-main-padding: 16px;
  }
  >.el-container>.el-container>.el-main>.el-embed {
    height: 100%;
  }
  >.el-container>.el-splite {
    z-index: calc(var(--el-index-top) - 1);
  }
  >.el-container>.el-aside {
    z-index: calc(var(--el-index-top) - 2);
  }
  >.el-container>.el-container>.el-header {
    z-index: calc(var(--el-index-top) - 3);
  }
  >.el-container>.el-container>.el-tabs {
    z-index: calc(var(--el-index-top) - 4);
  }
  &.is-fixed {
    padding-top: calc(var(--el-layout-header-height) + var(--el-layout-tabs-height));
    padding-left: calc(var(--el-layout-splite-width) + var(--el-layout-aside-width));
    >.el-container>.el-container>.el-header,
    >.el-container>.el-splite,
    >.el-container>.el-aside,
    >.el-container>.el-container>.el-tabs {
      position: fixed;
    }
    >.el-container>.el-container>.el-header {
      top: 0;
      left: calc(var(--el-layout-splite-width) + var(--el-layout-aside-width));
      right: 0;
      transition: var(--el-transition-all);
    }
    >.el-container>.el-splite {
      top: 0;
      left: 0;
      bottom: 0;
    }
    >.el-container>.el-aside {
      top: 0;
      left: var(--el-layout-splite-width);
      bottom: 0;
    }
    >.el-container>.el-container>.el-tabs {
      top: var(--el-layout-header-height);
      left: calc(var(--el-layout-splite-width) + var(--el-layout-aside-width));
      right: 0;
      transition: var(--el-transition-all);
    }
    >.el-container>.el-container>.el-main {
      overflow: initial;
    }
  }
}

[data-theme='simple'] {
  .el-layout.el-layout--column {
    >.el-container>.el-container>.el-header,
    >.el-container>.el-splite,
    >.el-container>.el-aside,
    >.el-container>.el-container>.el-tabs {
      background-color: var(--el-fill-color-blank);
    }
    >.el-container>.el-splite {
      .el-menu {
        --el-menu-active-bg-color: var(--el-color-primary);
        --el-menu-active-text-color: var(--el-color-white);
      }
    }
  }
}

[data-theme='primary'] {
  .el-layout.el-layout--column {
    >.el-container>.el-splite {
      background-color: var(--el-color-primary);

      .el-splite__header {
        .el-logo>svg,
        .el-logo>span {
          color: var(--el-color-white);
        }
      }

      .el-splite__footer {
        color: var(--el-color-white);
        border-top-color: var(--el-color-primary-light-2);
      }

      .el-menu {
        --el-menu-active-bg-color: var(--el-color-primary-dark-2);
        --el-menu-hover-bg-color: var(--el-color-primary-dark-2);
        --el-menu-text-color: var(--el-color-white);
        --el-menu-active-text-color: var(--el-color-white);
        --el-menu-hover-text-color: var(--el-color-white);
      }

    }
  }
}

[data-theme='technological'] {
  .el-layout.el-layout--column {
    >.el-container>.el-splite {
      background-color: var(--el-color-primary-dark-9);

      .el-splite__header {
        .el-logo>svg,
        .el-logo>span {
          color: var(--el-color-primary);
        }
      }

      .el-splite__footer {
        color: var(--el-color-white);
        border-top-color: var(--el-color-primary-dark-6);
      }

      .el-menu {
        --el-menu-active-bg-color: var(--el-color-primary);
        --el-menu-hover-bg-color: var(--el-color-primary-dark-2);
        --el-menu-text-color: var(--el-color-white);
        --el-menu-active-text-color: var(--el-color-white);
        --el-menu-hover-text-color: var(--el-color-white);
      }
    }
  }
}
[data-theme='immersive'] {
  .el-layout.el-layout--column {
    >.el-container>.el-container>.el-header,
    >.el-container>.el-splite,
    >.el-container>.el-aside,
    >.el-container>.el-container>.el-tabs {
      background-color: transparent;
      box-shadow: none;
    }
    >.el-container>.el-splite {
      padding-left: 16px;
       .el-menu {
        width: calc(var(--el-layout-splite-width) - 16px);
        --el-menu-hover-bg-color: var(--el-color-primary-light-8);
        --el-menu-active-bg-color: var(--el-color-primary-light-8);
        .el-menu-item,
        .el-sub-menu>.el-sub-menu__title {
          border-radius: var(--el-border-radius-base);
        }
      }
    }

    >.el-container>.el-aside {
      .el-menu {
        --el-menu-hover-bg-color: var(--el-color-primary-light-8);
        --el-menu-active-bg-color: var(--el-color-primary-light-8);
        width: calc(var(--el-layout-menu-width) - 16px);
        .el-menu-item,
        .el-sub-menu>.el-sub-menu__title {
          border-radius: var(--el-border-radius-base);
        }
      }
      .el-aside__header,
      .el-aside__body {
        padding-left: 16px;
      }
    }
    >.el-container>.el-container>.el-header {
      .el-tools {
        .el-button.is-text.is-has-bg {
          background-color: var(--el-fill-color-extra-light);
        }
      }
    }
    >.el-container>.el-container>.el-tabs {
      .el-tabs__header {
        padding-left: 16px;
        padding-right: 16px;
      }
      .el-tabs__item {
        border-top-right-radius: var(--el-border-radius-base);
        border-top-left-radius: var(--el-border-radius-base);
        &::after,
        &::before {
          content: none;
        }
        &.is-active {
          background-color: var(--el-fill-color-blank);
        }
      }
    }
    >.el-container>.el-container>.el-main {
      padding-top: 0;
    }
    &.is-fixed {
      >.el-container>.el-container>.el-header,
      >.el-container>.el-splite,
      >.el-container>.el-aside,
      >.el-container>.el-container>.el-tabs {
        background-color: var(--el-bg-color-page);
      }
    }
  }
}

[data-theme='simple'][data-effect='glass'] {
  .el-layout.el-layout--column {
    >.el-container>.el-container>.el-header,
    >.el-container>.el-aside,
    >.el-container>.el-splite,
    >.el-container>.el-container>.el-tabs {
      backdrop-filter: saturate(180%) blur(16px);
      background-color: color-mix(in srgb, var(--el-fill-color-blank) var(--el-effect-glass-opacity), transparent);
    }
  }
}
[data-theme='immersive'][data-effect='glass'] {
  .el-layout.el-layout--column {
    >.el-container>.el-container>.el-header,
    >.el-container>.el-aside,
    >.el-container>.el-splite,
    >.el-container>.el-container>.el-tabs {
      backdrop-filter: saturate(180%) blur(16px);
      background-color: color-mix(in srgb, var(--el-bg-color-page) var(--el-effect-glass-opacity), transparent);
    }
  }
}
[data-theme='primary'][data-effect='glass'],
[data-theme='technological'][data-effect='glass'] {
  .el-layout.el-layout--column {
    >.el-container>.el-container>.el-header,
    >.el-container>.el-aside,
    >.el-container>.el-container>.el-tabs {
      backdrop-filter: saturate(180%) blur(16px);
      background-color: color-mix(in srgb, var(--el-fill-color-blank) var(--el-effect-glass-opacity), transparent);
    }
  }
}
</style>
