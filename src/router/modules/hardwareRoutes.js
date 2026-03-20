const hardwareRoutes = {
  path: '/hardware',
  name: 'hardware',
  meta: {
    title: '硬件资源',
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
      component: () => import('@/views/hardware/hardwareAssets'),
      meta: {
        title: '硬件台账',
        locale: 'ec.menu.name.hardwareAssets',
        type: 'menu',
      },
    },
  ],
}

export default hardwareRoutes
