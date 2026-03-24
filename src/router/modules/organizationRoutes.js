const organizationRoutes = {
  path: '/organization',
  name: 'organization',
  meta: {
    title: '组织资源',
    locale: 'ec.menu.name.organization',
    icon: 'ri-team-line',
    type: 'directory',
    order: 17,
  },
  redirect: '/organization/departments',
  children: [
    {
      path: '/organization/departments',
      name: 'organizationDepartments',
      component: () => import('@/views/organization/departments'),
      meta: {
        title: '部门管理',
        locale: 'ec.menu.name.organizationDepartments',
        type: 'menu',
      },
    },
    {
      path: '/organization/locations',
      name: 'organizationLocations',
      component: () => import('@/views/organization/locations'),
      meta: {
        title: '位置管理',
        locale: 'ec.menu.name.organizationLocations',
        type: 'menu',
      },
    },
    {
      path: '/organization/service-providers',
      name: 'organizationServiceProviders',
      component: () => import('@/views/organization/serviceProviders'),
      meta: {
        title: '服务商管理',
        locale: 'ec.menu.name.organizationServiceProviders',
        fullpage: true,
        type: 'menu',
      },
    },
    {
      path: '/organization/persons',
      name: 'organizationPersons',
      component: () => import('@/views/organization/persons'),
      meta: {
        title: '人员管理',
        locale: 'ec.menu.name.organizationPersons',
        fullpage: true,
        type: 'menu',
      },
    },
  ],
}

export default organizationRoutes
