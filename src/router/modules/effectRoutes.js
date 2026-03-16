const effectRoutes = {
  path: '/effect',
  name: 'effect',
  meta: {
    title: '视觉特效',
    locale: 'ec.menu.name.effect',
    icon: 'ri-flower-line',
    type: 'directory‌',
    hiddenBreadcrumb: true,
  },
  redirect: '/effect/effectGlass',
  children: [
    {
      path: '/effect/effectGlass',
      name: 'effectGlass',
      component: () => import('@/views/effect/effectGlass'),
      meta: {
        title: '液态玻璃特效',
        locale: 'ec.menu.name.effectGlass',
        type: 'menu',
        // hiddenBreadcrumb: true,
      },
    },
    {
      path: '/effect/effectSphere3D',
      name: 'effectSphere3D',
      component: () => import('@/views/effect/effectSphere3D'),
      meta: {
        title: '旋转球体特效',
        locale: 'ec.menu.name.effectSphere3D',
        type: 'menu',
        hiddenBreadcrumb: true,
      },
    },
  ],
}
export default effectRoutes
