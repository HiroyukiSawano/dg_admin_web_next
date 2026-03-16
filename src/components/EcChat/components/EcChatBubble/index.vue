<template>
  <div v-if="!internalDestroyed" class="ec-chat-bubble" :class="[`is-${props.placement}`, `ec-chat-bubble--${props.variant}`, `ec-chat-bubble--${props.shape}`, isTyping ? `is-typing` : '']">
    <div v-if="!$slots.avatar && props.avatar" class="ec-chat-bubble__avatar">
      <el-avatar :src="props.avatar" :size="props.avatarSize" :shape="props.avatarShape" @error="avatarError" />
    </div>
    <div v-if="!$slots.avatar && !props.avatar && props.avatarPlaceholder" class="ec-chat-bubble__avatar ec-chat-bubble__avatar--placeholder">
      <el-avatar :size="props.avatarSize" />
    </div>
    <div v-if="$slots.avatar" class="ec-chat-bubble__avatar">
      <slot name="avatar"></slot>
    </div>

    <div class="ec-chat-bubble__content">
      <div v-if="$slots.header" class="ec-chat-bubble__header">
        <slot name="header"></slot>
      </div>

      <div class="ec-chat-bubble__detail" :class="{ 'is-loading': props.loading }" :style="`max-width: ${props.maxWidth}`">
        <div v-if="!props.loading" class="ec-chat-bubble__typewriter" :class="{ 'no-content': !props.content }">
          <ec-chat-typewriter
            v-if="!$slots.content && props.content"
            ref="typewriterRef"
            :typing="_typing"
            :content="props.content"
            :is-markdown="props.isMarkdown"
            :is-fog="props.isFog"
            @start="onStart"
            @writing="onWriting"
            @finish="onFinish"
          />
        </div>

        <div v-if="!internalDestroyed && $slots.content && !props.loading" class="ec-chat-bubble__text">
          <slot name="content"></slot>
        </div>
        <div v-if="!$slots.loading && props.loading" class="ec-chat-bubble__loading">
          <ec-chat-loading :animation="props.loadingAnimation" :text="props.loadingText" />
        </div>
        <div v-if="$slots.loading && props.loading" class="ec-chat-bubble__loading">
          <slot name="loading"></slot>
        </div>
      </div>

      <div v-if="$slots.footer" class="ec-chat-bubble__footer">
        <slot name="footer"></slot>
      </div>
    </div>
  </div>
</template>
<script setup>
import { computed, onUnmounted, ref, watch } from 'vue'
import EcChatTypewriter from '../EcChatTypewriter/index.vue'
import EcChatLoading from '../EcChatLoading/index.vue'
defineOptions({
  name: 'EcChatBubble',
})
const props = defineProps({
  content: { type: String, default: '' },
  avatar: { type: String, default: '' },
  placement: { type: String, default: 'left' },
  variant: { type: String, default: 'filled' },
  maxWidth: { type: String, default: '100%' },
  avatarSize: { type: Number, default: 32 },
  avatarShape: { type: String, default: 'circle' },
  avatarPlaceholder: { type: Boolean, default: false },
  typing: { type: [Boolean, Object], default: undefined },
  isMarkdown: { type: Boolean, default: false },
  isFog: { type: [Boolean, Object], default: false },
  loading: { type: Boolean, default: false },
  loadingAnimation: { type: String, default: 'circle' },
  loadingText: { type: [Boolean, String], default: undefined },
  shape: { type: String, default: 'corner' },
})

const emits = defineEmits(['start', 'writing', 'finish', 'avatarError'])

const internalDestroyed = ref(false)
const isTyping = ref(false)

watch(
  () => props.content,
  (newVal, oldVal) => {
    if (newVal !== oldVal && internalDestroyed.value) {
      restart()
    }
  },
)

const typewriterRef = ref()

const interrupt = () => {
  typewriterRef.value?.interrupt()
}

const continueTyping = () => {
  typewriterRef.value?.continue()
}

const restart = () => {
  internalDestroyed.value = false
  typewriterRef.value?.restart()
}

const destroy = () => {
  typewriterRef.value?.destroy()
  internalDestroyed.value = true
}

const instance = {
  interrupt,
  continue: continueTyping,
  restart,
  destroy,
  renderedContent: computed(() => (internalDestroyed.value ? '' : typewriterRef.value?.renderedContent.value || '')),
  isTyping: computed(() => !internalDestroyed.value && (typewriterRef.value?.isTyping.value || false)),
  progress: computed(() => (internalDestroyed.value ? 0 : typewriterRef.value?.progress.value || 0)),
}

const DEFAULT_TYPING = {
  step: 2,
  suffix: '|',
  interval: 50,
  isRequestEnd: true,
}

const _typing = computed(() => {
  if (typeof props.typing === 'undefined') {
    return false
  } else if (typeof props.typing === 'boolean') {
    return props.typing
  } else {
    return Object.assign({}, DEFAULT_TYPING, props.typing)
  }
})

const onStart = (instance) => {
  emits('start', instance)
}

const onFinish = (instance) => {
  isTyping.value = false
  emits('finish', instance)
}

const onWriting = (instance) => {
  isTyping.value = true
  emits('writing', instance)
}

const avatarError = (e) => {
  emits('avatarError', e)
}

onUnmounted(instance.destroy)
defineExpose(instance)
</script>

<style scoped lang="scss" src="./style.scss"></style>
