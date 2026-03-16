<template>
  <teleport to="body">
    <div class="simple-keyboard-wrapper" ref="keyboardWrapperRef" v-show="visible" @click="closePop">
      <div class="simple-keyboard-block">
        <div class="simple-keyboard"></div>
      </div>
    </div>
  </teleport>
</template>

<script setup>
import { ref, computed, onMounted, watch, useTemplateRef } from 'vue'
import Keyboard from 'simple-keyboard'
import 'simple-keyboard/build/css/index.css'
import layout from 'simple-keyboard-layouts/build/layouts/chinese.js'
defineOptions({
  name: 'EcVirtualKeyboard',
  inheritAttrs: false
})

const props = defineProps({
  layoutName: {
    type: String,
    default: 'default'
  },

  precision: {
    type: Number,
    default: 2
  },
  disabled: Boolean
})
const visible = defineModel('visible', { type: Boolean, default: false })

const value = defineModel('value', { type: String, default: '' })

const emits = defineEmits(['change', 'enter', 'close', 'focus'])

const keyboard = ref(null)
const keyboardWrapperRef = useTemplateRef('keyboardWrapperRef')
const inputRef = useTemplateRef('input')

const language = ref('en')
const layouts = {
  default: [
    'q w e r t y u i o p {bksp}',
    "{none} a s d f g h j k l {enter}",
    '{caps} z x c v b n m , . {clear}',
    '{lang} {num} {space} {symbol} {close}',
  ],
  shift: [
    'Q W E R T Y U I O P {bksp}',
    '{none} A S D F G H J K L {enter}',
    '{caps} Z X C V B N M , . {clear}',
    '{lang} {num} {space} {symbol} {close}',
  ],
  number: [
    '1 2 3 4 5 6 7 8 9 0 {bksp}',
    `{none} @ # $ & * ( ) ' " {enter}`,
    '{symbol} % - + = / ; : ! ? {clear}',
    '{abc} {space} {abc} {close}',
  ],
  symbol: [
    '~ ! @ # $ % ^ * [ ] {bksp}',
    '{none} - _ = + ` · { } \\ {enter}',
    '{num} \' < > ? ￥ ， 。 《 》 {clear}',
    '{abc} {space} {abc} {close}',
  ],
}

const displays = ref({
  '{tab}': '<i class="ri-contract-right-fill"></i>',
  '{clear}': '<i class="ri-close-circle-fill"></i>',
  '{num}': '123',
  '{abc}': 'ABC',
  '{symbol}': '@+=',
  '{bksp}': '<i class="ri-delete-back-2-fill"></i>',
  '{none}': ' ',
  '{caps}': '<i class="ri-arrow-up-circle-fill"></i>',
  '{enter}': '<i class="ri-corner-down-left-line"></i>',
  '{lang}': computed(() => language.value === 'zh-cn' ? '中':'En'),
  '{space}': '<i class="ri-space"></i>',
  '{close}': '<i class="ri-skip-down-line"></i>',
  '{arrowleft}': '<i class="ri-arrow-left-line"></i>',
  '{arrowright}': '<i class="ri-arrow-right-line"></i>',
})

const open = () => {
  if (visible.value) return
  visible.value = true
  emits('focus')
}

const init = () => {
  if (keyboard.value) return
  keyboard.value = new Keyboard('simple-keyboard', {
    onChange: onChange,
    onKeyPress: onKeyPress,
    onInit: onInit,
    layout: layouts,
    layoutName: props.layoutName,
    display: displays.value,
    layoutCandidatesPageSize: 15,

  })
}

const onInit = (keyboard) => {
  keyboard.setInput(value.value)
}
const onChange = (input, e) => {
  e.preventDefault()
  e.stopImmediatePropagation()
  value.value = input
  emits('change', input)
}
watch(value, (n) => {
  if (keyboard.value.getInput() !== n) {
    keyboard.value.setInput(n || '')
  }
})
const onKeyPress = (button) => {
  if (button === '{caps}') return keyCaps()
  if (button === '{lang}') return keyLang()
  if (button === '{clear}') return keyClear()
  if (button === '{enter}') return keyEnter()
  if (button === '{close}') return close()
  if (button === '{num}') return keyNum()
  if (button === '{abc}') return keyAbc()
  if (button === '{symbol}') return keySymbol()
  if (button === '{arrowleft}') return keyArrow(0)
  if (button === '{arrowright}') return keyArrow(1)
}
const keyNum = () => {
  keyboard.value.setOptions({ layoutName: 'number', enableLayoutCandidates: false })
}
const keyAbc = () => {
  keyboard.value.setOptions({ layoutName: 'default', enableLayoutCandidates: language.value === 'zh-cn' ? true : false })
}
const keySymbol = () => {
  keyboard.value.setOptions({ layoutName: 'symbol', enableLayoutCandidates: false })
}
const keyCaps = () => {
  let currentLayout = keyboard.value.options.layoutName
  language.value = 'en'
  keyboard.value.setOptions({
    layoutName: currentLayout === 'default' ? 'shift' : 'default',
    enableLayoutCandidates: false
  })
}
const keyLang = () => {
  if (language.value === 'zh-cn') {
    language.value = 'en'
    keyboard.value.setOptions({ layoutName: 'default', layoutCandidates: null, enableLayoutCandidates: false })
  } else {
    language.value = 'zh-cn'
    keyboard.value.setOptions({ layoutName: 'default', layoutCandidates: layout.layoutCandidates, enableLayoutCandidates: true })
  }
}

