import Http from '@/utils/http'

const resolveMonitorResponse = async (options) => {
  const response = await Http.request(options, true)
  const payload = response?.data ?? response

  if (payload?.code === 200 || payload?.code === 1) {
    return payload.data
  }

  if (payload?.status && [200, 300].includes(payload.status)) {
    return payload.data
  }

  if (payload?.data !== undefined && payload?.code == null && payload?.status == null) {
    return payload.data
  }

  if (Array.isArray(payload)) {
    return payload
  }

  throw new Error(payload?.message || payload?.msg || 'Monitor request failed')
}

const buildMonitorCommandId = (prefix = 'cmd') => {
  return `${prefix}-${Date.now()}`
}

const buildMonitorAgentCommand = (func, param, cmdIdPrefix = 'cmd') => {
  return {
    type: 'cmd',
    cmd: {
      func,
      param,
      cmdID: buildMonitorCommandId(cmdIdPrefix),
    },
  }
}

const resolveMonitorTtydUrl = (payload) => {
  if (payload?.url) return payload.url
  if (payload?.port) return `http://localhost:${payload.port}`
  return ''
}

export const sendMonitorAgentCommand = async (agentId, command) => {
  const commandResponse = await resolveMonitorResponse({
    url: '/api/commands/send',
    method: 'POST',
    data: {
      agentId,
      content: JSON.stringify(command),
    },
  })

  if (commandResponse?.status !== 'SUCCESS') {
    throw new Error(commandResponse?.message || `Agent response error: ${commandResponse?.status || 'UNKNOWN'}`)
  }

  let agentPayload = null
  try {
    agentPayload = JSON.parse(commandResponse?.response || '{}')
  } catch (_) {
    throw new Error('Agent response is not valid JSON')
  }

  if (!agentPayload?.success) {
    throw new Error(agentPayload?.message || 'Agent command failed')
  }

  return agentPayload
}

export const getMonitorLogStats = () => {
  return resolveMonitorResponse({
    url: '/api/loghits/stats',
    method: 'GET',
  })
}

export const getMonitorLogList = (params = {}) => {
  return resolveMonitorResponse({
    url: '/api/loghits',
    method: 'GET',
    params,
  }).then((data) => (Array.isArray(data) ? data : []))
}

export const getMonitorLogDetail = (id) => {
  return resolveMonitorResponse({
    url: `/api/loghits/${id}`,
    method: 'GET',
  })
}

export const getMonitorDashboardAgents = () => {
  return resolveMonitorResponse({
    url: '/api/dashboard/agents',
    method: 'GET',
  }).then((data) => (Array.isArray(data) ? data : []))
}

export const getMonitorAlerts = () => {
  return resolveMonitorResponse({
    url: '/api/alert/events/unacknowledged',
    method: 'GET',
  }).then((data) => (Array.isArray(data) ? data : []))
}

export const ackMonitorAlert = (id) => {
  return resolveMonitorResponse({
    url: `/api/alert/events/${id}/ack`,
    method: 'POST',
  })
}

export const ackAllMonitorAlerts = () => {
  return resolveMonitorResponse({
    url: '/api/alert/events/ack-all',
    method: 'POST',
  })
}

export const getMonitorAgentDetail = (agentId) => {
  return resolveMonitorResponse({
    url: `/api/dashboard/agents/${encodeURIComponent(agentId)}`,
    method: 'GET',
  })
}

export const getMonitorAgentLogs = (agentId, params = {}) => {
  return resolveMonitorResponse({
    url: `/api/dashboard/agents/${encodeURIComponent(agentId)}/logs`,
    method: 'GET',
    params,
  }).then((data) => (Array.isArray(data) ? data : []))
}

export const getMonitorApplicableRules = (agentId) => {
  return resolveMonitorResponse({
    url: '/api/alert/rules/applicable',
    method: 'GET',
    params: {
      agentId,
    },
  }).then((data) => (Array.isArray(data) ? data : []))
}

export const createMonitorAlertRule = (payload) => {
  return resolveMonitorResponse({
    url: '/api/alert/rules',
    method: 'POST',
    data: payload,
  })
}

export const deleteMonitorAlertRule = (id) => {
  return resolveMonitorResponse({
    url: `/api/alert/rules/${id}`,
    method: 'DELETE',
  })
}

export const getMonitorLogMonitors = async (agentId) => {
  const payload = await sendMonitorAgentCommand(agentId, buildMonitorAgentCommand('LogTail/list', [], 'logtail-list'))
  return Array.isArray(payload?.monitors) ? payload.monitors : []
}

export const createMonitorLogMonitor = (agentId, path, appName) => {
  return sendMonitorAgentCommand(
    agentId,
    buildMonitorAgentCommand('LogTail/add', [path, appName, ''], 'logtail-add'),
  )
}

export const deleteMonitorLogMonitor = (agentId, path) => {
  return sendMonitorAgentCommand(agentId, buildMonitorAgentCommand('LogTail/remove', [path], 'logtail-remove'))
}

export const getMonitorFilterRules = (agentId = '*') => {
  return resolveMonitorResponse({
    url: '/api/rules',
    method: 'GET',
    params: {
      agentId: agentId || '*',
    },
  }).then((data) => (Array.isArray(data) ? data : []))
}

export const createMonitorFilterRule = (payload) => {
  return resolveMonitorResponse({
    url: '/api/rules',
    method: 'POST',
    data: payload,
  })
}

export const deleteMonitorFilterRule = (id) => {
  return resolveMonitorResponse({
    url: `/api/rules/${id}`,
    method: 'DELETE',
  })
}

export const rebuildMonitorFilterRules = (agentId = '*') => {
  return resolveMonitorResponse({
    url: `/api/rules/rebuild/${encodeURIComponent(agentId || '*')}`,
    method: 'POST',
  })
}

export const getMonitorTtydServices = async (agentId) => {
  const payload = await sendMonitorAgentCommand(agentId, buildMonitorAgentCommand('TtydService/list', [], 'ttyd-list'))
  return Array.isArray(payload?.services) ? payload.services : []
}

export const startMonitorTtydService = async (agentId, options) => {
  const payload = await sendMonitorAgentCommand(
    agentId,
    buildMonitorAgentCommand(
      'TtydService/start',
      [JSON.stringify(options)],
      'ttyd-start',
    ),
  )

  return {
    ...payload,
    resolvedUrl: resolveMonitorTtydUrl(payload),
  }
}

export const stopMonitorTtydService = (agentId, port) => {
  return sendMonitorAgentCommand(agentId, buildMonitorAgentCommand('TtydService/stopByPort', [port], 'ttyd-stop'))
}

export { buildMonitorAgentCommand, resolveMonitorTtydUrl }
