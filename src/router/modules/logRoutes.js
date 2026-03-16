const logRoutes = {
  path: '/log',
  name: 'log',
  component: () => import('@/views/log'),
  meta: {
    title: '日志',
    locale: 'ec.menu.name.log',
    icon: 'ri-pushpin-line',
    type: 'menu',
    hidden: true,
  },
}
export default logRoutes
