import Http from '@/utils/http'

const EMPTY_STATUS_DICTIONARIES = Object.freeze({
  departmentStatus: [],
  personStatus: [],
  serviceProviderStatus: [],
  informationSystemStatus: [],
  projectStatus: [],
  hardwareStatus: [],
})

let statusDictionaryCache = null
let statusDictionaryPromise = null

const resolveEamResponse = async (options) => {
  const response = await Http.request(options, true)
  const payload = response?.data ?? response

  if (payload?.success) {
    return payload.data
  }

  throw new Error(payload?.message || 'Dictionary request failed')
}

const normalizeStatusDictionaries = (payload = {}) => {
  return Object.keys(EMPTY_STATUS_DICTIONARIES).reduce((acc, key) => {
    acc[key] = Array.isArray(payload?.[key]) ? payload[key] : []
    return acc
  }, {})
}

export const getStatusDictionaries = async (forceRefresh = false) => {
  if (!forceRefresh && statusDictionaryCache) {
    return statusDictionaryCache
  }

  if (!forceRefresh && statusDictionaryPromise) {
    return statusDictionaryPromise
  }

  statusDictionaryPromise = resolveEamResponse({
    url: '/api/v1/dictionaries/statuses',
    method: 'GET',
  })
    .then((payload) => {
      statusDictionaryCache = normalizeStatusDictionaries(payload)
      return statusDictionaryCache
    })
    .finally(() => {
      statusDictionaryPromise = null
    })

  return statusDictionaryPromise
}
