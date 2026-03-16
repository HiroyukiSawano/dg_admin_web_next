const packagesRoutes = {
  path: '/packages',
  name: 'packages',
  component: () => import('@/views/packages'),
  meta: {
    title: '资源依赖',
    locale: 'ec.menu.name.packages',
    icon: 'ri-pushpin-line',
    type: 'menu',
  },
}
export default packagesRoutes
