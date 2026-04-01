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
      component: () => import('@/views/project/projectsFigma'),
      meta: {
        title: '项目台账',
        locale: 'ec.menu.name.projectAssets',
        fullpage: true,
        type: 'menu',
      },
    },
    {
      path: '/project/projects/create',
      name: 'projectAssetCreate',
      component: () => import('@/views/project/projectFormPage'),
      meta: {
        title: '新增项目',
        locale: 'ec.project.page.createTitle',
        fullpage: true,
        hidden: true,
        active: '/project/projects',
        type: 'menu',
      },
    },
    {
      path: '/project/projects/:id/edit',
      name: 'projectAssetEdit',
      component: () => import('@/views/project/projectFormPage'),
      meta: {
        title: '编辑项目',
        locale: 'ec.project.page.editTitle',
        fullpage: true,
        hidden: true,
        active: '/project/projects',
        type: 'menu',
      },
    },
    {
      path: '/project/projects/:id/detail',
      name: 'projectAssetDetail',
      component: () => import('@/views/project/projectDetailPage'),
      meta: {
        title: '项目详情',
        locale: 'ec.project.page.detailTitle',
        fullpage: true,
        hidden: true,
        active: '/project/projects',
        type: 'menu',
      },
    },
    {
      path: '/project/projects/:id/relations',
      name: 'projectAssetRelations',
      component: () => import('@/views/project/projectRelationsPage'),
      meta: {
        title: '项目关联维护',
        locale: 'ec.project.page.relationsTitle',
        fullpage: true,
        hidden: true,
        active: '/project/projects',
        type: 'menu',
      },
    },
  ],
}

export default projectRoutes
