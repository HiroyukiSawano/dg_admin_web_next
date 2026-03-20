<template>
  <div class="monitor-rule-condition-item-row">
    <el-select :model-value="item.metricType" @update:model-value="handleMetricChange">
      <el-option v-for="option in metricOptions" :key="option.value" :label="option.label" :value="option.value" />
    </el-select>

    <el-select
      v-if="item.metricType === 'DISK_PARTITION' && cachedPartitions.length"
      :model-value="item.targetName"
      @update:model-value="emitPatch({ targetName: $event })"
    >
      <el-option v-for="partition in cachedPartitions" :key="partition" :label="partition" :value="partition" />
    </el-select>

    <el-input
      v-else-if="['DISK_PARTITION', 'PROCESS_ABNORMAL'].includes(item.metricType)"
      :model-value="item.targetName"
      @update:model-value="emitPatch({ targetName: $event })"
      :placeholder="t('ec.monitor.dashboard.rules.target')"
    />

    <template v-if="!['PROCESS_ABNORMAL', 'AGENT_OFFLINE'].includes(item.metricType)">
      <el-select :model-value="item.operator" @update:model-value="emitPatch({ operator: $event })">
        <el-option v-for="option in opOptions" :key="option.value" :label="option.label" :value="option.value" />
      </el-select>

      <el-input-number
        :model-value="item.threshold"
        :min="0"
        controls-position="right"
        @update:model-value="emitPatch({ threshold: $event || 0 })"
      />
    </template>

    <el-tooltip placement="top" :content="t('ec.monitor.dashboard.rules.duration')">
      <el-input-number
        :model-value="item.durationSec"
        :min="0"
        controls-position="right"
        @update:model-value="emitPatch({ durationSec: $event || 0 })"
      />
    </el-tooltip>

    <el-button link type="danger" @click="$emit('remove')">
      {{ t('ec.monitor.dashboard.rules.delete') }}
    </el-button>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const props = defineProps({
  item: {
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
})

const emit = defineEmits(['patch', 'remove'])

const emitPatch = (patch) => {
  emit('patch', patch)
}

const handleMetricChange = (metricType) => {
  const selected = props.metricOptions.find((item) => item.value === metricType)
  const patch = { metricType }

  if (!selected?.numeric) {
    patch.operator = 'EQ'
    patch.threshold = 0
  }

  if (['LOG_HIT_CRITICAL', 'LOG_HIT_TOTAL'].includes(metricType) && !props.item.durationSec) {
    patch.durationSec = 300
  }

  if (metricType === 'DISK_PARTITION') {
    patch.targetName = props.cachedPartitions[0] || ''
  } else if (metricType !== 'PROCESS_ABNORMAL') {
    patch.targetName = ''
  }

  emitPatch(patch)
}
</script>

<style lang="scss" scoped>
.monitor-rule-condition-item-row {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr)) auto;
  gap: 12px;
  padding: 12px;
  border: 1px solid var(--el-border-color-light);
  background-color: var(--el-fill-color-blank);
}

@media only screen and (max-width: 1200px) {
  .monitor-rule-condition-item-row {
    grid-template-columns: 1fr;
  }
}
</style>
