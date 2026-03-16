import { defineStore } from 'pinia'
import { apiUtilsUuid } from '@/services/modules/bspService'
import {
  AUTH_ENABLED,
  STORAGE_PREFIX,
  COOKIE_PREFIX,
  TOKEN_EXPIRES,
  USER_EXPIRES,
} from '@/configs'
import { Storage, Cookie } from '@/utils/storage'
import { usePermissionStore } from './permissionStore'
import { useTabsStore } from './tabsStore'

const defaultUser = () => ({
  id: AUTH_ENABLED ? '' : 'local-dev-user',
  name: 'ec.user.info.username',
  organName: 'ec.user.info.organName',
  avatar: '',
  username: 'platformadmin',
})

const useAuthorizeStore = defineStore('authentes', {
  state: () => ({
    token: '',
    user: defaultUser(),
    roles: ['AUTH_SYSTEM_ADMIN', 'ROLE_SYSTE'],
    permissions: ['LIST.ADD', 'LIST.EDIT', 'LIST.DELETE', 'USER.ADD', 'USER.EDIT', 'USER.DELETE'],
  }),
  getters: {},
  actions: {
    ResetAuthorize() {
      this.$reset()
      Cookie.removeItem(`${STORAGE_PREFIX}/AUTHORIZE_TOKEN_KEY`)
      Cookie.removeItem(`${STORAGE_PREFIX}/AUTHORIZE_USER_KEY`)
    },
    SetAuthorize(payload = {}) {
      const { token = '', user = defaultUser() } = payload
      this.token = token
      this.user = { ...defaultUser(), ...user }
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
      }
    },
    async CheckToken() {
      if (!AUTH_ENABLED) {
        this.EnsureAuthorize()
        return
      }
      if (this.token) return
      const {
        data: { data: token },
      } = await apiUtilsUuid()
      this.token = token
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
