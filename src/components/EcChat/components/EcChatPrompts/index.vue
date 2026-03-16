<template>
  <div class="ec-chat-prompts">
    <slot v-if="$slots.title || props.title" name="title">
      <div class="ec-chat-prompts__title">{{ title }}</div>
    </slot>

    <div class="ec-chat-prompts__list" :class="{ 'ec-chat-prompts__list--wrap': props.wrap, 'ec-chat-prompts__list--vertical': props.vertical }">
      <div
        v-for="item in items"
        :key="item.key"
        class="ec-chat-prompts__item"
        :class="{ 'is-disabled': item.disabled, 'is-hover': isHover(item.key), 'is-active': isActive(item.key) }"
        @click.stop="handleItemClick(item)"
        @mouseenter.stop="handleMouseEnter(item.key)"
        @mouseleave.stop="handleMouseLeave(item.key)"
        @mousedown.stop="handleMouseDown(item.key)"
        @mouseup.stop="handleMouseUp(item.key)"
      >
        <div v-if="item.icon" class="ec-chat-prompts__item__icon">
          <slot v-if="$slots.icon || item.icon" name="icon" :item="item">
            <el-icon :class="item.icon" />
          </slot>
        </div>
        <div class="ec-chat-prompts__item__content">
          <slot v-if="$slots.label || item.label" name="label" :item="item">
            <div class="ec-chat-prompts__item__label">{{ item.label }}</div>
          </slot>
          <slot v-if="$slots.description || item.description" name="description" :item="item">
            <div class="ec-chat-prompts__item__description">
              {{ item.description }}
            </div>
          </slot>
          <div v-if="item.children && item.children.length > 0" class="ec-chat-prompts__item__children">
            <index :items="item.children" :vertical="item.vertical || props.vertical" @item-click="handleItemClick" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
defineOptions({
  name: 'EcChatPrompts',
})
const props = defineProps({
  items: {
    type: Array,
    default: () => [],
  },
  title: {
    type: String,
    default: '',
  },
  wrap: {
    type: Boolean,
    default: false,
  },
  vertical: {
    type: Boolean,
    default: false,
  },
})

const emits = defineEmits(['itemClick'])

const hoverKeys = ref(new Set())
const activeKeys = ref(new Set())

const handleItemClick = (item) => {
  if (item.disabled) return
  if (item.children && item.children.length > 0) return
  emits('itemClick', item)
}

const handleMouseEnter = (key) => {
  hoverKeys.value.add(key)
}

const handleMouseLeave = (key) => {
  hoverKeys.value.delete(key)
}

const handleMouseDown = (key) => {
  activeKeys.value.add(key)
}

const handleMouseUp = (key) => {
  activeKeys.value.delete(key)
}

const isHover = (key) => {
  return hoverKeys.value.has(key)
}

const isActive = (key) => {
  return activeKeys.value.has(key)
}
</script>

<style scoped lang="scss" src="./style.scss"></style>
