<template>
  <div class="ec-chat-welcome" :class="[`ec-chat-welcome--${props.direction}`, `ec-chat-welcome--${props.variant}`]">
    <slot name="image">
      <div v-if="!!props.icon" class="ec-chat-welcome__image">
        <el-image :src="props.icon" />
      </div>
    </slot>

    <div class="ec-chat-welcome__content">
      <div v-if="!!props.title" class="ec-chat-welcome__title">
        <slot name="title">{{ props.title }}</slot>
      </div>
      <div v-if="!!props.description" class="ec-chat-welcome__description">
        <slot name="description">{{ props.description }}</slot>
      </div>
    </div>

    <div class="ec-chat-welcome__extra">
      <slot name="extra">{{ props.extra }}</slot>
    </div>
  </div>
</template>

<script setup>
import { toRefs, computed, defineSlots } from 'vue'

const props = defineProps({
  variant: {
    type: String,
    default: 'filled',
  },
  direction: {
    type: String,
    default: 'ltr',
  },
  icon: {
    type: String,
    default: '',
  },
  title: {
    type: String,
    default: '',
  },
  extra: {
    type: [String, Object],
    default: '',
  },
  description: {
    type: String,
    default: '',
  },
})

</script>

<style scoped lang="scss" src="./style.scss"></style>
