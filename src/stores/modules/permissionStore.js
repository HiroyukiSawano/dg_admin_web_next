import { mergeWith } from 'lodash-es'
import { defineStore } from 'pinia'
import configs from '@/configs'
import { resolveSystemProfile } from '@/configs/systemProfile'
import { removeRoutes, resetRoutes, frontendRoutes } from '@/router'
import { apiUserMenus } from '@/services/modules/bspService'
import { useAuthorizeStore } from './authorizeStore'

const usePermissionStore = defineStore('permission', {
  state: () => ({
    menus: [],
    routes: [],
    homepage: configs.ROUTES_HOMEPAGE,
    routed: false,
  }),

  getters: {},
  actions: {
    // 设置菜单
    SetPermissionMenus(payload) {
      this.menus = payload
    },
    // 设置扁平化的路由
    SetPermissionRoutes(payload) {
      this.routes = payload
    },
    // 设置主页
    SetPermissionHomepage(payload) {
      this.homepage = payload
    },
    // 设置路由加载完成
    SetPermissionRouted(payload) {
      this.routed = payload
    },
    // 重置所有
    ResetPermission() {
      // 先移除旧路由
      removeRoutes(this.routes)
      // 重置数据
      this.$reset()
    },
    // 生成路由
    async GenerateRoutes() {
      const { roles, Logout } = useAuthorizeStore()
      try {
        // 获取后端路由
        const backendRoutes = await fetchBackendRoutes()
        // 合并路由
        let routes = mergeRoutes(backendRoutes, frontendRoutes)
        console.log(routes, 'routesroutesroutesroutesroutes')
        // 开启国际化路由
        if(configs.SYSTEM_LOCALE_ENABLED) routes = formatRoutes(routes)
        // 开启过滤权限路由
        if(configs.ROUTES_CONTROL) routes = filterRoutes(routes, roles)

        // 设置菜单，过滤掉不显示的菜单
        const menus = filterMenus(routes)
        this.SetPermissionMenus(menus)

        // 设置扁平化的路由
        const flattens = flattenRoutes(routes)
        this.SetPermissionRoutes(flattens)

        // 设置路由中第一个为菜单的路径为首页（如果默认首页为空的话）
        const homepage = this.homepage ?? flattens.find((r) => r.meta?.type === 'menu')?.path
        this.SetPermissionHomepage(homepage)

        // 路由重置
        resetRoutes(flattens)
        // 路由构建已完成
        this.SetPermissionRouted(true)
      } catch (error) {
        // 构建路由过程中出现任何错误都注销并刷新页面
        console.log(error)
        await Logout()
        window.location.reload()
      }
    },
  },
})

/**
 * 异步获取后端路由
 * 则通过BSP请求获取菜单数据若获取的数据为空，则抛出错误便于外层捕获，否则将数据转换为路由格式并返回
 * @throws {Error} 如果从后端获取的菜单数据为空，则抛出错误
 */
const fetchBackendRoutes = async () => {
  // 检查配置，确定路由来源是否为后端
  if (configs.ROUTES_PROVENANCE === 'backend') {
    // 向BSP请求用户菜单数据
    const res = await apiUserMenus()
    // 如果没有数据，直接抛出错误便于外层捕获
    if (!res?.length) throw new Error('No menus data !!')
    // 处理成标准路由数据格式返回
    return convertBackendMenu(res)
  }
  return []
}

/**
 * 将BSP菜单数据转换为前端路由格式
 * 此函数递归处理每个菜单项，将其转换为适用于前端路由的格式它处理路径、名称、组件、元数据、重定向和子菜单
 * @param {Array} menus - 后端返回的菜单数据，默认为空数组
 * @param {String} active - 当前激活的菜单路径，用于处理隐藏菜单的激活状态
 */

