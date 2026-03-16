

import { reactive } from 'vue'

export const useVirtualKeyboardHook = () => {
  const vk = reactive({
    visible: false,
    text: '',
    ele: null,

    open(el) {
      if (!(el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement)) return
      if (el.hasAttribute('disabled') || el.hasAttribute('readonly')) return
      vk.ele = el
      vk.text = el.value
      vk.visible = true
    },

    close() {
      vk.change()
      vk.visible = false
      vk.ele = null
      vk.text = ''
    },

    change() {
      const el = vk.ele
      if (el) {
        el.value = vk.text
        el.dispatchEvent(new Event('input', { bubbles: true }))
      }
    }
  })
  return vk
}
