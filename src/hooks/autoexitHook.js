import { ref, onMounted, onUnmounted } from 'vue'
import { useDebounceFn } from '@vueuse/core'
export const useAutoexitHook = (count = 0, onCallback = null) => {
  const _autoexit_time_ = ref(Date.now())
  let timer = null
  const updateActivityTime = useDebounceFn(() => (_autoexit_time_.value = Date.now()), 300)
  const checkAutoLogout = () => {
    if (Date.now() - _autoexit_time_.value > count * 60 * 1000) {
      clearInterval(timer)
      timer = null
      if (onCallback) onCallback()
    }
  }
  const events = ['click', 'mousemove', 'keydown', 'scroll']
  const setEventListeners = () =>
    events.forEach((e) => document.addEventListener(e, updateActivityTime))
  const cleanEventListeners = () =>
    events.forEach((e) => document.removeEventListener(e, updateActivityTime))
  onMounted(() => {
    setEventListeners()
    if (count && count > 0) timer = setInterval(checkAutoLogout, 1000)
  })
  onUnmounted(() => {
    if (timer) clearInterval(timer)
    cleanEventListeners()
  })
}
