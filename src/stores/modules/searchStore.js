import { defineStore } from 'pinia'
import { STORAGE_PREFIX } from '@/configs'
const useSearchStore = defineStore('search', {
  state: () => ({
    histories: [],
  }),

  getters: {},
  actions: {
    // 添加搜索历史
    AddSearchHistories(payload) {
       // 如果搜索历史中已存在该关键词，则不执行任何操作
      if (this.histories.includes(payload)) return
      // 否则将新的搜索关键词添加到历史中
      this.histories.push(payload)
    },
    // 删除搜索历史
    DeleteSearchHistories(payload) {
      // 找到需要删除的搜索关键词的索引
      const index = this.histories.indexOf(payload)
      // 如果找到了该关键词，则从历史中移除
      if (index !== -1) this.histories.splice(index, 1)
    },
    // 重置搜索历史
    ResetSearch() {
      this.$reset()
    },
  },
  persist: {
    key: `${STORAGE_PREFIX}/SEARCHES_KEY`,
  },
})

export { useSearchStore }
export default useSearchStore
