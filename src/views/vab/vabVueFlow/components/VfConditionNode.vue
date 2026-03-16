<template>
  <div class="custom-node condition-node">
    <!-- 左侧一个目标连接点 -->
    <Handle
      id="target"
      type="target"
      :position="Position.Left"
    />

    <!-- 右侧多个源连接点，根据条件数量动态生成 -->
    <Handle
      v-for="(condition, index) in conditions"
      :key="`source-${condition.id}`"
      :id="`source-${condition.id}`"
      type="source"
      :position="Position.Right"
      :style="{ top: condition.position + '%' }"
    />

    <!-- 如果没有任何条件，添加一个默认连接点 -->
    <Handle
      v-if="conditions.length === 0"
      id="source-default"
      type="source"
      :position="Position.Right"
    />

    <div class="node-content">
      <div class="node-label">{{ data.label }}</div>
      <div v-if="data.description" class="node-description">{{ data.description }}</div>

      <!-- 条件管理 -->
      <div v-if="data.conditions && data.conditions.length > 0" class="conditions-list">
        <div v-for="(condition, index) in data.conditions"
             :key="condition.id || index"
             class="condition-item">
          <span class="condition-icon">•</span>
          <span>{{ condition.name }} ({{ condition.id }})</span>
        </div>
      </div>

      <div v-else class="no-conditions">
        暂无条件
      </div>
    </div>
  </div>
</template>

<script setup>
import { Handle, Position } from '@vue-flow/core'
import { computed } from 'vue'

const props = defineProps({
  data: {
    type: Object,
    required: true
  }
})

// 计算条件的位置
const conditions = computed(() => {
  if (!props.data.conditions || props.data.conditions.length === 0) {
    return []
  }

  return props.data.conditions.map((condition, index) => {
    const totalConditions = props.data.conditions.length
    const position = 25 + (index * 50 / Math.max(totalConditions - 1, 1))
    return {
      id: condition.id || `cond-${index}`,
      name: condition.name || `条件${index + 1}`,
      position: position
    }
  })
})
</script>
<style scoped>
.condition-node {
  padding: 12px 20px;
  border: 2px solid #E6A23C;
  border-radius: 8px;
  background: white;
  min-width: 150px;
  text-align: center;
  position: relative;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.condition-node.selected {
  border-color: #F56C6C;
  box-shadow: 0 0 0 3px rgba(245, 108, 108, 0.2);
}

.node-content {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.node-label {
  font-weight: 600;
  font-size: 14px;
  color: #E6A23C;
}

.node-description {
  font-size: 12px;
  color: #909399;
}

.conditions-list {
  margin-top: 8px;
  border-top: 1px solid #f0f0f0;
  padding-top: 8px;
}

.condition-item {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 4px 0;
  font-size: 12px;
  color: #606266;
}

.condition-icon {
  color: #67C23A;
  font-size: 10px;
}

.add-condition-btn {
  margin-top: 8px;
  padding: 4px 8px;
  background: #409EFF;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 12px;
  cursor: pointer;
  transition: background 0.3s;
}

.add-condition-btn:hover {
  background: #66b1ff;
}

/* 连接点样式 */
:deep(.vue-flow__handle) {
  width: 8px;
  height: 8px;
  border: 2px solid white;
}

:deep(.vue-flow__handle.source) {
  background: #E6A23C;
}

:deep(.vue-flow__handle.target) {
  background: #409EFF;
}
</style>
