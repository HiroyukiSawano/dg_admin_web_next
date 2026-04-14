export const middlewareTypeOptions = (t) => ([
  { value: 'TOMCAT', label: t('ec.middleware.type.tomcat') },
  { value: 'NGINX', label: t('ec.middleware.type.nginx') },
  { value: 'REDIS', label: t('ec.middleware.type.redis') },
  { value: 'KAFKA', label: t('ec.middleware.type.kafka') },
  { value: 'ROCKETMQ', label: t('ec.middleware.type.rocketmq') },
  { value: 'ELASTICSEARCH', label: t('ec.middleware.type.elasticsearch') },
  { value: 'NACOS', label: t('ec.middleware.type.nacos') },
  { value: 'OTHER', label: t('ec.middleware.type.other') },
])

export const statusOptions = (t) => ([
  { value: 'ACTIVE', label: t('ec.middleware.status.active') },
  { value: 'INACTIVE', label: t('ec.middleware.status.inactive') },
])

export const buildOptionLabelMap = (options = []) => {
  return options.reduce((acc, item) => {
    acc[item.value] = item.label
    return acc
  }, {})
}
