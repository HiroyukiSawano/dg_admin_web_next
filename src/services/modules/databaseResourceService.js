import Http from '@/utils/http'

const resolveEamResponse = async (options) => {
  const response = await Http.request(options, true)
  const payload = response?.data ?? response

  if (payload?.success) {
    return payload.data
  }

  throw new Error(payload?.message || 'Database resource request failed')
}

const normalizePageResponse = (payload) => ({
  records: Array.isArray(payload?.records) ? payload.records : [],
  total: Number(payload?.total || 0),
  pageNo: Number(payload?.pageNo || 1),
  pageSize: Number(payload?.pageSize || 10),
})

export const getDatabaseResourceList = async (params = {}) => {
  const payload = await resolveEamResponse({
    url: '/api/v1/database-resources',
    method: 'GET',
    params,
  })

  return normalizePageResponse(payload)
}

export const getDatabaseResourceDetail = (id) => {
  return resolveEamResponse({
    url: `/api/v1/database-resources/${id}`,
    method: 'GET',
  })
}

export const getDatabaseResourceStats = () => {
  return resolveEamResponse({
    url: '/api/v1/database-resources/stats',
    method: 'GET',
  })
}

export const createDatabaseResource = (payload) => {
  return resolveEamResponse({
    url: '/api/v1/database-resources',
    method: 'POST',
    data: payload,
  })
}

export const updateDatabaseResource = (id, payload) => {
  return resolveEamResponse({
    url: `/api/v1/database-resources/${id}`,
    method: 'PUT',
    data: payload,
  })
}

export const deleteDatabaseResource = (id) => {
  return resolveEamResponse({
    url: `/api/v1/database-resources/${id}`,
    method: 'DELETE',
  })
}

export const getDatabaseResourceOptions = async () => {
  const payload = await resolveEamResponse({
    url: '/api/v1/database-resources/options',
    method: 'GET',
  })

  return Array.isArray(payload) ? payload : []
}
