import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { APP_API_URL } from '@/configs'
import {
  ackAllMonitorAlerts,
  ackMonitorAlert,
  getMonitorAlerts,
  getMonitorDashboardAgents,
} from '@/services/modules/monitorService'

const REFRESH_INTERVAL = 15000
const RECONNECT_INTERVAL = 5000
const MAX_AGENT_LOGS = 50
const MONITOR_SOCKET_PATH = '/ws/monitor'

const useMonitorStore = defineStore('monitor', () => {
  const agents = ref(new Map())
  const alerts = ref([])
  const activeAgentId = ref(null)
  const autoRefreshPauseCount = ref(0)
  const refreshInFlight = ref(false)
  const initialized = ref(false)
  const socketState = ref('CLOSED')

  let refreshTimer = null
  let socket = null
  let reconnectTimer = null

  const activeAgent = computed(() => {
    return activeAgentId.value ? agents.value.get(activeAgentId.value) || null : null
  })

  const agentList = computed(() => {
    return Array.from(agents.value.values()).sort((left, right) => {
      if (left.online !== right.online) return left.online ? -1 : 1
      return (left.systemInfo?.hostname || left.id || '').localeCompare(right.systemInfo?.hostname || right.id || '')
    })
  })

  const totalAgents = computed(() => agents.value.size)
  const onlineAgents = computed(() => agentList.value.filter((agent) => agent.online).length)
  const criticalAlertsCount = computed(() => alerts.value.filter((alert) => alert.alertLevel === 'CRITICAL').length)

  const initializeMonitoring = async () => {
    if (initialized.value) return
    initialized.value = true
    await loadDashboard()
    startRefreshTimer()
    connectSocket()
  }

  const setActiveAgent = (agentId) => {
    activeAgentId.value = agentId
  }

  const pauseAutoRefresh = () => {
    autoRefreshPauseCount.value += 1
  }

  const resumeAutoRefresh = () => {
    autoRefreshPauseCount.value = Math.max(0, autoRefreshPauseCount.value - 1)
  }

  const ackAlert = async (id) => {
    await ackMonitorAlert(id)
    alerts.value = alerts.value.filter((alert) => alert.id !== id)
  }

  const ackAllAlerts = async () => {
    await ackAllMonitorAlerts()
    alerts.value = []
  }

  const loadDashboard = async () => {
    if (autoRefreshPauseCount.value > 0 || refreshInFlight.value) return

    refreshInFlight.value = true
    try {
      const [agentPayload, alertPayload] = await Promise.all([getMonitorDashboardAgents(), getMonitorAlerts()])
      reconcileDashboardAgents(agentPayload)
      alerts.value = Array.isArray(alertPayload) ? alertPayload : []
    } finally {
      refreshInFlight.value = false
    }
  }

  const startRefreshTimer = () => {
    if (refreshTimer) return
    refreshTimer = window.setInterval(() => {
      loadDashboard()
    }, REFRESH_INTERVAL)
  }

  const connectSocket = () => {
    if (socket && [WebSocket.OPEN, WebSocket.CONNECTING].includes(socket.readyState)) return

    socketState.value = 'CONNECTING'
    socket = new WebSocket(resolveMonitorSocketUrl())

    socket.onopen = () => {
      socketState.value = 'OPEN'
      clearReconnectTimer()
    }

    socket.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data)
        handleSocketMessage(message)
      } catch (error) {
        console.error('Failed to parse monitor socket message', error)
      }
    }

    socket.onerror = () => {
      socketState.value = 'ERROR'
    }

    socket.onclose = () => {
      socketState.value = 'CLOSED'
      socket = null
      scheduleReconnect()
    }
  }

  const scheduleReconnect = () => {
    if (!initialized.value || reconnectTimer) return
    reconnectTimer = window.setTimeout(() => {
      reconnectTimer = null
      connectSocket()
    }, RECONNECT_INTERVAL)
  }

  const clearReconnectTimer = () => {
    if (!reconnectTimer) return
    window.clearTimeout(reconnectTimer)
    reconnectTimer = null
  }

  const handleSocketMessage = (message) => {
    switch (message.type) {
      case 'FULL_SYNC':
        reconcileRealtimeAgents(message.data || [])
        break
      case 'AGENT_ONLINE':
      case 'AGENT_OFFLINE':
      case 'METRIC_UPDATE':
      case 'LOG_EVENT':
      case 'PROCESS_UPDATE':
        patchRealtimeAgent(message)
        break
      case 'NEW_ALERT':
        upsertAlert(message.data)
        break
      default:
        break
    }
  }

  const reconcileRealtimeAgents = (payload = []) => {
    const seenIds = new Set()

    payload.forEach((item) => {
      const normalized = normalizeAgentPayload(item, agents.value.get(resolveAgentId(item))?.logs || [])
      if (!normalized.id) return

      seenIds.add(normalized.id)
      const existing = agents.value.get(normalized.id)
      agents.value.set(normalized.id, existing ? mergeAgent(existing, normalized) : normalized)
    })

    Array.from(agents.value.keys()).forEach((id) => {
      if (!seenIds.has(id)) agents.value.delete(id)
    })

    ensureActiveAgentStillExists()
  }

  const reconcileDashboardAgents = (payload = []) => {
    const seenIds = new Set()

    payload.forEach((item) => {
      const normalized = normalizeDashboardAgent(item, agents.value.get(item.agentId)?.logs || [])
      if (!normalized.id) return

      seenIds.add(normalized.id)
      const existing = agents.value.get(normalized.id)
      agents.value.set(normalized.id, existing ? mergeAgent(existing, normalized) : normalized)
    })

    Array.from(agents.value.keys()).forEach((id) => {
      if (!seenIds.has(id)) agents.value.delete(id)
    })

    ensureActiveAgentStillExists()
  }

  const patchRealtimeAgent = (message) => {
    const id = message.agentId
    if (!id || !agents.value.has(id)) return

    const current = agents.value.get(id)
    if (!current) return

    if (message.type === 'AGENT_ONLINE') current.online = true
    if (message.type === 'AGENT_OFFLINE') current.online = false
    if (message.type === 'METRIC_UPDATE') {
      current.systemInfo = {
        ...current.systemInfo,
        ...message.data,
      }
    }
    if (message.type === 'LOG_EVENT') {
      current.logs = [normalizeAgentLog(message.data), ...(current.logs || [])].slice(0, MAX_AGENT_LOGS)
    }
    if (message.type === 'PROCESS_UPDATE') {
      current.processes = normalizeProcesses(message.data)
    }

    agents.value.set(id, { ...current })
  }

  const ensureActiveAgentStillExists = () => {
    if (!activeAgentId.value || agents.value.has(activeAgentId.value)) return
    activeAgentId.value = null
  }

  const upsertAlert = (alert) => {
    if (!alert?.id) return
    const nextAlerts = alerts.value.filter((item) => item.id !== alert.id)
    nextAlerts.unshift(alert)
    alerts.value = nextAlerts
  }

  return {
    agents,
    alerts,
    activeAgentId,
    activeAgent,
    agentList,
    totalAgents,
    onlineAgents,
    criticalAlertsCount,
    socketState,
    initializeMonitoring,
    loadDashboard,
    setActiveAgent,
    pauseAutoRefresh,
    resumeAutoRefresh,
    ackAlert,
    ackAllAlerts,
  }
})

