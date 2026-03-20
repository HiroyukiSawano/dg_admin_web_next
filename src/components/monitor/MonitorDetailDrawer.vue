<template>
  <el-drawer v-model="drawerVisible" :title="drawerTitle" size="560px" append-to-body>
    <div class="monitor-detail" v-if="agent" v-loading="loading">
      <section class="monitor-detail__section">
        <header>{{ t('ec.monitor.dashboard.detail.summary') }}</header>
        <div class="monitor-detail__summary">
          <div v-for="item in summaryItems" :key="item.key" class="monitor-detail__summary-item">
            <span>{{ item.label }}</span>
            <strong>{{ item.value }}</strong>
          </div>
        </div>
      </section>

      <section class="monitor-detail__section">
        <header>{{ t('ec.monitor.dashboard.detail.hardware') }}</header>
        <div class="monitor-detail__spec-grid">
          <div
            v-for="item in hardwareItems"
            :key="item.key"
            class="monitor-detail__spec-item"
            :class="{ 'is-full': item.full }"
          >
            <span>{{ item.label }}</span>
            <pre v-if="item.multiline">{{ item.value }}</pre>
            <strong v-else>{{ item.value }}</strong>
          </div>
        </div>
      </section>

      <section class="monitor-detail__section" v-if="diskList.length">
        <header>{{ t('ec.monitor.dashboard.detail.disks') }}</header>
        <div class="monitor-detail__disk-list">
          <div v-for="disk in diskList" :key="disk.mountPoint" class="monitor-detail__disk-item">
            <div class="monitor-detail__disk-meta">
              <span>{{ disk.mountPoint }}</span>
              <small>{{ disk.usageLabel }}</small>
            </div>
            <div class="monitor-detail__disk-bar">
              <i :style="{ width: `${disk.percent}%` }" :class="resolveUsageClass(disk.percent)" />
            </div>
            <strong>{{ disk.percent }}%</strong>
          </div>
        </div>
      </section>

      <section class="monitor-detail__section">
        <header>{{ t('ec.monitor.dashboard.detail.processes') }}</header>
        <div class="monitor-detail__process-list" v-if="processList.length">
          <div v-for="process in processList" :key="`${process.name}-${process.pid}`" class="monitor-detail__process-item">
            <div class="monitor-detail__process-meta">
              <span>{{ process.name }}</span>
              <small v-if="process.pid && process.pid !== process.name">PID: {{ process.pid }}</small>
            </div>
            <el-tag :type="process.running ? 'success' : 'danger'">
              {{ process.statusText }}
            </el-tag>
          </div>
        </div>
        <el-empty v-else :description="t('ec.monitor.dashboard.detail.noProcesses')" />
      </section>

      <section class="monitor-detail__section">
        <header>{{ t('ec.monitor.dashboard.detail.recentLogs') }}</header>
        <div class="monitor-detail__log-list" v-if="recentLogs.length">
          <div v-for="log in recentLogs" :key="log.id" class="monitor-detail__log-item">
            <span>{{ formatDateTime(log.createTime || log.timestamp) }}</span>
            <pre>{{ log.logContent || log.message || log.raw || '-' }}</pre>
          </div>
        </div>
        <el-empty v-else :description="t('ec.monitor.dashboard.detail.noLogs')" />
      </section>

      <section class="monitor-detail__section">
        <header>{{ t('ec.monitor.dashboard.detail.actions') }}</header>
        <div class="monitor-detail__actions">
          <el-button @click="showAlertsModal = true">{{ t('ec.monitor.dashboard.detail.viewAlerts') }}</el-button>
          <el-button @click="showLogsModal = true">{{ t('ec.monitor.dashboard.detail.viewLogs') }}</el-button>
          <el-button type="primary" @click="showRuleModal = true">{{ t('ec.monitor.dashboard.detail.rules') }}</el-button>
          <el-button @click="showLogMonitorModal = true">{{ t('ec.monitor.dashboard.detail.logMonitors') }}</el-button>
          <el-button @click="showFilterRuleModal = true">{{ t('ec.monitor.dashboard.detail.filterRules') }}</el-button>
          <el-button @click="showTtydModal = true">{{ t('ec.monitor.dashboard.detail.ttyd') }}</el-button>
        </div>
      </section>
    </div>

    <MonitorAgentAlertsModal v-model:visible="showAlertsModal" :agent-id="agent?.id || ''" />
    <MonitorLogTimelineModal v-model:visible="showLogsModal" :agent-id="agent?.id || ''" />
    <MonitorRuleConfigModal v-model:visible="showRuleModal" :agent-id="agent?.id || ''" />
    <MonitorLogMonitorConfigModal v-model:visible="showLogMonitorModal" :agent-id="agent?.id || ''" />
    <MonitorFilterRuleConfigModal v-model:visible="showFilterRuleModal" :agent-id="agent?.id || ''" />
    <MonitorTtydConfigModal v-model:visible="showTtydModal" :agent-id="agent?.id || ''" />
  </el-drawer>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import dayjs from 'dayjs'
