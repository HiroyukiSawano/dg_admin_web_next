const softwareRoutes = {
  path: '/software',
  name: 'software',
  meta: {
    title: '软件资产',
    locale: 'ec.menu.name.software',
    icon: 'ri-apps-2-line',
    type: 'directory',
    order: 20,
  },
  redirect: '/software/informationSystems',
  children: [
    {
      path: '/software/informationSystems',
      name: 'softwareAssets',
      component: () => import('@/views/software/informationSystemsFigma'),
      meta: {
        title: '软件台账',
        locale: 'ec.menu.name.softwareAssets',
        fullpage: true,
        type: 'menu',
      },
    },
    {
      path: '/software/informationSystems/create',
      name: 'softwareAssetCreate',
      component: () => import('@/views/software/softwareFormPage'),
      meta: {
        title: '新增软件',
        locale: 'ec.software.page.createTitle',
        fullpage: true,
        hidden: true,
        active: '/software/informationSystems',
        type: 'menu',
      },
    },
    {
      path: '/software/informationSystems/:id/edit',
      name: 'softwareAssetEdit',
      component: () => import('@/views/software/softwareFormPage'),
      meta: {
        title: '编辑软件',
        locale: 'ec.software.page.editTitle',
        fullpage: true,
        hidden: true,
        active: '/software/informationSystems',
        type: 'menu',
      },
    },
    {
      path: '/software/informationSystems/:id/detail',
      name: 'softwareAssetDetail',
      component: () => import('@/views/software/softwareDetailPage'),
      meta: {
        title: '软件详情',
        locale: 'ec.software.page.detailTitle',
        fullpage: true,
        hidden: true,
        active: '/software/informationSystems',
        type: 'menu',
      },
    },
    {
      path: '/software/informationSystems/:id/relations',
      name: 'softwareAssetRelations',
      component: () => import('@/views/software/softwareRelationsPage'),
      meta: {
        title: '软件关联维护',
        locale: 'ec.software.page.relationsTitle',
        fullpage: true,
        hidden: true,
        active: '/software/informationSystems',
        type: 'menu',
      },
    },
  ],
}

export default softwareRoutes