const resolveAgentId = (agent) => agent?.id || agent?.agentId || ''

const mergeAgent = (existing, incoming) => {
  return {
    ...existing,
    ...incoming,
    systemInfo: {
      ...(existing.systemInfo || {}),
      ...(incoming.systemInfo || {}),
    },
    processes: incoming.processes || existing.processes || [],
    logs: incoming.logs || existing.logs || [],
  }
}

const normalizeDashboardAgent = (agent, existingLogs = []) => {
  return {
    id: agent.agentId,
    online: Boolean(agent.online),
    systemInfo: {
      hostname: agent.mainframeName || agent.agentId,
      osName: agent.osName || '',
      osVersion: agent.osVersion || '',
      osType: agent.osType || '',
      cpuType: agent.cpuType || '',
      cpuUsage: toNumber(agent.cpuUsage),
      totalMemory: toNumber(agent.ramCapacity),
      freeMemory: toNumber(agent.ramAvailable),
      availableProcessors: toNumber(agent.cpuCores),
      disks: (agent.parts || []).map((part) => ({
        mountPoint: part.mountPoint,
        totalSpace: toNumber(part.capacity),
        usableSpace: toNumber(part.availableCapacity),
      })),
    },
    processes: normalizeProcesses(agent.processStatusList),
    logs: existingLogs,
  }
}

