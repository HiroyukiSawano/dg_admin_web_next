const formRoutes = {
  path: '/form',
  name: 'form',
  meta: {
    title: '表单',
    locale: 'ec.menu.name.form',
    icon: 'ri-archive-drawer-line',
    type: 'directory‌',
    order: 4
  },
  redirect: '/form/formBasic',
  children: [
    {
      path: '/form/formBasic',
      name: 'formBasic',
      component: () => import('@/views/form/formBasic'),
      meta: {
        title: '基础表单',
        locale: 'ec.menu.name.formBasic',
        type: 'menu',
      },
    },
    {
      path: '/form/formGrid',
      name: 'formGrid',
      component: () => import('@/views/form/formGrid'),
      meta: {
        title: '网格表单',
        locale: 'ec.menu.name.formGrid',
        type: 'menu',
      },
    },
  ],
}
export default formRoutes
