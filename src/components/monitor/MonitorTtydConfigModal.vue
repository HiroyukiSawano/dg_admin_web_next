<template>
  <el-dialog v-model="visible" :title="dialogTitle" width="760px" append-to-body destroy-on-close>
    <div class="monitor-ttyd" v-loading="loading">
      <el-alert
        v-if="notice.message"
        :title="notice.message"
        :type="notice.type"
        :closable="false"
        show-icon
      >
        <template #default>
          <div v-if="notice.link" class="monitor-ttyd__notice-link">
            <a :href="notice.link" target="_blank" rel="noopener noreferrer">{{ notice.link }}</a>
          </div>
          <div v-if="notice.extra">{{ notice.extra }}</div>
        </template>
      </el-alert>

      <div class="monitor-ttyd__list" v-if="services.length">
        <div v-for="service in services" :key="`${service.port}-${service.command || 'default'}`" class="monitor-ttyd__item">
          <div class="monitor-ttyd__item-main">
            <div class="monitor-ttyd__item-header">
              <el-tag :type="service.isRunning ? 'success' : 'danger'">
                {{ service.isRunning ? t('ec.monitor.dashboard.ttyd.running') : t('ec.monitor.dashboard.ttyd.stopped') }}
              </el-tag>
              <strong>{{ t('ec.monitor.dashboard.ttyd.portLabel', { port: service.port || '-' }) }}</strong>
              <span>{{ service.command || 'bash' }}</span>
            </div>
            <pre>{{ resolveServiceUrl(service) || '-' }}</pre>
            <small>
              {{ t('ec.monitor.dashboard.ttyd.serviceMeta', {
                writable: service.writable ? 'true' : 'false',
                workingDirectory: service.workingDirectory || '/',
              }) }}
            </small>
          </div>
          <div class="monitor-ttyd__item-actions">
            <el-button v-if="resolveServiceUrl(service)" link type="primary" @click="openService(resolveServiceUrl(service))">
              {{ t('ec.monitor.dashboard.ttyd.open') }}
            </el-button>
            <el-button
              link
              type="danger"
              :loading="stoppingPort === service.port"
              @click="handleStop(service.port)"
            >
              {{ t('ec.monitor.dashboard.ttyd.stop') }}
            </el-button>
          </div>
        </div>
      </div>

      <el-empty v-else :description="t('ec.monitor.dashboard.ttyd.empty')" />

      <el-divider />

      <el-form :model="form" label-position="top" @submit.prevent>
        <div class="monitor-ttyd__form-grid">
          <el-form-item :label="t('ec.monitor.dashboard.ttyd.port')">
            <el-input v-model="form.port" type="number" min="1" max="65535" />
          </el-form-item>
          <el-form-item :label="t('ec.monitor.dashboard.ttyd.writable')">
            <el-switch v-model="form.writable" />
          </el-form-item>
        </div>
        <div class="monitor-ttyd__form-grid">
          <el-form-item :label="t('ec.monitor.dashboard.ttyd.username')">
            <el-input v-model="form.username" autocomplete="off" />
          </el-form-item>
          <el-form-item :label="t('ec.monitor.dashboard.ttyd.password')">
            <el-input v-model="form.password" type="password" autocomplete="off" show-password />
          </el-form-item>
        </div>
      </el-form>
    </div>

    <template #footer>
      <el-button @click="visible = false">{{ t('ec.monitor.dashboard.ttyd.cancel') }}</el-button>
      <el-button type="primary" :loading="starting" @click="handleStart">
        {{ t('ec.monitor.dashboard.ttyd.start') }}
      </el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { computed, onBeforeUnmount, reactive, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  getMonitorTtydServices,
  resolveMonitorTtydUrl,
  startMonitorTtydService,
  stopMonitorTtydService,
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
const starting = ref(false)
const stoppingPort = ref(null)
const services = ref([])
const form = reactive({
  port: '7681',
  username: 'admin',
  password: 'password',
  writable: true,
})
const notice = reactive({
  type: 'success',
  message: '',
  link: '',
  extra: '',
})

const dialogTitle = computed(() => t('ec.monitor.dashboard.ttyd.title', { agentId: props.agentId || '-' }))

watch(visible, async (next, previous) => {
  if (next) {
    monitorStore.pauseAutoRefresh()
    resetForm()
    resetNotice()
    await loadServices()
  }

  if (!next && previous) {
    monitorStore.resumeAutoRefresh()
  }
})

onBeforeUnmount(() => {
  if (visible.value) monitorStore.resumeAutoRefresh()
})

function resetForm() {
  form.port = '7681'
  form.username = 'admin'
  form.password = 'password'
  form.writable = true
}

function resetNotice() {
  notice.type = 'success'
  notice.message = ''
  notice.link = ''
  notice.extra = ''
}

function setNotice(type, message, link = '', extra = '') {
  notice.type = type
  notice.message = message
  notice.link = link
  notice.extra = extra
}

async function loadServices() {
  if (!props.agentId) return

  loading.value = true
  try {
    services.value = await getMonitorTtydServices(props.agentId)
  } catch (error) {
    services.value = []
    setNotice('error', error.message || t('ec.monitor.dashboard.ttyd.message.loadFailed'))
    ElMessage.error(error.message || t('ec.monitor.dashboard.ttyd.message.loadFailed'))
  } finally {
    loading.value = false
  }
}

async function handleStart() {
  const port = Number(form.port)
  const username = form.username.trim()
  const password = form.password

  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    ElMessage.warning(t('ec.monitor.dashboard.ttyd.message.invalidPort'))
    return
  }
  if (!username) {
    ElMessage.warning(t('ec.monitor.dashboard.ttyd.message.usernameRequired'))
    return
  }
  if (!password) {
    ElMessage.warning(t('ec.monitor.dashboard.ttyd.message.passwordRequired'))
    return
  }

  starting.value = true
  resetNotice()

  try {
    const payload = await startMonitorTtydService(props.agentId, {
      Port: port,
      Credential: `${username}:${password}`,
      Writable: form.writable,
    })
    const link = payload.resolvedUrl || resolveMonitorTtydUrl(payload)
    if (!link) {
      throw new Error(t('ec.monitor.dashboard.ttyd.message.linkMissing'))
    }

    setNotice('success', payload.message || t('ec.monitor.dashboard.ttyd.message.startSuccess'), link)
    openService(link)
    await loadServices()
  } catch (error) {
    setNotice('error', error.message || t('ec.monitor.dashboard.ttyd.message.startFailed'))
    ElMessage.error(error.message || t('ec.monitor.dashboard.ttyd.message.startFailed'))
  } finally {
    starting.value = false
  }
}

