<template>
  <el-dialog v-model="visible" :title="dialogTitle" width="760px" append-to-body destroy-on-close>
    <div class="monitor-log-timeline" v-loading="loading">
      <div class="monitor-log-timeline__list" v-if="logs.length">
        <div v-for="log in logs" :key="log.id" class="monitor-log-timeline__item">
          <div class="monitor-log-timeline__item-header">
            <div class="monitor-log-timeline__tags">
              <el-tag v-if="log.level" :type="log.level === 'CRITICAL' ? 'danger' : 'warning'">{{ log.level }}</el-tag>
              <span v-if="log.appName">[{{ log.appName }}]</span>
            </div>
            <span>{{ formatDateTime(log.createTime || log.timestamp) }}</span>
          </div>

          <div class="monitor-log-timeline__rule" v-if="log.matchedRuleName || log.matchedKeyword">
            <strong>{{ log.matchedRuleName || '-' }}</strong>
            <em>{{ log.matchedKeyword || '-' }}</em>
          </div>

          <pre class="monitor-log-timeline__content">{{ log.logContent || log.raw || '-' }}</pre>
        </div>
      </div>

      <el-empty v-else :description="t('ec.monitor.dashboard.logs.empty')" />
    </div>
  </el-dialog>
</template>

<script setup>
import { onBeforeUnmount, ref, watch, computed } from 'vue'
import dayjs from 'dayjs'
import { useI18n } from 'vue-i18n'
import { ElMessage } from 'element-plus'
import { getMonitorAgentLogs } from '@/services/modules/monitorService'
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

const loading = ref(false)
const logs = ref([])

const dialogTitle = computed(() => t('ec.monitor.dashboard.logs.title', { agentId: props.agentId || '-' }))

watch(visible, async (next, previous) => {
  if (next) {
    monitorStore.pauseAutoRefresh()
    if (props.agentId) await loadLogs(props.agentId)
  }
  if (!next && previous) monitorStore.resumeAutoRefresh()
})

onBeforeUnmount(() => {
  if (visible.value) monitorStore.resumeAutoRefresh()
})

const loadLogs = async (agentId) => {
  loading.value = true
  try {
    logs.value = await getMonitorAgentLogs(agentId, { limit: 50 })
  } catch (error) {
    logs.value = []
    ElMessage.error(error.message || t('ec.monitor.logs.message.loadFailed'))
  } finally {
    loading.value = false
  }
}

const formatDateTime = (value) => {
  return value ? dayjs(value).format('YYYY-MM-DD HH:mm:ss') : '-'
}
</script>

<style lang="scss" scoped>
.monitor-log-timeline {
  min-height: 240px;
}

.monitor-log-timeline__list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-height: 60vh;
  overflow: auto;
}

.monitor-log-timeline__item {
  padding: 16px;
  border: 1px solid var(--el-border-color-light);
  background-color: var(--el-fill-color-light);
}

.monitor-log-timeline__item-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.monitor-log-timeline__tags {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--el-text-color-secondary);
  font-size: var(--el-font-size-small);
}

.monitor-log-timeline__item-header span:last-child {
  color: var(--el-text-color-secondary);
  font-size: var(--el-font-size-small);
  font-family: var(--el-font-family-monospace, 'Consolas', 'Courier New', monospace);
}

.monitor-log-timeline__rule {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 12px 0;

  strong {
    color: var(--el-text-color-primary);
  }

  em {
    color: var(--el-color-primary);
    font-style: normal;
    font-family: var(--el-font-family-monospace, 'Consolas', 'Courier New', monospace);
  }
}

.monitor-log-timeline__content {
  margin: 0;
  padding: 12px;
  overflow: auto;
  background-color: var(--el-fill-color-blank);
  color: var(--el-text-color-primary);
  font-family: var(--el-font-family-monospace, 'Consolas', 'Courier New', monospace);
  font-size: var(--el-font-size-small);
  line-height: 1.6;
  white-space: pre-wrap;
  word-break: break-all;
}
</style>
