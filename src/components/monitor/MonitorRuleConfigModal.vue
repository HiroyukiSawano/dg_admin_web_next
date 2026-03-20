<template>
  <el-dialog v-model="visible" :title="dialogTitle" width="880px" append-to-body destroy-on-close>
    <div class="monitor-rule-config-modal" v-loading="loading">
      <MonitorAlertRuleList :rules="rules" @delete="deleteRule" />

      <el-button v-if="!showAddForm" @click="openAddForm">{{ t('ec.monitor.dashboard.rules.create') }}</el-button>

      <MonitorRuleConditionEditor
        v-else
        :draft="form"
        :cached-partitions="cachedPartitions"
        :metric-options="metricOptions"
        :op-options="opOptions"
        :saving="saving"
        :create-group-draft="createGroupDraft"
        :create-item-draft="createItemDraft"
        @cancel="showAddForm = false"
        @submit="submitRule"
      />
    </div>
  </el-dialog>
</template>

<script setup>
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { ElMessage, ElMessageBox } from 'element-plus'
import MonitorAlertRuleList from '@/components/monitor/MonitorAlertRuleList.vue'
import MonitorRuleConditionEditor from '@/components/monitor/MonitorRuleConditionEditor.vue'
import {
  createMonitorAlertRule,
  deleteMonitorAlertRule,
  getMonitorAgentDetail,
  getMonitorApplicableRules,
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
const rules = ref([])
const cachedPartitions = ref([])
const showAddForm = ref(false)

const metricOptions = computed(() => [
  { value: 'CPU_USAGE', label: t('ec.monitor.dashboard.rules.metric.cpu'), numeric: true },
  { value: 'RAM_USAGE', label: t('ec.monitor.dashboard.rules.metric.memory'), numeric: true },
  { value: 'DISK_USAGE', label: t('ec.monitor.dashboard.rules.metric.disk'), numeric: true },
  { value: 'DISK_PARTITION', label: t('ec.monitor.dashboard.rules.metric.partition'), numeric: true },
  { value: 'PROCESS_ABNORMAL', label: t('ec.monitor.dashboard.rules.metric.process'), numeric: false },
  { value: 'AGENT_OFFLINE', label: t('ec.monitor.dashboard.rules.metric.offline'), numeric: false },
  { value: 'LOG_HIT_CRITICAL', label: t('ec.monitor.dashboard.rules.metric.logCritical'), numeric: true },
  { value: 'LOG_HIT_TOTAL', label: t('ec.monitor.dashboard.rules.metric.logTotal'), numeric: true },
])

const opOptions = computed(() => [
  { value: 'GT', label: '>' },
  { value: 'GTE', label: '>=' },
  { value: 'LT', label: '<' },
  { value: 'LTE', label: '<=' },
  { value: 'EQ', label: '=' },
])

const dialogTitle = computed(() => t('ec.monitor.dashboard.rules.title', { agentId: props.agentId || '-' }))

let draftId = 0
const form = ref(createEmptyDraft())

watch(visible, async (next, previous) => {
  if (next) {
    monitorStore.pauseAutoRefresh()
    showAddForm.value = false
    await Promise.all([fetchRules(), prefetchPartitions()])
  }

  if (!next && previous) {
    showAddForm.value = false
    monitorStore.resumeAutoRefresh()
  }
})

onBeforeUnmount(() => {
  if (visible.value) monitorStore.resumeAutoRefresh()
})

function createEmptyDraft() {
  return {
    ruleName: '',
    alertLevel: 'CRITICAL',
    cooldownSec: 60,
    topLogic: 'AND',
    groups: [],
  }
}

function nextDraftId() {
  draftId += 1
  return `monitor-rule-${draftId}`
}

function createItemDraft(overrides = {}) {
  return {
    id: nextDraftId(),
    metricType: 'CPU_USAGE',
    operator: 'GT',
    threshold: 80,
    targetName: '',
    durationSec: 0,
    ...overrides,
  }
}

function createGroupDraft(overrides = {}) {
  const items = overrides.items?.length ? overrides.items : [createItemDraft()]
  return {
    id: nextDraftId(),
    logic: overrides.logic || 'OR',
    items: items.map((item) => createItemDraft(item)),
  }
}

async function fetchRules() {
  loading.value = true
  try {
    const payload = await getMonitorApplicableRules(props.agentId)
    rules.value = payload.map((rule) => ({
      ...rule,
      formattedConditions: formatConditions(rule.conditions),
    }))
  } catch (error) {
    rules.value = []
    ElMessage.error(error.message || t('ec.monitor.dashboard.rules.message.loadFailed'))
  } finally {
    loading.value = false
  }
}

async function prefetchPartitions() {
  if (!props.agentId) {
    cachedPartitions.value = []
    return
  }

  try {
    const detail = await getMonitorAgentDetail(props.agentId)
    cachedPartitions.value = (detail?.parts || []).map((part) => part.mountPoint).filter(Boolean)
  } catch (error) {
    cachedPartitions.value = []
  }
}

function openAddForm() {
  form.value = createEmptyDraft()
  form.value.groups = [createGroupDraft()]
  showAddForm.value = true
}

async function submitRule() {
  if (!form.value.ruleName) {
    ElMessage.warning(t('ec.monitor.dashboard.rules.message.ruleNameRequired'))
    return
  }

  const validGroups = sanitizeGroups(form.value.groups)
  if (!validGroups.length) {
    ElMessage.warning(t('ec.monitor.dashboard.rules.message.groupRequired'))
    return
  }

  const smallDurations = validGroups.flatMap((group) => {
    return group.items.filter((item) => item.durationSec > 0 && item.durationSec < 60)
  })

  try {
    if (form.value.cooldownSec > 0 && form.value.cooldownSec < 60) {
      await ElMessageBox.confirm(t('ec.monitor.dashboard.rules.message.cooldownWarning'), t('ec.monitor.dashboard.rules.alertLevel'), {
        type: 'warning',
      })
    }

    if (smallDurations.length) {
      await ElMessageBox.confirm(t('ec.monitor.dashboard.rules.message.durationWarning'), t('ec.monitor.dashboard.rules.alertLevel'), {
        type: 'warning',
      })
    }
  } catch (_) {
    return
  }

  saving.value = true
  try {
    await createMonitorAlertRule({
      agentId: props.agentId,
      ruleName: form.value.ruleName,
      alertLevel: form.value.alertLevel,
      cooldownSec: form.value.cooldownSec,
      enabled: true,
      conditions: JSON.stringify({
        logic: form.value.topLogic,
        groups: validGroups,
      }),
    })

    ElMessage.success(t('ec.monitor.dashboard.rules.message.createSuccess'))
    showAddForm.value = false
    await fetchRules()
  } catch (error) {
    ElMessage.error(error.message || t('ec.monitor.dashboard.rules.message.createFailed'))
  } finally {
    saving.value = false
  }
}

async function deleteRule(id) {
  try {
    await ElMessageBox.confirm(t('ec.monitor.dashboard.rules.message.deleteConfirm'), t('ec.monitor.dashboard.rules.delete'), {
      type: 'warning',
    })

    await deleteMonitorAlertRule(id)
    rules.value = rules.value.filter((rule) => rule.id !== id)
    ElMessage.success(t('ec.monitor.dashboard.rules.message.deleteSuccess'))
  } catch (_) {}
}

function sanitizeGroups(groups) {
  return groups
    .filter((group) => group.items.length > 0)
    .map(({ id, items, ...group }) => ({
      ...group,
      items: items.map(({ id: itemId, ...item }) => item),
    }))
}

function formatConditions(jsonStr) {
  if (!jsonStr) return t('ec.monitor.dashboard.rules.empty')

  try {
    const expression = JSON.parse(jsonStr)
    const topLogic = expression.logic === 'AND' ? ' AND ' : ' OR '
    const groups = expression.groups || []
    const labels = {
      CPU_USAGE: t('ec.monitor.dashboard.rules.metric.cpu'),
      RAM_USAGE: t('ec.monitor.dashboard.rules.metric.memory'),
      DISK_USAGE: t('ec.monitor.dashboard.rules.metric.disk'),
      DISK_PARTITION: t('ec.monitor.dashboard.rules.metric.partition'),
      PROCESS_ABNORMAL: t('ec.monitor.dashboard.rules.metric.process'),
      AGENT_OFFLINE: t('ec.monitor.dashboard.rules.metric.offline'),
      LOG_HIT_CRITICAL: t('ec.monitor.dashboard.rules.metric.logCritical'),
      LOG_HIT_TOTAL: t('ec.monitor.dashboard.rules.metric.logTotal'),
    }

    const groupsText = groups.map((group) => {
      const groupLogic = group.logic === 'AND' ? ' && ' : ' || '
      const items = (group.items || []).map((item) => {
        const target = item.targetName ? `[${item.targetName}]` : ''
        if (['PROCESS_ABNORMAL', 'AGENT_OFFLINE'].includes(item.metricType)) {
          return `${labels[item.metricType] || item.metricType}${target}`
        }

        return `${labels[item.metricType] || item.metricType}${target}${item.operator}${item.threshold}`
      })

      return items.length > 1 ? `(${items.join(groupLogic)})` : items[0]
    })

    return groupsText.join(topLogic)
  } catch (error) {
    return t('ec.monitor.dashboard.rules.empty')
  }
}
</script>

<style lang="scss" scoped>
.monitor-rule-config-modal {
  min-height: 240px;
}
</style>
