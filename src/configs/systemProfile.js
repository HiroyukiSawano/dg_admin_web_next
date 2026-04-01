import { APP_NAME } from '@/configs'

const SYSTEM_PROFILES = [
  {
    name: '资产管理系统',
    usernames: ['eam_demo'],
    roles: ['ROLE_EAM_ASSET', 'ROLE_EAM_DEMO'],
    allowedPrefixes: ['/organization', '/project', '/software', '/hardware'],
  },
  {
    name: '组织资源新版演示',
    usernames: ['eam_figma_demo'],
    roles: ['ROLE_EAM_FIGMA'],
    allowedPrefixes: ['/organization', '/project'],
    excludedRouteNames: ['organizationDepartments', 'organizationLocations'],
    menuRouteNames: ['organization', 'organizationServiceProviders', 'organizationPersons', 'project', 'projectAssets'],
    homepage: '/organization/service-providers',
  },
  {
    name: '运营管理系统',
    usernames: ['ops_demo'],
    roles: ['ROLE_EAM_OPERATIONS'],
    allowedPrefixes: ['/monitor'],
  },
]

const normalizeList = (value) => {
  if (Array.isArray(value)) return value.filter(Boolean)
  if (typeof value === 'string') {
    return value
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean)
  }
  return []
}

export const resolveSystemProfile = ({ user = {}, roles = [] } = {}) => {
  const currentRoles = normalizeList(roles)
  const username = user?.username || ''

  const matchedProfile = SYSTEM_PROFILES.find((profile) => {
    if (profile.roles.some((role) => currentRoles.includes(role))) return true
    return profile.usernames.includes(username)
  })

  return (
    matchedProfile || {
      name: APP_NAME,
      usernames: [],
      roles: [],
      allowedPrefixes: [],
      excludedRouteNames: [],
      menuRouteNames: [],
      homepage: null,
    }
  )
}

export default SYSTEM_PROFILES
