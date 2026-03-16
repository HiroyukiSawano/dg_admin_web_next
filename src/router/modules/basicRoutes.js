const basicRoutes = {
  path: '/basic',
  name: 'basic',
  redirect: '/basic/basicIcon',
  meta: {
    title: '基础项',
    locale: 'ec.menu.name.basic',
    icon: 'ri-layout-2-line',
    type: 'directory‌',
    order: 3
  },
  children: [
    {
      path: '/basic/basicIcon',
      name: 'basicIcon',
      component: () => import('@/views/basic/basicIcon'),
      meta: {
        title: '图标',
        locale: 'ec.menu.name.basicIcon',
        type: 'menu',
      },
    },
  ],
}
export default basicRoutes
