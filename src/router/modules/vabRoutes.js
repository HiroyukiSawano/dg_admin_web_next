const vabRoutes = {
  path: '/vab',
  name: 'vab',
  meta: {
    title: '原子组件',
    locale: 'ec.menu.name.vab',
    icon: 'ri-shapes-line',
    type: 'directory‌',
    order: 6
  },
  redirect: '/vab/vabChart',
  children: [
    {
      path: '/vab/vabChart',
      name: 'vabChart',
      component: () => import('@/views/vab/vabChart'),
      meta: {
        title: '图表',
        locale: 'ec.menu.name.vabChart',
        type: 'menu',
        order: 1,
        hiddenBreadcrumb: true
      },
    },
    {
      path: '/vab/vabIconSvgAnimation',
      name: 'vabIconSvgAnimation',
      component: () => import('@/views/vab/vabIconSvgAnimation'),
      meta: {
        title: '加载动画',
        locale: 'ec.menu.name.vabIconSvgAnimation',
        type: 'menu',
        order: 2,
        hiddenBreadcrumb: true
      },
    },
    {
      path: '/vab/vabIconSvgColor',
      name: 'vabIconSvgColor',
      component: () => import('@/views/vab/vabIconSvgColor'),
      meta: {
        title: '图标色彩',
        locale: 'ec.menu.name.vabIconSvgColor',
        type: 'menu',
        order: 3,
        hiddenBreadcrumb: true
      },
    },
    {
      path: '/vab/vabPasswordGenerator',
      name: 'vabPasswordGenerator',
      component: () => import('@/views/vab/vabPasswordGenerator'),
      meta: {
        title: '密码生成器',
        locale: 'ec.menu.name.vabPasswordGenerator',
        type: 'menu',
        order: 4,
        hiddenBreadcrumb: true
      },
    },
    {
      path: '/vab/vabContextmenu',
      name: 'vabContextmenu',
      component: () => import('@/views/vab/vabContextmenu'),
      meta: {
        title: '右键菜单',
        locale: 'ec.menu.name.vabContextmenu',
        type: 'menu',
        order: 5
      },
    },
    {
      path: '/vab/vabMilestone',
      name: 'vabMilestone',
      component: () => import('@/views/vab/vabMilestone'),
      meta: {
        title: '里程碑',
        locale: 'ec.menu.name.vabMilestone',
        type: 'menu',
        order: 6
      },
    },
    {
      path: '/vab/vabChat',
      name: 'vabChat',
      component: () => import('@/views/vab/vabChat'),
      meta: {
        title: '对话',
        locale: 'ec.menu.name.vabChat',
        type: 'menu',
        hiddenBreadcrumb: true,
        order: 7
      },
    },
    {
      path: '/vab/vabSituationGuide',
      name: 'vabSituationGuide',
      component: () => import('@/views/vab/vabSituationGuide'),
      meta: {
        title: '情行选择',
        locale: 'ec.menu.name.vabSituationGuide',
        type: 'menu',
        order: 8,
        hiddenBreadcrumb: true
      },
    },
    {
      path: '/vab/vabCron',
      name: 'vabCron',
      component: () => import('@/views/vab/vabCron'),
      meta: {
        title: '规则生成器',
        locale: 'ec.menu.name.vabCron',
        type: 'menu',
        order: 9,
        hiddenBreadcrumb: true
      },
    },
    {
      path: '/vab/vabWorkflow',
      name: 'vabWorkflow',
      component: () => import('@/views/vab/vabWorkflow'),
      meta: {
        title: '工作流',
        locale: 'ec.menu.name.vabWorkflow',
        type: 'menu',
        order: 10
      },
    },
    {
      path: '/vab/vabTableSelect',
      name: 'vabTableSelect',
      component: () => import('@/views/vab/vabTableSelect'),
      meta: {
        title: '表格选择器',
        locale: 'ec.menu.name.vabTableSelect',
        type: 'menu',
        order: 11,
        hiddenBreadcrumb: true
      },
    },
    {
      path: '/vab/vabPlayer',
      name: 'vabPlayer',
      component: () => import('@/views/vab/vabPlayer'),
      meta: {
        title: '视频播放器',
        locale: 'ec.menu.name.vabPlayer',
        type: 'menu',
        order: 12,
        hiddenBreadcrumb: true
      },
    },
    {
      path: '/vab/vabWatermark',
      name: 'vabWatermark',
      component: () => import('@/views/vab/vabWatermark'),
      meta: {
        title: '水印',
        locale: 'ec.menu.name.vabWatermark',
        type: 'menu',
        order: 13
      },
    },
    {
      path: '/vab/vabDynamicIcon',
      name: 'vabDynamicIcon',
      component: () => import('@/views/vab/vabDynamicIcon'),
      meta: {
        title: '动效图标',
        locale: 'ec.menu.name.vabDynamicIcon',
        type: 'menu',
        order: 14,
        hiddenBreadcrumb: true
      },
    },
    {
      path: '/vab/vabDraggable',
      name: 'vabDraggable',
      component: () => import('@/views/vab/vabDraggable'),
      meta: {
        title: '拖拽',
        locale: 'ec.menu.name.vabDraggable',
        type: 'menu',
        order: 15,
        hiddenBreadcrumb: true
      },
    },
    {
      path: '/vab/vabVirtualKeyboard',
      name: 'vabVirtualKeyboard',
      component: () => import('@/views/vab/vabVirtualKeyboard'),
      meta: {
        title: '虚拟键盘',
        locale: 'ec.menu.name.vabVirtualKeyboard',
        type: 'menu',
        order: 16
      },
    },
    {
      path: '/vab/vabAnchor',
      name: 'vabAnchor',
      component: () => import('@/views/vab/vabAnchor'),
      meta: {
        title: '锚点',
        locale: 'ec.menu.name.vabAnchor',
        type: 'menu',
        order: 17,
        hiddenBreadcrumb: true,
      },
    },
    {
      path: '/vab/vabScrollText',
      name: 'vabScrollText',
      component: () => import('@/views/vab/vabScrollText'),
      meta: {
        title: '文本滚动',
        locale: 'ec.menu.name.vabScrollText',
        type: 'menu',
        order: 18,
      },
    },
    {
      path: '/vab/vabGridLayout',
      name: 'vabGridLayout',
      component: () => import('@/views/vab/vabGridLayout'),
      meta: {
        title: '网格拖拽布局',
        locale: 'ec.menu.name.vabGridLayout',
        type: 'menu',
        order: 19,
        hiddenBreadcrumb: true,
      },
    },
    {
      path: '/vab/vabFilterBar',
      name: 'vabFilterBar',
      component: () => import('@/views/vab/vabFilterBar'),
      meta: {
        title: '动态过滤器',
        locale: 'ec.menu.name.vabFilterBar',
        type: 'menu',
        order: 20,
      },
    },
    {
      path: '/vab/vabGantt',
      name: 'vabGantt',
      component: () => import('@/views/vab/vabGantt'),
      meta: {
        title: '甘特图',
        locale: 'ec.menu.name.vabGantt',
        type: 'menu',
        order: 21,
      },
    },
    {
      path: '/vab/vabPrint',
      name: 'vabPrint',
      component: () => import('@/views/vab/vabPrint'),
      meta: {
        title: '打印',
        locale: 'ec.menu.name.vabPrint',
        type: 'menu',
        order: 22,
      },
    },
    {
      path: '/vab/vabCropper',
      name: 'vabCropper',
      component: () => import('@/views/vab/vabCropper'),
      meta: {
        title: '图像裁剪',
        locale: 'ec.menu.name.vabCropper',
        type: 'menu',
        order: 23,
        hiddenBreadcrumb: true
      },
    },
    {
      path: '/vab/vabMagnifier',
      name: 'vabMagnifier',
      component: () => import('@/views/vab/vabMagnifier'),
      meta: {
        title: '放大镜',
        locale: 'ec.menu.name.vabMagnifier',
        type: 'menu',
        order: 24,
      },
    },
    {
      path: '/vab/vabMock',
      name: 'vabMock',
      component: () => import('@/views/vab/vabMock'),
      meta: {
        title: 'Mock 数据',
        locale: 'ec.menu.name.vabMock',
        type: 'menu',
        order: 25,
      },
    },
    {
      path: '/vab/vabCountUp',
      name: 'vabCountUp',
      component: () => import('@/views/vab/vabCountUp'),
      meta: {
        title: '数字自增长',
        locale: 'ec.menu.name.vabCountUp',
        type: 'menu',
        order: 26,
      },
    },
    {
      path: '/vab/vabImageViewer',
      name: 'vabImageViewer',
      component: () => import('@/views/vab/vabImageViewer'),
      meta: {
        title: '图片预览器',
        locale: 'ec.menu.name.vabImageViewer',
        type: 'menu',
        order: 27,
      },
    },
    {
      path: '/vab/vabMarkdown',
      name: 'vabMarkdown',
      component: () => import('@/views/vab/vabMarkdown'),
      meta: {
        title: '标记语言',
        locale: 'ec.menu.name.vabMarkdown',
        type: 'menu',
        order: 28,
      },
    },
    {
      path: '/vab/vabVueFlow',
      name: 'vabVueFlow',
      component: () => import('@/views/vab/vabVueFlow/index.vue'),
      meta: {
        title: '流程图',
        locale: 'ec.menu.name.vabVueFlow',
        type: 'menu',
        tag: 'new',
        order: 29,
        hiddenBreadcrumb: true,
      },
    },
    {
      path: '/vab/vabTiptap',
      name: 'vabTiptap',
      component: () => import('@/views/vab/vabTiptap'),
      meta: {
        title: 'Tiptap Docs',
        locale: 'ec.menu.name.vabTiptap',
        type: 'menu',
        tag: 'new',
        order: 30,
        hiddenBreadcrumb: true,
      },
    },
  ],
}
export default vabRoutes
