import dayjs from 'dayjs'

export const formatDate = (value) => {
  return value ? dayjs(value).format('YYYY-MM-DD') : '-'
}

export const formatDateTime = (value) => {
  return value ? dayjs(value).format('YYYY-MM-DD HH:mm:ss') : '-'
}

export const flattenTree = (tree = []) => {
  return tree.reduce((acc, item) => {
    acc.push(item)
    acc.push(...flattenTree(item.children || []))
    return acc
  }, [])
}

export const buildTreeLabelMap = (tree = [], labelKey = 'name') => {
  return flattenTree(tree).reduce((acc, item) => {
    acc[item.id] = item[labelKey]
    return acc
  }, {})
}

export const buildListLabelMap = (list = [], labelKey = 'name') => {
  return (Array.isArray(list) ? list : []).reduce((acc, item) => {
    acc[item.id] = item[labelKey]
    return acc
  }, {})
}

export const parseImportText = (value) => {
  const source = String(value || '').trim()
  if (!source) {
    throw new Error('Import payload is empty')
  }

  const parsed = JSON.parse(source)
  if (Array.isArray(parsed)) {
    return parsed
  }

  if (Array.isArray(parsed?.items)) {
    return parsed.items
  }

  throw new Error('Import payload must be an array or an object with items')
}

export const getFilenameFromDisposition = (value, fallback = 'hardware-assets.csv') => {
  const source = String(value || '')
  const utf8Match = source.match(/filename\*=UTF-8''([^;]+)/i)
  if (utf8Match?.[1]) {
    return decodeURIComponent(utf8Match[1])
  }

  const normalMatch = source.match(/filename="?([^"]+)"?/i)
  return normalMatch?.[1] || fallback
}
