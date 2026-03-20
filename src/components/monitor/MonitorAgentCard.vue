<template>
  <el-card class="monitor-agent-card" :class="cardClasses" shadow="hover" @click="$emit('select', agent.id)">
    <div class="monitor-agent-card__header">
      <div class="monitor-agent-card__status">
        <span class="monitor-agent-card__dot" :class="agent.online ? 'is-online' : 'is-offline'" />
        <div class="monitor-agent-card__title">
          <strong>{{ agent.systemInfo?.hostname || agent.id }}</strong>
          <span>{{ agent.online ? t('ec.monitor.dashboard.card.online') : t('ec.monitor.dashboard.card.offline') }}</span>
        </div>
      </div>

      <div class="monitor-agent-card__badges">
        <el-tag v-if="criticalAlerts" type="danger">{{ criticalAlerts }}</el-tag>
        <el-tag v-if="warningAlerts" type="warning">{{ warningAlerts }}</el-tag>
      </div>
    </div>

    <div class="monitor-agent-card__subtitle">{{ agent.systemInfo?.osName || '-' }}</div>

    <div class="monitor-agent-card__metrics">
      <div class="monitor-agent-card__metric">
        <span>{{ t('ec.monitor.dashboard.card.cpu') }}</span>
        <div class="monitor-agent-card__bar"><i :style="{ width: `${cpuUsage}%` }" :class="resolveUsageClass(cpuUsage)" /></div>
        <strong>{{ cpuUsage.toFixed(1) }}%</strong>
      </div>
      <div class="monitor-agent-card__metric">
        <span>{{ t('ec.monitor.dashboard.card.memory') }}</span>
        <div class="monitor-agent-card__bar"><i :style="{ width: `${memoryUsage}%` }" :class="resolveUsageClass(memoryUsage)" /></div>
        <strong>{{ memoryUsage.toFixed(1) }}%</strong>
      </div>
      <div class="monitor-agent-card__metric">
        <span>{{ t('ec.monitor.dashboard.card.disk') }}</span>
        <div class="monitor-agent-card__bar"><i :style="{ width: `${diskUsage}%` }" :class="resolveUsageClass(diskUsage)" /></div>
        <strong>{{ diskUsage.toFixed(1) }}%</strong>
      </div>
    </div>

    <div class="monitor-agent-card__footer">
      <span>{{ agent.id }}</span>
      <div class="monitor-agent-card__actions">
        <el-button link @click.stop="$emit('open-alerts', agent.id)">{{ t('ec.monitor.dashboard.card.alerts') }}</el-button>
        <el-button link @click.stop="$emit('open-logs', agent.id)">{{ t('ec.monitor.dashboard.card.logs') }}</el-button>
      </div>
    </div>
  </el-card>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const props = defineProps({
  agent: {
    type: Object,
    required: true,
  },
  active: {
    type: Boolean,
    default: false,
  },
  criticalAlerts: {
    type: Number,
    default: 0,
  },
  warningAlerts: {
    type: Number,
    default: 0,
  },
})

defineEmits(['select', 'open-alerts', 'open-logs'])

const cpuUsage = computed(() => Number(props.agent.systemInfo?.cpuUsage || 0))

const memoryUsage = computed(() => {
  const total = Number(props.agent.systemInfo?.totalMemory || 0)
  const free = Number(props.agent.systemInfo?.freeMemory || 0)
  if (!total) return 0
  return ((total - free) / total) * 100
})

const diskUsage = computed(() => {
  const disks = props.agent.systemInfo?.disks || []
  if (!disks.length) return 0

  const total = disks.reduce((sum, disk) => sum + Number(disk.totalSpace || 0), 0)
  const usable = disks.reduce((sum, disk) => sum + Number(disk.usableSpace || 0), 0)
  if (!total) return 0
  return ((total - usable) / total) * 100
})

const cardClasses = computed(() => {
  return {
    'is-active': props.active,
    'has-critical': props.criticalAlerts > 0,
    'has-warning': props.criticalAlerts === 0 && props.warningAlerts > 0,
    'is-offline': !props.agent.online,
  }
})

const resolveUsageClass = (value) => {
  if (value >= 90) return 'is-danger'
  if (value >= 70) return 'is-warning'
  return 'is-primary'
}
</script>

<style lang="scss" scoped>
.monitor-agent-card {
  cursor: pointer;
  border: 1px solid var(--el-border-color);
  transition: var(--el-transition-all);

  &.is-active {
    border-color: var(--el-color-primary);
    box-shadow: 0 0 0 1px var(--el-color-primary-light-7) inset;
  }

  &.has-critical {
    border-color: var(--el-color-danger-light-5);
    background-color: var(--el-color-danger-light-9);
  }

  &.has-warning {
    border-color: var(--el-color-warning-light-5);
    background-color: var(--el-color-warning-light-9);
  }

  &.is-offline {
    opacity: 0.75;
  }

  :deep(.el-card__body) {
    display: flex;
    flex-direction: column;
    gap: 16px;
    padding: 16px;
  }
}

.monitor-agent-card__header,
.monitor-agent-card__footer,
.monitor-agent-card__metric {
  display: flex;
  align-items: center;
  gap: 12px;
}

.monitor-agent-card__header {
  justify-content: space-between;
}

.monitor-agent-card__status {
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 0;
}

.monitor-agent-card__dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  flex-shrink: 0;

  &.is-online {
    background-color: var(--el-color-success);
    box-shadow: 0 0 0 3px var(--el-color-success-light-8);
  }

  &.is-offline {
    background-color: var(--el-color-danger);
    box-shadow: 0 0 0 3px var(--el-color-danger-light-8);
  }
}

.monitor-agent-card__title {
  display: flex;
  flex-direction: column;
  min-width: 0;

  strong {
    color: var(--el-text-color-primary);
    font-size: var(--el-font-size-base);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  span,
  .monitor-agent-card__subtitle {
    color: var(--el-text-color-secondary);
    font-size: var(--el-font-size-small);
  }
}

.monitor-agent-card__subtitle {
  color: var(--el-text-color-secondary);
  font-size: var(--el-font-size-small);
}

.monitor-agent-card__metrics {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.monitor-agent-card__metric {
  span,
  strong {
    color: var(--el-text-color-secondary);
    font-size: var(--el-font-size-small);
    white-space: nowrap;
  }

  span {
    width: 36px;
    flex-shrink: 0;
  }

  strong {
    width: 52px;
    text-align: right;
  }
}

.monitor-agent-card__bar {
  flex: 1;
  height: 8px;
  overflow: hidden;
  background-color: var(--el-fill-color-light);

  i {
    display: block;
    height: 100%;
    transition: var(--el-transition-all);
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

.monitor-agent-card__footer {
  justify-content: space-between;
  padding-top: 12px;
  border-top: 1px solid var(--el-border-color-lighter);
  color: var(--el-text-color-secondary);
  font-family: var(--el-font-family-monospace, 'Consolas', 'Courier New', monospace);
  font-size: var(--el-font-size-small);
}

.monitor-agent-card__actions {
  display: flex;
  gap: 8px;
  font-family: var(--el-font-family);
}
</style>
