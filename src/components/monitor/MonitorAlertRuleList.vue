<template>
  <div class="monitor-alert-rule-list" v-if="rules.length">
    <div v-for="rule in rules" :key="rule.id" class="monitor-alert-rule-list__item">
      <div class="monitor-alert-rule-list__header">
        <div class="monitor-alert-rule-list__title">
          <el-tag :type="rule.alertLevel === 'CRITICAL' ? 'danger' : 'warning'">{{ rule.alertLevel || 'WARNING' }}</el-tag>
          <strong>{{ rule.ruleName }}</strong>
          <span v-if="rule.agentId === '*'" class="is-global">{{ t('ec.monitor.dashboard.rules.global') }}</span>
        </div>
        <el-button
          v-if="rule.agentId !== '*'"
          link
          type="danger"
          @click="$emit('delete', rule.id)"
        >
          {{ t('ec.monitor.dashboard.rules.delete') }}
        </el-button>
      </div>

      <div class="monitor-alert-rule-list__content">
        <span>{{ rule.formattedConditions }}</span>
        <span>{{ t('ec.monitor.dashboard.rules.cooldownSec') }}: {{ rule.cooldownSec }}</span>
        <span>{{ rule.enabled ? t('ec.monitor.dashboard.rules.enabled') : t('ec.monitor.dashboard.rules.disabled') }}</span>
      </div>
    </div>
  </div>

  <el-empty v-else :description="t('ec.monitor.dashboard.rules.empty')" />
</template>

<script setup>
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

defineProps({
  rules: {
    type: Array,
    default: () => [],
  },
})

defineEmits(['delete'])
</script>

<style lang="scss" scoped>
.monitor-alert-rule-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 16px;
}

.monitor-alert-rule-list__item {
  padding: 16px;
  border: 1px solid var(--el-border-color-light);
  background-color: var(--el-fill-color-light);
}

.monitor-alert-rule-list__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.monitor-alert-rule-list__title {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;

  strong {
    color: var(--el-text-color-primary);
    min-width: 0;
  }

  .is-global {
    color: var(--el-text-color-secondary);
    font-size: var(--el-font-size-small);
  }
}

.monitor-alert-rule-list__content {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 12px;
  color: var(--el-text-color-secondary);
  font-size: var(--el-font-size-small);
  line-height: 1.6;
}
</style>
