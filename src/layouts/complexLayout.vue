<template>
  <div
    class="el-layout el-layout--complex"
    :class="`is-${strategy} ${collapse ? 'is-collapse' : ''} on-${device} ${tabs ? '' : 'no-tabs'} ${breadcrumb ? '' : 'no-breadcrumb'}`"
  >
    <el-container>
      <el-header>
        <layout-logo />
        <el-menu class="justify-content-center hidden-sm-and-down" :default-active="prevs.meta?.active || prevs.path" router mode="horizontal">
          <el-menu-item v-for="item in menus" :key="item" :index="item.path">
            <el-icon v-if="item.meta?.icon" class="el-menu-item__icon">
              <component :is="item.meta?.icon" />
            </el-icon>
            <template #title>
              <span class="el-menu-item__label">{{ $t(item.meta?.title) }}</span>
              <em v-if="item.meta?.tag" class="el-menu-item__tag"></em>
            </template>
          </el-menu-item>
        </el-menu>
        <layout-tools class="margin-left-auto" />
      </el-header>
      <el-container>
        <el-aside class="hidden-sm-and-down" :class="collapse || nexts.length === 0 ? 'el-aside--collapse' : ''">
          <div class="el-aside__body">
            <el-scrollbar>
              <el-menu :default-active="route.meta?.active || route.path" router :collapse="collapse" :unique-opened="unique">
                <layout-menu :data="nexts" />
              </el-menu>
            </el-scrollbar>
          </div>
        </el-aside>
        <el-container direction="vertical">
          <layout-tabs v-if="tabs" />
          <el-main id="app-main">
            <layout-breadcrumb v-if="breadcrumb && !route.meta.hiddenBreadcrumb" />
            <router-view v-slot="{ Component }">
              <keep-alive :include="caches">
                <component :is="Component" v-if="visible" :key="route.fullPath" />
              </keep-alive>
            </router-view>
            <layout-frame />
          </el-main>
        </el-container>
      </el-container>
    </el-container>
  </div>
</template>
<script setup>
import { ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useRoute } from 'vue-router'
import { useStyleStore } from '@/stores/modules/styleStore'
import { useSystemStore } from '@/stores/modules/systemStore'
import { usePermissionStore } from '@/stores/modules/permissionStore'
import { useAliveStore } from '@/stores/modules/aliveStore'

import LayoutBreadcrumb from './components/LayoutBreadcrumb'
import LayoutLogo from './components/LayoutLogo'
import LayoutTools from './components/LayoutTools'
import LayoutTabs from './components/LayoutTabs'
import LayoutMenu from './components/LayoutMenu'
import LayoutFrame from './components/LayoutFrame'


defineOptions({ name: 'LayoutComplex' })

const route = useRoute()

// 菜单数据
const { menus } = storeToRefs(usePermissionStore())
// 上级菜单
const prevs = ref({})
// 下级菜单
const nexts = ref([])

// 设置
const { unique, tabs, collapse, breadcrumb, strategy } = storeToRefs(useStyleStore())
const { device } = storeToRefs(useSystemStore())
const { UpdateStyle } = useStyleStore()
// 保活
const { caches, visible } = storeToRefs(useAliveStore())

// 更新菜单
const updateMenus = () => {
  // 获取当前路由的面包屑导航数据
  const { meta: { breadcrumb = [] } = {} } = route
  // 更新上级菜单，如果有面包屑则取第一个
  prevs.value = breadcrumb.length > 0 ? breadcrumb[0] : {}
  // 根据上级菜单的路径查找对应的子菜单
  nexts.value = menus.value.find(m => m.path === prevs.value.path)?.children || []
  UpdateStyle({ key: 'collapse', value: nexts.value.length === 0 })
}
watch(() => route, () => updateMenus(), { deep: true, immediate: true })
</script>

