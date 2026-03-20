<template>
  <div class="monitor-rule-condition-editor">
    <el-alert :title="t('ec.monitor.dashboard.rules.message.helper')" type="info" :closable="false" />

    <el-form label-position="top">
      <div class="monitor-rule-condition-editor__base">
        <el-form-item :label="t('ec.monitor.dashboard.rules.ruleName')">
          <el-input :model-value="draft.ruleName" @update:model-value="draft.ruleName = $event" :placeholder="t('ec.monitor.dashboard.rules.ruleName.placeholder')" />
        </el-form-item>
        <el-form-item :label="t('ec.monitor.dashboard.rules.alertLevel')">
          <el-select :model-value="draft.alertLevel" @update:model-value="draft.alertLevel = $event">
            <el-option label="CRITICAL" value="CRITICAL" />
            <el-option label="WARNING" value="WARNING" />
          </el-select>
        </el-form-item>
        <el-form-item :label="t('ec.monitor.dashboard.rules.cooldownSec')">
          <el-input-number :model-value="draft.cooldownSec" :min="1" controls-position="right" @update:model-value="draft.cooldownSec = $event || 1" />
        </el-form-item>
      </div>

      <div class="monitor-rule-condition-editor__logic">
        <span>{{ t('ec.monitor.dashboard.rules.topLogic') }}</span>
        <el-radio-group :model-value="draft.topLogic" @update:model-value="draft.topLogic = $event">
          <el-radio-button label="AND" value="AND" />
          <el-radio-button label="OR" value="OR" />
        </el-radio-group>
      </div>

      <div class="monitor-rule-condition-editor__groups">
        <div v-for="(group, groupIndex) in draft.groups" :key="group.id" class="monitor-rule-condition-editor__group">
          <div class="monitor-rule-condition-editor__group-header">
            <strong>{{ t('ec.monitor.dashboard.rules.groupLogic') }} {{ groupIndex + 1 }}</strong>
            <div class="monitor-rule-condition-editor__group-actions">
              <el-radio-group :model-value="group.logic" @update:model-value="group.logic = $event">
                <el-radio-button label="AND" value="AND" />
                <el-radio-button label="OR" value="OR" />
              </el-radio-group>
              <el-button link @click="addGroupItem(group)">{{ t('ec.monitor.dashboard.rules.addCondition') }}</el-button>
              <el-button link type="danger" @click="removeGroup(groupIndex)">{{ t('ec.monitor.dashboard.rules.delete') }}</el-button>
            </div>
          </div>

          <div class="monitor-rule-condition-editor__items">
            <MonitorRuleConditionItemRow
              v-for="(item, itemIndex) in group.items"
              :key="item.id"
              :item="item"
              :cached-partitions="cachedPartitions"
              :metric-options="metricOptions"
              :op-options="opOptions"
              @patch="patchItem(group, itemIndex, $event)"
              @remove="removeGroupItem(group, itemIndex)"
            />
          </div>
        </div>
      </div>

      <div class="monitor-rule-condition-editor__footer">
        <el-button @click="addGroup">{{ t('ec.monitor.dashboard.rules.addGroup') }}</el-button>
        <div class="monitor-rule-condition-editor__footer-actions">
          <el-button @click="$emit('cancel')">{{ t('ec.monitor.dashboard.rules.cancel') }}</el-button>
          <el-button type="primary" :loading="saving" @click="$emit('submit')">{{ t('ec.monitor.dashboard.rules.save') }}</el-button>
        </div>
      </div>
    </el-form>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
import MonitorRuleConditionItemRow from '@/components/monitor/MonitorRuleConditionItemRow.vue'

const { t } = useI18n()

const props = defineProps({
  draft: {
    type: Object,
    required: true,
  },
  cachedPartitions: {
    type: Array,
    default: () => [],
  },
  metricOptions: {
    type: Array,
    default: () => [],
  },
  opOptions: {
    type: Array,
    default: () => [],
  },
  saving: {
    type: Boolean,
    default: false,
  },
  createGroupDraft: {
    type: Function,
    required: true,
  },
  createItemDraft: {
    type: Function,
    required: true,
  },
})

defineEmits(['cancel', 'submit'])

const addGroup = () => {
  props.draft.groups.push(props.createGroupDraft())
}

const removeGroup = (index) => {
  props.draft.groups.splice(index, 1)
}

const addGroupItem = (group) => {
  group.items.push(props.createItemDraft())
}

const removeGroupItem = (group, index) => {
  group.items.splice(index, 1)
  if (!group.items.length) {
    const groupIndex = props.draft.groups.findIndex((candidate) => candidate.id === group.id)
    if (groupIndex > -1) removeGroup(groupIndex)
  }
}

const patchItem = (group, index, patch) => {
  Object.assign(group.items[index], patch)
}
</script>

<style lang="scss" scoped>
.monitor-rule-condition-editor {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.monitor-rule-condition-editor__base {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
  gap: 16px;
}

.monitor-rule-condition-editor__logic,
.monitor-rule-condition-editor__group,
.monitor-rule-condition-editor__footer {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.monitor-rule-condition-editor__logic span,
.monitor-rule-condition-editor__group-header strong {
  color: var(--el-text-color-primary);
}

.monitor-rule-condition-editor__group {
  padding: 16px;
  border: 1px solid var(--el-border-color-light);
  background-color: var(--el-fill-color-light);
}

.monitor-rule-condition-editor__group-header,
.monitor-rule-condition-editor__group-actions,
.monitor-rule-condition-editor__footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.monitor-rule-condition-editor__items,
.monitor-rule-condition-editor__groups {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.monitor-rule-condition-editor__footer-actions {
  display: flex;
  gap: 12px;
}

@media only screen and (max-width: 1200px) {
  .monitor-rule-condition-editor__base,
  .monitor-rule-condition-editor__group-header,
  .monitor-rule-condition-editor__group-actions,
  .monitor-rule-condition-editor__footer {
    grid-template-columns: 1fr;
    flex-direction: column;
    align-items: flex-start;
  }

  .monitor-rule-condition-editor__footer-actions {
    width: 100%;
    justify-content: flex-end;
  }
}
</style>
