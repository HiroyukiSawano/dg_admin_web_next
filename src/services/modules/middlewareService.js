import Http from '@/utils/http'

const resolveEamResponse = async (options) => {
  const response = await Http.request(options, true)
  const payload = response?.data ?? response

  if (payload?.success) {
    return payload.data
  }

  throw new Error(payload?.message || 'Middleware request failed')
}

const normalizePageResponse = (payload) => ({
  records: Array.isArray(payload?.records) ? payload.records : [],
  total: Number(payload?.total || 0),
  pageNo: Number(payload?.pageNo || 1),
  pageSize: Number(payload?.pageSize || 10),
})

export const getMiddlewareResourceList = async (params = {}) => {
  const payload = await resolveEamResponse({
    url: '/api/v1/middleware-resources',
    method: 'GET',
    params,
  })

  return normalizePageResponse(payload)
}

export const getMiddlewareResourceDetail = (id) => {
  return resolveEamResponse({
    url: `/api/v1/middleware-resources/${id}`,
    method: 'GET',
  })
}

export const getMiddlewareResourceStats = () => {
  return resolveEamResponse({
    url: '/api/v1/middleware-resources/stats',
    method: 'GET',
  })
}

export const createMiddlewareResource = (payload) => {
  return resolveEamResponse({
    url: '/api/v1/middleware-resources',
    method: 'POST',
    data: payload,
  })
}

export const updateMiddlewareResource = (id, payload) => {
  return resolveEamResponse({
    url: `/api/v1/middleware-resources/${id}`,
    method: 'PUT',
    data: payload,
  })
}

export const deleteMiddlewareResource = (id) => {
  return resolveEamResponse({
    url: `/api/v1/middleware-resources/${id}`,
    method: 'DELETE',
  })
}

export const getMiddlewareResourceOptions = async () => {
  const payload = await resolveEamResponse({
    url: '/api/v1/middleware-resources/options',
    method: 'GET',
  })

  return Array.isArray(payload) ? payload : []
}
