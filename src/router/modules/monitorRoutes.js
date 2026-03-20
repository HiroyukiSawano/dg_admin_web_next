const monitorRoutes = {
  path: '/monitor',
  name: 'monitor',
  meta: {
    title: '监控中心',
    locale: 'ec.menu.name.monitor',
    icon: 'ri-radar-line',
    type: 'directory',
    order: 16,
  },
  redirect: '/monitor/dashboard',
  children: [
    {
      path: '/monitor/dashboard',
      name: 'monitorDashboard',
      component: () => import('@/views/monitor/monitorDashboard'),
      meta: {
        title: '监控大盘',
        locale: 'ec.menu.name.monitorDashboard',
        type: 'menu',
      },
    },
    {
      path: '/monitor/logs',
      name: 'monitorLogs',
      component: () => import('@/views/monitor/monitorLogs'),
      meta: {
        title: '日志审计',
        locale: 'ec.menu.name.monitorLogs',
        type: 'menu',
      },
    },
  ],
}

export default monitorRoutes
