const databaseRoutes = {
  path: '/database',
  name: 'database',
  meta: {
    title: '数据库资产',
    locale: 'ec.menu.name.database',
    icon: 'ri-database-2-line',
    type: 'directory',
    order: 22,
  },
  redirect: '/database/databaseResources',
  children: [
    {
      path: '/database/databaseResources',
      name: 'databaseResources',
      component: () => import('@/views/databaseResource/databaseResources'),
      meta: {
        title: '数据库台账',
        locale: 'ec.menu.name.databaseResources',
        fullpage: true,
        type: 'menu',
      },
    },
    {
      path: '/database/databaseResources/create',
      name: 'databaseResourceCreate',
      component: () => import('@/views/databaseResource/databaseFormPage'),
      meta: {
        title: '新增数据库',
        locale: 'ec.database.page.createTitle',
        fullpage: true,
        hidden: true,
        active: '/database/databaseResources',
        type: 'menu',
      },
    },
    {
      path: '/database/databaseResources/:id/edit',
      name: 'databaseResourceEdit',
      component: () => import('@/views/databaseResource/databaseFormPage'),
      meta: {
        title: '编辑数据库',
        locale: 'ec.database.page.editTitle',
        fullpage: true,
        hidden: true,
        active: '/database/databaseResources',
        type: 'menu',
      },
    },
    {
      path: '/database/databaseResources/:id/detail',
      name: 'databaseResourceDetail',
      component: () => import('@/views/databaseResource/databaseDetailPage'),
      meta: {
        title: '数据库详情',
        locale: 'ec.database.page.detailTitle',
        fullpage: true,
        hidden: true,
        active: '/database/databaseResources',
        type: 'menu',
      },
    },
  ],
}

export default databaseRoutes