const convertBackendMenu = (menus = [], active) => {
  if (!Array.isArray(menus) || menus.length === 0) return []
  return menus.map((item) => {
    // 解构菜单项的属性，并设置默认值和处理隐藏属性
    const {
      path,
      data,
      title,
      hidden: hidden = item.hidden === 1,
      children,
      icon,
    } = { ...item, hidden: undefined }
    return {
      // 处理菜单路径，如果为'#'则使用data属性作为路径
      path: path === '#' ? `/${data}` : path,
      // 使用data属性作为路由名称
      name: data,
      // 根据路径加载组件，如果路径为'#'则不需要加载组件
      component: path === '#' ? null : loadComponent(path),
      meta: {
        // 使用菜单标题作为元数据的标题
        title,
        // 设置元数据的国际化键值
        locale: `ec.menu.name.${data}`,
        // 根据路径判断菜单类型，如果路径为'#'则为目录，否则为普通菜单（后续会判断link/iframe）
        type: path === '#' ? 'directory' : 'menu',
        // 使用处理后的hidden属性作为元数据的隐藏标志
        hidden,
        // 处理图标，如果图标包含'ri-'前缀则直接使用，否则添加前缀或设置为null
        icon: icon?.includes('ri-') ? icon : icon ? `ri-${icon}` : null,
        // 根据菜单是否隐藏，决定是否设置激活状态
        active: hidden ? active : null,
      },
      // 处理重定向，如果菜单有子菜单且不隐藏，则重定向到第一个子菜单的路径
      redirect: (path === '#' && children?.find(({ path, hidden }) => !(hidden || path === '#'))?.path) || '',
      // 递归处理子菜单
      children: children?.length > 0 ? convertBackendMenu(children, path) : [],
    }
  })
}

/**
 * 格式化路由数据
 * 该函数递归地处理路由数据，为每个路由项添加默认的标题（国际化标题）
 * @param {Array} data - 路由数据数组，包含多个路由项
 */
const formatRoutes = (data) => {
  return data.map((item) => {
    // 解构路由项，提取meta信息、children及剩余属性
    const { meta = {}, children, ...r } = item
    // 创建新的路由项，合并剩余属性与meta，如果有国际化的话确保title字段被正确赋予国际化键值
    const _item = { ...r, meta: { ...meta, title: meta.locale || meta.title || item.name } }
    // 如果当前路由项有子路由，则递归格式化子路由
    if (children?.length > 0) _item.children = formatRoutes(children)
    // 返回格式化后的路由项
    return _item
  })
}

/**
 * 将嵌套的路由数据结构展平为一维数组
 * @param {Array} data - 嵌套的路由数据
 * @param {Array} breadcrumb - 当前面包屑导航路径，默认为空数组
 */
const flattenRoutes = (data, breadcrumb = []) => {
  return data.reduce((acc, item) => {
    // 解构路由项，提取子路由和元数据，其余属性保留在_item中
    const { children, meta, ...r } = item
    // 构造新路由项，合并元数据，并将当前项添加到面包屑导航中
    const _item = { ...r, meta: { ...meta, breadcrumb: [...breadcrumb, item] } }
    // 递归处理子路由
    const _children = children?.length > 0 ? flattenRoutes(children, [...breadcrumb, item]) : []
    // 将当前项和子路由合并到累积数组
    return [...acc, _item, ..._children]
  }, [])
}

/**
 * 根据用户角色过滤路由
 * 此函数的作用是过滤给定的路由数据，只保留对具有特定角色的用户可见的路由及其子路由
 * 它通过递归地检查每个路由及其子路由的访问权限来实现过滤
 *
 * @param {Array} data - 包含所有路由信息的数组，每个路由都有可能包含子路由（children）
 * @param {Array} roles - 当前用户的角色数组，用于判断用户是否有访问特定路由的权限
 */
const filterRoutes = (data, roles = []) => {
  const { allowedPrefixes = [] } = resolveSystemProfile({ roles })

  return data.reduce((acc, item) => {
    if (allowedPrefixes.length > 0 && !hasRoutePrefixAccess(item, allowedPrefixes)) return acc
    // 如果用户不具备访问此路由的角色权限，则跳过此路由，不加入到结果中
    if (item.meta?.roles && !item.meta?.roles.some((r) => roles.includes(r))) return acc
    // 复制当前路由项，以避免修改原始数据结构
    const _item = { ...item }
    // 则递归过滤子路由
    if (item.children?.length > 0) _item.children = filterRoutes(item.children, roles)
    // 将处理后的当前路由项添加到结果数组中
    return [...acc, _item]
  }, [])
}

