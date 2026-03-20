<template>
  <el-dialog v-model="visible" :title="dialogTitle" width="720px" append-to-body destroy-on-close>
    <div class="monitor-log-monitor" v-loading="loading">
      <div class="monitor-log-monitor__list" v-if="monitors.length">
        <div v-for="monitor in monitors" :key="`${monitor.path}-${monitor.appName || '-'}`" class="monitor-log-monitor__item">
          <div class="monitor-log-monitor__item-main">
            <div class="monitor-log-monitor__item-header">
              <el-tag :type="monitor.isRunning ? 'success' : 'danger'">
                {{ monitor.isRunning ? t('ec.monitor.dashboard.logMonitor.running') : t('ec.monitor.dashboard.logMonitor.stopped') }}
              </el-tag>
              <strong>{{ monitor.appName || '-' }}</strong>
              <span>{{ t('ec.monitor.dashboard.logMonitor.fileCount', { count: monitor.fileCount || 0 }) }}</span>
            </div>
            <pre>{{ monitor.path || '-' }}</pre>
          </div>
          <el-button text type="danger" @click="handleDelete(monitor.path)">
            {{ t('ec.monitor.dashboard.logMonitor.delete') }}
          </el-button>
        </div>
      </div>

      <el-empty v-else :description="t('ec.monitor.dashboard.logMonitor.empty')" />

      <el-divider />

      <el-form :model="form" label-position="top" @submit.prevent>
        <el-form-item :label="t('ec.monitor.dashboard.logMonitor.appName')">
          <el-input
            v-model="form.appName"
            :placeholder="t('ec.monitor.dashboard.logMonitor.appNamePlaceholder')"
            clearable
          />
        </el-form-item>
        <el-form-item :label="t('ec.monitor.dashboard.logMonitor.path')">
          <el-input
            v-model="form.path"
            :placeholder="t('ec.monitor.dashboard.logMonitor.pathPlaceholder')"
            clearable
          />
        </el-form-item>
      </el-form>
    </div>

    <template #footer>
      <el-button @click="visible = false">{{ t('ec.monitor.dashboard.logMonitor.cancel') }}</el-button>
      <el-button type="primary" :loading="saving" @click="handleCreate">
        {{ t('ec.monitor.dashboard.logMonitor.create') }}
      </el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { computed, onBeforeUnmount, reactive, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { ElMessage } from 'element-plus'
import {
  createMonitorLogMonitor,
  deleteMonitorLogMonitor,
  getMonitorLogMonitors,
} from '@/services/modules/monitorService'
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
const saving = ref(false)
const monitors = ref([])
const form = reactive({
  appName: '',
  path: '',
})

const dialogTitle = computed(() => t('ec.monitor.dashboard.logMonitor.title', { agentId: props.agentId || '-' }))

watch(visible, async (next, previous) => {
  if (next) {
    monitorStore.pauseAutoRefresh()
    resetForm()
    await loadMonitors()
  }

  if (!next && previous) {
    monitorStore.resumeAutoRefresh()
  }
})

onBeforeUnmount(() => {
  if (visible.value) monitorStore.resumeAutoRefresh()
})

function resetForm() {
  form.appName = ''
  form.path = ''
}

async function loadMonitors() {
  if (!props.agentId) return

  loading.value = true
  try {
    monitors.value = await getMonitorLogMonitors(props.agentId)
  } catch (error) {
    monitors.value = []
    ElMessage.error(error.message || t('ec.monitor.dashboard.logMonitor.message.loadFailed'))
  } finally {
    loading.value = false
  }
}

async function handleCreate() {
  const path = form.path.trim()
  if (!path) {
    ElMessage.warning(t('ec.monitor.dashboard.logMonitor.message.pathRequired'))
    return
  }

  saving.value = true
  try {
    await createMonitorLogMonitor(props.agentId, path, form.appName.trim() || t('ec.monitor.dashboard.logMonitor.unknownApp'))
    ElMessage.success(t('ec.monitor.dashboard.logMonitor.message.createSuccess'))
    resetForm()
    await loadMonitors()
  } catch (error) {
    ElMessage.error(error.message || t('ec.monitor.dashboard.logMonitor.message.createFailed'))
  } finally {
    saving.value = false
  }
}

async function handleDelete(path) {
  try {
    await deleteMonitorLogMonitor(props.agentId, path)
    ElMessage.success(t('ec.monitor.dashboard.logMonitor.message.deleteSuccess'))
    await loadMonitors()
  } catch (error) {
    ElMessage.error(error.message || t('ec.monitor.dashboard.logMonitor.message.deleteFailed'))
  }
}
</script>

<style lang="scss" scoped>
.monitor-log-monitor {
  min-height: 220px;
}

.monitor-log-monitor__list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-height: 320px;
  overflow: auto;
}

.monitor-log-monitor__item {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  padding: 16px;
  border: 1px solid var(--el-border-color-light);
  background-color: var(--el-fill-color-light);
}

.monitor-log-monitor__item-main {
  min-width: 0;
  flex: 1;

  pre {
    margin: 8px 0 0;
    color: var(--el-text-color-primary);
    white-space: pre-wrap;
    word-break: break-all;
    font-family: var(--el-font-family-monospace, 'Consolas', 'Courier New', monospace);
  }
}

.monitor-log-monitor__item-header {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;

  strong {
    color: var(--el-text-color-primary);
  }

  span {
    color: var(--el-text-color-secondary);
    font-size: var(--el-font-size-small);
  }
}

@media only screen and (max-width: 991px) {
  .monitor-log-monitor__item {
    flex-direction: column;
    align-items: stretch;
  }
}
</style>
