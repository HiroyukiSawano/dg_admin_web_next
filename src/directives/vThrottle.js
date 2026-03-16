import { throttle } from 'lodash-es'
export default {
  mounted(el, binding) {
    const { value } = binding
    const throttledFunction = throttle(value, 2000)
    el.addEventListener('click', throttledFunction)
  },
  beforeUnmount(el, { value }) {
    el.removeEventListener('click', value)
  },
}
