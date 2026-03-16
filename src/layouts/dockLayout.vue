<template>
  <div
    class="el-layout el-layout--dock"
    :class="`is-${strategy} ${collapse ? 'is-collapse' : ''} on-${device} ${tabs ? '' : 'no-tabs'} ${breadcrumb ? '' : 'no-breadcrumb'}`"
  >
    <el-container>
      <el-header>
        <layout-logo />
        <el-menu class="justify-content-end hidden-sm-and-down" mode="horizontal" :default-active="route.meta?.active || route.path" router>
          <template v-for="item in menus">
            <el-sub-menu v-if="hasChildren(item)" :key="item.path" :index="item.path" teleported>
              <template #title>
                <el-icon v-if="item.meta?.icon" class="el-sub-menu__icon">
                  <component :is="item.meta?.icon" />
                </el-icon>
                <span class="el-sub-menu__label">{{ $t(item.meta?.title) }}</span>
                <em v-if="item.meta?.tag" class="el-sub-menu__tag"></em>
              </template>
              <layout-menu :data="item.children" />
            </el-sub-menu>
            <el-menu-item v-else :key="item.path + ''" :index="item.path">
              <el-icon v-if="item.meta?.icon" class="el-menu-item__icon">
                <component :is="item.meta?.icon" />
              </el-icon>
              <template #title>
                <a v-if="item.meta?.type == 'link'" class="el-menu-item__link" :href="item.path" target="_blank"
                  @click.stop="() => { }"></a>
                <span class="el-menu-item__label">{{ $t(item.meta?.title) }}</span>
                <em v-if="item.meta?.tag" class="el-menu-item__tag"></em>
              </template>
            </el-menu-item>
          </template>
        </el-menu>
        <layout-tools />
      </el-header>
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
  </div>
</template>
<script setup>
import { ref, onMounted, computed } from 'vue'
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

defineOptions({ name: 'LayoutDock' })

const route = useRoute()

const { unique, tabs, collapse, breadcrumb, strategy } = storeToRefs(useStyleStore())
const { device } = storeToRefs(useSystemStore())
const { menus } = storeToRefs(usePermissionStore())
const { caches, visible } = storeToRefs(useAliveStore())
// 是否包含未隐藏的子项
const hasChildren = (row) => row.children?.some(c => !c.meta?.hidden)
</script>

<style lang="scss">
.el-layout.el-layout--dock {
  --el-layout-header-height: 56px;
  --el-layout-tabs-height: 32px;
  --el-layout-breadcrumb-height: 32px;
  --el-layout-splite-width: 0px;
  --el-layout-aside-width: 0px;
  height: 100%;
  width: 100%;
  transition: var(--el-transition-all);
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
  }
  >.el-container,
  >.el-container>.el-container {
    width: 100%;
    height: 100%;
    min-height: 0;
    min-width: 0;
  }
  >.el-container>.el-header,
  >.el-container>.el-tabs {
    position: relative;
    background-color: var(--el-fill-color-blank);
    transition: var(--el-transition-all);
    box-shadow: var(--el-box-shadow-lighter);
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
      --el-menu-hover-bg-color: var(--el-color-primary-light-9);
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
  >.el-container>.el-tabs {
    --el-tabs-header-height: var(--el-layout-tabs-height);
  }
  >.el-container>.el-main {
    --el-main-padding: 16px;
  }
  >.el-container>.el-main>.el-breadcrumb {
    height: var(--el-layout-breadcrumb-height);
    padding-bottom: 16px;
  }

  >.el-container>.el-header {
    z-index: calc(var(--el-index-top) - 1);
  }
  >.el-container>.el-tabs {
    z-index: calc(var(--el-index-top) - 2);
  }
  >.el-container>.el-main>.el-breadcrumb  {
    z-index: calc(var(--el-index-top) - 3);
  }
  &.is-fixed {
    padding-top: calc(var(--el-layout-header-height) + var(--el-layout-tabs-height));
     >.el-container>.el-header,
     >.el-container>.el-tabs {
      position: fixed;
      left: 0;
      right: 0;
     }
    >.el-container>.el-header {
      top: 0;
    }
    >.el-container>.el-tabs {
      top: var(--el-layout-header-height);
    }
    >.el-container>.el-main {
      overflow: initial;
    }
  }
}

[data-theme='simple'] {
  .el-layout.el-layout--dock {
    >.el-container>.el-header,
    >.el-container>.el-tabs {
      background-color: var(--el-fill-color-blank);
    }
  }
}
[data-theme='primary'] {
  .el-layout.el-layout--dock   {
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
          border-left-color: var(--el-color-primary-light-2);
        }
        .el-dropdown .el-dropdown__link {
          color: var(--el-color-white);
        }
      }
    }
  }
}

[data-theme='technological'] {
  .el-layout.el-layout--dock   {
    >.el-container>.el-header {
      background-color: var(--el-color-primary-dark-9);
      .el-logo>svg {
        color: var(--el-color-primary);
      }
      .el-logo>span {
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
        .el-dropdown .el-dropdown__link {
          color: var(--el-color-white);
        }
      }
    }
  }
}
[data-theme='immersive'] {
  .el-layout.el-layout--dock   {
    >.el-container>.el-header,
    >.el-container>.el-tabs {
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

    >.el-container>.el-tabs {
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
    >.el-container>.el-main {
      padding-top: 0;
    }
    >.el-container>.el-main>.el-breadcrumb {
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
      >.el-container>.el-tabs {
        background-color: var(--el-bg-color-page);
      }
    }
  }
}

[data-theme='simple'][data-effect='glass'] {
  .el-layout.el-layout--dock {
    >.el-container>.el-header,
    >.el-container>.el-tabs {
      background-color: color-mix(in srgb, var(--el-fill-color-blank) var(--el-effect-glass-opacity), transparent);
      backdrop-filter: saturate(180%) blur(16px);
    }
  }
}
[data-theme='immersive'][data-effect='glass'] {
  .el-layout.el-layout--dock {
    >.el-container>.el-header,
    >.el-container>.el-tabs {
      background-color: color-mix(in srgb, var(--el-bg-color-page) var(--el-effect-glass-opacity), transparent);
      backdrop-filter: saturate(180%) blur(16px);
    }
  }
}
</style>
