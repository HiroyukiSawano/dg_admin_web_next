import Http from '@/utils/http'

const resolveEamResponse = async (options) => {
  const response = await Http.request(options, true)
  const payload = response?.data ?? response

  if (payload?.success) {
    return payload.data
  }

  throw new Error(payload?.message || 'Project request failed')
}

const normalizePageResponse = (payload) => {
  return {
    records: Array.isArray(payload?.records) ? payload.records : [],
    total: Number(payload?.total || 0),
    pageNo: Number(payload?.pageNo || 1),
    pageSize: Number(payload?.pageSize || 10),
  }
}

const normalizeProjectDetail = (payload) => {
  return {
    project: payload?.project || null,
    documents: Array.isArray(payload?.documents) ? payload.documents : [],
    informationSystemIds: Array.isArray(payload?.informationSystemIds) ? payload.informationSystemIds : [],
    serviceProviderIds: Array.isArray(payload?.serviceProviderIds) ? payload.serviceProviderIds : [],
    personIds: Array.isArray(payload?.personIds) ? payload.personIds : [],
    hardwareAssetIds: Array.isArray(payload?.hardwareAssetIds) ? payload.hardwareAssetIds : [],
    persons: Array.isArray(payload?.persons) ? payload.persons : [],
    informationSystems: Array.isArray(payload?.informationSystems) ? payload.informationSystems : [],
    hardwareAssets: Array.isArray(payload?.hardwareAssets) ? payload.hardwareAssets : [],
    serviceProviders: Array.isArray(payload?.serviceProviders) ? payload.serviceProviders : [],
  }
}

export const getProjectList = async (params = {}) => {
  const payload = await resolveEamResponse({
    url: '/api/v1/projects',
    method: 'GET',
    params,
  })

  return normalizePageResponse(payload)
}

export const getProjectDetail = async (id) => {
  const payload = await resolveEamResponse({
    url: `/api/v1/projects/${id}`,
    method: 'GET',
  })

  return normalizeProjectDetail(payload)
}

export const getProjectStats = () => {
  return resolveEamResponse({
    url: '/api/v1/projects/stats',
    method: 'GET',
  })
}

export const createProject = (payload) => {
  return resolveEamResponse({
    url: '/api/v1/projects',
    method: 'POST',
    data: payload,
  })
}

export const updateProject = (id, payload) => {
  return resolveEamResponse({
    url: `/api/v1/projects/${id}`,
    method: 'PUT',
    data: payload,
  })
}

export const deleteProject = (id) => {
  return resolveEamResponse({
    url: `/api/v1/projects/${id}`,
    method: 'DELETE',
  })
}

export const syncProjectRelations = (id, payload) => {
  return resolveEamResponse({
    url: `/api/v1/projects/${id}/relations`,
    method: 'PUT',
    data: payload,
  })
}

export const getProjectOptions = async () => {
  const payload = await resolveEamResponse({
    url: '/api/v1/projects/options',
    method: 'GET',
  })

  return Array.isArray(payload) ? payload : []
}

export const uploadProjectDocument = async (file) => {
  const formData = new FormData()
  formData.append('file', file)

  return resolveEamResponse({
    url: '/api/v1/files',
    method: 'POST',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
}

export const getProjectInformationSystemOptions = async () => {
  const payload = await resolveEamResponse({
    url: '/api/v1/information-systems/options',
    method: 'GET',
  })

  return Array.isArray(payload) ? payload : []
}

export const getProjectServiceProviderOptions = async () => {
  const payload = await resolveEamResponse({
    url: '/api/v1/service-providers/options',
    method: 'GET',
  })

  return Array.isArray(payload) ? payload : []
}

export const getProjectPersonOptions = async () => {
  const payload = await resolveEamResponse({
    url: '/api/v1/persons/options',
    method: 'GET',
  })

  return Array.isArray(payload) ? payload : []
}

export const getProjectHardwareOptions = async () => {
  const payload = await resolveEamResponse({
    url: '/api/v1/hardware-assets/options',
    method: 'GET',
  })

  return Array.isArray(payload) ? payload : []
}