import { useI18n } from 'vue-i18n'
import { ElMessage } from 'element-plus'
import MonitorAgentAlertsModal from '@/components/monitor/MonitorAgentAlertsModal.vue'
import MonitorFilterRuleConfigModal from '@/components/monitor/MonitorFilterRuleConfigModal.vue'
import MonitorLogTimelineModal from '@/components/monitor/MonitorLogTimelineModal.vue'
import MonitorLogMonitorConfigModal from '@/components/monitor/MonitorLogMonitorConfigModal.vue'
import MonitorRuleConfigModal from '@/components/monitor/MonitorRuleConfigModal.vue'
import MonitorTtydConfigModal from '@/components/monitor/MonitorTtydConfigModal.vue'
import { getMonitorAgentDetail } from '@/services/modules/monitorService'
import { useMonitorStore } from '@/stores/modules/monitorStore'

const { t } = useI18n()
const monitorStore = useMonitorStore()

const loading = ref(false)
const deepDetail = ref(null)
const showAlertsModal = ref(false)
const showLogsModal = ref(false)
const showRuleModal = ref(false)
const showLogMonitorModal = ref(false)
const showFilterRuleModal = ref(false)
const showTtydModal = ref(false)

const drawerVisible = computed({
  get: () => Boolean(monitorStore.activeAgentId),
  set: (value) => {
    if (!value) monitorStore.setActiveAgent(null)
  },
})

const agent = computed(() => monitorStore.activeAgent)
const agentSystemInfo = computed(() => agent.value?.systemInfo || {})
const detailInfo = computed(() => deepDetail.value || {})

const drawerTitle = computed(() => {
  return agentSystemInfo.value.hostname || t('ec.monitor.dashboard.detail.title')
})

const statusLabel = computed(() => {
  return agent.value?.online ? t('ec.monitor.dashboard.detail.online') : t('ec.monitor.dashboard.detail.offline')
})

const operatingSystem = computed(() => {
  return joinDisplay([detailInfo.value.osName, detailInfo.value.osVersion, detailInfo.value.osType], ' ')
})

const cpuLabel = computed(() => {
  return joinDisplay([detailInfo.value.cpuType, detailInfo.value.cpuSpeed], ' / ')
})

const memoryLabel = computed(() => {
  if (detailInfo.value.ramUsage || detailInfo.value.ramCapacity) {
    return joinDisplay([detailInfo.value.ramUsage, detailInfo.value.ramCapacity], ' / ')
  }

  return formatUsageValue(agentSystemInfo.value.totalMemory, agentSystemInfo.value.freeMemory)
})

const memoryUsageDetail = computed(() => {
  if (detailInfo.value.ramUsage || detailInfo.value.ramCapacity || detailInfo.value.ramAvailable) {
    const usage = joinDisplay([detailInfo.value.ramUsage, detailInfo.value.ramCapacity], ' / ')
    if (detailInfo.value.ramAvailable) {
      return `${usage} (${t('ec.monitor.dashboard.detail.available')}: ${detailInfo.value.ramAvailable})`
    }
    return usage
  }

  return formatUsageValue(agentSystemInfo.value.totalMemory, agentSystemInfo.value.freeMemory)
})

