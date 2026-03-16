import { defineStore } from 'pinia'
const useFrameStore = defineStore('frame', {
  state: () => ({
    pages: [],
  }),
  getters: {},
  actions: {
    SetFramePages(route) {
      this.pages = []
      this.pages.push({ ...route })
    },
    AddFramePages(route) {

      const index = this.pages.findIndex((item) => item.fullPath === route.fullPath)
      if (index !== -1) return
      this.pages.push({ ...route })
    },
    DeleteFramePages(route) {
      this.pages.forEach((item, index) => {
        if (item.fullPath === route.fullPath) this.pages.splice(index, 1)
      })
    },
    RefreshFramePages(route) {
      this.pages.forEach((item) => {
        if (item.path === route.path) {
          const url = route.meta.url
          item.meta.url = ''
          setTimeout(() => (item.meta.url = url), 500)
        }
      })
    },
    ClearFramePages() {
      this.pages = []
    },
  },
})
export { useFrameStore }
export default useFrameStore
