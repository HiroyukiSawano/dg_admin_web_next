import router from '@/router'
import { useTabsStore } from '@/stores/modules/tabsStore'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
const Tabs = {
  //刷新标签
  refresh() {
    NProgress.start()
    const route = router.currentRoute.value
    const { RefreshTabsVisits } = useTabsStore()
    RefreshTabsVisits(route)
    NProgress.done()
  },

  //关闭标签
  async close(tag) {
    const { DeleteTabsVisits, visits } = useTabsStore()
    const route = tag || router.currentRoute.value
    await DeleteTabsVisits(route)
    const index = visits.findIndex((t) => t.fullPath === route.fullPath)
    if (index > 0) {
      router.push(visits[index - 1])
    } else {
      router.push('/')
    }
  },
  //关闭标签后处理
  async closeNext(next) {
    const route = router.currentRoute.value
    const { DeleteTabsVisits } = useTabsStore()
    await DeleteTabsVisits(route)
    if (next) {
      const { visits } = useTabsStore()
      next(visits)
    }
  },
  //关闭其他
  closeOther() {
    const route = router.currentRoute.value
    const { DeleteTabsVisitsOthers } = useTabsStore()
    DeleteTabsVisitsOthers(route)
  },
  //设置标题
  setTitle(title) {
    const { UpdateTabsVisitsTitle } = useTabsStore()
    UpdateTabsVisitsTitle(title)
  },
}

export default Tabs
