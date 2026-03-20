<template>
  <el-card class="monitor-dashboard">
    <MonitorAlertBanner />

    <el-form :model="filterForm" inline @submit.prevent>
      <el-form-item :label="t('ec.monitor.dashboard.filter.keyword')">
        <el-input
          v-model="filterForm.keyword"
          clearable
          :placeholder="t('ec.monitor.dashboard.filter.keyword.placeholder')"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleSearch">{{ t('ec.global.button.text.search') }}</el-button>
        <el-button @click="handleReset">{{ t('ec.global.button.text.reset') }}</el-button>
      </el-form-item>
      <el-form-item class="margin-left-auto" v-if="activeAgentId">
        <div class="monitor-dashboard__active-agent">
          <span>{{ t('ec.monitor.dashboard.filter.activeAgent') }}</span>
          <strong>{{ activeAgentId }}</strong>
        </div>
      </el-form-item>
    </el-form>

    <div class="monitor-dashboard__summary">
      <div class="monitor-dashboard__summary-card">
        <span>{{ t('ec.monitor.dashboard.summary.total') }}</span>
        <strong>{{ totalAgents }}</strong>
      </div>
      <div class="monitor-dashboard__summary-card">
        <span>{{ t('ec.monitor.dashboard.summary.online') }}</span>
        <strong class="is-success">{{ onlineAgents }}</strong>
      </div>
      <div class="monitor-dashboard__summary-card">
        <span>{{ t('ec.monitor.dashboard.summary.offline') }}</span>
        <strong class="is-danger">{{ totalAgents - onlineAgents }}</strong>
      </div>
      <div class="monitor-dashboard__summary-card">
        <span>{{ t('ec.monitor.dashboard.summary.abnormal') }}</span>
        <strong class="is-warning">{{ abnormalProcesses }}</strong>
      </div>
    </div>

    <div class="monitor-dashboard__grid" v-if="filteredAgents.length">
      <MonitorAgentCard
        v-for="agent in filteredAgents"
        :key="agent.id"
        :agent="agent"
        :active="activeAgentId === agent.id"
        :critical-alerts="getCriticalAlertsForAgent(agent.id)"
        :warning-alerts="getWarningAlertsForAgent(agent.id)"
        @select="handleSelectAgent"
        @open-alerts="openAlerts"
        @open-logs="openLogs"
      />
    </div>

    <el-empty v-else :description="t('ec.monitor.dashboard.empty')" />
  </el-card>

  <MonitorDetailDrawer />
  <MonitorAgentAlertsModal v-model:visible="showAlertsModal" :agent-id="selectedAlertAgentId" />
  <MonitorLogTimelineModal v-model:visible="showLogsModal" :agent-id="selectedLogsAgentId" />
</template>

<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useI18n } from 'vue-i18n'
import MonitorAlertBanner from '@/components/monitor/MonitorAlertBanner.vue'
import MonitorAgentAlertsModal from '@/components/monitor/MonitorAgentAlertsModal.vue'
import MonitorAgentCard from '@/components/monitor/MonitorAgentCard.vue'
import MonitorDetailDrawer from '@/components/monitor/MonitorDetailDrawer.vue'
import MonitorLogTimelineModal from '@/components/monitor/MonitorLogTimelineModal.vue'
import { useMonitorStore } from '@/stores/modules/monitorStore'

defineOptions({ name: 'MonitorDashboard' })

const { t } = useI18n()
const monitorStore = useMonitorStore()
const { agentList, totalAgents, onlineAgents, activeAgentId, alerts } = storeToRefs(monitorStore)

const filterForm = reactive({
  keyword: '',
})
const appliedKeyword = ref('')

const showAlertsModal = ref(false)
const selectedAlertAgentId = ref('')
const showLogsModal = ref(false)
const selectedLogsAgentId = ref('')

const filteredAgents = computed(() => {
  const keyword = appliedKeyword.value
  if (!keyword) return agentList.value

  return agentList.value.filter((agent) => {
    return [agent.id, agent.systemInfo?.hostname, agent.systemInfo?.osName]
      .filter(Boolean)
      .some((value) => String(value).toLowerCase().includes(keyword))
  })
})

const abnormalProcesses = computed(() => {
  return agentList.value.reduce((count, agent) => {
    return count + (agent.processes || []).filter((process) => process.running === false).length
  }, 0)
})

const handleSearch = () => {
  appliedKeyword.value = filterForm.keyword.trim().toLowerCase()
}

const handleReset = () => {
  filterForm.keyword = ''
  appliedKeyword.value = ''
}

const handleSelectAgent = (agentId) => {
  monitorStore.setActiveAgent(agentId)
}

const openAlerts = (agentId) => {
  selectedAlertAgentId.value = agentId
  showAlertsModal.value = true
}

const openLogs = (agentId) => {
  selectedLogsAgentId.value = agentId
  showLogsModal.value = true
}

const getCriticalAlertsForAgent = (agentId) => {
  return alerts.value.filter((alert) => alert.agentId === agentId && alert.alertLevel === 'CRITICAL').length
}

const getWarningAlertsForAgent = (agentId) => {
  return alerts.value.filter((alert) => alert.agentId === agentId && alert.alertLevel !== 'CRITICAL').length
}

onMounted(() => {
  monitorStore.initializeMonitoring()
})
</script>

<style lang="scss" scoped>
.monitor-dashboard {
  :deep(.el-form.el-form--inline) {
    margin: -8px -8px 8px;

    .el-form-item {
      margin: 0;
      padding: 8px;
    }

    .el-input {
      width: 280px;
    }
  }
}

.monitor-dashboard__active-agent {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border: 1px solid var(--el-border-color-light);
  background-color: var(--el-fill-color-light);
  color: var(--el-text-color-secondary);
  font-size: var(--el-font-size-small);

  strong {
    color: var(--el-text-color-primary);
    font-family: var(--el-font-family-monospace, 'Consolas', 'Courier New', monospace);
    font-weight: var(--el-font-weight-primary);
  }
}

.monitor-dashboard__summary {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 16px;
  margin-bottom: 16px;
}

.monitor-dashboard__summary-card {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 16px;
  border: 1px solid var(--el-border-color-light);
  background-color: var(--el-fill-color-blank);

  span {
    color: var(--el-text-color-secondary);
    font-size: var(--el-font-size-small);
  }

  strong {
    color: var(--el-text-color-primary);
    font-size: 24px;
    line-height: 1;
  }

  .is-success {
    color: var(--el-color-success);
  }

  .is-danger {
    color: var(--el-color-danger);
  }

  .is-warning {
    color: var(--el-color-warning);
  }
}

.monitor-dashboard__grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 16px;
}

@media only screen and (max-width: 1400px) {
  .monitor-dashboard__grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

@media only screen and (max-width: 991px) {
  .monitor-dashboard {
    :deep(.el-form.el-form--inline) {
      flex-direction: column;

      .el-form-item {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        width: 100%;

        .el-form-item__content {
          width: 100%;
        }
      }

      .el-input {
        width: 100%;
      }
    }
  }

  .monitor-dashboard__summary,
  .monitor-dashboard__grid {
    grid-template-columns: 1fr;
  }

  .monitor-dashboard__active-agent {
    width: 100%;
    justify-content: space-between;
  }
}
</style>