const processCountLabel = computed(() => {
  const count = detailInfo.value.processCount ?? processList.value.length
  return count || count === 0 ? String(count) : '-'
})

const feedbackTimeLabel = computed(() => formatDateTime(detailInfo.value.feedbackTime))

const diskOverviewLabel = computed(() => {
  if (detailInfo.value.disk) return detailInfo.value.disk

  if (!diskList.value.length) return '-'
  const total = diskList.value.reduce((sum, disk) => sum + disk.total, 0)
  return `${diskList.value.length} ${t('ec.monitor.dashboard.detail.partitions')} / ${formatMegabytes(total)}`
})

const gpuLabel = computed(() => {
  const gpu = detailInfo.value.gpu
  if (!gpu) return '-'
  return String(gpu)
    .split('|')
    .map((item) => item.trim())
    .filter(Boolean)
    .join('\n') || '-'
})

const summaryItems = computed(() => [
  { key: 'agentId', label: t('ec.monitor.dashboard.detail.agentId'), value: agent.value?.id || '-' },
  { key: 'host', label: t('ec.monitor.dashboard.detail.host'), value: agentSystemInfo.value.hostname || '-' },
  { key: 'status', label: t('ec.monitor.dashboard.detail.status'), value: statusLabel.value },
  { key: 'os', label: t('ec.monitor.dashboard.detail.os'), value: operatingSystem.value },
  { key: 'cpu', label: t('ec.monitor.dashboard.detail.cpu'), value: cpuLabel.value },
  { key: 'memory', label: t('ec.monitor.dashboard.detail.memory'), value: memoryLabel.value },
])

const hardwareItems = computed(() => [
  {
    key: 'osArchitecture',
    label: t('ec.monitor.dashboard.detail.osArchitecture'),
    value: firstDisplayValue(detailInfo.value.osType),
  },
  {
    key: 'cpuCores',
    label: t('ec.monitor.dashboard.detail.cpuCores'),
    value: firstDisplayValue(detailInfo.value.cpuCores, agentSystemInfo.value.availableProcessors),
  },
  {
    key: 'cpuModel',
    label: t('ec.monitor.dashboard.detail.cpuModel'),
    value: firstDisplayValue(cpuLabel.value),
    full: true,
  },
  {
    key: 'memoryUsage',
    label: t('ec.monitor.dashboard.detail.memoryUsage'),
    value: firstDisplayValue(memoryUsageDetail.value),
    full: true,
  },
  {
    key: 'memorySpec',
    label: t('ec.monitor.dashboard.detail.memorySpec'),
    value: joinDisplay([detailInfo.value.ramType, detailInfo.value.ramSpeed, detailInfo.value.ramManufacturer], ' / '),
    full: true,
  },
  {
    key: 'mainBoard',
    label: t('ec.monitor.dashboard.detail.mainBoard'),
    value: firstDisplayValue(detailInfo.value.mainBoard),
    full: true,
  },
  {
    key: 'diskOverview',
    label: t('ec.monitor.dashboard.detail.diskOverview'),
    value: diskOverviewLabel.value,
    full: true,
  },
  {
    key: 'gpu',
    label: t('ec.monitor.dashboard.detail.gpu'),
    value: gpuLabel.value,
    full: true,
    multiline: gpuLabel.value !== '-',
  },
  {
    key: 'processCount',
    label: t('ec.monitor.dashboard.detail.processCount'),
    value: processCountLabel.value,
  },
  {
    key: 'feedbackTime',
    label: t('ec.monitor.dashboard.detail.feedbackTime'),
    value: feedbackTimeLabel.value,
  },
])

