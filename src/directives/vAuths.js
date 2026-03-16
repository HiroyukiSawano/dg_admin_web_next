import { permissionAll } from '@/utils/permission'
import { useAuthorizeStore } from '@/stores/modules/authorizeStore'
export default {
  mounted(el, binding) {
    if (permissionAll()) return
    const { permissions } = useAuthorizeStore()
    let flag = false
    permissions.map((val) => {
      binding.value.map((v) => {
        if (val === v) flag = true
      })
    })
    if (!flag) el.parentNode.removeChild(el)
  },
}
