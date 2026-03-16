<template>
  <div class="ec-chat-sender__wrapper" tabindex="-1" :style="{ cursor: props.disabled ? 'not-allowed' : 'default' }">
    <div ref="senderRef" class="ec-chat-sender" :class="{ 'is-disabled': props.disabled }">
      <transition name="slide">
        <div v-if="visibleHeader && $slots.header" class="ec-chat-sender__header">
          <slot name="header"></slot>
        </div>
      </transition>
      <div class="ec-chat-sender__content" :class="{ 'ec-chat-sender__content--updown': props.variant === 'updown' }" @mousedown="onContentMouseDown">
        <div v-if="$slots.prefix && props.variant === 'default'" class="ec-chat-sender__prefix">
          <slot name="prefix"></slot>
        </div>
        <div class="ec-chat-sender__input">
          <el-input
            ref="inputRef"
            v-model="internalValue"
            :rows="1"
            :autosize="props.autoSize"
            type="textarea"
            :validate-event="false"
            :placeholder="props.placeholder"
            :read-only="props.readonly || props.disabled"
            :disabled="props.disabled"
            @compositionstart="handleCompositionStart"
            @compositionend="handleCompositionEnd"
            @paste="handleInternalPaste"
            @keydown="handleKeyDown"
          />
        </div>

        <div v-if="props.variant === 'default'" class="ec-chat-sender__actions">
          <slot name="actions">
            <el-button v-if="!speechLoading && props.allowSpeech" circle icon="ri-mic-fill" @click="startRecognition" />
            <el-button v-if="speechLoading && props.allowSpeech" class="is-rippling" circle icon="ri-stop-fill" @click="stopRecognition" />
            <el-button v-if="props.clearable" circle icon="ri-close-line" @click="clear" />
            <el-button v-if="!props.loading" :type="isSubmitDisabled ? 'info' : 'primary'" circle :disabled="isSubmitDisabled" icon="ri-arrow-up-line" @click="submit" />
            <el-button v-if="props.loading" class="is-spinning" circle icon="ri-stop-fill" @click="cancel" />
          </slot>
        </div>

        <div v-if="props.variant === 'updown' && props.showUpdown" class="ec-chat-sender__toolbar">
          <div v-if="$slots.prefix" class="ec-chat-sender__prefix">
            <slot name="prefix"></slot>
          </div>

          <div class="ec-chat-sender__actions">
            <slot name="actions">
              <el-button v-if="!speechLoading && props.allowSpeech" circle icon="ri-mic-fill" @click="startRecognition" />
              <el-button v-if="speechLoading && props.allowSpeech" class="is-rippling" circle icon="ri-stop-fill" @click="stopRecognition" />
              <el-button v-if="props.clearable" circle icon="ri-close-line" @click="clear" />
              <el-button v-if="!props.loading" :type="isSubmitDisabled ? 'info' : 'primary'" circle :disabled="isSubmitDisabled" icon="ri-arrow-up-line" @click="submit" />
              <el-button v-if="props.loading" class="is-spinning" circle icon="ri-stop-fill" @click="cancel" />
            </slot>
          </div>
        </div>
      </div>

      <transition name="slide">
        <div v-if="$slots.footer" class="ec-chat-sender__footer">
          <slot name="footer"></slot>
        </div>
      </transition>
    </div>

    <!-- 虚拟触发 popover -->
    <el-popover
      ref="popoverRef"
      virtual-triggering
      :virtual-ref="senderRef"
      :visible="popoverVisible"
      :width="props.triggerPopoverWidth"
      :disabled="props.disabled"
      :show-arrow="false"
      :placement="props.triggerPopoverPlacement"
      :offset="props.triggerPopoverOffset"
      popper-class="ec-chat-sender__popover"
      :teleported="false"
    >
      <slot name="trigger-popover" :trigger-string="triggerString">
        当前触发的字符为：{{ `${triggerString}` }}
        在这里定义的内容，但注意这里的回车事件将会被 输入框 覆盖
      </slot>
    </el-popover>
  </div>
