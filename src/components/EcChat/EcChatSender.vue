<template>
  <div :class="['ec-chat__sender', focusFlag ? 'is-focus' : '']">
    <div class="ec-chart__sender__header">
      <slot name="header"></slot>
    </div>
    <div class="ec-chart__sender__textarea">
      <el-input
        type="textarea"
        v-model="textValue"
        :placeholder="placeholder"
        :disabled="disabledComputed || showStopBtn"
        :autosize="autosize"
        @keydown="keydownFn"
        @keyup="keyupFn"
        @focus="focusFn"
        @blur="blurFn"
        @change="handleChange"
        @compositionstart="compositionstartFn"
        @compositionend="compositionendFn"
        @compositionupdate="compositionupdateFn"

        v-bind="props.textareaProps"

      />
    </div>
    <div class="ec-chat__sender__action">
      <div class="ec-chat__sender__mode">
        <slot name="prefix"></slot>
      </div>
      <div class="ec-chat__sender__toolbar">
        <slot name="suffix"></slot>
      </div>
      <div class="ec-chat__sender__button">
        <el-button circle v-if="!showStopBtn" type="primary" :disabled="disabledComputed || showStopBtn || !textValue" icon="ri-arrow-up-line" @click="handleSend" />
        <el-button circle v-else icon="ri-stop-fill" @click="handleStop" />
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, watch, onMounted, onBeforeUnmount, onUpdated, computed, reactive } from 'vue'
defineOptions({
  name: 'EcChatSender',
})
const props = defineProps({
  autosize: {
    type: [Boolean, Object],
    default: () => ({ minRows: 2, maxRows: 6 }),
  },
  disabled: Boolean,
  placeholder: {
    type: String,
    default: '请输入消息...',
  },
  prefix: {
    type: [String, Function],
  },
  loading: {
    type: Boolean,
    default: false,
  },
  suffix: {
    type: [String, Function],
  },
  stopDisabled: Boolean,
  textareaProps: {
    type: Object,
  },
  value: {
    type: [String, Number],
    default: undefined,
  },
  modelValue: {
    type: [String, Number],
    default: undefined,
  },
  defaultValue: {
    type: [String, Number],
  },
  onBlur: Function,
  onChange: Function,
  onFocus: Function,
  onSend: Function,
  onStop: Function,
})
const emit = defineEmits(['send', 'stop', 'update:modelValue', 'blur', 'focus', 'fileSelect'])
let shiftDownFlag = false
let isComposition = false
const textValue = ref('')
const focusFlag = ref(false)
const showStopBtn = computed(() => props.loading || props.stopDisabled)
const disabledComputed = computed(() => props.disabled || false)

watch(() => props.modelValue, (n) => {
  textValue.value = n || props.defaultValue || ''
}, { immediate: true })

watch(() => textValue.value, (n) => {
  emit('update:modelValue', n)
})

const handleSend = (e) => {
  if (textValue.value && !disabledComputed.value) {
    emit('send', textValue.value, { e })
    textValue.value = ''
  }
}

const handleStop = (e) => {
  e.stopPropagation()
  emit('stop', textValue.value, { e })
}
const keydownFn = (e) => {
  const { key } = e
  if (key === 'Shift') {
    shiftDownFlag = true
  }
  if (key === 'Enter' && !shiftDownFlag && !isComposition) {
    e.preventDefault()
    e.stopPropagation()
    handleSend(e)
  }
}
const focusFn = (e) => {
  focusFlag.value = true
  emit('focus', textValue.value, e)
}

const blurFn = (e) => {
  focusFlag.value = false
  shiftDownFlag = false
  emit('blur', e)
}

const keyupFn = (e) => {
  const { key, shiftKey } = e
  if (key === 'Shift' || !shiftKey) {
    shiftDownFlag = false
  }
}
const handleChange = (value) => {
  textValue.value = value
  emit('update:modelValue', value)
  props.onChange?.(value)
}

const compositionstartFn = () => {
  isComposition = true
}

const compositionendFn = () => {
  isComposition = false
}
const compositionupdateFn = () => {
  isComposition = false
}
</script>

<style lang="scss" scoped>

.ec-chat__sender {
  padding: 16px;
  border: var(--el-border);
  background-color: var(--el-fill-color-blank);
  border-radius: var(--el-border-radius-base);
  &.is-focus {
    box-shadow: var(--el-box-shadow-lighter);
    border-color: var(--el-color-primary);
  }
}
.ec-chat__sender__action {
  margin-top: 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  .el-button {
    flex-shrink: 0;
  }
}

.ec-chat__sender__toolbar {
  white-space: nowrap;
  margin-left: auto;
}
.ec-chart__sender__textarea {
  :deep(.el-textarea) {
    .el-textarea__inner {
      padding: 0;
      border: none;
      resize: none;
      outline: none;
      box-shadow: none;
      background: none;
    }
  }
}
.ec-chat__sender__button {
  margin-left: 12px;
}
.ec-chat__sender__mode {
  display: flex;
  align-items: center;
}
</style>
