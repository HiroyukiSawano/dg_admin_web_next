const softwareRoutes = {
  path: '/software',
  name: 'software',
  meta: {
    title: '软件资源',
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
      component: () => import('@/views/software/informationSystems'),
      meta: {
        title: '软件台账',
        locale: 'ec.menu.name.softwareAssets',
        type: 'menu',
      },
    },
  ],
}

export default softwareRoutes