const diskList = computed(() => {
  if (detailInfo.value.parts?.length) {
    return detailInfo.value.parts.map((part) => {
      const total = parseMonitorNumber(part.capacity)
      const available = parseMonitorNumber(part.availableCapacity)
      const used = Math.max(total - available, 0)
      const percent = total ? Math.round((used / total) * 100) : 0

      return {
        mountPoint: part.mountPoint || '-',
        total,
        used,
        percent,
        usageLabel: `${formatMegabytes(used)} / ${formatMegabytes(total)}`,
      }
    })
  }

  return (agentSystemInfo.value.disks || []).map((disk) => {
    const total = Number(disk.totalSpace || 0)
    const usable = Number(disk.usableSpace || 0)
    const used = Math.max(total - usable, 0)
    const percent = total ? Math.round((used / total) * 100) : 0

    return {
      mountPoint: disk.mountPoint || '-',
      total,
      used,
      percent,
      usageLabel: `${formatMegabytes(used)} / ${formatMegabytes(total)}`,
    }
  })
})

const processList = computed(() => {
  if (detailInfo.value.processStatusList?.length) {
    return detailInfo.value.processStatusList.map((process) => {
      const running = process.status === '正常' || process.running === true
      return {
        name: process.processName || process.name || '-',
        pid: process.pid || process.processName || process.name || '-',
        running,
        statusText: process.status || (running ? t('ec.monitor.dashboard.process.running') : t('ec.monitor.dashboard.process.stopped')),
      }
    })
  }

  return (agent.value?.processes || []).map((process) => ({
    name: process.name || '-',
    pid: process.pid || process.name || '-',
    running: process.running !== false,
    statusText: process.status || (process.running === false ? t('ec.monitor.dashboard.process.stopped') : t('ec.monitor.dashboard.process.running')),
  }))
})

const recentLogs = computed(() => {
  return (agent.value?.logs || []).slice(0, 8)
})

watch(
  () => monitorStore.activeAgentId,
  async (agentId) => {
    if (!agentId) {
      deepDetail.value = null
      return
    }

    loading.value = true
    try {
      deepDetail.value = await getMonitorAgentDetail(agentId)
    } catch (error) {
      deepDetail.value = null
      ElMessage.error(error.message || t('ec.monitor.dashboard.rules.message.detailFailed'))
    } finally {
      loading.value = false
    }
  },
  { immediate: true },
)

const resolveUsageClass = (value) => {
  if (value >= 90) return 'is-danger'
  if (value >= 70) return 'is-warning'
  return 'is-primary'
}

function firstDisplayValue(...values) {
  for (const value of values) {
    if (value === 0 || value === '0') return String(value)
    if (value) return String(value)
  }

  return '-'
}

function joinDisplay(values, separator = ' ') {
  const normalized = values
    .filter((value) => value === 0 || value === '0' || Boolean(value))
    .map((value) => String(value).trim())
    .filter(Boolean)

  return normalized.length ? normalized.join(separator) : '-'
}

function formatDateTime(value) {
  if (!value) return '-'
  const date = dayjs(value)
  return date.isValid() ? date.format('YYYY-MM-DD HH:mm:ss') : String(value)
}

function formatUsageValue(totalValue, freeValue) {
  const total = Number(totalValue || 0)
  const free = Number(freeValue || 0)
  if (!total) return '-'

  const used = Math.max(total - free, 0)
  return `${formatMegabytes(used)} / ${formatMegabytes(total)}`
}

function parseMonitorNumber(value) {
  const parsed = Number.parseFloat(value)
  return Number.isFinite(parsed) ? parsed : 0
}

function formatMegabytes(value) {
  const numeric = Number(value || 0)
  if (!numeric) return '0 MB'
  if (numeric >= 1024 * 1024) return `${(numeric / (1024 * 1024)).toFixed(1)} TB`
  if (numeric >= 1024) return `${(numeric / 1024).toFixed(1)} GB`
  return `${numeric.toFixed(1)} MB`
}
</script>

