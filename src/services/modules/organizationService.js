import Http from '@/utils/http'

const resolveEamResponse = async (options) => {
  const response = await Http.request(options, true)
  const payload = response?.data ?? response

  if (payload?.success) {
    return payload.data
  }

  throw new Error(payload?.message || 'Organization request failed')
}

const normalizePageResponse = (payload) => {
  return {
    records: Array.isArray(payload?.records) ? payload.records : [],
    total: Number(payload?.total || 0),
    pageNo: Number(payload?.pageNo || 1),
    pageSize: Number(payload?.pageSize || 10),
  }
}

const buildDepartmentTree = (items = []) => {
  const nodes = Array.isArray(items) ? items.map((item) => ({ ...item, children: [] })) : []
  const nodeMap = new Map(nodes.map((item) => [item.id, item]))
  const roots = []

  nodes.forEach((item) => {
    if (item.parentId != null && nodeMap.has(item.parentId)) {
      nodeMap.get(item.parentId).children.push(item)
      return
    }

    roots.push(item)
  })

  const sortNodes = (list) => {
    return list
      .sort((a, b) => String(a.code || '').localeCompare(String(b.code || '')))
      .map((item) => ({
        ...item,
        children: sortNodes(item.children || []),
      }))
  }

  return sortNodes(roots)
}

export const getDepartmentOptions = async () => {
  const payload = await resolveEamResponse({
    url: '/api/v1/departments/options',
    method: 'GET',
  })

  return buildDepartmentTree(payload)
}

export const getDepartmentDetail = (id) => {
  return resolveEamResponse({
    url: `/api/v1/departments/${id}`,
    method: 'GET',
  })
}

export const createDepartment = (payload) => {
  return resolveEamResponse({
    url: '/api/v1/departments',
    method: 'POST',
    data: payload,
  })
}

export const updateDepartment = (id, payload) => {
  return resolveEamResponse({
    url: `/api/v1/departments/${id}`,
    method: 'PUT',
    data: payload,
  })
}

export const deleteDepartment = (id) => {
  return resolveEamResponse({
    url: `/api/v1/departments/${id}`,
    method: 'DELETE',
  })
}

export const getLocationList = async (params = {}) => {
  const payload = await resolveEamResponse({
    url: '/api/v1/locations',
    method: 'GET',
    params,
  })

  return normalizePageResponse(payload)
}

export const getLocationDetail = (id) => {
  return resolveEamResponse({
    url: `/api/v1/locations/${id}`,
    method: 'GET',
  })
}

export const createLocation = (payload) => {
  return resolveEamResponse({
    url: '/api/v1/locations',
    method: 'POST',
    data: payload,
  })
}

export const updateLocation = (id, payload) => {
  return resolveEamResponse({
    url: `/api/v1/locations/${id}`,
    method: 'PUT',
    data: payload,
  })
}

export const deleteLocation = (id) => {
  return resolveEamResponse({
    url: `/api/v1/locations/${id}`,
    method: 'DELETE',
  })
}

export const getServiceProviderList = async (params = {}) => {
  const payload = await resolveEamResponse({
    url: '/api/v1/service-providers',
    method: 'GET',
    params,
  })

  return normalizePageResponse(payload)
}

export const getServiceProviderStats = () => {
  return resolveEamResponse({
    url: '/api/v1/service-providers/stats',
    method: 'GET',
  })
}

export const getServiceProviderDetail = (id) => {
  return resolveEamResponse({
    url: `/api/v1/service-providers/${id}`,
    method: 'GET',
  })
}

export const createServiceProvider = (payload) => {
  return resolveEamResponse({
    url: '/api/v1/service-providers',
    method: 'POST',
    data: payload,
  })
}

export const updateServiceProvider = (id, payload) => {
  return resolveEamResponse({
    url: `/api/v1/service-providers/${id}`,
    method: 'PUT',
    data: payload,
  })
}

export const uploadOrganizationImage = async (file) => {
  const formData = new FormData()
  formData.append('file', file)

  return resolveEamResponse({
    url: '/api/v1/files/images',
    method: 'POST',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
}

export const deleteServiceProvider = (id) => {
  return resolveEamResponse({
    url: `/api/v1/service-providers/${id}`,
    method: 'DELETE',
  })
}

export const syncServiceProviderRelations = (id, payload) => {
  return resolveEamResponse({
    url: `/api/v1/service-providers/${id}/relations`,
    method: 'PUT',
    data: payload,
  })
}

export const getPersonList = async (params = {}) => {
  const payload = await resolveEamResponse({
    url: '/api/v1/persons',
    method: 'GET',
    params,
  })

  return normalizePageResponse(payload)
}

export const getPersonStats = () => {
  return resolveEamResponse({
    url: '/api/v1/persons/stats',
    method: 'GET',
  })
}

export const getPersonDetail = (id) => {
  return resolveEamResponse({
    url: `/api/v1/persons/${id}`,
    method: 'GET',
  })
}

export const createPerson = (payload) => {
  return resolveEamResponse({
    url: '/api/v1/persons',
    method: 'POST',
    data: payload,
  })
}

export const updatePerson = (id, payload) => {
  return resolveEamResponse({
    url: `/api/v1/persons/${id}`,
    method: 'PUT',
    data: payload,
  })
}

export const deletePerson = (id) => {
  return resolveEamResponse({
    url: `/api/v1/persons/${id}`,
    method: 'DELETE',
  })
}

export const syncPersonRelations = (id, payload) => {
  return resolveEamResponse({
    url: `/api/v1/persons/${id}/relations`,
    method: 'PUT',
    data: payload,
  })
}

export const getPersonDepartmentOptions = () => {
  return getDepartmentOptions()
}

export const getOrganizationHardwareOptions = async () => {
  const payload = await resolveEamResponse({
    url: '/api/v1/hardware-assets/options',
    method: 'GET',
  })

  return Array.isArray(payload) ? payload : []
}

export const getOrganizationInformationSystemOptions = async () => {
  const payload = await resolveEamResponse({
    url: '/api/v1/information-systems/options',
    method: 'GET',
  })

  return Array.isArray(payload) ? payload : []
}

export const getOrganizationProjectOptions = async () => {
  const payload = await resolveEamResponse({
    url: '/api/v1/projects/options',
    method: 'GET',
  })

  return Array.isArray(payload) ? payload : []
}

export const getOrganizationPersonOptions = async () => {
  const payload = await resolveEamResponse({
    url: '/api/v1/persons/options',
    method: 'GET',
  })

  return Array.isArray(payload) ? payload : []
}

export const getOrganizationServiceProviderOptions = async () => {
  const payload = await resolveEamResponse({
    url: '/api/v1/service-providers/options',
    method: 'GET',
  })

  return Array.isArray(payload) ? payload : []
}
