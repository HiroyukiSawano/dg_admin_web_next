const errorRoutes = {
  path: '/error',
  name: 'error',
  meta: {
    title: '异常页',
    locale: 'ec.menu.name.error',
    icon: 'ri-close-circle-line',
    type: 'directory‌',
    order: 9
  },
  redirect: '/error/403',
  children: [
    {
      path: '/error/403',
      name: 'error403',
      component: () => import('@/views/error/403'),
      meta: {
        title: '403',
        locale: 'ec.menu.name.error403',
        type: 'menu',
        hiddenBreadcrumb: true
      },
    },
    {
      path: '/error/404',
      name: 'error404',
      component: () => import('@/views/error/404'),
      meta: {
        title: '404',
        locale: 'ec.menu.name.error404',
        type: 'menu',
        hiddenBreadcrumb: true
      },
    },
    {
      path: '/error/500',
      name: 'error500',
      component: () => import('@/views/error/500'),
      meta: {
        title: '500',
        locale: 'ec.menu.name.error500',
        type: 'menu',
        hiddenBreadcrumb: true
      },
    },
  ],
}
export default errorRoutes
