export const databaseTypeOptions = (t) => ([
  { value: 'MYSQL', label: t('ec.database.type.mysql') },
  { value: 'ORACLE', label: t('ec.database.type.oracle') },
  { value: 'POSTGRESQL', label: t('ec.database.type.postgresql') },
  { value: 'SQLSERVER', label: t('ec.database.type.sqlserver') },
  { value: 'GAUSSDB', label: t('ec.database.type.gaussdb') },
  { value: 'DAMENG', label: t('ec.database.type.dameng') },
  { value: 'OTHER', label: t('ec.database.type.other') },
])

export const statusOptions = (t) => ([
  { value: 'ACTIVE', label: t('ec.database.status.active') },
  { value: 'INACTIVE', label: t('ec.database.status.inactive') },
])

export const buildOptionLabelMap = (options = []) => {
  return options.reduce((acc, item) => {
    acc[item.value] = item.label
    return acc
  }, {})
}
