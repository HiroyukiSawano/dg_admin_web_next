import { defineStore } from 'pinia'
import configs from '@/configs'
import { useAliveStore } from './aliveStore'
import { useFrameStore } from './frameStore'
import { useStyleStore } from './styleStore'

const useTabsStore = defineStore('tabs', {
  state: () => ({
    visits: [],
  }),
  getters: {
  },
  actions: {
    AddTabsVisits(route) {
      const contain = this.visits.some((v) => v.fullPath === route.fullPath)
      if (contain) return
      this.visits.push({ ...route })
      const { AddAliveCaches } = useAliveStore()
      AddAliveCaches(route)
    },
    DeleteTabsVisits(route) {
      this.visits = this.visits.filter((v) => v.fullPath !== route.fullPath)
      const { DeleteAliveCaches } = useAliveStore()
      DeleteAliveCaches(route)
      const { DeleteFramePages } = useFrameStore()
      DeleteFramePages(route)
    },
    DeleteTabsVisitsOthers(route) {
      this.visits = this.visits.filter(
        (v) => (v.meta && v.meta.affix) || v.fullPath === route.fullPath,
      )
      const { DeleteAliveCachesOthers } = useAliveStore()
      DeleteAliveCachesOthers(route)
      const { DeleteFramePages } = useFrameStore()
      DeleteFramePages(route)
    },
    DeleteTabsVisitsLeft(route) {
      const index = this.visits.findIndex((v) => v.fullPath === route.fullPath)
      if (index === -1) return
      this.visits = this.visits.filter((v, i) => {
        if (i >= index || (v.meta && v.meta.affix)) return true
        const { DeleteAliveCaches } = useAliveStore()
        DeleteAliveCaches(v)
        const { DeleteFramePages } = useFrameStore()
        DeleteFramePages(v)
        return false
      })
    },
    DeleteTabsVisitsRight(route) {
      const index = this.visits.findIndex((v) => v.fullPath === route.fullPath)
      if (index === -1) return
      this.visits = this.visits.filter((v, i) => {
        if (i <= index || (v.meta && v.meta.affix)) return true
        const { DeleteAliveCaches } = useAliveStore()
        DeleteAliveCaches(v)
        const { DeleteFramePages } = useFrameStore()
        DeleteFramePages(v)
        return false
      })
    },
    async RefreshTabsVisits(route) {
      const { RefreshFramePages } = useFrameStore()
      await RefreshFramePages(route)
      const { DeleteAliveCaches, SetCachesVisible, AddAliveCaches } = useAliveStore()
      await DeleteAliveCaches(route)
      await SetCachesVisible(false)
      await AddAliveCaches(route)
      await SetCachesVisible(true)
    },
    UpdateTabsVisits(route) {
      const index = this.visits.findIndex((v) => v.fullPath === route.fullPath)
      if (index !== -1) Object.assign(this.visits[index], { ...route })
    },
    UpdateTabsVisitsTitle(title = '') {
      const fullPath = location.hash.substring(1)
      this.visits.forEach((v) => {
        if (v.fullPath === fullPath) v.meta.title = title
      })
    },
    ClearTabsVisits() {
      this.visits = this.visits.filter((v) => v.meta?.affix)
      const { ClearAliveCaches } = useAliveStore()
      ClearAliveCaches()
    },
    ResetTabs() {
      this.$reset()
    },
  },
  persist: {
    key: `${configs.STORAGE_PREFIX}/TABS_KEY`,
    pick: ['visits'],
    storage: {
      setItem: (k, v) => {
        const { tabsPersistence } = useStyleStore()
        if (tabsPersistence) {
          localStorage.setItem(k, v)
        }
      },
      getItem: (k) => {
        const { tabsPersistence } = useStyleStore()
        if (tabsPersistence) {
          return localStorage.getItem(k)
        }
      },
    },
  },
})
export { useTabsStore }
export default useTabsStore
