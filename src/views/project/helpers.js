import dayjs from 'dayjs'
import { getStatusLabel as resolveStatusLabel, getStatusTagType as resolveStatusTagType } from '@/utils/statusDictionary'

export const formatDate = (value) => {
  return value ? dayjs(value).format('YYYY-MM-DD') : '-'
}

export const formatDateTime = (value) => {
  return value ? dayjs(value).format('YYYY-MM-DD HH:mm:ss') : '-'
}

export const formatAmount = (value) => {
  if (value == null || value === '') return '-'
  const numeric = Number(value)
  return Number.isNaN(numeric) ? String(value) : numeric.toFixed(2)
}

export const formatFileSize = (value) => {
  const size = Number(value || 0)
  if (!size) return '-'
  if (size >= 1024 * 1024) return `${(size / 1024 / 1024).toFixed(2)} MB`
  if (size >= 1024) return `${(size / 1024).toFixed(2)} KB`
  return `${size} B`
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

export const getStatusLabel = (status, optionMap = {}) => resolveStatusLabel(status, optionMap)

export const getStatusTagType = (status, optionMap = {}) => resolveStatusTagType(status, optionMap)
