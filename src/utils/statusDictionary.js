const isEnglishLocale = (locale) => String(locale || '').toLowerCase().startsWith('en')

export const buildStatusOptionMap = (options = [], locale = 'zh-CN') => {
  return (Array.isArray(options) ? options : []).reduce((acc, item) => {
    const displayLabel = isEnglishLocale(locale)
      ? item.labelEn || item.label || item.value
      : item.label || item.labelEn || item.value
    acc[item.value] = {
      ...item,
      displayLabel,
    }
    return acc
  }, {})
}

export const getStatusLabel = (value, optionMap = {}, fallback = '-') => {
  if (!value) {
    return fallback
  }
  return optionMap?.[value]?.displayLabel || value
}

export const getStatusTagType = (value, optionMap = {}, fallback = 'info') => {
  if (!value) {
    return fallback
  }
  return optionMap?.[value]?.tagType || fallback
}
