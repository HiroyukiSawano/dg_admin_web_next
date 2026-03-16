const listRoutes = {
  path: '/list',
  name: 'list',
  meta: {
    title: '列表',
    locale: 'ec.menu.name.list',
    icon: 'ri-list-indefinite',
    type: 'directory‌',
    order: 7
  },
  redirect: '/list/listBasic',
  children: [
    {
      path: '/list/listBasic',
      name: 'listBasic',
      component: () => import('@/views/list/listBasic'),
      meta: {
        title: '基础列表',
        locale: 'ec.menu.name.listBasic',
        type: 'menu',
      },
    },
    {
      path: '/list/listArticle',
      name: 'listArticle',
      component: () => import('@/views/list/listArticle'),
      meta: {
        title: '文章列表',
        locale: 'ec.menu.name.listArticle',
        type: 'menu',
      },
    },
    {
      path: '/list/listCard',
      name: 'listCard',
      component: () => import('@/views/list/listCard'),
      meta: {
        title: '卡片列表',
        locale: 'ec.menu.name.listCard',
        type: 'menu',
        hiddenBreadcrumb: true
      },
    },
  ],
}
export default listRoutes
