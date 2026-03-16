import { createRouter, createWebHashHistory } from 'vue-router'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import configs, { AUTH_ENABLED } from '@/configs'
import { t } from '@/locales'
import { useAuthorizeStore } from '@/stores/modules/authorizeStore'
import { usePermissionStore } from '@/stores/modules/permissionStore'

const modules = import.meta.glob('./modules/*.js', { eager: true })
const staticRoutes = Object.keys(modules).reduce((acc, path) => {
  const module = modules[path].default
  acc.push(module)
  return acc
}, [])

const sortRoutes = (routes) => {
  routes.sort((a, b) => (a.meta?.order ?? Infinity) - (b.meta?.order ?? Infinity))
  routes.forEach((route) => {
    if (route.children?.length > 0) {
      sortRoutes(route.children)
    }
  })
}

sortRoutes(staticRoutes)

export const constantRoutes = [
  { path: '/', name: 'Root', component: () => import('@/layouts') },
  { path: '/login', name: 'Login', component: () => import('@/views/login') },
  { path: '/403', component: () => import('@/views/error/403') },
  { path: '/404', component: () => import('@/views/error/404') },
  { path: '/500', component: () => import('@/views/error/500') },
  { path: '/redirect/:path(.*)', component: () => import('@/views/redirect') },
  { path: '/:pathMatch(.*)*', component: () => import('@/views/error/404') },
]

export const frontendRoutes = [
  {
    path: '/home',
    name: 'home',
    meta: {
      title: '主页',
      locale: 'ec.menu.name.home',
      icon: 'ri-home-smile-2-line',
      type: 'menu',
      affix: true,
      hiddenBreadcrumb: true,
    },
    component: () => import('@/views/home'),
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    redirect: '/dashboard/dashboardConsole',
    meta: {
      title: '控制台',
      locale: 'ec.menu.name.dashboard',
      icon: 'ri-dashboard-line',
      type: 'directory',
      tag: 'new',
      hiddenBreadcrumb: true,
    },
    children: [
      {
        path: '/dashboard/dashboardWorkbench',
        name: 'dashboardWorkbench',
        component: () => import('@/views/dashboard/dashboardWorkbench'),
        meta: {
          title: '工作台',
          locale: 'ec.menu.name.dashboardWorkbench',
          type: 'menu',
          tag: 'new',
          hiddenBreadcrumb: true,
        },
      },
      {
        path: '/dashboard/dashboardConsole',
        name: 'dashboardConsole',
        component: () => import('@/views/dashboard/dashboardConsole'),
        meta: {
          title: '控制面板',
          locale: 'ec.menu.name.dashboardConsole',
          type: 'menu',
          hiddenBreadcrumb: true,
        },
      },
      {
        path: '/dashboard/dashboardCustom',
        name: 'dashboardCustom',
        component: () => import('@/views/dashboard/dashboardCustom'),
        meta: {
          title: '自定义面板',
          locale: 'ec.menu.name.dashboardCustom',
          type: 'menu',
          hiddenBreadcrumb: true,
        },
      },
    ],
  },
  ...staticRoutes,
]

const router = createRouter({
  history: createWebHashHistory(import.meta.env.VITE_APP_CONTEXT),
  routes: constantRoutes,
  scrollBehavior: () => ({ left: 0, top: 0 }),
})

const handleFullpageRoute = (to) => {
  if (to.meta.fullpage) {
    to.matched = [to.matched[to.matched.length - 1]]
  }
  return true
}

router.beforeEach(async (to, from) => {
  NProgress.start()
  const authorizeStore = useAuthorizeStore()
  const permissionStore = usePermissionStore()
  const { user, CheckToken } = authorizeStore
  const { routed, homepage, GenerateRoutes } = permissionStore

  if (configs.ROUTES_WHITELIST.includes(to.path)) return true

  if (!AUTH_ENABLED) {
    authorizeStore.EnsureAuthorize()
    if (!routed) {
      await GenerateRoutes()
      return { ...to, replace: true }
    }
    if (to.path === '/') return { path: homepage, replace: true }
    if (to.path === '/login') return { path: homepage || '/home', replace: true }
    return handleFullpageRoute(to)
  }

  await CheckToken()

  const identifier = user?.id
  if (!identifier) {
    if (to.path !== '/login') return { path: '/login', replace: true }
    return true
  }

  if (!routed) {
    await GenerateRoutes()
    return { ...to, replace: true }
  }

  if (to.path === '/') return { path: homepage, replace: true }
  if (to.path === '/login') return { path: from.fullPath, replace: true }
  return handleFullpageRoute(to)
})

router.afterEach((to) => {
  document.title = to.meta.title ? `${t(to.meta.title)} - ${t('ec.app.name')}` : `${t('ec.app.name')}`
  NProgress.done()
})

export const addRoutes = (routes) => {
  routes.forEach((route) => {
    const { name } = route
    if (!name || router.hasRoute(name)) return
    router.addRoute('Root', route)
  })
}

export const removeRoutes = (routes) => {
  routes.forEach((route) => {
    const { name } = route
    if (!name || !router.hasRoute(name)) return
    router.removeRoute(name)
  })
}

export const resetRoutes = async (routes) => {
  removeRoutes(routes)
  addRoutes(routes)
}

export default router
