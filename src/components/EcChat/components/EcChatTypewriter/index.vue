<template>
  <div ref="typewriterRef" class="typewriter-container">
    <div
      class="typewriter-content"
      :class="{
        'typing-cursor': typing && typingRunning,
        'typing-cursor-fog': props.isFog && typing && typingRunning,
      }"
      :style="{
        '--tw-cursor-char': `'${typingConfig.suffix}'`,
        '--tw-cursor-fog-bg-color': props.isFog ? (typeof props.isFog === 'object' ? (props.isFog.bgColor ?? 'var(--el-fill-color)') : 'var(--el-fill-color)') : '',
        '--tw-cursor-fog-width': props.isFog ? (typeof props.isFog === 'object' ? (props.isFog.width ?? '80px') : '80px') : '',
      }"
    >
      <div v-if="props.isMarkdown" class="typewriter-markdown" :class="{ 'markdown-body': props.isMarkdown }">
        <MdPreview :modelValue="renderedContent" previewTheme="github" />
      </div>
      <div v-else class="typewriter-text" v-html="renderedContent"></div>
    </div>
  </div>
</template>
<script setup>
import { computed, onUnmounted, ref, toRef, watch } from 'vue'
import DOMPurify from 'dompurify';
import { MdPreview } from 'md-editor-v3'
import 'md-editor-v3/lib/preview.css'
defineOptions({
  name: 'EcChatTypewriter',
})
const props = defineProps({
  content: { type: String, default: '' },
  typing: { type: [Boolean, Object], default: false },
  isMarkdown: { type: Boolean, default: false },
  isFog: { type: [Boolean, Object], default: false },
  mdPlugins: { type: Array, default: () => [] },
})
const emits = defineEmits(['start', 'writing', 'finish'])
let timer = null


const cacheContent = ref('')
const processedContent = computed(() => {
  if (!props.content) return ''
  if (!props.typing) return props.content
  const displayed = cacheContent.value.slice(0, typingIndex.value)
  return displayed
})
const renderedContent = computed(() => {
  if (!props.isMarkdown) return processedContent.value
  // return DOMPurify.sanitize(md?.render(processedContent.value ?? '') ?? '')
  // DOMPurify模式添加安全过滤可能会吞字符
  return DOMPurify.sanitize(processedContent.value ?? '')
  // return processedContent.value ?? ''
})

const typingRunning = ref(false)
const typingIndex = ref(0)
const typingConfig = computed(() => {
  const config = {
    step: typeof props.typing === 'object' ? (props.typing.step ?? 2) : 2,
    interval: typeof props.typing === 'object' ? (props.typing.interval ?? 48) : 48,
    suffix: props.isMarkdown ? '' : typeof props.typing === 'object' ? (props.typing.suffix ?? '|') : '|',
  }
  if (props.typing === true) return { ...config }
  if (typeof props.typing === 'object') return { ...config, ...props.typing, suffix: props.isMarkdown ? '' : (props.typing.suffix ?? '|') }
  return config
})
const typingProgress = computed(() => {
  return cacheContent.value ? Math.min((typingIndex.value / cacheContent.value.length) * 100, 100) : 0
})

let instance

const startTyping = () => {
  clearTimeout(timer)
  if (!props.typing || !cacheContent.value) return

  typingRunning.value = true
  emits('start', instance)

  const typeNext = () => {
    typingIndex.value += typingConfig.value.step
    emits('writing', instance)

    if (typingIndex.value >= cacheContent.value.length) {
      finishTyping()
      return
    }

    timer = setTimeout(typeNext, typingConfig.value.interval)
  }

  timer = setTimeout(typeNext, typingConfig.value.interval)
}

const finishTyping = () => {
  typingRunning.value = false
  typingIndex.value = cacheContent.value.length
  if (props.typing?.isRequestEnd ?? true) {
    emits('finish', instance)
  }
}

const interruptTyping = () => {
  clearTimeout(timer)
  typingRunning.value = false
}

const continueTyping = () => {
  if (typingIndex.value < cacheContent.value.length) {
    startTyping()
  }
}

const restartTyping = () => {
  typingIndex.value = 0
  startTyping()
}

const destroyTyping = () => {
  clearTimeout(timer)
  timer = null
  typingIndex.value = 0
  typingRunning.value = false
}

instance = {
  interrupt: interruptTyping,
  continue: continueTyping,
  restart: restartTyping,
  destroy: destroyTyping,
  renderedContent: computed(() => renderedContent.value),
  typing: toRef(typingRunning),
  progress: computed(() => typingProgress.value),
}

watch(() => props.content, (newVal, oldVal) => {
  if (!props.typing) {
    typingIndex.value = newVal?.length || 0
    typingRunning.value = false
    cacheContent.value = newVal || ''
    return
  }

  const shouldReset = !oldVal || !newVal?.startsWith(oldVal)

  if (shouldReset) {
    typingIndex.value = 0
    cacheContent.value = newVal || ''
  } else {
    cacheContent.value = newVal || ''
  }

  if (!typingRunning.value) {
    startTyping()
  }
}, { immediate: true })

onUnmounted(destroyTyping)

defineExpose(instance)
</script>

<style scoped lang="scss" src="./style.scss"></style>
