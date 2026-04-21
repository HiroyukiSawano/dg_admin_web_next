const hardwareRoutes = {
  path: '/hardware',
  name: 'hardware',
  meta: {
    title: '硬件资产',
    locale: 'ec.menu.name.hardware',
    icon: 'ri-database-2-line',
    type: 'directory',
    order: 18,
  },
  redirect: '/hardware/hardwareAssets',
  children: [
    {
      path: '/hardware/hardwareAssets',
      name: 'hardwareAssets',
      component: () => import('@/views/hardware/hardwareAssetsFigma'),
      meta: {
        title: '硬件台账',
        locale: 'ec.menu.name.hardwareAssets',
        fullpage: true,
        type: 'menu',
      },
    },
    {
      path: '/hardware/hardwareAssets/create',
      name: 'hardwareAssetCreate',
      component: () => import('@/views/hardware/hardwareFormPage'),
      meta: {
        title: '新增硬件',
        locale: 'ec.hardware.page.createTitle',
        fullpage: true,
        hidden: true,
        active: '/hardware/hardwareAssets',
        type: 'menu',
      },
    },
    {
      path: '/hardware/hardwareAssets/:id/edit',
      name: 'hardwareAssetEdit',
      component: () => import('@/views/hardware/hardwareFormPage'),
      meta: {
        title: '编辑硬件',
        locale: 'ec.hardware.page.editTitle',
        fullpage: true,
        hidden: true,
        active: '/hardware/hardwareAssets',
        type: 'menu',
      },
    },
    {
      path: '/hardware/hardwareAssets/:id/detail',
      name: 'hardwareAssetDetail',
      component: () => import('@/views/hardware/hardwareDetailPage'),
      meta: {
        title: '硬件详情',
        locale: 'ec.hardware.page.detailTitle',
        fullpage: true,
        hidden: true,
        active: '/hardware/hardwareAssets',
        type: 'menu',
      },
    },
    {
      path: '/hardware/hardwareAssets/:id/relations',
      name: 'hardwareAssetRelations',
      component: () => import('@/views/hardware/hardwareRelationsPage'),
      meta: {
        title: '硬件关联维护',
        locale: 'ec.hardware.page.relationsTitle',
        fullpage: true,
        hidden: true,
        active: '/hardware/hardwareAssets',
        type: 'menu',
      },
    },
  ],
}

export default hardwareRoutes
