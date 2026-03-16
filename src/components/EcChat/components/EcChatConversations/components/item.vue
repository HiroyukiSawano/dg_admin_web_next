<script setup>

import { h, ref, computed, nextTick, onMounted } from 'vue';

const props = defineProps({
  item: {
    type: Object,
    required: true
  },
  itemsStyle: {
    type: Object,
    default: () => ({})
  },
  itemsHoverStyle: {
    type: Object,
    default: () => ({})
  },
  itemsActiveStyle: {
    type: Object,
    default: () => ({})
  },
  itemsMenuOpenedStyle: {
    type: Object,
    default: () => ({})
  },
  prefixIcon: {
    type: [Object, null],
    default: null
  },
  suffixIcon: {
    type: [Object, null],
    default: null
  },
  showTooltip: {
    type: Boolean,
    default: false
  },
  labelMaxWidth: {
    type: Number,
    default: 0
  },
  menu: {
    type: Array,
    default: () => ([])
  },
  showBuiltInMenu: {
    type: Boolean,
    default: true
  },
  alwaysShowBuiltInMenu: {
    type: Boolean,
    default: false
  },
  tooltipPlacement: {
    type: String,
    default: 'top'
  },
  tooltipOffset: {
    type: Number,
    default: 0
  },
  menuPlacement: {
    type: String,
    default: 'bottom'
  },
  menuOffset: {
    type: Number,
    default: 0
  },
  menuMaxHeight: {
    type: Number,
    default: 300
  },
  menuStyle: {
    type: Object,
    default: () => ({})
  },
  menuShowArrow: {
    type: Boolean,
    default: true
  },
  menuClassName: {
    type: String,
    default: ''
  },
  menuTeleported: {
    type: Boolean,
    default: true
  },
  active: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['click', 'menuCommand']);

const slots = defineSlots();

function renderIcon(icon) {
  if (!icon)
    return null;
  return h(icon);
}

const prefixIconRender = computed(() => {
  return renderIcon(props.prefixIcon);
});

const suffixIconRender = computed(() => {
  return renderIcon(props.suffixIcon);
});

// 添加hover状态跟踪
const isHovered = ref(false);

const elDropdownRef = ref(null);

function handleMouseEnter() {
  isHovered.value = true;
}

function handleMouseLeave() {
  isHovered.value = false;
}

function handleClick(key) {
  emit('click', key);
}

const isTextOverflow = computed(() => {
  return (label = '') => {
    // 如果没有设置labelMaxWidth，直接返回false
    if (!props.labelMaxWidth)
      return false;

    // 创建一个临时的span元素来测量文本宽度
    const span = document.createElement('span');
    span.style.visibility = 'hidden';
    span.style.position = 'absolute';
    span.style.whiteSpace = 'nowrap';
    span.style.fontSize = '14px'; // 与CSS中定义的字体大小一致
    span.textContent = label;

    document.body.appendChild(span);
    const textWidth = span.offsetWidth;
    document.body.removeChild(span);

    // 如果文本宽度大于最大宽度，则返回true表示溢出
    return textWidth > props.labelMaxWidth;
  };
});

// 计算标签样式
const labelStyle = computed(() => {
  // 如果有labelMaxWidth，设置最大宽度并使用截断样式
  if (props.labelMaxWidth) {
    return {
      maxWidth: `${props.labelMaxWidth}px`,
      overflow: 'hidden'
    };
  }
  // 否则返回空对象
  return {};
});

const isShowMenuBtn = ref(false);

// 判断是否显示菜单
const shouldShowMenu = computed(() => {
  // return isHovered.value || item.value.key === activeKey.value || isShowMenuBtn.value
  return isHovered.value || props.active || isShowMenuBtn.value;
});

/* 内置菜单 开始 */
const menuButtonRef = ref(null);

// 合并菜单样式
const mergedMenuStyle = computed(() => {
  return {
    ...props.menuStyle
  };
});

// 辅助函数：驼峰式转短横线格式
function camelToKebab(str) {
  return str.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
}

// 当菜单显示、隐藏时候触发
function updateMenuStatus(isOpen) {
  isShowMenuBtn.value = isOpen;
  if (isOpen) {
    // 延迟执行，确保菜单已经渲染完成
    // 展开菜单时候 决定隐藏箭头
    nextTick(() => {
      // 获取页面的所有 conversation-dropdown-menu 组件
      const dropdownMenu = document.querySelectorAll(
        '.conversation-dropdown-menu'
      );
      if (dropdownMenu.length === 0) {
        return;
      }
      dropdownMenu.forEach(dropdownMenuItem => {
        // 将它子元素中所有 el-popper__arrow 元素的 display 设置为 none
        // 如果 dropdownMenuItem 存在，且display 不为 none
        if (
          dropdownMenuItem &&
          dropdownMenuItem.style.display !== 'none'
        ) {
          // 隐藏箭头
          const arrows = dropdownMenuItem.querySelectorAll('.el-popper__arrow');
          if (arrows.length === 0) {
            return;
          }
          arrows.forEach(arrow => {
            arrow.style.display = props.menuShowArrow
              ? 'block'
              : 'none';
          });

          // 设置 .el-dropdown-menu__item 悬停样式
          const items = dropdownMenuItem.querySelectorAll(
            '.el-dropdown-menu__item:not(.is-disabled)'
          );
          if (items.length === 0) {
            return;
          }
          items.forEach((item, index) => {
            if (!props.menu || props.menu.length === 0) {
              return;
            }
            const menuItemHoverStyle =
              props.menu[index].menuItemHoverStyle || {};
            // 生成固定类名（基于索引）
            const className = `custom-hover-${index}`;
            item.classList.add(className);
            // 动态插入样式规则
            const style = document.createElement('style');
            style.textContent = `
              .${className}:hover,
              .${className}:focus {
                ${Object.entries(menuItemHoverStyle)
                  .map(
                    ([prop, val]) => `${camelToKebab(prop)}: ${val} !important;`
                  )
                  .join(' ')}
              }
            `;
            document.head.appendChild(style);
          });
        }
      });
    });
  }
}

// 菜单命令处理
function menuCommand(command, item) {
  // 如果已经有自定义插槽，则不执行这个函数
  // 菜单的所有内容由开发者自行处理
  if (slots.menu) {
    return false;
  }
  emit('menuCommand', command, item);
}

function openDropdown() {
  if (elDropdownRef.value) {
    elDropdownRef.value.handleOpen?.();
  }
}

function closeDropdown() {
  if (elDropdownRef.value) {
    elDropdownRef.value.handleClose?.();
  }
}

onMounted(() => {
  console.log(elDropdownRef.value, '------');
});
/* 内置菜单 结束 */
</script>

<template>
  <li
    :key="props.item.key"
    class="conversation-item"
    :class="{
      disabled: props.item.disabled,
      active: props.active,
      hovered: props.item.disabled ? false : isHovered,
      'menu-opened': isShowMenuBtn,
      'always-show-built-in-menu': props.alwaysShowBuiltInMenu
    }"
    :style="{
      ...props.itemsStyle,
      ...(isHovered ? props.itemsHoverStyle : {}),
      ...(isShowMenuBtn ? props.itemsMenuOpenedStyle : {}),
      ...(props.active ? props.itemsActiveStyle : {})
    }"
    @click="handleClick(props.item.key)"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
  >
    <div class="conversation-content">
      <!-- 标签区域 - 通过插槽自定义 -->
      <div class="conversation-content-main">
        <!-- 前缀图标 -->
        <span v-if="prefixIconRender" class="conversation-prefix-icon">
          <el-icon>
            <component :is="prefixIconRender" />
          </el-icon>
        </span>

        <slot name="label">
          <!-- 标签和时间戳 -->
          <div class="conversation-label-container">
            <ElTooltip
              v-if="props.showTooltip && isTextOverflow(props.item.label)"
              :content="props.item.label"
              :placement="props.tooltipPlacement"
              :offset="props.tooltipOffset"
              effect="dark"
            >
              <span
                class="conversation-label"
                :class="{ 'text-gradient': isTextOverflow(props.item.label) }"
                :style="labelStyle"
              >{{ props.item.label }}</span>
            </ElTooltip>
            <span
              v-else
              class="conversation-label"
              :class="{ 'text-gradient': isTextOverflow(props.item.label) }"
              :style="labelStyle"
            >{{ props.item.label }}</span>
          </div>
        </slot>
      </div>

      <!-- 后缀图标 -->
      <span v-if="suffixIconRender" class="conversation-suffix-icon">
        <ElIcon>
          <component :is="suffixIconRender" />
        </ElIcon>
      </span>

      <!-- 菜单区域 - 只在hover或active状态下显示 -->
      <div
        v-show="(shouldShowMenu && props.showBuiltInMenu) || props.alwaysShowBuiltInMenu"
        class="conversation-dropdown-menu-container"
      >
        <div
          v-show="props.menu && props.menu.length"
          ref="menuButtonRef"
          class="conversation-dropdown-more"
          @click="e => e.stopPropagation()"
        >
          <el-dropdown
            ref="elDropdownRef"
            trigger="click"
            :placement="props.menuPlacement"
            :offset="props.menuOffset"
            :teleported="props.menuTeleported"
            :popper-class="
              props.menuClassName
                ? `conversation-dropdown-menu ${props.menuClassName}`
                : 'conversation-dropdown-menu'
            "
            :max-height="props.menuMaxHeight"
            :disabled="props.item.disabled"
            @visible-change="updateMenuStatus"
            @command="
              (command) => menuCommand(command, props.item)
            "
          >
            <template #default>
              <slot

                name="more-filled"
                v-bind="{
                  item: props.item,
                  isHovered: props.item.disabled ? false : isHovered,
                  isActive: props.active,
                  isMenuOpened: isShowMenuBtn,
                  isDisabled: props.item.disabled
                }"
              >
                <el-icon class="conversation-dropdown-more-icon ri-more-2-fill" />
              </slot>
            </template>
            <template #dropdown>
              <slot name="menu" v-bind="{ handleOpen: openDropdown, handleClose: closeDropdown }">
                <el-dropdown-menu :style="mergedMenuStyle">
                  <el-dropdown-item
                    v-for="menuItem in props.menu"
                    :key="menuItem.key"
                    :icon="menuItem.icon"
                    :disabled="menuItem.disabled"
                    :divided="menuItem.divided"
                    :command="menuItem.command"
                    :style="menuItem.menuItemStyle"
                  >
                    {{ menuItem.label }}
                  </el-dropdown-item>
                </el-dropdown-menu>
              </slot>
            </template>
          </el-dropdown>
        </div>
      </div>
    </div>
  </li>
</template>

<style scoped lang="scss" src="./style.scss"></style>
