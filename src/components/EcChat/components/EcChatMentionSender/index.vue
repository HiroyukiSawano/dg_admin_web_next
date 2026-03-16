
<template>
  <div class="ec-chat-mention-sender__wrapper" tabindex="-1" :style="{ cursor: props.disabled ? 'not-allowed' : 'default' }">
    <div ref="senderRef" class="ec-chat-mention-sender" :class="{ 'is-disabled': props.disabled }">
      <transition name="slide">
        <div v-if="visibleHeader && $slots.header" class="ec-chat-mention-sender__header">
          <slot name="header"></slot>
        </div>
      </transition>
      <div class="ec-chat-mention-sender__content" :class="{ 'ec-chat-mention-sender__content--updown': props.variant === 'updown' }" @mousedown="onContentMouseDown">

        <div v-if="$slots.prefix && props.variant === 'default'" class="ec-chat-mention-sender__prefix">
          <slot name="prefix"></slot>
        </div>
        <div class="ec-chat-mention-sender__input">
          <el-mention
            ref="inputRef"
            v-model="internalValue"
            :rows="1"
            :autosize="props.autoSize"
            type="textarea"
            :validate-event="false"
            :placeholder="placeholder"
            :read-only="props.readonly || props.disabled"
            :disabled="props.disabled"
            :options="props.options"
            :filter-option="props.filterOption"
            :whole="props.whole"
            :check-is-whole="props.checkIsWhole"
            :loading="props.triggerLoading"
            :prefix="props.triggerStrings"
            :split="props.triggerSplit"
            :placement="props.triggerPopoverPlacement"
            :offset="props.triggerPopoverOffset"
            @keydown="handleKeyDown"
            @search="handleSearch"
            @select="handleSelect"
            @paste="handleInternalPaste"
          >
            <template v-if="$slots['trigger-label']" #label="{ item, index }">
              <slot name="trigger-label" :item="item" :index="index" />
            </template>
            <template v-if="$slots['trigger-loading']" #loading>
              <slot name="trigger-loading"></slot>
            </template>
            <template v-if="$slots['trigger-header']" #header>
              <slot name="trigger-header"></slot>
            </template>
            <template v-if="$slots['trigger-footer']" #footer>
              <slot name="trigger-footer"></slot>
            </template>
          </el-mention>
        </div>
        <div v-if="props.variant === 'default'" class="ec-chat-mention-sender__actions">
          <slot name="actions">
            <el-button v-if="!speechLoading && props.allowSpeech" circle icon="ri-mic-fill" @click="startRecognition" />
            <el-button v-if="speechLoading && props.allowSpeech" class="is-rippling" circle icon="ri-stop-fill" @click="stopRecognition" />
            <el-button v-if="props.clearable" circle icon="ri-close-line" @click="clear" />
            <el-button v-if="!props.loading" :type="isSubmitDisabled ? 'info' : 'primary'" circle :disabled="isSubmitDisabled" icon="ri-arrow-up-line" @click="submit" />
            <el-button v-if="props.loading" class="is-spinning" circle icon="ri-stop-fill" @click="cancel" />
          </slot>
        </div>

        <div v-if="props.variant === 'updown' && props.showUpdown" class="ec-chat-mention-sender__toolbar">
          <div v-if="$slots.prefix" class="ec-chat-mention-sender__prefix">
            <slot name="prefix"></slot>
          </div>
          <div class="ec-chat-mention-sender__actions">
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
        <div v-if="$slots.footer" class="ec-chat-mention-sender__footer">
          <slot name="footer"></slot>
        </div>
      </transition>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, getCurrentInstance, defineSlots, nextTick } from 'vue'
import { useSpeechRecognition } from '@vueuse/core'
defineOptions({ name: 'EcChatMentionSender' })


const props = defineProps({
  placeholder: {
    type: String,
    default: '请输入内容'
  },
  autoSize: {
    type: Object,
    default: () => ({
      minRows: 1,
      maxRows: 6
    })
  },
  submitType: {
    type: String,
    default: 'enter'
  },
  headerAnimationTimer: {
    type: Number,
    default: 300
  },
  inputWidth: {
    type: String,
    default: '100%'
  },
  modelValue: {
    type: String,
    default: ''
  },
  variant: {
    type: String,
    default: 'default'
  },
  showUpdown: {
    type: Boolean,
    default: true
  },
  submitBtnDisabled: {
    type: Boolean,
    default: undefined
  },
  options: {
    type: Array,
    default: () => []
  },
  filterOption: {
    type: Function,
    default: () => true
  },
  whole: {
    type: Boolean,
    default: false
  },
  checkIsWhole: {
    type: Function,
    default: () => true
  },
  triggerLoading: {
    type: Boolean,
    default: false
  },
  triggerStrings: {
    type: Array,
    default: () => []
  },
  triggerSplit: {
    type: String,
    default: ' '
  },
  triggerPopoverPlacement: {
    type: String,
    default: 'top'
  },
  triggerPopoverOffset: {
    type: Number,
    default: 8
  },
  readonly: {
    type: Boolean,
    default: false
  },
  disabled: {
    type: Boolean,
    default: false
  },
  loading: {
    type: Boolean,
    default: false
  },
  allowSpeech: {
    type: Boolean,
    default: false
  },
  clearable: {
    type: Boolean,
    default: false
  }
});

