<template>
  <template v-for="item in data" :key="item">
    <el-sub-menu v-if="hasChildren(item)" :index="item.path" teleported>
      <div v-if="layout == 'classic' && collapse && item.meta?.title" class="el-menu-item text-primary background-transparent font-weight-primary">{{ $t(item.meta?.title) }}</div>

      <template #title>
        <a v-if="item.component || item.meta?.type == 'link'" class="el-sub-menu__link" @click="router.push({ path: item.path })"></a>
        <el-icon v-if="item.meta?.icon" class="el-sub-menu__icon"><component :is="item.meta?.icon" /></el-icon>
        <span class="el-sub-menu__label">
          {{ $t(item.meta?.title) }}
        </span>
        <em v-if="item.meta?.tag" class="el-sub-menu__tag"></em>
      </template>
      <LayoutMenu :data="item.children" />
    </el-sub-menu>
    <el-menu-item v-else :index="item.path">
      <el-icon v-if="item.meta?.icon" class="el-menu-item__icon"><component :is="item.meta?.icon" /></el-icon>
      <template #title>
        <a v-if="item.meta?.type == 'link'" class="el-menu-item__link" :href="item.meta?.url" target="_blank" @click.stop="() => {}"></a>
        <span class="el-menu-item__label">{{ $t(item.meta?.title) }}</span>
        <em v-if="item.meta?.tag" class="el-menu-item__tag"></em>
      </template>
    </el-menu-item>
  </template>
</template>
<script setup>
import { ref, onMounted, nextTick, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useStyleStore } from '@/stores/modules/styleStore'
import { useRouter, useRoute } from 'vue-router'
defineOptions({
  name: 'LayoutMenu',
})
defineProps({
  data: {
    type: Array,
    default: () => [],
  },
})
const { collapse, layout } = storeToRefs(useStyleStore())
const router = useRouter()
const route = useRoute()

const hasChildren = (item) => item.children && !item.children.every((item) => item.meta?.hidden)

</script>
<style lang="scss" scoped>

.el-menu {
  .el-sub-menu>.el-sub-menu__title,
  .el-menu-item {
    >.el-sub-menu__link,
    >.el-menu-item__link {
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      z-index: 1;
    }
    > .el-sub-menu__tag,
    > .el-menu-item__tag {
      position: absolute;
      right: 16px;
      top: 50%;
      transform: translateY(-50%);
      // margin-left: auto;
      // margin-right: 2px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      vertical-align: initial;
      width: 8px;
      height: 8px;
      background-color: var(--el-color-danger);
      border-radius: 50%;
      &::after {
        position: absolute;
        top: 0px;
        left: 0px;
        width: 100%;
        height: 100%;
        border-radius: 50%;
        background: inherit;
        content: '';
        animation: scaleing 1.2s ease-in-out infinite;
      }
    }
    > .el-sub-menu__tag {
      right: 32px;
    }
  }
  &.el-menu--collapse {
    .el-sub-menu>.el-sub-menu__title {
      > .el-sub-menu__tag {
        right: 8px;
        top: 12px;
      }
    }

  }
}
@keyframes scaleing {
  0% {
    transform: scale(0.5);
    opacity: 1;
  }

  30% {
    opacity: 0.7;
  }

  100% {
    transform: scale(2.5);
    opacity: 0;
  }
}
</style>
<style lang="scss">

</style>
