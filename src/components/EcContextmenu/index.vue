<template>
  <transition name="el-zoom-in-top">
    <div
      v-if="visible"
      ref="contextmenu"
      class="ec-contextmenu"
      :style="{ left: `${left}px`, top: `${top}px` }"
      @contextmenu.prevent="fn"
    >
      <div class="ec-contextmenu-menu">
        <slot></slot>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { ref, watch, provide, nextTick } from 'vue'

const visible = ref(false)
const top = ref(0)
const left = ref(0)
const contextmenu = ref(null)

const emit = defineEmits(['command', 'visibleChange'])

// 提供菜单点击方法
const menuClick = (command) => {
  close()
  emit('command', command)
}
provide('menuClick', menuClick)

// 点击外部关闭菜单
const cm = (e) => {
  if (contextmenu.value && !contextmenu.value.contains(e.target)) {
    close()
  }
}

// 监听 visible 变化控制事件监听
watch(visible, (value) => {
  if (value) {
    document.body.addEventListener('click', cm, true)
  } else {
    document.body.removeEventListener('click', cm, true)
  }
})

// 打开菜单
const open = (e) => {
  e.preventDefault()
  visible.value = true
  left.value = e.clientX + 1
  top.value = e.clientY + 1

  nextTick(() => {
    const ex = e.clientX + 1
    const ey = e.clientY + 1
    const ww = window.innerWidth
    const wh = window.innerHeight
    const mh = contextmenu.value.offsetHeight
    const mw = contextmenu.value.offsetWidth

    left.value = ex + mw > ww ? ww - mw : ex
    top.value = ey + mh > wh ? ey - mh : ey
  })

  emit('visibleChange', true)
}

// 关闭菜单
const close = () => {
  visible.value = false
  emit('visibleChange', false)
}

// 右键处理函数
const fn = () => false

// 暴露方法给父组件
defineExpose({
  open,
  close
})
</script>
<style lang="scss" scoped>
  .ec-contextmenu {
    position: fixed;
    z-index: 3333;
    :deep() {
      .ec-contextmenu-menu {
        padding: 6px 0;
        background-color: var(--el-bg-color-overlay);
        border-radius: var(--el-border-radius-base);
        box-shadow: var(--el-box-shadow-light);
        z-index: 3333;
        .ec-contextmenu-menu__item--divided {
          margin: 6px 0;
          border-top: 1px solid var(--el-border-color-lighter);
        }
        .ec-contextmenu-menu-item {
          position: relative;
          display: flex;
          align-items: center;
          padding: 8px 16px;
          color: var(--el-text-color-regular);
          font-size: var(--el-font-size-extra-small);
          line-height: 1;
          cursor: pointer;
          &:hover,&:focus {
            background-color: var(--el-color-primary-light-9);
            >.ec-contextmenu-menu-item__prefix,
            >.ec-contextmenu-menu-item__label {
              color: var(--el-color-primary);
            }
          }
          &.is-disabled {
            color: var(--el-text-color-disabled);
            cursor: not-allowed;
            background: transparent;
            >.ec-contextmenu-menu-item__prefix,
            >.ec-contextmenu-menu-item__label,
            >.ec-contextmenu-menu-item__suffix {
              color: var(--el-text-color-disabled);
            }
          }
          .ec-contextmenu-menu-item__prefix {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
            width: 16px;
            height: 16px;
            margin-right: 8px;
            white-space: nowrap;
          }
          .ec-contextmenu-menu-item__suffix {
            white-space: nowrap;
            color: var(--el-text-color-placeholder);
          }
          .ec-contextmenu-menu-item__label  {
            flex: 1;
            padding-right: 24px;
            white-space: nowrap;
          }
          .ec-contextmenu-menu-item__icon,
          .ec-contextmenu-menu-item__arrow {
            font-size: var(--el-font-size-base);
          }
          .ec-contextmenu-menu-item__arrow {
            margin-right: -2px;
          }
        }
      }
      .ec-contextmenu-menu-item>.ec-contextmenu-menu {
        margin: -6px 0;
        position: absolute;
        top: 0px;
        left: 100%;
        display: none;
      }
    }
  }

</style>