<style lang="scss" scoped>
.monitor-detail {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.monitor-detail__summary,
.monitor-detail__spec-grid {
  display: grid;
  gap: 12px;
}

.monitor-detail__summary {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.monitor-detail__spec-grid {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.monitor-detail__summary-item,
.monitor-detail__spec-item,
.monitor-detail__disk-item,
.monitor-detail__process-item,
.monitor-detail__log-item {
  padding: 12px;
  border: 1px solid var(--el-border-color-light);
  background-color: var(--el-fill-color-light);
}

.monitor-detail__summary-item,
.monitor-detail__spec-item {
  display: flex;
  flex-direction: column;
  gap: 6px;

  span {
    color: var(--el-text-color-secondary);
    font-size: var(--el-font-size-small);
  }

  strong,
  pre {
    margin: 0;
    color: var(--el-text-color-primary);
    word-break: break-all;
    font-family: inherit;
  }
}

.monitor-detail__spec-item.is-full {
  grid-column: 1 / -1;
}

.monitor-detail__spec-item pre {
  white-space: pre-wrap;
  font-family: var(--el-font-family-monospace, 'Consolas', 'Courier New', monospace);
}

.monitor-detail__section {
  display: flex;
  flex-direction: column;
  gap: 12px;

  > header {
    color: var(--el-text-color-primary);
    font-weight: var(--el-font-weight-primary);
  }
}

.monitor-detail__disk-list,
.monitor-detail__process-list,
.monitor-detail__log-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.monitor-detail__disk-item,
.monitor-detail__process-item {
  display: flex;
  align-items: center;
  gap: 12px;
}

.monitor-detail__disk-item span,
.monitor-detail__process-item span,
.monitor-detail__log-item span {
  color: var(--el-text-color-primary);
}

.monitor-detail__disk-meta,
.monitor-detail__process-meta {
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 120px;
}

.monitor-detail__disk-meta small,
.monitor-detail__process-meta small {
  color: var(--el-text-color-secondary);
  font-size: var(--el-font-size-small);
  font-family: var(--el-font-family-monospace, 'Consolas', 'Courier New', monospace);
}

.monitor-detail__disk-item strong {
  color: var(--el-text-color-secondary);
  font-size: var(--el-font-size-small);
  min-width: 48px;
  text-align: right;
}

.monitor-detail__disk-bar {
  flex: 1;
  height: 8px;
  overflow: hidden;
  background-color: var(--el-fill-color-blank);

  i {
    display: block;
    height: 100%;
  }

  .is-primary {
    background-color: var(--el-color-primary);
  }

  .is-warning {
    background-color: var(--el-color-warning);
  }

  .is-danger {
    background-color: var(--el-color-danger);
  }
}

.monitor-detail__process-item {
  justify-content: space-between;
}

.monitor-detail__process-meta {
  min-width: 0;
  flex: 1;
}

.monitor-detail__log-item {
  display: flex;
  flex-direction: column;
  gap: 8px;

  span {
    color: var(--el-text-color-secondary);
    font-size: var(--el-font-size-small);
    font-family: var(--el-font-family-monospace, 'Consolas', 'Courier New', monospace);
  }

  pre {
    margin: 0;
    color: var(--el-text-color-primary);
    white-space: pre-wrap;
    word-break: break-all;
    font-family: var(--el-font-family-monospace, 'Consolas', 'Courier New', monospace);
  }
}

.monitor-detail__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

@media only screen and (max-width: 991px) {
  .monitor-detail__summary,
  .monitor-detail__spec-grid {
    grid-template-columns: 1fr;
  }

  .monitor-detail__spec-item.is-full {
    grid-column: auto;
  }

  .monitor-detail__disk-item,
  .monitor-detail__process-item {
    flex-direction: column;
    align-items: flex-start;
  }

  .monitor-detail__disk-meta,
  .monitor-detail__process-meta,
  .monitor-detail__disk-bar {
    width: 100%;
  }

  .monitor-detail__disk-item strong {
    min-width: 0;
    text-align: left;
  }
}
</style>
