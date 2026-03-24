import dayjs from 'dayjs'
import { getStatusLabel as resolveStatusLabel, getStatusTagType as resolveStatusTagType } from '@/utils/statusDictionary'

const cloneTree = (tree = []) => {
  return tree.map((node) => ({
    ...node,
    children: cloneTree(node.children || []),
  }))
}

export const formatDateTime = (value) => {
  return value ? dayjs(value).format('YYYY-MM-DD HH:mm:ss') : '-'
}

export const flattenTree = (tree = []) => {
  return tree.reduce((acc, node) => {
    acc.push(node)
    acc.push(...flattenTree(node.children || []))
    return acc
  }, [])
}

export const buildIdNameMap = (tree = []) => {
  return flattenTree(tree).reduce((acc, item) => {
    acc[item.id] = item.name
    return acc
  }, {})
}

export const buildListLabelMap = (list = [], labelKey = 'name') => {
  return (Array.isArray(list) ? list : []).reduce((acc, item) => {
    acc[item.id] = item[labelKey]
    return acc
  }, {})
}

export const filterTreeByKeyword = (tree = [], keyword = '', fields = ['code', 'name']) => {
  const normalizedKeyword = keyword.trim().toLowerCase()
  if (!normalizedKeyword) {
    return cloneTree(tree)
  }

  const visit = (nodes) => {
    return nodes.reduce((acc, node) => {
      const children = visit(node.children || [])
      const matched = fields.some((field) => {
        return String(node[field] || '').toLowerCase().includes(normalizedKeyword)
      })

      if (matched) {
        acc.push({
          ...node,
          children: cloneTree(node.children || []),
        })
        return acc
      }

      if (children.length > 0) {
        acc.push({
          ...node,
          children,
        })
      }

      return acc
    }, [])
  }

  return visit(tree)
}

export const collectDescendantIds = (tree = [], targetId) => {
  const descendants = new Set()

  const walk = (nodes) => {
    for (const node of nodes) {
      if (node.id === targetId) {
        const collect = (items) => {
          items.forEach((item) => {
            descendants.add(item.id)
            collect(item.children || [])
          })
        }

        collect(node.children || [])
        return true
      }

      if (walk(node.children || [])) {
        return true
      }
    }

    return false
  }

  walk(tree)
  return descendants
}

export const cloneTreeWithDisabled = (tree = [], disabledIds = new Set()) => {
  return tree.map((node) => ({
    ...node,
    disabled: disabledIds.has(node.id),
    children: cloneTreeWithDisabled(node.children || [], disabledIds),
  }))
}

export const getStatusLabel = (status, optionMap = {}) => resolveStatusLabel(status, optionMap)

export const getStatusTagType = (status, optionMap = {}) => resolveStatusTagType(status, optionMap)

export const normalizeRelationIds = (value) => {
  return Array.isArray(value) ? value : []
}

export const mapIdsToLabels = (ids = [], mapping = {}) => {
  return normalizeRelationIds(ids).map((item) => mapping[item] || String(item))
}
