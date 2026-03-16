import { permissionAll } from '@/utils/permission'
import { useAuthorizeStore } from '@/stores/modules/authorizeStore'
export default {
  mounted(el, binding) {
    if (permissionAll()) return
    const { permissions } = useAuthorizeStore()
    if (!permissions.some((v) => v === binding.value)) el.parentNode.removeChild(el)
  },
}