async function handleStop(port) {
  try {
    await ElMessageBox.confirm(
      t('ec.monitor.dashboard.ttyd.message.stopConfirm', { port }),
      t('ec.monitor.dashboard.ttyd.stop'),
      { type: 'warning' },
    )
  } catch (_) {
    return
  }

  stoppingPort.value = port
  try {
    const payload = await stopMonitorTtydService(props.agentId, port)
    setNotice('success', payload.message || t('ec.monitor.dashboard.ttyd.message.stopSuccess'))
    await loadServices()
  } catch (error) {
    setNotice('error', error.message || t('ec.monitor.dashboard.ttyd.message.stopFailed'))
    ElMessage.error(error.message || t('ec.monitor.dashboard.ttyd.message.stopFailed'))
  } finally {
    stoppingPort.value = null
  }
}

function resolveServiceUrl(service) {
  return resolveMonitorTtydUrl(service)
}

function openService(url) {
  window.open(url, '_blank', 'noopener,noreferrer')
}
</script>

<style lang="scss" scoped>
.monitor-ttyd {
  min-height: 220px;
}

.monitor-ttyd__notice-link {
  margin-bottom: 6px;

  a {
    color: var(--el-color-primary);
    word-break: break-all;
  }
}

.monitor-ttyd__list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-height: 320px;
  overflow: auto;
  margin-top: 16px;
}

.monitor-ttyd__item {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  padding: 16px;
  border: 1px solid var(--el-border-color-light);
  background-color: var(--el-fill-color-light);
}

.monitor-ttyd__item-main {
  min-width: 0;
  flex: 1;

  pre,
  small {
    display: block;
    margin: 8px 0 0;
    color: var(--el-text-color-secondary);
    white-space: pre-wrap;
    word-break: break-all;
    font-family: var(--el-font-family-monospace, 'Consolas', 'Courier New', monospace);
  }

  pre {
    color: var(--el-text-color-primary);
  }
}

.monitor-ttyd__item-header {
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

.monitor-ttyd__item-actions {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 8px;
}

.monitor-ttyd__form-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}

@media only screen and (max-width: 991px) {
  .monitor-ttyd__item,
  .monitor-ttyd__form-grid {
    grid-template-columns: 1fr;
  }

  .monitor-ttyd__item {
    flex-direction: column;
    align-items: stretch;
  }

  .monitor-ttyd__item-actions {
    align-items: flex-start;
  }
}
</style>
