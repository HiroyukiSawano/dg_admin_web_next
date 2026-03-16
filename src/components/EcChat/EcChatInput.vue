<template>
  <div class="ec-chart__input">
    <el-input
      v-model="textual"
      :placeholder="placeholder"
      :disabled="disabled"
      :autofocus="autofocus"
      :autosize="autosize"
      @change="handleChange"
      @blur="blurFn"
      @focus="focusFn"
      @keydown="keydownFn"
      @keyup="keyupFn"
    >
      <template #prefix>
        <slot name="prefix"></slot>
      </template>
      <template #suffix>
        <slot name="suffix"></slot>
        <el-button
          v-if="!stopDisabled"
          type="primary"
          circle
          icon="ri-arrow-up-line"
          :class="[textual ? 'is-focus' : '']"
          :disabled="stopDisabled || !textual || disabled"
          @click="handleSend"
        />
        <el-button circle v-if="stopDisabled && !disabled" icon="ri-stop-fill" @click="handleStop" />
      </template>
    </el-input>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
defineOptions({
  name: 'EcChatInput',
})
const props = defineProps({
  autofocus: Boolean,
  autosize: {
    type: [Boolean, Object],
    default: () => ({ minRows: 1, maxRows: 5 }),
  },
  disabled: Boolean,
  placeholder: {
    type: String,
    default: '请输入消息...',
  },
  stopDisabled: Boolean,

  suffixIcon: {
    type: Function,
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
const emit = defineEmits([
  'update:modelValue',
  'send',
  'stop',
  'change',
  'blur',
  'focus'
])
const textual = ref(props.modelValue || props.defaultValue || '')
watch(() => props.modelValue, (n) => {
    if (n !== textual.value) {
      textual.value = n
    }
  }
)
watch(
  () => textual.value,
  (val) => {
    emit('update:modelValue', val)
  }
)

const handleSend = (e) => {
  if (textual.value && !props.stopDisabled) {
    emit('send', textual.value, { e })
    textual.value = ''
  }
}

const handleStop = (e) => {
  emit('stop', textual.value, { e })
}

const handleChange = (value) => {
  emit('update:modelValue', value)
  emit('change', value)
}

const blurFn = (value, context) => {
  emit('blur', value, context)
}

const focusFn = (value, context) => {
  emit('focus', value, context)
}

const keydownFn = (e) => {
  const { key } = e
  if (key === 'Enter') {
    e.preventDefault()
    e.stopPropagation()
    handleSend(e)
  }
}

const keyupFn = (e) => {
  const { key } = e
}
</script>

<style lang="scss" scoped>
.ec-chart__input {
  :deep(.el-input) {
  --el-input-height: 48px;
    .el-input__wrapper {
      padding: 1px 12px;
    }
  }
}

</style>
