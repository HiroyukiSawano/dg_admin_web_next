const projectRoutes = {
  path: '/project',
  name: 'project',
  meta: {
    title: '项目资源',
    locale: 'ec.menu.name.project',
    icon: 'ri-briefcase-4-line',
    type: 'directory',
    order: 19,
  },
  redirect: '/project/projects',
  children: [
    {
      path: '/project/projects',
      name: 'projectAssets',
      component: () => import('@/views/project/projects'),
      meta: {
        title: '项目台账',
        locale: 'ec.menu.name.projectAssets',
        type: 'menu',
      },
    },
  ],
}

export default projectRoutes
