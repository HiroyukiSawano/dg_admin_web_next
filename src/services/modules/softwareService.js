import Http from '@/utils/http'

const resolveEamResponse = async (options) => {
  const response = await Http.request(options, true)
  const payload = response?.data ?? response

  if (payload?.success) {
    return payload.data
  }

  throw new Error(payload?.message || 'Software request failed')
}

const normalizePageResponse = (payload) => {
  return {
    records: Array.isArray(payload?.records) ? payload.records : [],
    total: Number(payload?.total || 0),
    pageNo: Number(payload?.pageNo || 1),
    pageSize: Number(payload?.pageSize || 10),
  }
}

const normalizeInformationSystemDetail = (payload) => {
  return {
    informationSystem: payload?.informationSystem || null,
    serviceProviderIds: Array.isArray(payload?.serviceProviderIds) ? payload.serviceProviderIds : [],
    personIds: Array.isArray(payload?.personIds) ? payload.personIds : [],
    hardwareAssetIds: Array.isArray(payload?.hardwareAssetIds) ? payload.hardwareAssetIds : [],
    projectIds: Array.isArray(payload?.projectIds) ? payload.projectIds : [],
    serviceProviders: Array.isArray(payload?.serviceProviders) ? payload.serviceProviders : [],
    persons: Array.isArray(payload?.persons) ? payload.persons : [],
    hardwareAssets: Array.isArray(payload?.hardwareAssets) ? payload.hardwareAssets : [],
    projects: Array.isArray(payload?.projects) ? payload.projects : [],
  }
}

export const getInformationSystemList = async (params = {}) => {
  const payload = await resolveEamResponse({
    url: '/api/v1/information-systems',
    method: 'GET',
    params,
  })

  return normalizePageResponse(payload)
}

export const getInformationSystemDetail = async (id) => {
  const payload = await resolveEamResponse({
    url: `/api/v1/information-systems/${id}`,
    method: 'GET',
  })

  return normalizeInformationSystemDetail(payload)
}

export const getInformationSystemStats = () => {
  return resolveEamResponse({
    url: '/api/v1/information-systems/stats',
    method: 'GET',
  })
}

export const createInformationSystem = (payload) => {
  return resolveEamResponse({
    url: '/api/v1/information-systems',
    method: 'POST',
    data: payload,
  })
}

export const updateInformationSystem = (id, payload) => {
  return resolveEamResponse({
    url: `/api/v1/information-systems/${id}`,
    method: 'PUT',
    data: payload,
  })
}

export const deleteInformationSystem = (id) => {
  return resolveEamResponse({
    url: `/api/v1/information-systems/${id}`,
    method: 'DELETE',
  })
}

export const syncInformationSystemRelations = (id, payload) => {
  return resolveEamResponse({
    url: `/api/v1/information-systems/${id}/relations`,
    method: 'PUT',
    data: payload,
  })
}

export const getInformationSystemOptions = async () => {
  const payload = await resolveEamResponse({
    url: '/api/v1/information-systems/options',
    method: 'GET',
  })

  return Array.isArray(payload) ? payload : []
}

export const getSoftwareServiceProviderOptions = async () => {
  const payload = await resolveEamResponse({
    url: '/api/v1/service-providers/options',
    method: 'GET',
  })

  return Array.isArray(payload) ? payload : []
}

export const getSoftwarePersonOptions = async () => {
  const payload = await resolveEamResponse({
    url: '/api/v1/persons/options',
    method: 'GET',
  })

  return Array.isArray(payload) ? payload : []
}

export const getSoftwareProjectOptions = async () => {
  const payload = await resolveEamResponse({
    url: '/api/v1/projects/options',
    method: 'GET',
  })

  return Array.isArray(payload) ? payload : []
}

export const getSoftwareHardwareOptions = async () => {
  const payload = await resolveEamResponse({
    url: '/api/v1/hardware-assets/options',
    method: 'GET',
  })

  return Array.isArray(payload) ? payload : []
}
