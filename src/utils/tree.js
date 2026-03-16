const Tree = {
  treeFilter: (datas, func) => {
    return datas
      .map((node) => ({ ...node }))
      .filter((node) => {
        node.children = node.children && Tree.treeFilter(node.children, func)
        return func(node) || (node.children && node.children.length)
      })
  },

  treeFind: (datas, func) => {
    for (const data of datas) {
      if (func(data)) return data
      if (data.children) {
        const res = Tree.treeFind(data.children, func)
        if (res) return res
      }
    }
    return null
  },

  treeBuild: (data, id, pid, children) => {
    if (!Array.isArray(data)) {
      console.warn('【tree】传入的必须是一个数组')
      return []
    }
    const config = {
      id: id || 'id',
      pid: pid || 'pid',
      children: children || 'children',
    }
    const childrenListMap = {}
    const nodeIds = {}
    const tree = []
    for (const d of data) {
      const pid = d[config.pid]
      if (childrenListMap[pid] === null) {
        childrenListMap[pid] = []
      }
      nodeIds[d[config.id]] = d
      childrenListMap[pid].push(d)
    }
    for (const d of data) {
      const pid = d[config.pid]
      if (nodeIds[pid] === null) {
        tree.push(d)
      }
    }
    for (const t of tree) {
      adaptToChildrenList(t)
    }

    function adaptToChildrenList(o) {
      if (childrenListMap[o[config.id]] !== null) {
        o[config.children] = childrenListMap[o[config.id]]
      }
      if (o[config.children]) {
        for (const c of o[config.children]) {
          adaptToChildrenList(c)
        }
      }
    }

    return tree
  },

  treeFlatten: (tree, id = 'id', children = 'children') => {
    const arr = []
    const flatten = (node) => {
      // 将当前节点加入到扁平列表中
      const _node = { ...node }
      // 移除子节点，防止循环引用
      delete _node[children]
      arr.push(_node)
      // 递归处理子节点
      if (node[children] && node[children].length > 0) {
        for (const child of node[children]) {
          flatten(child)
        }
      }
    }
    // 遍历树的根节点，并开始递归处理
    for (const root of tree) {
      flatten(root)
    }
    return arr
  },
}

export default Tree
