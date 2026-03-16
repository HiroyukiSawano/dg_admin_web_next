export default {
  mounted(el, binding) {
    const { value } = binding
    let debounceTimer
    el.addEventListener('click', () => {
      if (debounceTimer) clearTimeout(debounceTimer)
      debounceTimer = setTimeout(() => {
        value()
      }, 1000)
    })
  },
}