const keyClear = () => {
  keyboard.value.clearInput()
  value.value = ''
}
const keyEnter = () => {
  emits('enter')
  close()
}
const close = () => {
  if (props.layoutName == 'number') {
    value.value = value.value.replace(new RegExp(`(\\d+)\\.(\\d{${props.precision}}).*$`), '$1.$2').replace(/\.$/, '')
  }
  visible.value = false
  emits('close')
}
const keyArrow = (num) => {
  const index = keyboard.value.getCaretPositionEnd()
  if (num == 0 && index - 1 >= 0) {
    keyboard.value.setCaretPosition(index - 1)
  } else if (num == 1 && index + 1 <= (value.value.length || 0)) {
    keyboard.value.setCaretPosition(index + 1)
  }
}

const closePop = (e) => {
  if (e.target === keyboardWrapperRef.value) {
    close()
  } else {
    if (document.activeElement !== inputRef.value) {
      inputRef.value?.focus()
    }
  }
}
onMounted(() => {
  init()
})

defineExpose({ open, close, init })
</script>
<style lang="scss">
.simple-keyboard-wrapper {
  z-index: 888888888;
  position: fixed;
  inset: 0;
  .simple-keyboard-block {
    padding: 12px;
    position: absolute;
    inset: 0;
    top: initial;
    background: var(--el-fill-color-blank);
    box-shadow: var(--el-box-shadow-lighter);
  }

  .simple-keyboard.hg-theme-default {
    display: flex;
    flex-direction: column;
    padding: 0;
    font-family: var(--el-font-family);
    background-color: transparent;
    // font-size: 36px;
    border-radius: 0;
    overflow: initial;
    &.hg-layout-default {
      .hg-button.hg-highlight {
        z-index: 1;
      }
    }

    &.hg-layout-shift {
      .hg-button.hg-button-caps {
        color: var(--el-color-primary);
      }
    }

    .hg-candidate-box {
      display: flex;
      align-items: center;
      position: relative;
      margin: 0;
      margin-top: -16px;
      transform: none;
      border-radius: 0;
      border: 0;
      background: none;
      .hg-candidate-box-prev,
      .hg-candidate-box-next {
        height: 64px;
        padding: 0 12px;
        font-family: "remixicon" !important;
        font-style: normal;
      }
      .hg-candidate-box-next {
        margin-right: -12px;
      }
      .hg-candidate-box-prev::before {
        content: "\ea60";
      }
      .hg-candidate-box-next::before {
        content: "\ea6c";
      }
      .hg-candidate-box-list {
        order: -1;
        .hg-candidate-box-list-item {
          padding: 0 32px;
          margin: 8px;
          width: auto;
          height: 64px;
          font-size: 36px;
          border-radius: var(--el-border-radius-base);
          &:hover {
            background: linear-gradient(180deg, var(--el-color-primary-light-8) 0%, var(--el-fill-color-blank) 100%);
            box-shadow: 0 4px 4px 0 color-mix(in srgb, var(--el-color-primary-dark-3) 25%, transparent);
          }
        }
      }
    }
    .hg-rows {
      display: flex;
      flex-direction: column;
      flex: 1;
      .hg-row {
        margin: 0;
        flex: 1;
      }
    }
    .hg-button {
      margin: 0;
      height: 40px;
      width: initial;
      max-width: initial;
      border-radius: var(--el-border-radius-base);
      background: var(--el-color-primary-light-9);
      border: 0;
      box-shadow: inset 0 0 0 4px var(--el-color-white);
      max-width: 8.33333333%;
      flex: 0 0 8.33333333%;
      &:hover {
        background: var(--el-color-primary-light-7);
      }

      &.hg-button-enter {
        background: var(--el-color-primary);
        color: var(--el-color-white);
        &:hover {
          background: var(--el-color-primary);
          color: var(--el-color-white);
        }
      }



      &.hg-button-lang,
      &.hg-button-symbol,
      &.hg-button-close,
      &.hg-button-bksp,
      &.hg-button-clear,
      &.hg-button-caps,
      &.hg-button-abc,
      &.hg-button-num {
        // flex-grow: 0;
        // flex-shrink: 0;
        // flex-basis: 154px;
        // flex: 2;
        background: var(--el-color-primary-light-7);
        &:hover {
          background: var(--el-color-primary-light-8);
        }
      }
      &.hg-button-space {
        max-width: 100%;
        flex: 100%;
      }
      &.hg-button-clear,
      &.hg-button-caps {
        max-width: 12.5%;
        flex: 12.5%;
      }
       &.hg-button-none {
        max-width: 4.16666667%;
        flex: 4.16666667%;
        visibility: hidden;
      }
      &.hg-button-bksp {
        max-width: 16.66666667%;
        flex: 16.66666667%;
      }
      &.hg-button-enter {
        max-width: 20.83333333%;
        flex: 20.83333333%;
      }

    }
  }
}
</style>

