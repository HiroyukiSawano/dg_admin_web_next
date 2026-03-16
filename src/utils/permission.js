import { useAuthorizeStore } from '@/stores/modules/authorizeStore'
export const permissionAll = () => {
  const allPermissions = '*/*/*'
  const { permissions } = useAuthorizeStore()
  return permissions.includes(allPermissions)
}

export const judementSameArr = (n, o) => {
  const setO = new Set(o)
  return n.every((item) => setO.has(item))
}

export const permission = (data) => {
  const { permissions } = useAuthorizeStore()
  if (!permissions) return false
  return permissions.includes(data)
}

export const permissionRole = (data) => {
  const { user, roles } = useAuthorizeStore()
  if (!user) return false
  if (!roles) return false
  return roles.includes(data)
}
