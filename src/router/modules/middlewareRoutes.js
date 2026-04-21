const middlewareRoutes = {
  path: '/middleware',
  name: 'middleware',
  meta: {
    title: '中间件资产',
    locale: 'ec.menu.name.middleware',
    icon: 'ri-node-tree',
    type: 'directory',
    order: 21,
  },
  redirect: '/middleware/middlewareResources',
  children: [
    {
      path: '/middleware/middlewareResources',
      name: 'middlewareResources',
      component: () => import('@/views/middleware/middlewareResources'),
      meta: {
        title: '中间件台账',
        locale: 'ec.menu.name.middlewareResources',
        fullpage: true,
        type: 'menu',
      },
    },
    {
      path: '/middleware/middlewareResources/create',
      name: 'middlewareResourceCreate',
      component: () => import('@/views/middleware/middlewareFormPage'),
      meta: {
        title: '新增中间件',
        locale: 'ec.middleware.page.createTitle',
        fullpage: true,
        hidden: true,
        active: '/middleware/middlewareResources',
        type: 'menu',
      },
    },
    {
      path: '/middleware/middlewareResources/:id/edit',
      name: 'middlewareResourceEdit',
      component: () => import('@/views/middleware/middlewareFormPage'),
      meta: {
        title: '编辑中间件',
        locale: 'ec.middleware.page.editTitle',
        fullpage: true,
        hidden: true,
        active: '/middleware/middlewareResources',
        type: 'menu',
      },
    },
    {
      path: '/middleware/middlewareResources/:id/detail',
      name: 'middlewareResourceDetail',
      component: () => import('@/views/middleware/middlewareDetailPage'),
      meta: {
        title: '中间件详情',
        locale: 'ec.middleware.page.detailTitle',
        fullpage: true,
        hidden: true,
        active: '/middleware/middlewareResources',
        type: 'menu',
      },
    },
  ],
}

export default middlewareRoutes
