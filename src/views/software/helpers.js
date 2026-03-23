import dayjs from 'dayjs'

export const formatDateTime = (value) => {
  return value ? dayjs(value).format('YYYY-MM-DD HH:mm:ss') : '-'
}

export const buildListLabelMap = (list = [], labelKey = 'name') => {
  return (Array.isArray(list) ? list : []).reduce((acc, item) => {
    acc[item.id] = item[labelKey]
    return acc
  }, {})
}

export const normalizeIdList = (value) => {
  return Array.isArray(value) ? value : []
}