<style lang="scss" scoped></style>
<style lang="scss">
.el-layout.el-layout--complex {
  --el-layout-header-height: 56px;
  --el-layout-tabs-height: 32px;
  --el-layout-breadcrumb-height: 32px;
  --el-layout-splite-width: 0px;
  --el-layout-aside-width: 224px;
  --el-layout-menu-width: 224px;
  height: 100%;
  width: 100%;
  transition: var(--el-transition-all);
  // &.is-collapse {
  //   padding-left: var(--el-layout-aside-collapse-width);
  //   >.el-container>.el-container>.el-container>.el-tabs {
  //     left: var(--el-layout-aside-collapse-width);
  //   }
  // }
  &.is-collapse {
    --el-layout-aside-width: 0px;
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
  >.el-container>.el-header,
  >.el-container>.el-container>.el-aside,
  >.el-container>.el-container>.el-container>.el-tabs {
    position: relative;
    background-color: var(--el-fill-color-blank);
    box-shadow: var(--el-box-shadow-lighter);
    transition: var(--el-transition-all);
  }
  >.el-container>.el-header {
    --el-header-padding: 0 16px;
    --el-header-height: var(--el-layout-header-height);
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-shrink: 0;
    .el-logo {
      margin-right: 16px;
    }

    .el-menu {
      --el-menu-bg-color: transparent;
      --el-menu-horizontal-height: 56px;
      --el-menu-horizontal-sub-item-height: 56px;
      --el-menu-base-level-padding: 16px;
      --el-menu-icon-width: 16px;
      --el-menu-active-bg-color: transparent;
      --el-menu-active-text-color: var(--el-color-primary);
      --el-menu-hover-bg-color: transparent;
      --el-menu-hover-text-color: var(--el-color-primary);
      flex: 1;
      min-width: 0;
      border: 0;

      .el-menu-item,
      .el-sub-menu>.el-sub-menu__title {
        border: 0;
      }

      .el-sub-menu.el-sub-menu__hide-arrow>.el-sub-menu__title {
        &.el-tooltip__trigger {
          padding-right: 16px;
        }
      }

      .el-menu-item:hover,
      .el-sub-menu>.el-sub-menu__title:hover {
        background-color: var(--el-menu-hover-bg-color);
        color: var(--el-menu-hover-text-color);
      }

      .el-menu-item.is-active,
      .el-sub-menu.is-active>.el-sub-menu__title {
        position: relative;
        background-color: var(--el-menu-active-bg-color);
        color: var(--el-menu-active-text-color) !important;
        &::before {
          content: '';
          position: absolute;
          bottom: 10px;
          left: 50%;
          transform: translate(-50%, 0%);
          width: 16px;
          height: 4px;
          background-color: var(--el-menu-active-text-color);
          border-radius: var(--el-border-radius-base);
        }
      }
    }
  }

  >.el-container>.el-container>.el-aside {
    width: var(--el-layout-aside-width);
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

    .el-aside__footer {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 48px;
    }

    >.el-aside__footer {
      border-top: 1px solid var(--el-border-color-lighter);
      cursor: pointer;
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
      --el-menu-hover-text-color: var(--el-color-primary);
      --el-menu-active-bg-color: var(--el-color-primary-light-9);
      --el-menu-active-text-color: var(--el-color-primary);
      transition: var(--el-transition-all);
      border: 0;
      width: var(--el-layout-menu-width);

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
          font-size: var(--el-font-size-small);

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

  >.el-container>.el-container>.el-container>.el-main {
    --el-main-padding: 16px;
  }
  >.el-container>.el-container>.el-container>.el-tabs {
    --el-tabs-header-height: var(--el-layout-tabs-height);
  }

  >.el-container>.el-container>.el-container>.el-main>.el-breadcrumb {
    position: relative;
    height: var(--el-layout-breadcrumb-height);
    padding-bottom: 16px;
  }
  >.el-container>.el-header {
    z-index: calc(var(--el-index-top) - 1);
  }
  >.el-container>.el-container>.el-aside {
    z-index: calc(var(--el-index-top) - 2);
  }
  >.el-container>.el-container>.el-container>.el-tabs {
    z-index: calc(var(--el-index-top) - 3);
  }
  >.el-container>.el-container>.el-container>.el-main>.el-breadcrumb  {
    z-index: calc(var(--el-index-top) - 4);
  }
  &.is-fixed {
    padding-top: calc(var(--el-layout-header-height) + var(--el-layout-tabs-height));
    padding-left: var(--el-layout-aside-width);
    >.el-container>.el-header,
    >.el-container>.el-container>.el-aside,
    >.el-container>.el-container>.el-container>.el-tabs {
      position: fixed;
    }
    >.el-container>.el-header {
      top: 0;
      left: 0;
      right: 0;
    }
    >.el-container>.el-container>.el-aside {
      top: var(--el-layout-header-height);
      left: 0;
      bottom: 0;
    }
    >.el-container>.el-container>.el-container>.el-tabs {
      top: var(--el-layout-header-height);
      left: var(--el-layout-aside-width);
      right: 0;
    }
    >.el-container>.el-container>.el-container>.el-main {
      overflow: initial;
    }
  }
}
[data-theme='simple'] {
  .el-layout.el-layout--complex {
    >.el-container>.el-header,
    >.el-container>.el-container>.el-aside,
    >.el-container>.el-container>.el-container>.el-tabs {
      background-color: var(--el-fill-color-blank);
    }
  }
}

[data-theme='primary'] {
  .el-layout.el-layout--complex {
    >.el-container>.el-header {
      background-color: var(--el-color-primary);
      .el-logo>svg,
      .el-logo>span {
        color: var(--el-color-white);
      }
      .el-menu {
        --el-menu-active-bg-color: var(--el-color-primary-light-1);
        --el-menu-hover-bg-color: var(--el-color-primary-light-1);
        --el-menu-text-color: var(--el-color-white);
        --el-menu-active-text-color: var(--el-color-white);
        --el-menu-hover-text-color: var(--el-color-white);
      }

      .el-tools {
        .el-button.is-text.is-has-bg {
          background-color: var(--el-color-primary-light-1);
          color: var(--el-color-white);
        }
        .el-divider.el-divider--vertical {
          border-left-color: var(--el-color-primary-light-1);
        }
        .el-dropdown .el-dropdown__link {
          color: var(--el-color-white);
        }
      }
    }
  }
}

[data-theme='technological'] {
  .el-layout.el-layout--complex {
    >.el-container>.el-header {
      background-color: var(--el-color-primary-dark-9);
      .el-logo > svg {
        color: var(--el-color-primary);
      }
      .el-logo > span {
        color: var(--el-color-white);
      }
      .el-menu {
        --el-menu-active-bg-color: var(--el-color-primary);
        --el-menu-hover-bg-color: var(--el-color-primary-dark-5);
        --el-menu-text-color: var(--el-color-white);
        --el-menu-active-text-color: var(--el-color-white);
        --el-menu-hover-text-color: var(--el-color-white);
      }

      .el-tools {
        .el-button.is-text.is-has-bg {
          background-color: var(--el-color-primary-dark-6);
        }

        .el-divider.el-divider--vertical {
          border-left-color: var(--el-color-primary-dark-5);
        }
      }
    }
  }
}
[data-theme='immersive'] {
  .el-layout.el-layout--complex {
    >.el-container>.el-header,
    >.el-container>.el-container>.el-aside,
    >.el-container>.el-container>.el-container>.el-tabs {
      background-color: transparent;
      box-shadow: none;
    }
    >.el-container>.el-header {
      .el-tools {
        .el-button.is-text.is-has-bg {
          background-color: var(--el-fill-color-extra-light);
        }
      }
    }
    >.el-container>.el-container>.el-aside {
      padding-left: 16px;
      --el-layout-menu-width: 208px;
      .el-menu {
        --el-menu-hover-bg-color: var(--el-color-primary-light-8);
        --el-menu-active-bg-color: var(--el-color-primary-light-8);
        .el-menu-item,
        .el-sub-menu>.el-sub-menu__title {
          border-radius: var(--el-border-radius-base);
        }
      }
    }
    >.el-container>.el-container>.el-container>.el-tabs {
      .el-tabs__header {
        padding: 0 16px;
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
    >.el-container>.el-container>.el-container>.el-main {
      padding-top: 0;
    }
    >.el-container>.el-container>.el-container>.el-main>.el-breadcrumb {
      padding: 0 16px;
      background-color: var(--el-fill-color-blank);
      border-bottom: 1px solid var(--el-border-color);
      border-top-right-radius: var(--el-border-radius-base);
      border-top-left-radius: var(--el-border-radius-base);
      .el-breadcrumb__title {
        display: none;
      }
      & + template + .el-embed,
      & + .el-card,
      & + .el-page > .el-card:first-child {
        border-top-left-radius: 0;
        border-top-right-radius: 0;
      }
    }
    &.is-fixed {
      >.el-container>.el-header,
      >.el-container>.el-container>.el-aside,
      >.el-container>.el-container>.el-container>.el-tabs {
        background-color: var(--el-bg-color-page);
      }
    }
  }
}

[data-theme='simple'][data-effect='glass'] {
  .el-layout.el-layout--complex {
    >.el-container>.el-header,
    >.el-container>.el-container>.el-aside,
    >.el-container>.el-container>.el-container>.el-tabs {
      background-color: color-mix(in srgb, var(--el-fill-color-blank) var(--el-effect-glass-opacity), transparent);
      backdrop-filter: saturate(180%) blur(16px);
    }
  }
}
[data-theme='immersive'][data-effect='glass'] {
  .el-layout.el-layout--complex {
    >.el-container>.el-header,
    >.el-container>.el-container>.el-aside,
    >.el-container>.el-container>.el-container>.el-tabs {
      background-color: color-mix(in srgb, var(--el-bg-color-page) var(--el-effect-glass-opacity), transparent);
      backdrop-filter: saturate(180%) blur(16px);
    }
  }
}
</style>