</template>
<script setup>
import { ref, computed, watch, getCurrentInstance, defineSlots, nextTick } from 'vue'
import { onKeyStroke, useSpeechRecognition } from '@vueuse/core'
defineOptions({ name: 'EcChatSender' })
const props = defineProps({
  placeholder: {
    type: String,
    default: '请输入内容',
  },
  autoSize: {
    type: [Object, Boolean],
    default: () => ({
      minRows: 1,
      maxRows: 6,
    }),
  },
  submitType: {
    type: String,
    default: 'enter',
  },
  inputWidth: {
    type: String,
    default: '100%',
  },
  modelValue: {
    type: String,
    default: '', // 显式定义value的默认值
  },
  variant: {
    type: String,
    default: 'default',
  },
  showUpdown: {
    type: Boolean,
    default: true,
  },
  submitBtnDisabled: {
    type: [Boolean, undefined],
    default: undefined,
  },
  triggerStrings: {
    type: Array,
    default: () => [], // 指令字符数组，默认空数组
  },
  triggerPopoverVisible: {
    type: Boolean,
    default: false,
  },
  triggerPopoverWidth: {
    type: String,
    default: '100%',
  },
  triggerPopoverLeft: {
    type: String,
    default: '0px',
  },
  triggerPopoverOffset: {
    type: Number,
    default: 8,
  },
  triggerPopoverPlacement: {
    type: String,
    default: 'top-start',
  },

  // 其他属性
  readonly: {
    type: Boolean,
    default: false,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  loading: {
    type: Boolean,
    default: false,
  },
  allowSpeech: {
    type: Boolean,
    default: false,
  },
  clearable: {
    type: Boolean,
    default: false,
  },
})

const emits = defineEmits(['update:modelValue', 'update:triggerPopoverVisible', 'trigger', 'recordingChange', 'submit', 'cancel', 'pasteFile'])

const slots = defineSlots()

// 获取当前组件实例
const instance = getCurrentInstance()
// 判断是否存在 submit 监听器
const hasOnRecordingChangeListener = computed(() => {
  return !!instance?.vnode.props?.onRecordingChange
})
// 判断是否存在 pasteFile 监听器
const hasOnPasteFileListener = computed(() => {
  return !!instance?.vnode.props?.onPasteFile
})

const senderRef = ref()
const inputRef = ref()
const internalValue = computed({
  get() {
    return props.modelValue
  },
  set(val) {
    if (props.readonly || props.disabled) return
    emits('update:modelValue', val)
  },
})

const inputInstance = computed(() => inputRef.value?.ref)

const isComposing = ref(false)
const popoverRef = ref()
const hasOnTriggerListener = computed(() => {
  return !!instance?.vnode.props?.onTrigger
})

// 计算提交按钮禁用状态
const isSubmitDisabled = computed(() => {
  if (typeof props.submitBtnDisabled === 'boolean') {
    return props.submitBtnDisabled
  }
  return !internalValue.value
})

const popoverVisible = computed({
  get() {
    return props.triggerPopoverVisible
  },
  set(value) {
    if (props.readonly || props.disabled) return
    emits('update:triggerPopoverVisible', value)
  },
})

// 当前触发 指令的 字符
const triggerString = ref('')

// 监听输入值变化
watch(
  () => internalValue.value,
  (newVal, oldVal) => {
    if (isComposing.value) return
    // 触发逻辑：当输入值等于数组中的任意一个指令字符时触发
    // 确保 oldVal 是字符串类型
    const triggerStrings = props.triggerStrings || [] // 如果为 undefined，就使用空数组
    const validOldVal = typeof oldVal === 'string' ? oldVal : ''
    const wasOldValTrigger = triggerStrings.includes(validOldVal)
    const isNewValTrigger = triggerStrings.includes(newVal)

    // 触发显示：从空变为触发字符
    if (oldVal === '' && isNewValTrigger) {
      triggerString.value = newVal
      if (hasOnTriggerListener.value) {
        emits('trigger', { oldValue: oldVal, newValue: newVal, triggerString: newVal, isOpen: true })
        popoverVisible.value = true
      } else {
        popoverVisible.value = true
      }
    }
    // 关闭：从触发字符变为非触发字符
    else if (!isNewValTrigger && wasOldValTrigger) {
      if (hasOnTriggerListener.value) {
        emits('trigger', { oldValue: oldVal || '', newValue: newVal, triggerString: undefined, isOpen: false })
        popoverVisible.value = false
      } else {
        popoverVisible.value = false
      }
    }
    // 触发显示：从非空且非触发字符变为触发字符
    else if (oldVal !== '' && isNewValTrigger && !wasOldValTrigger) {
      triggerString.value = newVal
      if (hasOnTriggerListener.value) {
        emits('trigger', { oldValue: oldVal || '', newValue: newVal, triggerString: newVal, isOpen: true })
        popoverVisible.value = true
      } else {
        popoverVisible.value = true
      }
    }
  },
  { deep: true, immediate: true },
)

// 内容容器聚焦
const onContentMouseDown = (e) => {
  // 点击容器后设置输入框的聚焦，会触发 &:focus-within 样式
  if (e.target !== senderRef.value.querySelector(`.el-textarea__inner`)) e.preventDefault()
  inputRef.value.focus()
}

// 头部显示隐藏
const visibleHeader = ref(false)
// 打开头部
const openHeader = () => {
  if (!slots.header) return false
  if (props.readonly) return false
  visibleHeader.value = true
}
// 关闭头部
const closeHeader = () => {
  if (!slots.header) return false
  if (props.readonly) return false
  visibleHeader.value = false
}

// 使用浏览器自带的语音转文字功能
const {
  isListening: isSpeechListening,
  isSupported: isSpeechSupported,
  result: speechResult,
  start: speechStart,
  stop: speechStop,
} = useSpeechRecognition({ continuous: true, interimResults: true, lang: 'zh-CN' })
const speechLoading = computed(() => isSpeechListening.value)
// 开始语音识别
const startRecognition = () => {
  if (props.readonly) return
  if (hasOnRecordingChangeListener.value) {
    emits('recordingChange', true)
    return
  }
  if (isSpeechSupported.value) {
    speechStart()
  } else {
    console.error('浏览器不支持 Web Speech API')
  }
}
// 停止语音识别
const stopRecognition = () => {
  if (hasOnRecordingChangeListener.value) {
    emits('recordingChange', false)
    return
  }
  speechStop()
}
// 监听语音识别结果变化
watch(speechResult, (newResult) => {
  if (props.readonly || !newResult) return
  internalValue.value = newResult
})
const handleKeyDown = (e) => {
  if (props.readonly) return
  const _resetSelectionRange = () => {
    const cursorPosition = e.target.selectionStart
    const textBeforeCursor = internalValue.value.slice(0, cursorPosition)
    const textAfterCursor = internalValue.value.slice(cursorPosition)
    internalValue.value = `${textBeforeCursor}\n${textAfterCursor}`
    e.target.setSelectionRange(cursorPosition + 1, cursorPosition + 1)
  }
  // 是否按下组合键
  let _isComKeyDown = false
  switch (props.submitType) {
    case 'cmdOrCtrlEnter':
      _isComKeyDown = e.metaKey || e.ctrlKey
      break
    case 'shiftEnter':
      _isComKeyDown = e.shiftKey
      break
    case 'altEnter':
      _isComKeyDown = e.altKey
      break
    case 'enter':
      _isComKeyDown = e.shiftKey || e.metaKey || e.ctrlKey || e.altKey
      break
    default:
      _isComKeyDown = false
      break
  }
  if (e.keyCode === 13) {
    e.preventDefault()
    if (props.submitType === 'enter') {
      _isComKeyDown ? _resetSelectionRange() : submit()
    } else {
      _isComKeyDown ? submit() : _resetSelectionRange()
    }
  }
}
// // 判断组合键的回车键 (目前支持四种模式)
// const _resetSelectionRange = async () => {
//   const el = inputRef.value?.ref
//   if (!el) return
//   const position = el.selectionStart
//   const before = internalValue.value.slice(0, position)
//   const after = internalValue.value.slice(position)
//   internalValue.value = `${before}\n${after}`
//   await nextTick()
//   el.setSelectionRange(position + 1, position + 1)
// }

// // 判断是否按下组合键
// const isComboKeyPressed = (e, type) => {
//   switch (type) {
//     case 'cmdOrCtrlEnter':
//       return e.metaKey || e.ctrlKey
//     case 'shiftEnter':
//       return e.shiftKey
//     case 'altEnter':
//       return e.altKey
//     case 'enter':
//       return e.shiftKey || e.metaKey || e.ctrlKey || e.altKey
//     default:
//       return false
//   }
// }

// // 使用 onKeyStroke 监听回车键
// onKeyStroke(
//   'Enter',
//   (e) => {
//     if (props.readonly || props.disabled) return
//     e.preventDefault()
//     const _isComboKeyPressed = isComboKeyPressed(e, props.submitType)
//     if (props.submitType === 'enter') {
//       _isComboKeyPressed ? _resetSelectionRange() : submit()
//     } else {
//       _isComboKeyPressed ? submit() : _resetSelectionRange()
//     }
//   },
//   { target: () => inputRef.value?.ref },
// )

// 提交
const submit = () => {
  if (props.readonly || props.loading || props.disabled || isSubmitDisabled.value) return
  emits('submit', internalValue.value)
}
// 取消
const cancel = () => {
  if (props.readonly) return
  emits('cancel', internalValue.value)
}
// 清空
const clear = () => {
  if (props.readonly) return
  inputRef.value.clear()
  internalValue.value = ''
}
// 失去焦点
const blur = () => {
  if (props.readonly) return false
  inputRef.value.blur()
}
// 聚焦到指定索引位置
const focusToIndex = (index) => {
  const el = inputRef.value.ref
  if (!el || typeof el.focus !== 'function') return
  const position = Math.max(0, Math.min(index, internalValue.value.length))
  el.focus()
  el.setSelectionRange(position, position)
}
// 聚焦到指定位置
const focus = (type = 'all') => {
  if (props.readonly) return false
  if (type === 'all') {
    inputRef.value.select()
  } else if (type === 'start') {
    focusToIndex(0)
  } else if (type === 'end') {
    focusToIndex(internalValue.value.length)
  }
}

// 处理输入法开始 (此方法是拼音输入法的时候用)
const handleCompositionStart = () => {
  isComposing.value = true
}
// 处理输入法结束
const handleCompositionEnd = () => {
  isComposing.value = false
}
// 处理粘贴事件
const handleInternalPaste = (e) => {
  const files = e.clipboardData?.files
  if (files?.length && hasOnPasteFileListener.value) {
    emits('pasteFile', files[0], files)
    e.preventDefault()
  }
}
// 暴露方法
defineExpose({ openHeader, closeHeader, clear, blur, focus, submit, cancel, startRecognition, stopRecognition, popoverVisible, inputInstance })
</script>

<style scoped lang="scss" src="./style.scss"></style>
