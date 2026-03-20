<template>
  <div class="monitor-alert-banner" v-if="visibleAlerts.length">
    <div class="monitor-alert-banner__header">
      <strong>{{ t('ec.monitor.dashboard.banner.title') }} ({{ alerts.length }})</strong>
      <el-button link @click="handleAckAll">{{ t('ec.monitor.dashboard.banner.ackAll') }}</el-button>
    </div>

    <div class="monitor-alert-banner__list">
      <div v-for="alert in visibleAlerts" :key="alert.id" class="monitor-alert-banner__item">
        <el-tag :type="alert.alertLevel === 'CRITICAL' ? 'danger' : 'warning'">
          {{ alert.alertLevel === 'CRITICAL' ? t('ec.monitor.dashboard.alerts.level.critical') : t('ec.monitor.dashboard.alerts.level.warning') }}
        </el-tag>
        <span class="monitor-alert-banner__agent">[{{ alert.agentId }}]</span>
        <span class="monitor-alert-banner__message">{{ alert.message || alert.ruleName || '-' }}</span>
        <span class="monitor-alert-banner__time">{{ formatDateTime(alert.createTime) }}</span>
        <el-button link @click="handleAck(alert.id)">{{ t('ec.monitor.dashboard.banner.ackOne') }}</el-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import dayjs from 'dayjs'
import { storeToRefs } from 'pinia'
import { useMonitorStore } from '@/stores/modules/monitorStore'

const { t } = useI18n()
const monitorStore = useMonitorStore()
const { alerts } = storeToRefs(monitorStore)

const visibleAlerts = computed(() => alerts.value.slice(0, 5))

const handleAck = (id) => {
  monitorStore.ackAlert(id)
}

const handleAckAll = () => {
  monitorStore.ackAllAlerts()
}

const formatDateTime = (value) => {
  return value ? dayjs(value).format('HH:mm:ss') : '-'
}
</script>

<style lang="scss" scoped>
.monitor-alert-banner {
  margin-bottom: 16px;
  border: 1px solid var(--el-color-danger-light-7);
  background-color: var(--el-color-danger-light-9);
}

.monitor-alert-banner__header,
.monitor-alert-banner__item {
  display: grid;
  grid-template-columns: auto auto 1fr auto auto;
  gap: 12px;
  align-items: center;
  padding: 12px 16px;
}

.monitor-alert-banner__header {
  border-bottom: 1px solid var(--el-color-danger-light-7);

  strong {
    color: var(--el-color-danger);
    font-size: var(--el-font-size-small);
    grid-column: 1 / span 4;
  }
}

.monitor-alert-banner__list {
  display: flex;
  flex-direction: column;
}

.monitor-alert-banner__item + .monitor-alert-banner__item {
  border-top: 1px solid var(--el-border-color-lighter);
}

.monitor-alert-banner__agent,
.monitor-alert-banner__time {
  color: var(--el-text-color-secondary);
  font-family: var(--el-font-family-monospace, 'Consolas', 'Courier New', monospace);
  font-size: var(--el-font-size-small);
}

.monitor-alert-banner__message {
  color: var(--el-text-color-primary);
  font-size: var(--el-font-size-small);
}

@media only screen and (max-width: 991px) {
  .monitor-alert-banner__header,
  .monitor-alert-banner__item {
    grid-template-columns: 1fr;
    gap: 8px;
  }

  .monitor-alert-banner__header strong {
    grid-column: auto;
  }
}
</style>
