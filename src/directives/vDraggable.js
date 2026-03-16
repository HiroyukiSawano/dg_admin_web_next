
export default {
  mounted(el, binding) {
    let start = 0
    let end = 0
    el.onmousedown = function (e) {
      const x = e.clientX - el.offsetLeft
      const y = e.clientY - el.offsetTop
      document.onmousemove = function (e) {
        el.setAttribute('drag-flag', 'true')
        start = Date.now()

        const l = e.clientX - x
        const t = e.clientY - y

        if (t > 0 && t < document.body.clientHeight - 50) {
          el.style.top = `${t}px`
        }
        if (l > 0 && l < document.body.clientWidth - 50) {
          el.style.left = `${l}px`
        }
      }
      document.onmouseup = function () {
        end = Date.now()
        if (end - start > 200) {
          el.setAttribute('drag-flag', 'false')
        }
        document.onmousemove = null
        document.onmouseup = null
      }
      return false
    }
  },
}
