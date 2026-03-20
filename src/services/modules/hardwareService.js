import Http from '@/utils/http'
import { getDepartmentOptions } from '@/services/modules/organizationService'

const resolveEamResponse = async (options) => {
  const response = await Http.request(options, true)
  const payload = response?.data ?? response

  if (payload?.success) {
    return payload.data
  }

  throw new Error(payload?.message || 'Hardware request failed')
}

const normalizePageResponse = (payload) => {
  return {
    records: Array.isArray(payload?.records) ? payload.records : [],
    total: Number(payload?.total || 0),
    pageNo: Number(payload?.pageNo || 1),
    pageSize: Number(payload?.pageSize || 10),
  }
}

const normalizeHardwareDetail = (payload) => {
  return {
    hardwareAsset: payload?.hardwareAsset || null,
    subtypeDetail: payload?.subtypeDetail || null,
    informationSystemIds: Array.isArray(payload?.informationSystemIds) ? payload.informationSystemIds : [],
    ownerIds: Array.isArray(payload?.ownerIds) ? payload.ownerIds : [],
    vendorIds: Array.isArray(payload?.vendorIds) ? payload.vendorIds : [],
    lifecycleRecords: Array.isArray(payload?.lifecycleRecords) ? payload.lifecycleRecords : [],
  }
}

export const getHardwareAssetList = async (params = {}) => {
  const payload = await resolveEamResponse({
    url: '/api/v1/hardware-assets',
    method: 'GET',
    params,
  })

  return normalizePageResponse(payload)
}

export const getHardwareAssetDetail = async (id) => {
  const payload = await resolveEamResponse({
    url: `/api/v1/hardware-assets/${id}`,
    method: 'GET',
  })

  return normalizeHardwareDetail(payload)
}

export const createHardwareAsset = (payload) => {
  return resolveEamResponse({
    url: '/api/v1/hardware-assets',
    method: 'POST',
    data: payload,
  })
}

export const updateHardwareAsset = (id, payload) => {
  return resolveEamResponse({
    url: `/api/v1/hardware-assets/${id}`,
    method: 'PUT',
    data: payload,
  })
}

export const deleteHardwareAsset = (id) => {
  return resolveEamResponse({
    url: `/api/v1/hardware-assets/${id}`,
    method: 'DELETE',
  })
}

export const syncHardwareSystems = (id, ids = []) => {
  return resolveEamResponse({
    url: `/api/v1/hardware-assets/${id}/systems`,
    method: 'PUT',
    data: { ids },
  })
}

export const syncHardwareOwners = (id, ids = []) => {
  return resolveEamResponse({
    url: `/api/v1/hardware-assets/${id}/owners`,
    method: 'PUT',
    data: { ids },
  })
}

export const syncHardwareVendors = (id, ids = []) => {
  return resolveEamResponse({
    url: `/api/v1/hardware-assets/${id}/vendors`,
    method: 'PUT',
    data: { ids },
  })
}

export const executeHardwareLifecycle = (id, payload) => {
  return resolveEamResponse({
    url: `/api/v1/hardware-assets/${id}/lifecycle`,
    method: 'POST',
    data: payload,
  })
}

export const batchImportHardwareAssets = (items = []) => {
  return resolveEamResponse({
    url: '/api/v1/hardware-assets/import',
    method: 'POST',
    data: { items },
  })
}

export const exportHardwareAssets = () => {
  return Http.request(
    {
      url: '/api/v1/hardware-assets/export',
      method: 'GET',
      responseType: 'arraybuffer',
    },
    true,
  )
}

export const getHardwareDepartmentOptions = () => {
  return getDepartmentOptions()
}

export const getHardwareLocationOptions = async () => {
  const payload = await resolveEamResponse({
    url: '/api/v1/locations',
    method: 'GET',
    params: {
      pageNo: 1,
      pageSize: 1000,
    },
  })

  return Array.isArray(payload?.records) ? payload.records : []
}

export const getHardwarePersonOptions = async () => {
  const payload = await resolveEamResponse({
    url: '/api/v1/persons/options',
    method: 'GET',
  })

  return Array.isArray(payload) ? payload : []
}

export const getHardwareVendorOptions = async () => {
  const payload = await resolveEamResponse({
    url: '/api/v1/service-providers/options',
    method: 'GET',
  })

  return Array.isArray(payload) ? payload : []
}

export const getHardwareSystemOptions = async () => {
  const payload = await resolveEamResponse({
    url: '/api/v1/information-systems/options',
    method: 'GET',
  })

  return Array.isArray(payload) ? payload : []
}