const hasRoutePrefixAccess = (route, allowedPrefixes = []) => {
  const path = route?.path || ''
  return allowedPrefixes.some((prefix) => path === prefix || path.startsWith(`${prefix}/`))
}

/**
 * 过滤菜单项
 * 该函数接收一个菜单项数组，并返回一个新的数组，新数组中不包含任何元数据中标记为隐藏的菜单项
 * @param {Array} data - 菜单项数组
 */
const filterMenus = (data) => {
  return data.reduce((acc, item) => {
    // 如果菜单项的元数据中标记为隐藏，则跳过该项
    if (item.meta?.hidden) return acc
    // 复制当前菜单项以避免修改原始数据
    const _item = { ...item }
    // 如果菜单项有子菜单项，则递归调用filterMenus函数进行过滤
    if (item.children?.length > 0) _item.children = filterMenus(item.children)
    // 将过滤后的菜单项添加到结果数组中
    return [...acc, _item]
  }, [])
}

/**
 * 动态加载组件
 * @param {string} component 组件的名称，用于查找和动态导入对应的组件模块
 */
const loadComponent = (component) => {
  // 获取所有模块的映射，用于动态导入
  const modules = import.meta.glob('@/views/**/*.vue')
  // 如果指定了组件名称，则尝试查找并导入该组件
  if (component) {
    for (const path in modules) {
      // 从文件路径中提取目录路径，作为组件的标识
      const dir = path.split('views')[1].split('.vue')[0]
      // 如果找到匹配的组件路径或组件的索引路径，则返回该组件的动态导入函数
      if (dir === component || dir === `${component}/index`) {
        return () => modules[path]()
      }
    }
  }
  // 如果未找到指定的组件，则返回404错误页面的动态导入函数
  return () => import('@/views/error/404')
}

/**
 * 深度合并路由配置
 * 该函数用于合并两个路由配置数组，如果数组中的项有相同的name属性，则会进行合并
 * @param {Array} previous - 第一个路由配置数组
 * @param {Array} nexts - 第二个路由配置数组
 * @returns {Array} - 合并后的路由配置数组
 */
const mergeRoutes = (previous, nexts) => {
  const handler = (a, b) => {
    // 如果任一参数不是数组，则直接返回
    if (!Array.isArray(a) || !Array.isArray(b)) return
    // 初始化空数组merges，用于存储最终合并后的结果
    const merges = []
    // 初始化Map对象，用于临时存储第一个数组中需要合并的项
    const maps = new Map()
    // 遍历第一个数组，将项存储在maps中以便后续合并
    a.forEach((item) => {
      if (item.name) {
        // 如果当前项有name属性，则将其作为键存储在maps中
        maps.set(item.name, item)
      } else {
        // 如果当前项没有name属性，则直接将其添加到merges数组中
        merges.push(item)
      }
    })
    // 遍历第二个数组，与maps中的项进行合并
    b.forEach((item) => {
      // 检查当前元素是否有name属性
      if (item.name) {
        // 尝试从maps中获取与当前元素name属性值相同的项
        const existed = maps.get(item.name)
        // 如果找到了相同的项
        if (existed) {
          // 将现有项与新项合并，并将结果添加到merges数组中
          merges.push(mergeWith({}, existed, item, handler))
          // 合并后，从maps中移除现有项，以避免重复合并
          maps.delete(item.name)
        } else {
          // 如果没有找到相同的项，直接将当前元素添加到merges数组中
          merges.push(item)
        }
      } else {
        // 如果没有找到相同的项，直接将当前元素添加到merges数组中
        merges.push(item)
      }
    })
    // 将maps中剩余的项添加到合并后的数组中
    merges.push(...maps.values())
    return merges
  }
  return handler(previous, nexts) || []
}

export { usePermissionStore }
export default usePermissionStore
