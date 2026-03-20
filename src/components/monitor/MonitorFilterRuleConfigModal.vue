<template>
  <el-dialog v-model="visible" :title="dialogTitle" width="760px" append-to-body destroy-on-close>
    <div class="monitor-filter-rule" v-loading="loading">
      <div class="monitor-filter-rule__list" v-if="rules.length">
        <div v-for="rule in rules" :key="rule.id" class="monitor-filter-rule__item">
          <div class="monitor-filter-rule__item-main">
            <div class="monitor-filter-rule__item-header">
              <el-tag :type="resolveRuleType(rule.ruleType)">{{ formatRuleType(rule.ruleType) }}</el-tag>
              <strong>{{ rule.ruleName || '-' }}</strong>
              <span v-if="rule.agentId === '*'">{{ t('ec.monitor.dashboard.filterRule.global') }}</span>
            </div>
            <div class="monitor-filter-rule__item-meta">
              <span>{{ formatMatchMode(rule.matchMode) }}</span>
              <pre>{{ rule.keyword || '-' }}</pre>
            </div>
          </div>
          <el-button v-if="rule.agentId !== '*'" text type="danger" @click="handleDelete(rule.id)">
            {{ t('ec.monitor.dashboard.filterRule.delete') }}
          </el-button>
        </div>
      </div>

      <el-empty v-else :description="t('ec.monitor.dashboard.filterRule.empty')" />

      <el-divider />

      <el-form :model="form" label-position="top" @submit.prevent>
        <el-form-item :label="t('ec.monitor.dashboard.filterRule.ruleName')">
          <el-input v-model="form.ruleName" :placeholder="t('ec.monitor.dashboard.filterRule.ruleNamePlaceholder')" clearable />
        </el-form-item>
        <div class="monitor-filter-rule__form-grid">
          <el-form-item :label="t('ec.monitor.dashboard.filterRule.ruleType')">
            <el-select v-model="form.ruleType">
              <el-option value="CRITICAL" :label="t('ec.monitor.dashboard.filterRule.ruleTypeCritical')" />
              <el-option value="EXCLUDE" :label="t('ec.monitor.dashboard.filterRule.ruleTypeExclude')" />
              <el-option value="BASIC" :label="t('ec.monitor.dashboard.filterRule.ruleTypeBasic')" />
            </el-select>
          </el-form-item>
          <el-form-item :label="t('ec.monitor.dashboard.filterRule.matchMode')">
            <el-select v-model="form.matchMode">
              <el-option value="CONTAINS" :label="t('ec.monitor.dashboard.filterRule.matchContains')" />
              <el-option value="EQUALS" :label="t('ec.monitor.dashboard.filterRule.matchEquals')" />
              <el-option value="REGEX" :label="t('ec.monitor.dashboard.filterRule.matchRegex')" />
              <el-option value="STARTS_WITH" :label="t('ec.monitor.dashboard.filterRule.matchStartsWith')" />
              <el-option value="ENDS_WITH" :label="t('ec.monitor.dashboard.filterRule.matchEndsWith')" />
            </el-select>
          </el-form-item>
        </div>
        <el-form-item :label="t('ec.monitor.dashboard.filterRule.keyword')">
          <el-input v-model="form.keyword" :placeholder="t('ec.monitor.dashboard.filterRule.keywordPlaceholder')" clearable />
        </el-form-item>
      </el-form>
    </div>

    <template #footer>
      <el-button @click="visible = false">{{ t('ec.monitor.dashboard.filterRule.cancel') }}</el-button>
      <el-button type="primary" :loading="saving" @click="handleCreate">
        {{ t('ec.monitor.dashboard.filterRule.create') }}
      </el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { computed, onBeforeUnmount, reactive, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { ElMessage } from 'element-plus'
import {
  createMonitorFilterRule,
  deleteMonitorFilterRule,
  getMonitorFilterRules,
  rebuildMonitorFilterRules,
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
const form = reactive({
  ruleName: '',
  ruleType: 'CRITICAL',
  matchMode: 'CONTAINS',
  keyword: '',
})

const dialogTitle = computed(() => t('ec.monitor.dashboard.filterRule.title', { agentId: props.agentId || '*' }))

watch(visible, async (next, previous) => {
  if (next) {
    monitorStore.pauseAutoRefresh()
    resetForm()
    await loadRules()
  }

  if (!next && previous) {
    monitorStore.resumeAutoRefresh()
  }
})

onBeforeUnmount(() => {
  if (visible.value) monitorStore.resumeAutoRefresh()
})

function resetForm() {
  form.ruleName = ''
  form.ruleType = 'CRITICAL'
  form.matchMode = 'CONTAINS'
  form.keyword = ''
}

async function loadRules() {
  loading.value = true
  try {
    rules.value = await getMonitorFilterRules(props.agentId || '*')
  } catch (error) {
    rules.value = []
    ElMessage.error(error.message || t('ec.monitor.dashboard.filterRule.message.loadFailed'))
  } finally {
    loading.value = false
  }
}

async function handleCreate() {
  if (!form.ruleName.trim() || !form.keyword.trim()) {
    ElMessage.warning(t('ec.monitor.dashboard.filterRule.message.formRequired'))
    return
  }

  saving.value = true
  const agentId = props.agentId || '*'
  try {
    await createMonitorFilterRule({
      agentId,
      ruleName: form.ruleName.trim(),
      ruleType: form.ruleType,
      matchMode: form.matchMode,
      keyword: form.keyword.trim(),
    })
    await rebuildMonitorFilterRules(agentId)
    ElMessage.success(t('ec.monitor.dashboard.filterRule.message.createSuccess'))
    resetForm()
    await loadRules()
  } catch (error) {
    ElMessage.error(error.message || t('ec.monitor.dashboard.filterRule.message.createFailed'))
  } finally {
    saving.value = false
  }
}

async function handleDelete(id) {
  const agentId = props.agentId || '*'
  try {
    await deleteMonitorFilterRule(id)
    await rebuildMonitorFilterRules(agentId)
    ElMessage.success(t('ec.monitor.dashboard.filterRule.message.deleteSuccess'))
    await loadRules()
  } catch (error) {
    ElMessage.error(error.message || t('ec.monitor.dashboard.filterRule.message.deleteFailed'))
  }
}

function resolveRuleType(ruleType) {
  if (ruleType === 'CRITICAL') return 'danger'
  if (ruleType === 'EXCLUDE') return 'success'
  return 'warning'
}

function formatRuleType(ruleType) {
  if (ruleType === 'CRITICAL') return t('ec.monitor.dashboard.filterRule.ruleTypeCritical')
  if (ruleType === 'EXCLUDE') return t('ec.monitor.dashboard.filterRule.ruleTypeExclude')
  return t('ec.monitor.dashboard.filterRule.ruleTypeBasic')
}

function formatMatchMode(matchMode) {
  const map = {
    CONTAINS: t('ec.monitor.dashboard.filterRule.matchContains'),
    EQUALS: t('ec.monitor.dashboard.filterRule.matchEquals'),
    REGEX: t('ec.monitor.dashboard.filterRule.matchRegex'),
    STARTS_WITH: t('ec.monitor.dashboard.filterRule.matchStartsWith'),
    ENDS_WITH: t('ec.monitor.dashboard.filterRule.matchEndsWith'),
  }

  return map[matchMode] || matchMode
}
</script>

<style lang="scss" scoped>
.monitor-filter-rule {
  min-height: 220px;
}

.monitor-filter-rule__list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-height: 320px;
  overflow: auto;
}

.monitor-filter-rule__item {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  padding: 16px;
  border: 1px solid var(--el-border-color-light);
  background-color: var(--el-fill-color-light);
}

.monitor-filter-rule__item-main {
  min-width: 0;
  flex: 1;
}

.monitor-filter-rule__item-header {
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

.monitor-filter-rule__item-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 8px;

  span {
    color: var(--el-color-primary);
    font-size: var(--el-font-size-small);
  }

  pre {
    margin: 0;
    color: var(--el-text-color-primary);
    white-space: pre-wrap;
    word-break: break-all;
    font-family: var(--el-font-family-monospace, 'Consolas', 'Courier New', monospace);
  }
}

.monitor-filter-rule__form-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}

@media only screen and (max-width: 991px) {
  .monitor-filter-rule__item,
  .monitor-filter-rule__form-grid {
    grid-template-columns: 1fr;
  }

  .monitor-filter-rule__item {
    flex-direction: column;
    align-items: stretch;
  }
}
</style>
