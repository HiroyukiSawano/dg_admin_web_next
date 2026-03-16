
const otherRoutes = {
  path: '/other',
  name: 'other',
  meta: {
    title: '其他',
    locale: 'ec.menu.name.other',
    icon: 'ri-triangular-flag-line',
    type: 'directory‌',
    order: 9
  },
  redirect: '/other/otherDirective',
  children: [
    {
      path: '/other/otherDirective',
      name: 'otherDirective',
      component: () => import('@/views/other/otherDirective'),
      meta: {
        title: '指令集',
        locale: 'ec.menu.name.otherDirective',
        type: 'menu',
      },
    },
    {
      path: '/other/otherTabs',
      name: 'otherTabs',
      component: () => import('@/views/other/otherTabs'),
      meta: {
        title: '标签操作',
        locale: 'ec.menu.name.otherTabs',
        type: 'menu',
      },
    },
    {
      path: '/other/otherPermission',
      name: 'otherPermission',
      meta: {
        title: '路由权限',
        locale: 'ec.menu.name.otherPermission',
        roles: ['AUTH_SYSTEM_ADMIN'],
        type: 'directory‌',
      },
      redirect: '/other/otherPermission/otherPermissionDemo',
      children: [
        {
          path: '/other/otherPermission/otherPermissionDemo',
          name: 'otherPermissionDemo',
          component: () => import('@/views/other/otherPermission/otherPermissionDemo'),
          meta: {
            title: '路由权限演示',
            locale: 'ec.menu.name.otherPermissionDemo',
            roles: ['AUTH_SYSTEM_ADMIN'],
            type: 'menu',
          },
        },
      ],
    },
    {
      path: '/other/otherFullpage',
      name: 'otherFullpage',
      component: () => import('@/views/other/otherFullpage'),
      meta: {
        title: '整页路由',
        locale: 'ec.menu.name.otherFullpage',
        fullpage: true,
        type: 'menu',
      },
    },
    {
      path: '/other/otherVerificate',
      name: 'otherVerificate',
      meta: {
        title: '表单验证',
        locale: 'ec.menu.name.otherVerificate',
        type: 'menu',
      },
      component: () => import('@/views/other/otherVerificate'),
    },
    {
      path: '/link',
      name: 'link',
      meta: {
        title: '外部链接',
        locale: 'ec.menu.name.link',
        type: 'directory‌',
      },
      children: [
        {
          path: '/link/linkBaidu',
          name: 'linkBaidu',
          meta: {
            title: '百度',
            locale: 'ec.menu.name.linkBaidu',
            type: 'link',
            url: 'https://www.baidu.com/',
          },
        },
        {
          path: '/link/linkAmap',
          name: 'linkAmap',
          meta: {
            title: '高德地图',
            locale: 'ec.menu.name.linkAmap',
            type: 'link',
            url: 'https://www.amap.com/',
          },
        },
      ],
    },
    {
      path: '/iframe',
      name: 'iframe',
      meta: {
        title: '内嵌框架',
        locale: 'ec.menu.name.iframe',
        type: 'directory‌',
      },
      children: [
        {
          path: '/iframe/iframeReact',
          name: 'iframeReact',
          component: { template: '<template></template>' },
          meta: {
            title: 'React',
            locale: 'ec.menu.name.iframeReact',
            type: 'iframe',
            url: 'https://react.dev/',
          },
        },
        {
          path: '/iframe/iframeVitepress',
          name: 'iframeVitepress',
          component: { template: '<template></template>' },
          meta: {
            title: 'Vitepress',
            locale: 'ec.menu.name.iframeVitepress',
            type: 'iframe',
            url: 'https://vitepress.dev/',
          },
        },
      ],
    },
  ],
}
export default otherRoutes
