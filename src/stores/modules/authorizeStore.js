import { defineStore } from 'pinia'
import { apiUtilsUuid } from '@/services/modules/bspService'
import { resolveSystemProfile } from '@/configs/systemProfile'
import {
  AUTH_ENABLED,
  AUTH_LOGIN_MODE,
  STORAGE_PREFIX,
  COOKIE_PREFIX,
  TOKEN_EXPIRES,
  USER_EXPIRES,
} from '@/configs'
import { Storage, Cookie } from '@/utils/storage'
import { usePermissionStore } from './permissionStore'
import { useSystemStore } from './systemStore'
import { useTabsStore } from './tabsStore'

const defaultUser = () => ({
  id: AUTH_ENABLED ? '' : 'local-dev-user',
  name: 'ec.user.info.username',
  organName: 'ec.user.info.organName',
  avatar: '',
  username: 'eam_figma_demo',
})

const defaultRoles = () => (AUTH_ENABLED ? [] : ['AUTH_SYSTEM_ADMIN', 'ROLE_SYSTE'])
const defaultPermissions = () => (AUTH_ENABLED ? [] : ['LIST.ADD', 'LIST.EDIT', 'LIST.DELETE', 'USER.ADD', 'USER.EDIT', 'USER.DELETE'])

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

const syncSystemName = (user, roles) => {
  const { UpdateSystem } = useSystemStore()
  const { name } = resolveSystemProfile({ user, roles })
  UpdateSystem({ key: 'name', value: name })
}

const useAuthorizeStore = defineStore('authentes', {
  state: () => ({
    token: '',
    user: defaultUser(),
    roles: defaultRoles(),
    permissions: defaultPermissions(),
  }),
  getters: {},
  actions: {
    ResetAuthorize() {
      this.$reset()
      Cookie.removeItem(`${STORAGE_PREFIX}/AUTHORIZE_TOKEN_KEY`)
      Cookie.removeItem(`${STORAGE_PREFIX}/AUTHORIZE_USER_KEY`)
      syncSystemName(defaultUser(), defaultRoles())
    },
    SetAuthorize(payload = {}) {
      const { token = '', user = defaultUser(), roles, permissions } = payload
      this.token = token
      this.user = { ...defaultUser(), ...user }
      this.roles = normalizeList(roles ?? user?.role ?? user?.roles)
      this.permissions = normalizeList(permissions ?? user?.permission ?? user?.permissions)
      syncSystemName(this.user, this.roles)
    },
    Login(payload) {
      this.SetAuthorize(payload)
    },
    Logout() {
      this.ResetAuthorize()
      const { ResetTabs } = useTabsStore()
      ResetTabs()
      const { ResetPermission } = usePermissionStore()
      ResetPermission()
    },
    EnsureAuthorize() {
      if (!AUTH_ENABLED && !this.user?.id) {
        this.user = defaultUser()
        syncSystemName(this.user, this.roles)
      }
    },
    async CheckToken() {
      if (!AUTH_ENABLED) {
        this.EnsureAuthorize()
        return
      }
      if (!this.user?.id) return
      if (this.token) return
      if (AUTH_LOGIN_MODE === 'local') {
        this.ResetAuthorize()
        return
      }
      try {
        const {
          data: { data: token },
        } = await apiUtilsUuid()
        this.token = token
      } catch (error) {
        this.ResetAuthorize()
      }
    },
    async ClearCache() {
      this.Logout()
      Storage.clear()
      window.location.reload()
    },
  },
  persist: [
    {
      key: `${COOKIE_PREFIX}/AUTHORIZE_TOKEN_KEY`,
      pick: ['token'],
      storage: {
        setItem: (k, v) => Cookie.setItem(k, v, { expires: TOKEN_EXPIRES }),
        getItem: (k) => Cookie.getItem(k),
      },
    },
    {
      key: `${COOKIE_PREFIX}/AUTHORIZE_USER_KEY`,
      pick: ['user'],
      storage: {
        setItem: (k, v) => Cookie.setItem(k, v, { expires: USER_EXPIRES }),
        getItem: (k) => Cookie.getItem(k),
      },
    },
    {
      key: `${STORAGE_PREFIX}/AUTHORIZE_ACCESS_KEY`,
      pick: ['roles', 'permissions'],
      storage: Storage,
    },
  ],
})

export { useAuthorizeStore }
export default useAuthorizeStore