const emits = defineEmits(['update:modelValue', 'submit', 'cancel', 'search', 'select', 'recordingChange', 'pasteFile'])

const slots = defineSlots();



const instance = getCurrentInstance();
const hasOnRecordingChangeListener = computed(() => {
  return !!instance?.vnode.props?.onRecordingChange
})
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
  }
})

const isSubmitDisabled = computed(() => {
  if (typeof props.submitBtnDisabled === 'boolean') {
    return props.submitBtnDisabled;
  }
  return !internalValue.value
})

const popoverVisible = computed(() => inputRef.value?.dropdownVisible)
const inputInstance = computed(() => inputRef.value?.input.ref)

// 内容容器聚焦
const onContentMouseDown = (e) => {
  if (e.target !== senderRef.value.querySelector(`.el-textarea__inner`)) {
    e.preventDefault()
  }
  inputRef.value.input.focus()
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
  if (!slots.header)
    return;
  if (props.readonly)
    return;
  visibleHeader.value = false;
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
// 判断组合键的回车键 (目前支持四种模式)
const handleKeyDown = (e) =>{
  if (props.readonly) return
  const _resetSelectionRange = () => {
    const cursorPosition = e.target.selectionStart
    const textBeforeCursor = internalValue.value.slice(0, cursorPosition)
    const textAfterCursor = internalValue.value.slice(cursorPosition)
    internalValue.value = `${textBeforeCursor}\n${textAfterCursor}`
    e.target.setSelectionRange(cursorPosition + 1, cursorPosition + 1)
  }
  // 是否按下组合键
  let _isComKeyDown = false;
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
    e.preventDefault();
    if (props.submitType === 'enter') {
      _isComKeyDown ? _resetSelectionRange() : submit()
    } else {
      _isComKeyDown ? submit() : _resetSelectionRange()
    }
  }
}

// 提交
const submit = () => {
  if (
    props.readonly ||
    props.loading ||
    props.disabled ||
    isSubmitDisabled.value
  ) {
    return
  }
  emits('submit', internalValue.value)
}
// 取消按钮
const cancel = () => {
  if (props.readonly)
    return;
  emits('cancel', internalValue.value)
}
// 清空
const clear = () => {
  if (props.readonly) return
  inputRef.value.input.clear()
  internalValue.value = ''
}
// 失去焦点
const blur = () => {
  if (props.readonly) return false
  inputRef.value.input.blur()
}
// 聚焦到指定索引位置
const focusToIndex = (index) => {
  const el = inputRef.value.input.ref
  if (!el || typeof el.focus !== 'function') return
  const position = Math.max(0, Math.min(index, internalValue.value.length))
  el.focus()
  el.setSelectionRange(position, position)
}
// 聚焦到指定位置
const focus = (type = 'all') => {
  if (props.readonly) return false
  if (type === 'all') {
    inputRef.value.input.select()
  } else if (type === 'start') {
    focusToIndex(0)
  } else if (type === 'end') {
    focusToIndex(internalValue.value.length)
  }
}

// 指令
const handleSearch = (pattern, prefix) => {
  emits('search', pattern, prefix);
}

const handleSelect = (option, prefix) => {
  emits('select', option, prefix)
}
// const isComposing = ref(false)
// // 处理输入法开始 (此方法是拼音输入法的时候用)
// const handleCompositionStart = () => {
//   isComposing.value = true
// }
// // 处理输入法结束
// const handleCompositionEnd = () => {
//   isComposing.value = false
// }
// 处理粘贴事件
const handleInternalPaste = (e) => {
  const files = e.clipboardData?.files
  if (files?.length && hasOnPasteFileListener.value) {
    emits('pasteFile', files[0], files)
    e.preventDefault()
  }
}

defineExpose({
  openHeader,
  closeHeader,
  clear,
  blur,
  focus,
  submit,
  cancel,
  startRecognition,
  stopRecognition,
  popoverVisible,
  inputInstance
})
</script>

<style scoped lang="scss" src="./style.scss"></style>
