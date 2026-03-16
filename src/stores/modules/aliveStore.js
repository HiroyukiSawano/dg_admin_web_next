import { defineStore } from 'pinia'

const useAliveStore = defineStore('alive', {
  state: () => ({
    caches: [],
    visible: true,
  }),
  getters: {},
  actions: {
    AddAliveCaches(route) {
      if (this.caches.includes(route.name)) return
      this.caches.push(route.name)
    },
    DeleteAliveCaches(route) {
      const index = this.caches.indexOf(route.name)
      if (index !== -1) this.caches.splice(index, 1)
    },
    DeleteAliveCachesOthers(route) {
      this.caches = this.caches.filter((name) => name === route.name || name === this.caches[0])
    },
    ClearAliveCaches() {
      this.caches = []
    },
    SetCachesVisible(payload) {
      this.visible = payload
    },
    ResetAlive() {
      this.$reset()
    },
  },
})
export { useAliveStore }
export default useAliveStore