const normalizeAgentPayload = (agent, existingLogs = []) => {
  if (agent?.agentId) return normalizeDashboardAgent(agent, existingLogs)

  return {
    id: agent?.id,
    online: Boolean(agent?.online),
    systemInfo: {
      hostname: agent?.systemInfo?.hostname || agent?.id || '',
      osName: agent?.systemInfo?.osName || '',
      osVersion: agent?.systemInfo?.osVersion || '',
      osType: agent?.systemInfo?.osType || '',
      cpuType: agent?.systemInfo?.cpuType || '',
      cpuUsage: toNumber(agent?.systemInfo?.cpuUsage),
      totalMemory: toNumber(agent?.systemInfo?.totalMemory),
      freeMemory: toNumber(agent?.systemInfo?.freeMemory),
      availableProcessors: toNumber(agent?.systemInfo?.availableProcessors),
      disks: (agent?.systemInfo?.disks || []).map((disk) => ({
        mountPoint: disk.mountPoint,
        totalSpace: toNumber(disk.totalSpace),
        usableSpace: toNumber(disk.usableSpace),
      })),
    },
    processes: normalizeProcesses(agent?.processes),
    logs: Array.isArray(agent?.logs) ? agent.logs.map((log) => normalizeAgentLog(log)).slice(0, MAX_AGENT_LOGS) : existingLogs,
  }
}

const normalizeProcesses = (processes = []) => {
  if (!Array.isArray(processes)) return []
  return processes.map((process) => ({
    name: process.processName || process.name || process.pid || '-',
    running: process.running ?? process.status === '正常',
    status: process.status || (process.running ? 'RUNNING' : 'STOPPED'),
    pid: process.pid || process.processName || '',
  }))
}

const normalizeAgentLog = (log) => {
  if (!log) {
    return {
      id: `log-${Date.now()}`,
      logContent: '-',
      createTime: Date.now(),
    }
  }

  if (typeof log === 'string') {
    return {
      id: `log-${Date.now()}`,
      logContent: log,
      createTime: Date.now(),
    }
  }

  return {
    ...log,
    id: log.id || `${log.createTime || log.timestamp || Date.now()}-${Math.random().toString(16).slice(2, 8)}`,
  }
}

const toNumber = (value) => {
  const parsed = Number.parseFloat(value)
  return Number.isFinite(parsed) ? parsed : 0
}

const resolveMonitorSocketUrl = () => {
  const apiBase = APP_API_URL
  if (apiBase) {
    try {
      const normalized = new URL(apiBase, window.location.origin)
      normalized.protocol = normalized.protocol === 'https:' ? 'wss:' : 'ws:'
      normalized.pathname = MONITOR_SOCKET_PATH
      normalized.search = ''
      normalized.hash = ''
      return normalized.toString()
    } catch (_) {}
  }

  const fallback = new URL(MONITOR_SOCKET_PATH, window.location.origin)
  fallback.protocol = fallback.protocol === 'https:' ? 'wss:' : 'ws:'
  return fallback.toString()
}

export { useMonitorStore }
export default useMonitorStore
