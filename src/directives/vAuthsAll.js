import { judementSameArr, permissionAll } from '@/utils/permission'
import { useAuthorizeStore } from '@/stores/modules/authorizeStore'
export default {
  mounted(el, binding) {
    if (permissionAll()) return
    const { permissions } = useAuthorizeStore()

    const flag = judementSameArr(binding.value, permissions)
    if (!flag) el.parentNode.removeChild(el)
  },
}
