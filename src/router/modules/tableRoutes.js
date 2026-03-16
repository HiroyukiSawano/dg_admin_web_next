const tableRoutes = {
  path: '/table',
  name: 'table',
  meta: {
    title: '表格',
    locale: 'ec.menu.name.table',
    icon: 'ri-table-line',
    type: 'directory‌',
    order: 5
  },
  redirect: '/table/tableBasic',
  children: [
    {
      path: '/table/tableBasic',
      name: 'tableBasic',
      component: () => import('@/views/table/tableBasic'),
      meta: {
        title: '基础表格',
        locale: 'ec.menu.name.tableBasic',
        type: 'menu',
      },
    },
    {
      path: '/table/tableTabs',
      name: 'tableTabs',
      component: () => import('@/views/table/tableTabs'),
      meta: {
        title: '页签表格',
        locale: 'ec.menu.name.tableTabs',
        type: 'menu',
      },
    },
    {
      path: '/table/tableToggle',
      name: 'tableToggle',
      component: () => import('@/views/table/tableToggle'),
      meta: {
        title: '表格视图切换',
        locale: 'ec.menu.name.tableToggle',
        type: 'menu',
      },
    },
    {
      path: '/table/tableSetting',
      name: 'tableSetting',
      component: () => import('@/views/table/tableSetting'),
      meta: {
        title: '表格自定义设置',
        locale: 'ec.menu.name.tableSetting',
        type: 'menu',
      },
    },
    {
      path: '/table/tableSort',
      name: 'tableSort',
      component: () => import('@/views/table/tableSort'),
      meta: {
        title: '表格拖拽排序',
        locale: 'ec.menu.name.tableSort',
        type: 'menu',
      },
    },
    {
      path: '/table/tableOperate',
      name: 'tableOperate',
      meta: {
        title: '表格操作',
        locale: 'ec.menu.name.tableOperate',
        type: 'menu',
      },
      component: () => import('@/views/table/tableOperate'),
      children: [
        {
          path: '/table/tableOperate/tableOperateDetail',
          name: 'tableOperateDetail',
          component: () => import('@/views/table/tableOperate/tableOperateDetail'),
          meta: {
            title: '新增&编辑',
            locale: 'ec.menu.name.tableOperateDetail',
            type: 'menu',
            active: '/table/tableOperate',
            hidden: true,
          },
        },
      ],
    },
    {
      path: '/table/tableColumn',
      name: 'tableColumn',
      component: () => import('@/views/table/tableColumn'),
      meta: {
        title: '左树右表格',
        locale: 'ec.menu.name.tableColumn',
        type: 'menu',
      },
    },
    {
      path: '/table/tableSplit',
      name: 'tableSplit',
      component: () => import('@/views/table/tableSplit'),
      meta: {
        title: '可拖动分割表格',
        locale: 'ec.menu.name.tableSplit',
        type: 'menu',
      },
    },
    {
      path: '/table/tableFill',
      name: 'tableFill',
      component: () => import('@/views/table/tableFill'),
      meta: {
        title: '表格撑满布局',
        locale: 'ec.menu.name.tableFill',
        type: 'menu',
      },
    },
  ],
}
export default tableRoutes
