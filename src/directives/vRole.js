import { permissionRole } from '@/utils/permission'

export default {
  mounted(el, binding) {
    const { value } = binding
    if (Array.isArray(value)) {
      let ishas = false
      value.forEach((item) => {
        if (permissionRole(item)) {
          ishas = true
        }
      })
      if (!ishas) {
        el.parentNode.removeChild(el)
      }
    } else {
      if (!permissionRole(value)) {
        el.parentNode.removeChild(el)
      }
    }
  },
}
