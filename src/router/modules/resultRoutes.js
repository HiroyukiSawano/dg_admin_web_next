const resultRoutes = {
  path: '/result',
  name: 'result',
  meta: {
    title: '结果页',
    locale: 'ec.menu.name.result',
    icon: 'ri-checkbox-multiple-line',
    type: 'directory‌',
    order: 8
  },
  redirect: '/result/resultSuccess',
  children: [
    {
      path: '/result/resultSuccess',
      name: 'resultSuccess',
      component: () => import('@/views/result/resultSuccess'),
      meta: {
        title: '成功页',
        locale: 'ec.menu.name.resultSuccess',
        type: 'menu',
      },
    },
    {
      path: '/result/resultFail',
      name: 'resultFail',
      component: () => import('@/views/result/resultFail'),
      meta: {
        title: '失败页',
        locale: 'ec.menu.name.resultFail',
        type: 'menu',
      },
    },
    {
      path: '/result/resultBlank',
      name: 'resultBlank',
      component: () => import('@/views/result/resultBlank'),
      meta: {
        title: '空白页',
        locale: 'ec.menu.name.resultBlank',
        type: 'menu',
      },
    },
  ],
}
export default resultRoutes
