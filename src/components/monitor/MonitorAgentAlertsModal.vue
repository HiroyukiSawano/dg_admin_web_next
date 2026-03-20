<template>
  <el-dialog v-model="visible" :title="dialogTitle" width="720px" append-to-body destroy-on-close>
    <div class="monitor-agent-alerts">
      <div class="monitor-agent-alerts__toolbar" v-if="activeAlerts.length">
        <span>{{ activeAlerts.length }}</span>
        <el-button @click="handleAckAll">{{ t('ec.monitor.dashboard.banner.ackAll') }}</el-button>
      </div>

      <div class="monitor-agent-alerts__list" v-if="activeAlerts.length">
        <div v-for="alert in activeAlerts" :key="alert.id" class="monitor-agent-alerts__item">
          <div class="monitor-agent-alerts__item-header">
            <el-tag :type="alert.alertLevel === 'CRITICAL' ? 'danger' : 'warning'">
              {{ alert.alertLevel === 'CRITICAL' ? t('ec.monitor.dashboard.alerts.level.critical') : t('ec.monitor.dashboard.alerts.level.warning') }}
            </el-tag>
            <span>{{ formatDateTime(alert.createTime) }}</span>
          </div>

          <div class="monitor-agent-alerts__item-message">{{ alert.message || alert.ruleName || '-' }}</div>

          <div class="monitor-agent-alerts__item-footer">
            <el-button size="small" @click="handleAck(alert.id)">{{ t('ec.monitor.dashboard.banner.ackOne') }}</el-button>
          </div>
        </div>
      </div>

      <el-empty v-else :description="t('ec.monitor.dashboard.alerts.empty')" />
    </div>
  </el-dialog>
</template>

<script setup>
import { computed, onBeforeUnmount, watch } from 'vue'
import dayjs from 'dayjs'
import { useI18n } from 'vue-i18n'
import { storeToRefs } from 'pinia'
import { useMonitorStore } from '@/stores/modules/monitorStore'

const props = defineProps({
  agentId: {
    type: String,
    default: '',
  },
})

const visible = defineModel('visible', { type: Boolean, default: false })

const { t } = useI18n()
const monitorStore = useMonitorStore()
const { alerts } = storeToRefs(monitorStore)

const dialogTitle = computed(() => t('ec.monitor.dashboard.alerts.title', { agentId: props.agentId || '-' }))

const activeAlerts = computed(() => {
  if (!props.agentId) return []
  return alerts.value.filter((alert) => alert.agentId === props.agentId)
})

watch(visible, (next, previous) => {
  if (next) monitorStore.pauseAutoRefresh()
  if (!next && previous) monitorStore.resumeAutoRefresh()
})

onBeforeUnmount(() => {
  if (visible.value) monitorStore.resumeAutoRefresh()
})

const handleAck = (id) => {
  monitorStore.ackAlert(id)
}

const handleAckAll = async () => {
  await Promise.all(activeAlerts.value.map((alert) => monitorStore.ackAlert(alert.id)))
}

const formatDateTime = (value) => {
  return value ? dayjs(value).format('YYYY-MM-DD HH:mm:ss') : '-'
}
</script>

<style lang="scss" scoped>
.monitor-agent-alerts {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.monitor-agent-alerts__toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: var(--el-text-color-secondary);
  font-size: var(--el-font-size-small);
}

.monitor-agent-alerts__list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-height: 60vh;
  overflow: auto;
}

.monitor-agent-alerts__item {
  padding: 16px;
  border: 1px solid var(--el-border-color-light);
  background-color: var(--el-fill-color-light);
}

.monitor-agent-alerts__item-header,
.monitor-agent-alerts__item-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.monitor-agent-alerts__item-header span {
  color: var(--el-text-color-secondary);
  font-size: var(--el-font-size-small);
  font-family: var(--el-font-family-monospace, 'Consolas', 'Courier New', monospace);
}

.monitor-agent-alerts__item-message {
  margin: 12px 0;
  color: var(--el-text-color-primary);
  line-height: 1.6;
}
</style>
